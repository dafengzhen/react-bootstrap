import {
  type FC,
  type MouseEvent as ReactMouseEvent,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import type { ApiProp, DocTemplateProps, TocItem } from './types.ts';

import {
  type DemoSectionMeta,
  DemoSectionsContext,
  type DemoSectionsContextValue,
} from './demo-section.tsx';
import { useDocSidebar } from './doc-sidebar-context.ts';
import { NameColorBadge } from './name-badge.tsx';
import { PropsTable } from './props-table.tsx';
import { TableOfContents } from './table-of-contents.tsx';
import { TypeDefinitions } from './type-definitions.tsx';
import { scrollToSection, slugify, updateHash, useIdPrefix } from './utils.ts';

const TYPE_HIGHLIGHT_DURATION = 2000;

const COMMON_PROPS_TITLE = 'Common Props';

interface PropGroup {
  component?: string;
  props: ApiProp[];
}

export const DocTemplate: FC<DocTemplateProps> = ({
  componentDescription,
  componentName,
  componentTags = [],
  demoContent,
  props,
  showCopyButton = true,
  typeDefinitions = [],
}) => {
  const demoCounterRef = useRef(0);
  const demoEntriesRef = useRef<Map<string, TocItem>>(new Map());
  const highlightTimerRef = useRef<null | number>(null);
  const listenersRef = useRef<Set<() => void>>(new Set());
  const idPrefix = useIdPrefix(componentName);
  const [demoSections, setDemoSections] = useState<TocItem[]>([]);
  const [highlightedType, setHighlightedType] = useState<string>();
  const docSidebar = useDocSidebar();

  const typeDefIds = useMemo(() => {
    const counts = new Map<string, number>();
    const ids = new Map<string, string>();
    for (const typeDef of typeDefinitions) {
      const base = slugify(typeDef.name) || 'type';
      const count = (counts.get(base) ?? 0) + 1;
      counts.set(base, count);
      ids.set(typeDef.name, `${idPrefix}-typedef-${base}${count === 1 ? '' : `-${count}`}`);
    }
    return ids;
  }, [idPrefix, typeDefinitions]);

  const propGroups = useMemo<PropGroup[]>(() => {
    const groups: PropGroup[] = [];
    const indexByComponent = new Map<string, number>();
    for (const prop of props) {
      const component = prop.component ?? '';
      let index = indexByComponent.get(component);
      if (index === undefined) {
        index = groups.length;
        indexByComponent.set(component, index);
        groups.push({ component: prop.component, props: [] });
      }
      groups[index].props.push(prop);
    }
    return groups;
  }, [props]);

  const propGroupIds = useMemo<string[]>(() => {
    const used = new Set<string>();
    return propGroups.map((group) => {
      const base = (group.component && slugify(group.component)) || 'common';
      let candidate = `${idPrefix}-props-${base}`;
      let counter = 2;
      while (used.has(candidate)) {
        candidate = `${idPrefix}-props-${base}-${counter}`;
        counter += 1;
      }
      used.add(candidate);
      return candidate;
    });
  }, [idPrefix, propGroups]);

  const showPropGroups =
    propGroups.length > 1 || (propGroups.length === 1 && propGroups[0].component !== undefined);

  const handleTypeClick = useCallback(
    (event: ReactMouseEvent<HTMLAnchorElement>, typeName: string) => {
      event.preventDefault();
      const id = typeDefIds.get(typeName);
      if (!id) {
        return;
      }
      scrollToSection(id);
      updateHash(id);
      setHighlightedType(typeName);
      if (highlightTimerRef.current !== null) {
        clearTimeout(highlightTimerRef.current);
      }
      highlightTimerRef.current = setTimeout(
        () => setHighlightedType(undefined),
        TYPE_HIGHLIGHT_DURATION,
      );
    },
    [typeDefIds],
  );

  useEffect(
    () => () => {
      if (highlightTimerRef.current !== null) {
        clearTimeout(highlightTimerRef.current);
      }
    },
    [],
  );

  const demoSectionsContext = useMemo<DemoSectionsContextValue>(() => {
    const getSectionId = (key: string): string | undefined => {
      return demoEntriesRef.current.get(key)?.id;
    };

    const notifySections = (): void => {
      for (const listener of listenersRef.current) {
        listener();
      }
    };

    const register = (key: string, meta: DemoSectionMeta): string => {
      const existing = demoEntriesRef.current.get(key);
      if (existing) {
        const updated: TocItem = { id: existing.id, level: meta.level, title: meta.title };
        demoEntriesRef.current.set(key, updated);
        setDemoSections([...demoEntriesRef.current.values()]);
        notifySections();
        return existing.id;
      }

      const existingIds = new Set([...demoEntriesRef.current.values()].map((item) => item.id));
      let candidate = `${idPrefix}-${meta.id ?? `demo-${demoCounterRef.current + 1}`}`;
      while (existingIds.has(candidate)) {
        demoCounterRef.current += 1;
        candidate = `${idPrefix}-${meta.id ?? 'demo'}-${demoCounterRef.current + 1}`;
      }
      demoCounterRef.current += 1;

      const item: TocItem = { id: candidate, level: meta.level, title: meta.title };
      demoEntriesRef.current.set(key, item);
      setDemoSections([...demoEntriesRef.current.values()]);
      notifySections();
      return candidate;
    };

    const subscribe = (listener: () => void): (() => void) => {
      listenersRef.current.add(listener);
      return () => {
        listenersRef.current.delete(listener);
      };
    };

    const unregister = (key: string): void => {
      if (demoEntriesRef.current.delete(key)) {
        setDemoSections([...demoEntriesRef.current.values()]);
        notifySections();
      }
    };

    return { getSectionId, register, subscribe, unregister };
  }, [idPrefix]);

  const tocItems = useMemo<TocItem[]>(() => {
    const items: TocItem[] = [
      { id: `${idPrefix}-demo-overview`, level: 1, title: 'Component Demo' },
      ...demoSections,
      { id: `${idPrefix}-api-overview`, level: 1, title: 'API Documentation' },
      { id: `${idPrefix}-props`, level: 2, title: 'Props' },
    ];
    if (showPropGroups) {
      propGroups.forEach((group, index) => {
        items.push({
          id: propGroupIds[index],
          level: 3,
          title: group.component ?? COMMON_PROPS_TITLE,
        });
      });
    }
    if (typeDefinitions.length > 0) {
      items.push({ id: `${idPrefix}-types`, level: 2, title: 'Type Definitions' });
    }
    return items;
  }, [demoSections, idPrefix, propGroupIds, propGroups, showPropGroups, typeDefinitions.length]);

  useEffect(() => {
    if (!docSidebar) {
      return undefined;
    }
    return docSidebar.registerSections(tocItems);
  }, [docSidebar, tocItems]);

  const content = (
    <main className="api-doc-content">
      <section className="api-section">
        <div className="api-component-header">
          <NameColorBadge name={componentName} size="lg" />
          <h2 className="api-component-name">{componentName}</h2>
          {componentTags.map((tag) => (
            <span className="badge bg-secondary" key={tag}>
              {tag}
            </span>
          ))}
        </div>
        <p className="text-muted">{componentDescription}</p>
      </section>

      <section className="api-section" id={`${idPrefix}-demo-overview`}>
        <h3 className="h5 mb-3">Component Demo</h3>
        <p className="text-muted mb-4">Basic usage and examples of the {componentName} component</p>
      </section>

      <DemoSectionsContext.Provider value={demoSectionsContext}>
        {demoContent}
      </DemoSectionsContext.Provider>

      <section className="api-section" id={`${idPrefix}-api-overview`}>
        <h2 className="h4 mb-3">API Documentation</h2>
        <p className="text-muted mb-4">Complete API reference for the {componentName} component</p>
      </section>

      <section className="api-section" id={`${idPrefix}-props`}>
        <h3 className="h5 mb-3">Props</h3>
        {showPropGroups ? (
          propGroups.map((group, index) => (
            <div className="props-group mb-4" key={propGroupIds[index]}>
              <h4 className="h6 mb-3" id={propGroupIds[index]}>
                {group.component ?? COMMON_PROPS_TITLE}
              </h4>
              <PropsTable
                onTypeClick={handleTypeClick}
                props={group.props}
                typeDefIds={typeDefIds}
              />
            </div>
          ))
        ) : (
          <PropsTable onTypeClick={handleTypeClick} props={props} typeDefIds={typeDefIds} />
        )}
      </section>

      {typeDefinitions.length > 0 && (
        <TypeDefinitions
          highlightedType={highlightedType}
          sectionId={`${idPrefix}-types`}
          showCopyButton={showCopyButton}
          typeDefIds={typeDefIds}
          typeDefinitions={typeDefinitions}
        />
      )}
    </main>
  );

  if (!docSidebar) {
    return (
      <div className="api-doc-container">
        <aside className="api-doc-sidebar">
          <TableOfContents items={tocItems} />
        </aside>
        {content}
      </div>
    );
  }

  return content;
};

export default DocTemplate;
