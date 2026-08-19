import { type FC } from 'react';

export interface DocsFooterProps {
  githubUrl: string;
}

export const DocsFooter: FC<DocsFooterProps> = ({ githubUrl }) => (
  <footer className="docs-footer">
    <span className="docs-footer-text">React Bootstrap © {new Date().getFullYear()}</span>
    <a className="docs-footer-link" href={githubUrl} rel="noreferrer" target="_blank">
      GitHub ↗
    </a>
  </footer>
);

export default DocsFooter;
