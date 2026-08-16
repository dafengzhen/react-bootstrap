import { type FC, useCallback, useMemo } from 'react';

import type { DocsHomeProps } from './types';

import {
  scrollToSection,
  slugify,
  TableOfContents,
  type TocItem,
  updateHash,
  useIdPrefix,
} from '../doc-template';

const UNORDERED_INDEX = Number.MAX_SAFE_INTEGER;

export const DocsHome: FC<DocsHomeProps> = ({
  description = '欢迎使用组件库，以下是所有组件的文档',
  docs,
  title = '组件库文档',
}) => {
  const sortedDocs = useMemo(
    () => [...docs].sort((a, b) => (a.order ?? UNORDERED_INDEX) - (b.order ?? UNORDERED_INDEX)),
    [docs],
  );

  const idPrefix = useIdPrefix('docs');

  const docSlugs = useMemo(() => {
    const counts = new Map<string, number>();
    return sortedDocs.map((doc) => {
      const base = slugify(doc.name) || 'doc';
      const count = (counts.get(base) ?? 0) + 1;
      counts.set(base, count);
      return count === 1 ? base : `${base}-${count}`;
    });
  }, [sortedDocs]);

  const docIds = useMemo(() => docSlugs.map((slug) => `${idPrefix}-${slug}`), [docSlugs, idPrefix]);

  const tocItems = useMemo<TocItem[]>(
    () => [
      { id: `${idPrefix}-home`, level: 1, title: '文档首页' },
      ...docIds.map((id, index): TocItem => ({
        id,
        level: 2,
        title: sortedDocs[index].name,
      })),
    ],
    [docIds, idPrefix, sortedDocs],
  );

  const handleDocClick = useCallback((id: string) => {
    scrollToSection(id);
    updateHash(id);
  }, []);

  if (sortedDocs.length === 1) {
    return <>{sortedDocs[0].component}</>;
  }

  return (
    <div className="api-doc-container">
      <aside className="api-doc-sidebar">
        <TableOfContents items={tocItems} />
      </aside>

      <main className="api-doc-content">
        <section className="api-section" id={`${idPrefix}-home`}>
          <h2 className="h4 mb-3">{title}</h2>
          <p className="text-muted">{description}</p>
          <div className="mt-4 d-flex flex-wrap gap-2">
            {sortedDocs.map((doc, index) => (
              <button
                className="btn btn-outline-primary"
                key={doc.name}
                onClick={() => handleDocClick(docIds[index])}
                type="button"
              >
                {doc.icon && <span className="me-1">{doc.icon}</span>}
                {doc.name}
                {doc.tags && doc.tags.length > 0 && (
                  <span className="badge bg-light text-dark ms-2">{doc.tags.join(', ')}</span>
                )}
              </button>
            ))}
          </div>
        </section>

        {sortedDocs.map((doc, index) => (
          <section className="api-section" id={docIds[index]} key={docIds[index]}>
            <div className="d-flex align-items-center gap-2 mb-3">
              <h2 className="h4 mb-0">{doc.name}</h2>
              {doc.tags && doc.tags.length > 0 && (
                <div className="d-flex gap-1">
                  {doc.tags.map((tag) => (
                    <span className="badge bg-secondary" key={tag}>
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
            <p className="text-muted">{doc.description}</p>
            <div className="doc-content mt-3">{doc.component}</div>
          </section>
        ))}
      </main>
    </div>
  );
};

export default DocsHome;
