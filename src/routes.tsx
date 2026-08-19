import type { RouteObject } from 'react-router';

import AlertDoc from './components/alert/alert.doc';
import BadgeDoc from './components/badge/badge.doc';
import BreadcrumbDoc from './components/breadcrumb/breadcrumb.doc';
import ButtonGroupDoc from './components/button-group/button-group.doc';
import ButtonDoc from './components/button/button.doc';
import CardDoc from './components/card/card.doc';
import CloseButtonDoc from './components/close-button/close-button.doc';
import ListGroupDoc from './components/list-group/list-group.doc';
import ModalDoc from './components/modal/modal.doc';
import PaginationDoc from './components/pagination/pagination.doc';
import PlaceholderDoc from './components/placeholder/placeholder.doc';
import SpinnerDoc from './components/spinner/spinner.doc';
import TabsDoc from './components/tabs/tabs.doc';
import { type DocConfig, DocsHome, DocsLayout } from './internal/docs';

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
      'List group component that displays a series of content in a flexible list container, supporting active/disabled states, links and buttons, flush and numbered styles, horizontal layout, contextual colors, badges and custom content.',
    element: <ListGroupDoc />,
    name: 'ListGroup',
    order: 3,
    path: '/components/list-group',
    tags: ['Basic', 'Navigation'],
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
      'Modal component that renders content in a dialog layer above the page, supporting sizes, fullscreen, centered/scrollable layouts, placements, custom sizing, static backdrops, focus trapping and transition animations.',
    element: <ModalDoc />,
    name: 'Modal',
    order: 6,
    path: '/components/modal',
    tags: ['Basic', 'Dialog'],
  },
  {
    description:
      'Alert component that provides contextual feedback messages for typical user actions, supporting eight variants, dismissible mode with fade animation, links, headings and icons.',
    element: <AlertDoc />,
    name: 'Alert',
    order: 8,
    path: '/components/alert',
    tags: ['Basic', 'Feedback'],
  },
  {
    description:
      'Badge component that displays status, counts or labels in small inline content, supporting multiple background colors, pill shape, buttons and links, scaling with the parent font size.',
    element: <BadgeDoc />,
    name: 'Badge',
    order: 9,
    path: '/components/badge',
    tags: ['Basic', 'Feedback'],
  },
  {
    description:
      'Breadcrumb component that indicates the current page location within a navigational hierarchy, supporting links, active state, custom dividers and accessible labels.',
    element: <BreadcrumbDoc />,
    name: 'Breadcrumb',
    order: 10,
    path: '/components/breadcrumb',
    tags: ['Basic', 'Navigation'],
  },
  {
    description:
      'Pagination component that splits a set of links across multiple pages, supporting icon links, active/disabled states, sizing, alignment and accessible labels.',
    element: <PaginationDoc />,
    name: 'Pagination',
    order: 11,
    path: '/components/pagination',
    tags: ['Basic', 'Navigation'],
  },
  {
    description:
      'Placeholder component that renders skeleton loading placeholders for components and pages, supporting grid column widths, background colors, sizing, glow/wave animations and placeholder buttons.',
    element: <PlaceholderDoc />,
    name: 'Placeholder',
    order: 12,
    path: '/components/placeholder',
    tags: ['Basic', 'Feedback'],
  },
  {
    description:
      'Spinner component that indicates the loading state of a component or page, supporting border/grow animations, color variants, sizes and usage inside buttons.',
    element: <SpinnerDoc />,
    name: 'Spinner',
    order: 13,
    path: '/components/spinner',
    tags: ['Basic', 'Feedback'],
  },
  {
    description:
      'Tabs component that builds navigation and tabbed panels, supporting tabs/pills/underline variants, fill and justify layouts, vertical arrangement, active/disabled states and fade transitions.',
    element: <TabsDoc />,
    name: 'Tabs',
    order: 14,
    path: '/components/tabs',
    tags: ['Basic', 'Navigation'],
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
