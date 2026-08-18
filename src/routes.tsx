import type { RouteObject } from 'react-router';

import ButtonGroupDoc from './components/button-group/button-group.doc';
import ButtonDoc from './components/button/button.doc';
import CardDoc from './components/card/card.doc';
import CloseButtonDoc from './components/close-button/close-button.doc';
import DialogDoc from './components/dialog/dialog.doc';
import { type DocConfig, DocsHome, DocsLayout } from './components/docs';
import ModalDoc from './components/modal/modal.doc';

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
      'Card component that provides a flexible and extensible content container, supporting header/footer, images, overlays, navigation and various color styles.',
    element: <CardDoc />,
    name: 'Card',
    order: 4,
    path: '/components/card',
    tags: ['Basic', 'Layout'],
  },
  {
    description:
      'Close button component for dismissing content such as modals, alerts and toasts, with white variant and disabled state support.',
    element: <CloseButtonDoc />,
    name: 'CloseButton',
    order: 5,
    path: '/components/close-button',
    tags: ['Basic', 'Dialog'],
  },
  {
    description:
      'Dialog component that renders content in a modal layer above the page, supporting multiple placements, focus trapping, scroll locking and transition animations.',
    element: <DialogDoc />,
    name: 'Dialog',
    order: 6,
    path: '/components/dialog',
    tags: ['Basic', 'Dialog'],
  },
  {
    description:
      'Modal component that renders content in a dialog layer above the page, supporting sizes, fullscreen and centered/scrollable layouts, static backdrops, focus trapping and transition animations.',
    element: <ModalDoc />,
    name: 'Modal',
    order: 7,
    path: '/components/modal',
    tags: ['Basic', 'Dialog'],
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
