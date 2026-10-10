import { type FC } from 'react';

import styles from './docs.module.css';

const COPYRIGHT_YEAR = new Date().getFullYear();

export interface DocsFooterProps {
  githubUrl: string;
}

export const DocsFooter: FC<DocsFooterProps> = ({ githubUrl }) => (
  <footer className={styles.docsFooter}>
    <span className={styles.docsFooterText}>React Bootstrap © {COPYRIGHT_YEAR}</span>
    <a className={styles.docsFooterLink} href={githubUrl} rel="noreferrer" target="_blank">
      GitHub ↗
    </a>
  </footer>
);

export default DocsFooter;
