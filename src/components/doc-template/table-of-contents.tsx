import clsx from 'clsx';
import { type FC, type MouseEvent as ReactMouseEvent, useCallback, useState } from 'react';
import { NavLink } from 'react-router';

import type { TableOfContentsProps } from './types';

import { scrollToSection, updateHash } from './utils';

export const TableOfContents: FC<TableOfContentsProps> = ({
  items,
  onNavigate,
  title = '目录',
}) => {
  const [activeId, setActiveId] = useState<string>();

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

  return (
    <nav aria-label="目录导航" className="toc-nav">
      <div className="toc-header">
        <h6 className="toc-title">{title}</h6>
      </div>
      <ul className="toc-list">
        {items.map((item) =>
          item.to ? (
            <li className={clsx('toc-item', `toc-level-${item.level}`)} key={item.id}>
              <NavLink
                className={({ isActive }) => (isActive ? 'active' : undefined)}
                end={item.to === '/'}
                onClick={onNavigate}
                to={item.to}
              >
                {item.title}
              </NavLink>
            </li>
          ) : (
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
                onClick={(event) => handleAnchorClick(event, item.id)}
              >
                {item.title}
              </a>
            </li>
          ),
        )}
      </ul>
    </nav>
  );
};

export default TableOfContents;
