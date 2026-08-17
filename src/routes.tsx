import type { RouteObject } from 'react-router';

import ButtonGroupDoc from './components/button-group/button-group.doc';
import ButtonDoc from './components/button/button.doc';
import CloseButtonDoc from './components/close-button/close-button.doc';
import { type DocConfig, DocsHome, DocsLayout } from './components/docs';

const GITHUB_URL = 'https://github.com/dafengzhen/react-bootstrap';

const docsConfig: DocConfig[] = [
  {
    description: 'General-purpose button component, supports multiple variants, sizes, and states.',
    element: <ButtonDoc />,
    name: 'Button',
    order: 1,
    path: '/components/button',
    tags: ['Basic', 'Forms'],
  },
  {
    description:
      'Button group component that combines multiple buttons into a single unit, supporting horizontal/vertical arrangement and uniform sizing.',
    element: <ButtonGroupDoc />,
    name: 'ButtonGroup',
    order: 2,
    path: '/components/button-group',
    tags: ['Basic', 'Layout'],
  },
  {
    description:
      'Close button component for dismissing content such as modals, alerts and toasts, with white variant and disabled state support.',
    element: <CloseButtonDoc />,
    name: 'CloseButton',
    order: 3,
    path: '/components/close-button',
    tags: ['Basic', 'Overlay'],
  },
];

const HOME_DESCRIPTION =
  'React component library based on Bootstrap 5, with documentation and usage guides for all components below.';
const HOME_TITLE = 'React Bootstrap';

const appRoutes: RouteObject[] = [
  {
    children: [
      {
        element: <DocsHome description={HOME_DESCRIPTION} docs={docsConfig} title={HOME_TITLE} />,
        index: true,
      },
      ...docsConfig.map((doc): RouteObject => ({ element: doc.element, path: doc.path.slice(1) })),
    ],
    element: <DocsLayout docs={docsConfig} githubUrl={GITHUB_URL} />,
    path: '/',
  },
];

export default appRoutes;
