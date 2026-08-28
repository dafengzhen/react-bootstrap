import clsx from 'clsx';
import { type FC, Fragment, useCallback, useEffect, useMemo, useState } from 'react';

import type { DocsLayoutProps } from './types.ts';

import { DocSidebarContext, slugify, TableOfContents, type TocItem } from '../doc-template';
import { DocsFooter } from './docs-footer.tsx';
import styles from './docs.module.css';

export const DocsLayout: FC<DocsLayoutProps> = ({
  children,
  docs,
  embedded = false,
  githubUrl = 'https://github.com/dafengzhen/react-bootstrap',
  navItems = [],
  navTitle,
  pathname,
  renderLink,
  rightSidebarTitle = 'On This Page',
  sidebarTitle = 'Components',
}) => {
  const [pageSections, setPageSections] = useState<TocItem[]>([]);
  const [sidebarOpenAt, setSidebarOpenAt] = useState<null | string>(null);

  const sidebarOpen = sidebarOpenAt !== null && sidebarOpenAt === pathname;
  const showNav = !embedded && navItems.length > 0;

  const sortedDocs = useMemo(
    () => [...docs].sort((a, b) => a.name.localeCompare(b.name, 'en')),
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

  const sidebarItems = useMemo<TocItem[]>(
    () =>
      sortedDocs.map((doc) => ({
        id: `doc-${slugify(doc.name) || doc.path}`,
        level: 1,
        title: doc.name,
        to: doc.path,
      })),
    [sortedDocs],
  );

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

  const isNavItemActive = (to: string): boolean =>
    pathname === to || (to !== '/' && pathname?.startsWith(`${to}/`) === true);

  return (
    <DocSidebarContext.Provider value={sidebarContext}>
      <div
        className={clsx(
          styles.docsLayout,
          embedded && styles.docsLayoutEmbedded,
          showNav && styles.docsLayoutWithNav,
        )}
      >
        {showNav && (
          <header className={styles.docsNavbar}>
            {navTitle && (
              <Fragment>
                {renderLink ? (
                  renderLink({
                    children: (
                      <>
                        <img
                          alt={`${navTitle} logo`}
                          className={styles.docsNavbarLogo}
                          height={24}
                          src="/android-chrome-192x192.png"
                          width={24}
                        />
                        <span>{navTitle}</span>
                      </>
                    ),
                    className: styles.docsNavbarBrand,
                    to: '/',
                  })
                ) : (
                  // oxlint-disable-next-line nextjs/no-html-link-for-pages
                  <a className={styles.docsNavbarBrand} href="/">
                    <img
                      alt={`${navTitle} logo`}
                      className={styles.docsNavbarLogo}
                      height={24}
                      src="/android-chrome-192x192.png"
                      width={24}
                    />
                    <span>{navTitle}</span>
                  </a>
                )}
              </Fragment>
            )}
            <nav aria-label="主导航" className={styles.docsNavbarLinks}>
              {navItems.map((item) => {
                const isActive = isNavItemActive(item.to);
                const linkClassName = clsx(
                  styles.docsNavbarLink,
                  isActive && styles.docsNavbarLinkActive,
                );
                return (
                  <Fragment key={item.to}>
                    {renderLink ? (
                      renderLink({ children: item.label, className: linkClassName, to: item.to })
                    ) : (
                      <a className={linkClassName} href={item.to}>
                        {item.label}
                      </a>
                    )}
                  </Fragment>
                );
              })}
            </nav>
          </header>
        )}

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
              items={sidebarItems}
              onNavigate={handleClose}
              renderLink={renderLink}
              title={sidebarTitle}
            />
          </aside>

          <main className={styles.docsMain}>{children}</main>

          {!embedded && pageSections.length > 0 && (
            <aside
              aria-label={rightSidebarTitle}
              className={styles.docsRightSidebar}
              id="docs-right-sidebar"
            >
              <TableOfContents items={pageSections} title={rightSidebarTitle} />
            </aside>
          )}
        </div>

        <DocsFooter githubUrl={githubUrl} />
      </div>
    </DocSidebarContext.Provider>
  );
};

export default DocsLayout;
