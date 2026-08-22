import clsx from 'clsx';
import { type FC, type MouseEvent as ReactMouseEvent, useCallback, useMemo, useState } from 'react';

import type { TableOfContentsProps, TocItem } from './types.ts';

import styles from './doc-template.module.css';
import { scrollToSection, updateHash } from './utils.ts';

interface TocNode {
  children: TocNode[];
  item: TocItem;
}

const buildTree = (items: TocItem[]): TocNode[] => {
  const roots: TocNode[] = [];
  const stack: TocNode[] = [];
  let lastLinkedNode: null | TocNode = null;

  for (const item of items) {
    const node: TocNode = { children: [], item };
    if (item.to) {
      roots.push(node);
      lastLinkedNode = node;
      stack.length = 0;
      stack.push(node);
      continue;
    }

    while (stack.length > 0 && stack[stack.length - 1].item.level >= item.level) {
      stack.pop();
    }
    const parent = stack[stack.length - 1];
    if (parent) {
      parent.children.push(node);
    } else if (lastLinkedNode) {
      lastLinkedNode.children.push(node);
    } else {
      roots.push(node);
    }
    stack.push(node);
  }

  return roots;
};

const CHEVRON_PATH =
  'M7.247 11.14 2.451 5.658C1.885 5.013 2.345 4 3.204 4h9.592a1 1 0 0 1 .753 1.659l-4.796 5.48a1 1 0 0 1-1.506 0z';

const LEVEL_CLASSES = {
  1: styles.tocLevel1,
  2: styles.tocLevel2,
  3: styles.tocLevel3,
} as const;

export const TableOfContents: FC<TableOfContentsProps> = ({
  activeTo,
  items,
  onNavigate,
  renderLink,
  title = '目录',
}) => {
  const [activeId, setActiveId] = useState<string>();
  const [collapsedIds, setCollapsedIds] = useState<Set<string>>(() => new Set());

  const tree = useMemo(() => buildTree(items), [items]);

  const handleAnchorClick = useCallback(
    (event: ReactMouseEvent<HTMLAnchorElement>, id: string) => {
      event.preventDefault();
      setActiveId(id);
      scrollToSection(id);
      updateHash(id);
      onNavigate?.();
    },
    [onNavigate],
  );

  const handleToggle = useCallback((id: string) => {
    setCollapsedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }, []);

  const visibleNodes = useMemo(() => {
    const nodes: TocNode[] = [];
    const visit = (current: TocNode[]): void => {
      for (const node of current) {
        nodes.push(node);
        if (node.children.length > 0 && !collapsedIds.has(node.item.id)) {
          visit(node.children);
        }
      }
    };
    visit(tree);
    return nodes;
  }, [collapsedIds, tree]);

  return (
    <nav aria-label="目录导航" className={styles.tocNav}>
      <div className={styles.tocHeader}>
        <h6 className={styles.tocTitle}>{title}</h6>
      </div>
      <ul className={styles.tocList}>
        {visibleNodes.map(({ children, item }) => {
          const hasChildren = children.length > 0;
          const isCollapsed = collapsedIds.has(item.id);
          const levelClass = LEVEL_CLASSES[item.level];
          const isActive = item.to !== undefined ? item.to === activeTo : activeId === item.id;
          const chevron = (
            <svg
              aria-hidden="true"
              className={styles.tocChevron}
              fill="currentColor"
              viewBox="0 0 16 16"
            >
              <path d={CHEVRON_PATH} />
            </svg>
          );

          return (
            <li
              className={clsx(
                styles.tocItem,
                levelClass,
                isCollapsed && styles.collapsed,
                isActive && styles.active,
              )}
              key={item.id}
            >
              {hasChildren ? (
                <button
                  aria-expanded={!isCollapsed}
                  className={styles.tocToggle}
                  onClick={() => handleToggle(item.id)}
                  type="button"
                >
                  <span className={styles.tocToggleTitle}>{item.title}</span>
                  {chevron}
                </button>
              ) : item.to ? (
                renderLink ? (
                  renderLink({ children: item.title, to: item.to })
                ) : (
                  <a href={item.to} onClick={onNavigate}>
                    {item.title}
                  </a>
                )
              ) : (
                <a
                  aria-current={activeId === item.id ? 'location' : undefined}
                  href={`#${item.id}`}
                  onClick={(event) => handleAnchorClick(event, item.id)}
                >
                  {item.title}
                </a>
              )}
            </li>
          );
        })}
      </ul>
    </nav>
  );
};

export default TableOfContents;
