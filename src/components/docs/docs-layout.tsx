import clsx from 'clsx';
import { type FC, useCallback, useEffect, useMemo, useState } from 'react';

import type { DocsLayoutProps } from './types.ts';

import { DocSidebarContext, slugify, TableOfContents, type TocItem } from '../doc-template';
import { DocsFooter } from './docs-footer.tsx';
import styles from './docs.module.css';

const UNORDERED_INDEX = Number.MAX_SAFE_INTEGER;

const HOME_TOC_ID = 'docs-home';

export const DocsLayout: FC<DocsLayoutProps> = ({
  children,
  docs,
  embedded = false,
  githubUrl = 'https://github.com/dafengzhen/react-bootstrap',
  pathname,
  renderLink,
  sidebarTitle = 'Component Documentation',
}) => {
  const [pageSections, setPageSections] = useState<TocItem[]>([]);
  const [sidebarOpenAt, setSidebarOpenAt] = useState<null | string>(null);

  const sidebarOpen = sidebarOpenAt !== null && sidebarOpenAt === pathname;

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
    () => sortedDocs.find((doc) => doc.path === pathname),
    [pathname, sortedDocs],
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
    setSidebarOpenAt((prev) => (prev === pathname ? null : (pathname ?? null)));
  }, [pathname]);

  useEffect(() => {
    const hash = window.location.hash.slice(1);
    const target = hash ? document.getElementById(hash) : null;
    if (target) {
      target.scrollIntoView({ block: 'start' });
    } else {
      window.scrollTo({ top: 0 });
    }
  }, [pathname]);

  return (
    <DocSidebarContext.Provider value={sidebarContext}>
      <div className={clsx(styles.docsLayout, embedded && styles.docsLayoutEmbedded)}>
        {!embedded && (
          <button
            aria-controls="docs-sidebar"
            aria-expanded={sidebarOpen}
            aria-label={sidebarOpen ? '关闭组件目录' : '打开组件目录'}
            className={clsx(styles.docsSidebarFab, sidebarOpen && styles.docsSidebarFabOpen)}
            onClick={handleToggleSidebar}
            type="button"
          >
            <span aria-hidden="true" className={styles.docsSidebarFabIcon}>
              {sidebarOpen ? '×' : '☰'}
            </span>
            <span>{sidebarOpen ? '关闭' : '目录'}</span>
          </button>
        )}

        {!embedded && sidebarOpen && (
          <div
            aria-hidden="true"
            className={styles.docsSidebarBackdrop}
            onClick={handleClose}
            role="presentation"
          />
        )}

        <div className={styles.docsBody}>
          <aside
            aria-label={sidebarTitle}
            className={clsx(
              styles.docsSidebar,
              embedded ? styles.docsSidebarEmbedded : sidebarOpen && styles.docsSidebarOpen,
            )}
            id="docs-sidebar"
          >
            <TableOfContents
              activeTo={pathname}
              items={tocItems}
              onNavigate={handleClose}
              renderLink={renderLink}
              title={sidebarTitle}
            />
          </aside>

          <main className={styles.docsMain}>{children}</main>
        </div>

        <DocsFooter githubUrl={githubUrl} />
      </div>
    </DocSidebarContext.Provider>
  );
};

export default DocsLayout;
