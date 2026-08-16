import clsx from 'clsx';
import hljs from 'highlight.js';
import 'highlight.js/styles/github-dark.css';
import {
  createContext,
  type FC,
  type MouseEvent as ReactMouseEvent,
  useCallback,
  useContext,
  useEffect,
  useId,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import './highlight-theme.css';
import type {
  ApiTemplateProps,
  CodeBlockProps,
  DemoSectionProps,
  TableOfContentsProps,
  TocItem,
  TocLevel,
} from './types';

const COPY_FEEDBACK_DURATION = 2000;

const TOC_SCROLL_OFFSET = 80;

const sanitizeUseId = (id: string): string => id.replaceAll(/[«»:]/g, '');

export const slugify = (value: string): string =>
  value
    .normalize('NFKD')
    .toLowerCase()
    .trim()
    .replaceAll(/[^a-z0-9]+/g, '-')
    .replaceAll(/^-+|-+$/g, '');

export const useIdPrefix = (scope: string): string => {
  const rawId = useId();
  return useMemo(() => `${slugify(scope) || 'section'}-${sanitizeUseId(rawId)}`, [rawId, scope]);
};

async function copyToClipboard(text: string): Promise<boolean> {
  if (navigator.clipboard?.writeText) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch {
      return false;
    }
  }

  const textarea = document.createElement('textarea');
  textarea.style.left = '-9999px';
  textarea.style.position = 'fixed';
  textarea.value = text;
  document.body.append(textarea);
  textarea.select();
  const succeeded = document.execCommand('copy');
  textarea.remove();
  return succeeded;
}

export const scrollToSection = (id: string): void => {
  const target = document.getElementById(id);
  if (!target) {
    return;
  }
  const top = target.getBoundingClientRect().top + window.scrollY - TOC_SCROLL_OFFSET;
  window.scrollTo({ behavior: 'smooth', top });
};

export const updateHash = (id: string): void => {
  try {
    window.history.replaceState(null, '', `#${id}`);
  } catch {
    // ignore
  }
};

export const CodeBlock: FC<CodeBlockProps> = ({
  code,
  language = 'typescript',
  showCopyButton = true,
  title,
}) => {
  const codeRef = useRef<HTMLElement>(null);
  const timerRef = useRef<null | number>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const element = codeRef.current;
    if (!element) {
      return;
    }
    element.textContent = code;
    delete element.dataset.highlighted;
    hljs.highlightElement(element);
  }, [code, language]);

  useEffect(
    () => () => {
      if (timerRef.current !== null) {
        clearTimeout(timerRef.current);
      }
    },
    [],
  );

  const handleCopy = useCallback(async () => {
    if (!(await copyToClipboard(code))) {
      return;
    }
    setCopied(true);
    if (timerRef.current !== null) {
      clearTimeout(timerRef.current);
    }
    timerRef.current = setTimeout(() => setCopied(false), COPY_FEEDBACK_DURATION);
  }, [code]);

  const copyButton = showCopyButton ? (
    <button
      aria-label="复制代码"
      aria-live="polite"
      className={clsx('copy-button', copied && 'copied')}
      onClick={handleCopy}
      title={copied ? '已复制' : '复制代码'}
      type="button"
    >
      {copied ? '已复制 ✓' : '复制'}
    </button>
  ) : null;

  return (
    <div className="code-block-wrapper">
      {title ? (
        <div className="code-title">
          <span className="code-title-text">{title}</span>
          {copyButton}
        </div>
      ) : (
        copyButton
      )}
      <pre>
        <code className={`language-${language}`} ref={codeRef}>
          {code}
        </code>
      </pre>
    </div>
  );
};

export const TableOfContents: FC<TableOfContentsProps> = ({ items }) => {
  const listId = useId();
  const [activeId, setActiveId] = useState<string>();
  const [isOpen, setIsOpen] = useState<boolean>(
    () => typeof window === 'undefined' || !window.matchMedia('(max-width: 768px)').matches,
  );

  const handleClick = useCallback((event: ReactMouseEvent<HTMLAnchorElement>, id: string) => {
    event.preventDefault();
    setActiveId(id);
    scrollToSection(id);
    updateHash(id);
  }, []);

  return (
    <nav aria-label="目录导航" className={clsx('toc-nav', !isOpen && 'toc-nav-closed')}>
      <div className="toc-header">
        <h6 className="toc-title">目录</h6>
        <button
          aria-controls={listId}
          aria-expanded={isOpen}
          aria-label={isOpen ? '收起目录' : '展开目录'}
          className="toc-toggle"
          onClick={() => setIsOpen((prev) => !prev)}
          title={isOpen ? '收起目录' : '展开目录'}
          type="button"
        >
          <span className="toc-toggle-text">{isOpen ? '收起' : '目录'}</span>
          <span aria-hidden="true" className="toc-toggle-icon">
            {isOpen ? '▲' : '▼'}
          </span>
        </button>
      </div>
      <div className="toc-list-wrap">
        <ul className="toc-list" id={listId}>
          {items.map((item) => (
            <li
              className={clsx(
                'toc-item',
                `toc-level-${item.level}`,
                activeId === item.id && 'active',
              )}
              key={item.id}
            >
              <a
                aria-current={activeId === item.id ? 'location' : undefined}
                href={`#${item.id}`}
                onClick={(event) => handleClick(event, item.id)}
              >
                {item.title}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
};

interface DemoSectionMeta {
  id?: string;
  level: TocLevel;
  title: string;
}

interface DemoSectionsContextValue {
  register: (key: string, meta: DemoSectionMeta) => string;
  unregister: (key: string) => void;
}

const DemoSectionsContext = createContext<DemoSectionsContextValue | null>(null);

export const DemoSection: FC<DemoSectionProps> = ({
  children,
  className,
  code,
  codeLanguage = 'tsx',
  id,
  level = 2,
  title,
  ...rest
}) => {
  const context = useContext(DemoSectionsContext);
  const codeRegionId = useId();
  const instanceKey = useId();
  const [codeVisible, setCodeVisible] = useState(false);
  const [sectionId, setSectionId] = useState<string>(() => {
    if (context) {
      return '';
    }
    return id ?? `demo-${slugify(title) || 'section'}-${sanitizeUseId(instanceKey)}`;
  });

  useLayoutEffect(() => {
    if (!context) {
      return;
    }
    const registeredId = context.register(instanceKey, { id, level, title });
    setSectionId(registeredId);
    return () => {
      context.unregister(instanceKey);
    };
  }, [context, id, instanceKey, level, title]);

  const handleToggleCode = useCallback(() => {
    setCodeVisible((prev) => !prev);
  }, []);

  const Heading = level === 3 ? 'h3' : 'h2';

  return (
    <section className={clsx('demo-section', className)} id={sectionId || undefined} {...rest}>
      <div className="demo-section-heading">
        <Heading className={clsx('demo-section-title', level === 3 ? 'h6' : 'h5')}>{title}</Heading>
        {code ? (
          <button
            aria-controls={codeRegionId}
            aria-expanded={codeVisible}
            className="demo-code-toggle"
            onClick={handleToggleCode}
            title={codeVisible ? '隐藏示例代码' : '查看示例代码'}
            type="button"
          >
            {codeVisible ? '隐藏代码' : '查看代码'}
          </button>
        ) : null}
      </div>
      <div className={clsx('demo-preview', code && codeVisible && 'demo-preview-code-open')}>
        {children}
      </div>
      {code && codeVisible ? (
        <div className="demo-code" id={codeRegionId}>
          <CodeBlock code={code} language={codeLanguage} />
        </div>
      ) : null}
    </section>
  );
};

export const ApiTemplate: FC<ApiTemplateProps> = ({
  componentDescription,
  componentName,
  demoContent,
  props,
  showCopyButton = true,
  typeDefinitions = [],
}) => {
  const demoCounterRef = useRef(0);
  const demoEntriesRef = useRef<Map<string, TocItem>>(new Map());
  const idPrefix = useIdPrefix(componentName);
  const [demoSections, setDemoSections] = useState<TocItem[]>([]);

  const demoSectionsContext = useMemo<DemoSectionsContextValue>(() => {
    const register = (key: string, meta: DemoSectionMeta): string => {
      const existing = demoEntriesRef.current.get(key);
      if (existing) {
        const updated: TocItem = { id: existing.id, level: meta.level, title: meta.title };
        demoEntriesRef.current.set(key, updated);
        setDemoSections([...demoEntriesRef.current.values()]);
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
      return candidate;
    };

    const unregister = (key: string): void => {
      if (demoEntriesRef.current.delete(key)) {
        setDemoSections([...demoEntriesRef.current.values()]);
      }
    };

    return { register, unregister };
  }, [idPrefix]);

  const tocItems = useMemo<TocItem[]>(() => {
    const items: TocItem[] = [
      { id: `${idPrefix}-demo-overview`, level: 1, title: '组件演示' },
      ...demoSections,
      { id: `${idPrefix}-api-overview`, level: 1, title: 'API 文档' },
      { id: `${idPrefix}-props`, level: 2, title: '属性 (Props)' },
    ];
    if (typeDefinitions.length > 0) {
      items.push({ id: `${idPrefix}-types`, level: 2, title: '类型定义' });
    }
    return items;
  }, [demoSections, idPrefix, typeDefinitions.length]);

  return (
    <div className="api-doc-container">
      <aside className="api-doc-sidebar">
        <TableOfContents items={tocItems} />
      </aside>

      <main className="api-doc-content">
        <section className="api-section" id={`${idPrefix}-demo-overview`}>
          <h2 className="h4 mb-3">组件演示</h2>
          <p className="text-muted mb-4">{componentDescription}</p>
        </section>

        <DemoSectionsContext.Provider value={demoSectionsContext}>
          {demoContent}
        </DemoSectionsContext.Provider>

        <section className="api-section" id={`${idPrefix}-api-overview`}>
          <h2 className="h4 mb-3">API 文档</h2>
          <p className="text-muted mb-4">{componentName} 组件的完整 API 参考</p>
        </section>

        <section className="api-section" id={`${idPrefix}-props`}>
          <h3 className="h5 mb-3">属性 (Props)</h3>
          <div className="table-responsive">
            <table className="table table-bordered table-hover props-table">
              <thead className="table-light">
                <tr>
                  <th>属性名</th>
                  <th>类型</th>
                  <th>默认值</th>
                  <th>描述</th>
                </tr>
              </thead>
              <tbody>
                {props.map((prop) => (
                  <tr key={prop.name}>
                    <td>
                      <code className="text-primary">{prop.name}</code>
                    </td>
                    <td>
                      <code className="text-success">{prop.type}</code>
                    </td>
                    <td>
                      {prop.defaultValue && prop.defaultValue !== '-' ? (
                        <code className="prop-default-value">{prop.defaultValue}</code>
                      ) : (
                        <span className="text-muted">-</span>
                      )}
                    </td>
                    <td>{prop.description}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {typeDefinitions.length > 0 && (
          <section className="api-section" id={`${idPrefix}-types`}>
            <h3 className="h5 mb-3">类型定义</h3>
            {typeDefinitions.map((typeDef) => (
              <div className="mb-3" key={typeDef.name}>
                <h4 className="h6">{typeDef.name}</h4>
                {typeDef.description && <p className="text-muted small">{typeDef.description}</p>}
                <CodeBlock
                  code={typeDef.code}
                  language="typescript"
                  showCopyButton={showCopyButton}
                />
              </div>
            ))}
          </section>
        )}
      </main>
    </div>
  );
};

export default ApiTemplate;
