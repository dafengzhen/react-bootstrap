import { Link, Outlet, useLocation } from 'react-router';

import type { RenderLink } from '../components/doc-template';

import { DocsLayout } from '../components/docs';
import { docs, GITHUB_URL, HOME_DESCRIPTION, HOME_TITLE, NAV_ITEMS } from './doc-config';

const renderLink: RenderLink = ({ children, className, to }) => (
  <Link className={className} to={to}>
    {children}
  </Link>
);

export default function DocsRoute() {
  const { pathname } = useLocation();

  return (
    <DocsLayout
      docs={docs}
      githubUrl={GITHUB_URL}
      navItems={NAV_ITEMS}
      navTitle="React Bootstrap"
      pathname={pathname}
      renderLink={renderLink}
    >
      <Outlet />
    </DocsLayout>
  );
}

export function meta({ location }: { location: { pathname: string } }) {
  const pathname = location.pathname.replace(/\/+$/, '') || '/';
  const doc = docs.find((entry) => entry.path === pathname);
  const title = doc ? `${doc.name} · React Bootstrap` : HOME_TITLE;
  const description = doc?.description ?? HOME_DESCRIPTION;
  return [{ title }, { content: description, name: 'description' }];
}
