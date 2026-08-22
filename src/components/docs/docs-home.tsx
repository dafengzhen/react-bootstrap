import { type FC, Fragment, useMemo } from 'react';

import type { DocsHomeProps } from './types.ts';

import { NameColorBadge } from '../doc-template';
import styles from './docs.module.css';

const UNORDERED_INDEX = Number.MAX_SAFE_INTEGER;

export const DocsHome: FC<DocsHomeProps> = ({
  description = '欢迎使用组件库，以下是所有组件的文档',
  docs,
  renderLink,
  title = 'React Bootstrap',
}) => {
  const sortedDocs = useMemo(
    () => [...docs].sort((a, b) => (a.order ?? UNORDERED_INDEX) - (b.order ?? UNORDERED_INDEX)),
    [docs],
  );

  return (
    <div className={styles.docsHome}>
      <section className={styles.docsHomeHero}>
        <div className={styles.docsHomeHeading}>
          <img
            alt={`${title} logo`}
            className={styles.docsHomeLogo}
            height={44}
            src="/android-chrome-192x192.png"
            width={44}
          />
          <h1 className={styles.docsHomeTitle}>{title}</h1>
        </div>
        <p className={`text-muted ${styles.docsHomeDescription}`}>{description}</p>
      </section>

      <div className={styles.docsCardGrid}>
        {sortedDocs.map((doc) => {
          const card = (
            <>
              <NameColorBadge name={doc.name} size="md" />
              <div className={styles.docsCardBody}>
                <div className={styles.docsCardHeading}>
                  <h2 className={styles.docsCardTitle}>{doc.name}</h2>
                  {doc.tags?.map((tag) => (
                    <span className="badge bg-secondary" key={tag}>
                      {tag}
                    </span>
                  ))}
                </div>
                <p className={styles.docsCardDescription}>{doc.description}</p>
              </div>
            </>
          );

          return (
            <Fragment key={doc.path}>
              {renderLink ? (
                renderLink({ children: card, className: styles.docsCard, to: doc.path })
              ) : (
                <a className={styles.docsCard} href={doc.path}>
                  {card}
                </a>
              )}
            </Fragment>
          );
        })}
      </div>
    </div>
  );
};

export default DocsHome;
