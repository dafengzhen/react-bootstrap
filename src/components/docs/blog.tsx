import { type FC } from 'react';

import styles from './docs.module.css';

interface BlogPost {
  date: string;
  excerpt: string;
  title: string;
}

const POSTS: BlogPost[] = [
  {
    date: '2026-08-28',
    excerpt:
      'A look at what is coming next for React Bootstrap, including new components and documentation improvements.',
    title: 'Roadmap for 2026',
  },
  {
    date: '2026-08-28',
    excerpt:
      'The documentation site got a fresh layout with top navigation and a right-hand on-page table of contents.',
    title: 'Documentation Site Redesign',
  },
  {
    date: '2026-08-28',
    excerpt:
      'Introducing React Bootstrap: a React component library based on Bootstrap 5 with TypeScript support.',
    title: 'Introducing React Bootstrap',
  },
];

export const Blog: FC = () => (
  <div className={styles.docsPage}>
    <header className={styles.docsPageHeader}>
      <h1 className={styles.docsPageTitle}>Blog</h1>
      <p className={`text-muted ${styles.docsPageDescription}`}>
        Releases, updates and articles about React Bootstrap.
      </p>
    </header>
    <div className={styles.blogGrid}>
      {POSTS.map((post) => (
        <article className={styles.blogCard} key={post.title}>
          <h2 className={styles.blogCardTitle}>{post.title}</h2>
          <time className={styles.blogCardDate} dateTime={post.date}>
            {post.date}
          </time>
          <p className={styles.blogCardExcerpt}>{post.excerpt}</p>
        </article>
      ))}
    </div>
  </div>
);

export default Blog;
