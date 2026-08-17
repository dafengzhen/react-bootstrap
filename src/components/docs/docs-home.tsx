import { type FC, useMemo } from 'react';
import { Link } from 'react-router';

import type { DocsHomeProps } from './types';

import { NameColorBadge } from '../doc-template';

const UNORDERED_INDEX = Number.MAX_SAFE_INTEGER;

export const DocsHome: FC<DocsHomeProps> = ({
  description = '欢迎使用组件库，以下是所有组件的文档',
  docs,
  title = 'React Bootstrap',
}) => {
  const sortedDocs = useMemo(
    () => [...docs].sort((a, b) => (a.order ?? UNORDERED_INDEX) - (b.order ?? UNORDERED_INDEX)),
    [docs],
  );

  return (
    <div className="docs-home">
      <section className="docs-home-hero">
        <div className="docs-home-heading">
          <img
            alt={`${title} logo`}
            className="docs-home-logo"
            height={44}
            src="/android-chrome-192x192.png"
            width={44}
          />
          <h1 className="docs-home-title">{title}</h1>
        </div>
        <p className="text-muted docs-home-description">{description}</p>
      </section>

      <div className="docs-card-grid">
        {sortedDocs.map((doc) => (
          <Link className="docs-card" key={doc.path} to={doc.path}>
            <NameColorBadge name={doc.name} size="md" />
            <div className="docs-card-body">
              <div className="docs-card-heading">
                <h2 className="docs-card-title">{doc.name}</h2>
                {doc.tags?.map((tag) => (
                  <span className="badge bg-secondary" key={tag}>
                    {tag}
                  </span>
                ))}
              </div>
              <p className="docs-card-description">{doc.description}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default DocsHome;
