import { type FC, type ReactNode, useEffect, useMemo } from 'react';
import { Link } from 'react-router';

import type { TocItem } from '../doc-template';

import { CodeBlock, slugify, useDocSidebar, useIdPrefix } from '../doc-template';
import styles from './docs.module.css';

interface GettingStartedSection {
  content: ReactNode;
  id: string;
  title: string;
}

const INSTALL_CODE = 'npm install @dafengzhen/react-bootstrap bootstrap clsx react react-dom';

const QUICK_START_CODE = `import 'bootstrap/dist/css/bootstrap.css';
import { Button } from '@dafengzhen/react-bootstrap';

const App = () => (
  <Button variant="primary">Hello Bootstrap</Button>
);

export default App;`;

const INDIVIDUAL_IMPORT_CODE = `import { Button } from '@dafengzhen/react-bootstrap/button';
import { Card } from '@dafengzhen/react-bootstrap/card';
import { Modal } from '@dafengzhen/react-bootstrap/modal';`;

export const GettingStarted: FC = () => {
  const docSidebar = useDocSidebar();
  const idPrefix = useIdPrefix('getting-started');

  const sections = useMemo<GettingStartedSection[]>(() => {
    const createSection = (title: string, content: ReactNode): GettingStartedSection => ({
      content,
      id: `${idPrefix}-section-${slugify(title) || 'section'}`,
      title,
    });

    return [
      createSection('Installation', <CodeBlock code={INSTALL_CODE} language="bash" />),
      createSection('Quick Start', <CodeBlock code={QUICK_START_CODE} language="tsx" />),
      createSection(
        'Importing Components',
        <CodeBlock code={INDIVIDUAL_IMPORT_CODE} language="tsx" />,
      ),
      createSection(
        'Next Steps',
        <p className="mb-0">
          Browse the <Link to="/components">components overview</Link> to explore every component
          and its documentation.
        </p>,
      ),
    ];
  }, [idPrefix]);

  useEffect(() => {
    if (!docSidebar) {
      return undefined;
    }
    const items: TocItem[] = sections.map(({ id, title }) => ({ id, level: 1, title }));
    return docSidebar.registerSections(items);
  }, [docSidebar, sections]);

  return (
    <div className={styles.docsPage}>
      <header className={styles.docsPageHeader}>
        <h1 className={styles.docsPageTitle}>Getting Started</h1>
        <p className={`text-muted ${styles.docsPageDescription}`}>
          Install React Bootstrap and start building responsive interfaces with Bootstrap 5 in a few
          minutes.
        </p>
      </header>
      {sections.map(({ content, id, title }) => (
        <section className={styles.docsPageSection} id={id} key={id}>
          <h2 className={styles.docsPageSectionTitle}>{title}</h2>
          {content}
        </section>
      ))}
    </div>
  );
};

export default GettingStarted;
