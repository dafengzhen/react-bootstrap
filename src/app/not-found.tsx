import { Link } from 'react-router';

import styles from '../components/docs/docs.module.css';
import { Empty } from '../components/empty';

export function meta() {
  return [
    { title: 'Page Not Found · React Bootstrap' },
    {
      content: 'The page you are looking for does not exist or has been moved.',
      name: 'description',
    },
    { content: 'noindex', name: 'robots' },
  ];
}

export default function NotFound() {
  return (
    <div className={styles.docsPage}>
      <header className={styles.docsPageHeader}>
        <h1 className={styles.docsPageTitle}>Page Not Found</h1>
        <p className={`text-muted ${styles.docsPageDescription}`}>
          The page you are looking for does not exist or has been moved.
        </p>
      </header>
      <Empty
        description="Check the URL or browse the component documentation to find what you need."
        size="lg"
        title="404"
      >
        <Link className="btn btn-primary me-2" to="/components">
          Back to Components
        </Link>
        <Link className="btn btn-outline-secondary" to="/">
          Go Home
        </Link>
      </Empty>
    </div>
  );
}
