import { Link } from 'react-router';

import type { RenderLink } from '../components/doc-template';

import { DocsHome } from '../components/docs';
import { docs, HOME_DESCRIPTION, HOME_TITLE } from './doc-config';

const renderLink: RenderLink = ({ children, className, to }) => (
  <Link className={className} to={to}>
    {children}
  </Link>
);

export default function ComponentsPage() {
  return (
    <DocsHome
      description={HOME_DESCRIPTION}
      docs={docs}
      renderLink={renderLink}
      title={HOME_TITLE}
    />
  );
}
