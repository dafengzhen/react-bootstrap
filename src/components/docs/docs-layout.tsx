import clsx from 'clsx';
import { type FC, useCallback, useEffect, useMemo, useState } from 'react';
import { Outlet, useLocation } from 'react-router';

import type { DocsLayoutProps } from './types';

import { DocSidebarContext, slugify, TableOfContents, type TocItem } from '../doc-template';
import { DocsFooter } from './docs-footer';
import './docs.css';

const UNORDERED_INDEX = Number.MAX_SAFE_INTEGER;

const HOME_TOC_ID = 'docs-home';

export const DocsLayout: FC<DocsLayoutProps> = ({
  docs,
  githubUrl = 'https://github.com/dafengzhen/react-bootstrap',
  sidebarTitle = '组件文档',
}) => {
  const location = useLocation();
  const [pageSections, setPageSections] = useState<TocItem[]>([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);

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
    const items: TocItem[] = [{ id: HOME_TOC_ID, level: 1, title: '文档首页', to: '/' }];
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
    setSidebarOpen(false);
  }, []);

  useEffect(() => {
    const hash = window.location.hash.slice(1);
    const target = hash ? document.getElementById(hash) : null;
    if (target) {
      target.scrollIntoView({ block: 'start' });
    } else {
      window.scrollTo({ top: 0 });
    }
    setSidebarOpen(false);
  }, [location]);

  return (
    <DocSidebarContext.Provider value={sidebarContext}>
      <div className="docs-layout">
        <button
          aria-controls="docs-sidebar"
          aria-expanded={sidebarOpen}
          aria-label={sidebarOpen ? '关闭组件目录' : '打开组件目录'}
          className={clsx('docs-sidebar-fab', sidebarOpen && 'docs-sidebar-fab-open')}
          onClick={() => setSidebarOpen((prev) => !prev)}
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
