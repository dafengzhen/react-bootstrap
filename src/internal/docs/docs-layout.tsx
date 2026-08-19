import clsx from 'clsx';
import { type FC, useCallback, useEffect, useMemo, useState } from 'react';
import { Outlet, useLocation } from 'react-router';

import type { DocsLayoutProps } from './types.ts';

import { DocSidebarContext, slugify, TableOfContents, type TocItem } from '../doc-template';
import { DocsFooter } from './docs-footer.tsx';

const UNORDERED_INDEX = Number.MAX_SAFE_INTEGER;

const HOME_TOC_ID = 'docs-home';

export const DocsLayout: FC<DocsLayoutProps> = ({
  docs,
  githubUrl = 'https://github.com/dafengzhen/react-bootstrap',
  sidebarTitle = 'Component Documentation',
}) => {
  const location = useLocation();
  const [pageSections, setPageSections] = useState<TocItem[]>([]);
  const [sidebarOpenAt, setSidebarOpenAt] = useState<null | string>(null);

  const sidebarOpen = sidebarOpenAt === location.key;

  const sortedDocs = useMemo(
    () => [...docs].sort((a, b) => (a.order ?? UNORDERED_INDEX) - (b.order ?? UNORDERED_INDEX)),
    [docs],
  );

  const sidebarContext = useMemo(
    () => ({
      registerSections: (items: TocItem[]) => {
        setPageSections(items);
        return () => {
          setPageSections((prev) => (prev === items ? [] : prev));
        };
      },
    }),
    [],
  );

  const activeDoc = useMemo(
    () => sortedDocs.find((doc) => doc.path === location.pathname),
    [location.pathname, sortedDocs],
  );

  const tocItems = useMemo<TocItem[]>(() => {
    const items: TocItem[] = [{ id: HOME_TOC_ID, level: 1, title: 'Documentation Home', to: '/' }];
    for (const doc of sortedDocs) {
      items.push({
        id: `doc-${slugify(doc.name) || doc.path}`,
        level: 1,
        title: doc.name,
        to: doc.path,
      });
      if (activeDoc === doc) {
        items.push(...pageSections);
      }
    }
    return items;
  }, [activeDoc, pageSections, sortedDocs]);

  const handleClose = useCallback(() => {
    setSidebarOpenAt(null);
  }, []);

  const handleToggleSidebar = useCallback(() => {
    setSidebarOpenAt((prev) => (prev === location.key ? null : location.key));
  }, [location.key]);

  useEffect(() => {
    const hash = window.location.hash.slice(1);
    const target = hash ? document.getElementById(hash) : null;
    if (target) {
      target.scrollIntoView({ block: 'start' });
    } else {
      window.scrollTo({ top: 0 });
    }
  }, [location]);

  return (
    <DocSidebarContext.Provider value={sidebarContext}>
      <div className="docs-layout">
        <button
          aria-controls="docs-sidebar"
          aria-expanded={sidebarOpen}
          aria-label={sidebarOpen ? '关闭组件目录' : '打开组件目录'}
          className={clsx('docs-sidebar-fab', sidebarOpen && 'docs-sidebar-fab-open')}
          onClick={handleToggleSidebar}
          type="button"
        >
          <span aria-hidden="true" className="docs-sidebar-fab-icon">
            {sidebarOpen ? '×' : '☰'}
          </span>
          <span>{sidebarOpen ? '关闭' : '目录'}</span>
        </button>

        {sidebarOpen && (
          <div
            aria-hidden="true"
            className="docs-sidebar-backdrop"
            onClick={handleClose}
            role="presentation"
          />
        )}

        <div className="docs-body">
          <aside
            aria-label={sidebarTitle}
            className={clsx('docs-sidebar', sidebarOpen && 'docs-sidebar-open')}
            id="docs-sidebar"
          >
            <TableOfContents items={tocItems} onNavigate={handleClose} title={sidebarTitle} />
          </aside>

          <main className="docs-main">
            <Outlet />
          </main>
        </div>

        <DocsFooter githubUrl={githubUrl} />
      </div>
    </DocSidebarContext.Provider>
  );
};

export default DocsLayout;
