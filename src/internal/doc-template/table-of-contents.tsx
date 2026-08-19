import clsx from 'clsx';
import { type FC, type MouseEvent as ReactMouseEvent, useCallback, useMemo, useState } from 'react';
import { NavLink } from 'react-router';

import type { TableOfContentsProps, TocItem } from './types.ts';

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

export const TableOfContents: FC<TableOfContentsProps> = ({
  items,
  onNavigate,
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
    <nav aria-label="目录导航" className="toc-nav">
      <div className="toc-header">
        <h6 className="toc-title">{title}</h6>
      </div>
      <ul className="toc-list">
        {visibleNodes.map(({ children, item }) => {
          const hasChildren = children.length > 0;
          const isCollapsed = collapsedIds.has(item.id);
          const levelClass = `toc-level-${item.level}`;
          const chevron = (
            <svg aria-hidden="true" className="toc-chevron" fill="currentColor" viewBox="0 0 16 16">
              <path d={CHEVRON_PATH} />
            </svg>
          );

          return (
            <li
              className={clsx(
                'toc-item',
                levelClass,
                hasChildren && 'toc-has-children',
                isCollapsed && 'is-collapsed',
                activeId === item.id && 'active',
              )}
              key={item.id}
            >
              {hasChildren ? (
                item.to ? (
                  <NavLink
                    aria-expanded={!isCollapsed}
                    className={({ isActive }) => clsx('toc-toggle', isActive && 'active')}
                    end={item.to === '/'}
                    onClick={(event) => {
                      event.preventDefault();
                      handleToggle(item.id);
                    }}
                    to={item.to}
                  >
                    <span className="toc-toggle-title">{item.title}</span>
                    {chevron}
                  </NavLink>
                ) : (
                  <button
                    aria-expanded={!isCollapsed}
                    className="toc-toggle"
                    onClick={() => handleToggle(item.id)}
                    type="button"
                  >
                    <span className="toc-toggle-title">{item.title}</span>
                    {chevron}
                  </button>
                )
              ) : item.to ? (
                <NavLink
                  className={({ isActive }) => (isActive ? 'active' : undefined)}
                  end={item.to === '/'}
                  onClick={onNavigate}
                  to={item.to}
                >
                  {item.title}
                </NavLink>
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
