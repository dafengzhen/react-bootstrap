import { type ComponentType, lazy, Suspense } from 'react';
import { Link, Outlet, type RouteObject, useLocation } from 'react-router';

import type { RenderLink } from './components/doc-template';

import { type DocConfig, DocsHome, DocsLayout } from './components/docs';
import { Spinner } from './components/spinner';

const lazyDoc = (loader: () => Promise<{ default: ComponentType }>) => lazy(loader);

const AccordionDoc = lazyDoc(() => import('./components/accordion/accordion.doc'));
const AlertDoc = lazyDoc(() => import('./components/alert/alert.doc'));
const BadgeDoc = lazyDoc(() => import('./components/badge/badge.doc'));
const BreadcrumbDoc = lazyDoc(() => import('./components/breadcrumb/breadcrumb.doc'));
const ButtonDoc = lazyDoc(() => import('./components/button/button.doc'));
const ButtonGroupDoc = lazyDoc(() => import('./components/button-group/button-group.doc'));
const CardDoc = lazyDoc(() => import('./components/card/card.doc'));
const CarouselDoc = lazyDoc(() => import('./components/carousel/carousel.doc'));
const CloseButtonDoc = lazyDoc(() => import('./components/close-button/close-button.doc'));
const CodeBlockDoc = lazyDoc(() => import('./components/doc-template/code-block.doc'));
const CollapseDoc = lazyDoc(() => import('./components/collapse/collapse.doc'));
const DemoSectionDoc = lazyDoc(() => import('./components/doc-template/demo-section.doc'));
const DocTemplateDoc = lazyDoc(() => import('./components/doc-template/doc-template.doc'));
const DocsHomeDoc = lazyDoc(() => import('./components/docs/docs-home.doc'));
const DocsLayoutDoc = lazyDoc(() => import('./components/docs/docs-layout.doc'));
const DropdownDoc = lazyDoc(() => import('./components/dropdown/dropdown.doc'));
const FloatingLabelDoc = lazyDoc(() => import('./components/floating-label/floating-label.doc'));
const FormCheckDoc = lazyDoc(() => import('./components/form-check/form-check.doc'));
const FormControlDoc = lazyDoc(() => import('./components/form-control/form-control.doc'));
const FormFeedbackDoc = lazyDoc(() => import('./components/form-feedback/form-feedback.doc'));
const FormRangeDoc = lazyDoc(() => import('./components/form-range/form-range.doc'));
const FormSelectDoc = lazyDoc(() => import('./components/form-select/form-select.doc'));
const InputGroupDoc = lazyDoc(() => import('./components/input-group/input-group.doc'));
const LayoutDoc = lazyDoc(() => import('./components/layout/layout.doc'));
const ListGroupDoc = lazyDoc(() => import('./components/list-group/list-group.doc'));
const ModalDoc = lazyDoc(() => import('./components/modal/modal.doc'));
const NameColorBadgeDoc = lazyDoc(() => import('./components/doc-template/name-color-badge.doc'));
const NavbarDoc = lazyDoc(() => import('./components/navbar/navbar.doc'));
const OffcanvasDoc = lazyDoc(() => import('./components/offcanvas/offcanvas.doc'));
const PaginationDoc = lazyDoc(() => import('./components/pagination/pagination.doc'));
const PlaceholderDoc = lazyDoc(() => import('./components/placeholder/placeholder.doc'));
const PopoverDoc = lazyDoc(() => import('./components/popover/popover.doc'));
const ProgressDoc = lazyDoc(() => import('./components/progress/progress.doc'));
const ScrollSpyDoc = lazyDoc(() => import('./components/scrollspy/scrollspy.doc'));
const SpinnerDoc = lazyDoc(() => import('./components/spinner/spinner.doc'));
const StepsDoc = lazyDoc(() => import('./components/steps/steps.doc'));
const TableDoc = lazyDoc(() => import('./components/table/table.doc'));
const TableOfContentsDoc = lazyDoc(() => import('./components/doc-template/table-of-contents.doc'));
const TabsDoc = lazyDoc(() => import('./components/tabs/tabs.doc'));
const ToastDoc = lazyDoc(() => import('./components/toast/toast.doc'));
const TooltipDoc = lazyDoc(() => import('./components/tooltip/tooltip.doc'));

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
      'Offcanvas component that renders a hidden side drawer panel above the page, supporting four placements with custom slide transitions, backdrop and keyboard options, body scroll control, focus management and reduced-motion preferences.',
    element: <OffcanvasDoc />,
    name: 'Offcanvas',
    order: 7,
    path: '/components/offcanvas',
    tags: ['Basic', 'Dialog'],
  },
  {
    description:
      'Dropdown component that toggles contextual overlays for displaying lists of links and actions, supporting split buttons, sizing, dark menus, six directions, menu items with active/disabled states, headers/dividers/text, forms, alignment, auto-close behavior and keyboard navigation.',
    element: <DropdownDoc />,
    name: 'Dropdown',
    order: 8,
    path: '/components/dropdown',
    tags: ['Basic', 'Navigation'],
  },
  {
    description:
      'Navbar component that builds responsive navigation headers, supporting brand, navigation links, forms and text, responsive collapse with toggler, color schemes, containers, fixed/sticky placement, scrolling navs and offcanvas drawers.',
    element: <NavbarDoc />,
    name: 'Navbar',
    order: 9,
    path: '/components/navbar',
    tags: ['Basic', 'Navigation'],
  },
  {
    description:
      'Alert component that provides contextual feedback messages for typical user actions, supporting eight variants, dismissible mode with fade animation, links, headings and icons.',
    element: <AlertDoc />,
    name: 'Alert',
    order: 10,
    path: '/components/alert',
    tags: ['Basic', 'Feedback'],
  },
  {
    description:
      'Badge component that displays status, counts or labels in small inline content, supporting multiple background colors, pill shape, buttons and links, scaling with the parent font size.',
    element: <BadgeDoc />,
    name: 'Badge',
    order: 11,
    path: '/components/badge',
    tags: ['Basic', 'Feedback'],
  },
  {
    description:
      'Breadcrumb component that indicates the current page location within a navigational hierarchy, supporting links, active state, custom dividers and accessible labels.',
    element: <BreadcrumbDoc />,
    name: 'Breadcrumb',
    order: 12,
    path: '/components/breadcrumb',
    tags: ['Basic', 'Navigation'],
  },
  {
    description:
      'Pagination component that splits a set of links across multiple pages, supporting icon links, active/disabled states, sizing, alignment and accessible labels.',
    element: <PaginationDoc />,
    name: 'Pagination',
    order: 13,
    path: '/components/pagination',
    tags: ['Basic', 'Navigation'],
  },
  {
    description:
      'Placeholder component that renders skeleton loading placeholders for components and pages, supporting grid column widths, background colors, sizing, glow/wave animations and placeholder buttons.',
    element: <PlaceholderDoc />,
    name: 'Placeholder',
    order: 14,
    path: '/components/placeholder',
    tags: ['Basic', 'Feedback'],
  },
  {
    description:
      'Popover component that shows extended content in a floating card beside trigger elements, supporting header/body structure, four directions with alignment variations, HTML content, custom styling, delays, click/hover/focus/manual triggers, controlled mode, disabled elements and flip positioning.',
    element: <PopoverDoc />,
    name: 'Popover',
    order: 15,
    path: '/components/popover',
    tags: ['Basic', 'Feedback'],
  },
  {
    description:
      'Spinner component that indicates the loading state of a component or page, supporting border/grow animations, color variants, sizes and usage inside buttons.',
    element: <SpinnerDoc />,
    name: 'Spinner',
    order: 16,
    path: '/components/spinner',
    tags: ['Basic', 'Feedback'],
  },
  {
    description:
      'Tabs component that builds navigation and tabbed panels, supporting tabs/pills/underline variants, fill and justify layouts, vertical arrangement, active/disabled states and fade transitions.',
    element: <TabsDoc />,
    name: 'Tabs',
    order: 17,
    path: '/components/tabs',
    tags: ['Basic', 'Navigation'],
  },
  {
    description:
      'Toast component that pushes lightweight notifications to users, supporting header/body structure, stacking, nine placements, color schemes, autohide with hover pause and custom transitions.',
    element: <ToastDoc />,
    name: 'Toast',
    order: 18,
    path: '/components/toast',
    tags: ['Basic', 'Feedback'],
  },
  {
    description:
      'Tooltip component that shows contextual hints beside trigger elements, supporting four directions with alignment variations, HTML content, custom styling, delays, click/hover/focus/manual triggers, controlled mode, disabled elements and flip positioning.',
    element: <TooltipDoc />,
    name: 'Tooltip',
    order: 19,
    path: '/components/tooltip',
    tags: ['Basic', 'Feedback'],
  },
  {
    description:
      'Progress component that displays the completion state of a task or workflow, supporting labels, custom heights, color variants, striped and animated stripes, stacked segments and manual composition of multiple bars.',
    element: <ProgressDoc />,
    name: 'Progress',
    order: 20,
    path: '/components/progress',
    tags: ['Basic', 'Feedback'],
  },
  {
    description:
      'Steps component that displays progress through a sequence of operations, supporting horizontal/vertical and centered layouts, dot indicators, custom icons, error status, disabled steps and clickable switching in controlled or uncontrolled mode.',
    element: <StepsDoc />,
    name: 'Steps',
    order: 21,
    path: '/components/steps',
    tags: ['Basic', 'Feedback'],
  },
  {
    description:
      'Collapse component that toggles the visibility of content with an animated height or width transition, supporting vertical and horizontal dimensions, multiple targets, transition callbacks and reduced-motion preferences.',
    element: <CollapseDoc />,
    name: 'Collapse',
    order: 22,
    path: '/components/collapse',
    tags: ['Basic', 'Layout'],
  },
  {
    description:
      'Accordion component that collapses vertically stacked content sections into interactive expandable panels, supporting single or multiple open items, flush styling, controlled/uncontrolled active keys, custom triggers and accessible button/collapse associations.',
    element: <AccordionDoc />,
    name: 'Accordion',
    order: 23,
    path: '/components/accordion',
    tags: ['Basic', 'Layout'],
  },
  {
    description:
      'Carousel component that cycles through slides with reducer-driven custom slide and crossfade transitions, supporting indicators, controls, captions, autoplay with hover pause, per-slide intervals, keyboard and touch navigation, controlled mode and reduced-motion preferences.',
    element: <CarouselDoc />,
    name: 'Carousel',
    order: 24,
    path: '/components/carousel',
    tags: ['Basic', 'Layout'],
  },
  {
    description:
      'ScrollSpy component that automatically updates navigation links based on the scroll position of a container or the page, supporting rootMargin/threshold observation options, smooth scrolling, controlled mode, context-based ScrollSpyLink links and plain HTML targets via selector.',
    element: <ScrollSpyDoc />,
    name: 'ScrollSpy',
    order: 25,
    path: '/components/scrollspy',
    tags: ['Basic', 'Navigation'],
  },
  {
    description:
      'Form control component that renders inputs, selects and textareas with consistent Bootstrap styles, supporting sizing, disabled and readonly states, readonly plain text, file and color inputs, datalists, valid/invalid states, and the FormText helper text component.',
    element: <FormControlDoc />,
    name: 'FormControl',
    order: 26,
    path: '/components/form-control',
    tags: ['Basic', 'Forms'],
  },
  {
    description:
      'Floating label component that renders a form control with a label that floats above the input, supporting textareas, selects, disabled and readonly plaintext states, input groups, validation states and grid layouts.',
    element: <FloatingLabelDoc />,
    name: 'FloatingLabel',
    order: 27,
    path: '/components/floating-label',
    tags: ['Basic', 'Forms'],
  },
  {
    description:
      'Input group component that combines text addons, buttons, dropdowns, checkboxes and radios with form controls, supporting prefix/suffix and multiple addons, multiple inputs, button and dropdown addons, segmented buttons, custom selects and file inputs, wrapping, sizing and validation states.',
    element: <InputGroupDoc />,
    name: 'InputGroup',
    order: 28,
    path: '/components/input-group',
    tags: ['Basic', 'Forms'],
  },
  {
    description:
      'Form select component that renders native selects with customized appearance, supporting small/large sizing, multiple selection, visible option count, disabled state and valid/invalid validation states.',
    element: <FormSelectDoc />,
    name: 'FormSelect',
    order: 29,
    path: '/components/form-select',
    tags: ['Basic', 'Forms'],
  },
  {
    description:
      'Form check component that renders consistent checkboxes, radios and switches, composing FormCheck, FormCheckInput and FormCheckLabel, supporting indeterminate and disabled states, inline/reverse layouts and valid/invalid validation states.',
    element: <FormCheckDoc />,
    name: 'FormCheck',
    order: 30,
    path: '/components/form-check',
    tags: ['Basic', 'Forms'],
  },
  {
    description:
      'Form range component that renders a styled native range input, supporting min/max values, step intervals, disabled state and valid/invalid validation states.',
    element: <FormRangeDoc />,
    name: 'FormRange',
    order: 31,
    path: '/components/form-range',
    tags: ['Basic', 'Forms'],
  },
  {
    description:
      'Form feedback component that renders valid/invalid feedback text for form controls, supporting tooltip variants, browser native constraint validation with the was-validated form class and server-side validation states.',
    element: <FormFeedbackDoc />,
    name: 'FormFeedback',
    order: 32,
    path: '/components/form-feedback',
    tags: ['Basic', 'Forms'],
  },
  {
    description:
      'Layout components that structure forms with the grid system, providing Row and Col for multi-column form grids, gutters and alignment utilities, horizontal form labels with size variants, column sizing and auto-sizing, and responsive inline forms.',
    element: <LayoutDoc />,
    name: 'Layout',
    order: 33,
    path: '/components/layout',
    tags: ['Basic', 'Forms', 'Layout'],
  },
  {
    description:
      'Table component that displays tabular data with Bootstrap styles, providing structural helpers for head/body/footer, rows, cells and captions, supporting contextual variants, striped rows/columns, hover and active states, bordered/borderless styles, small sizing, group dividers, vertical alignment, nesting, top captions, responsive scroll wrappers, plus selection cells, inline editable cells, loading/empty rows and useTable/useTableSelection/useTableEditing hooks for full CRUD interactions.',
    element: <TableDoc />,
    name: 'Table',
    order: 34,
    path: '/components/table',
    tags: ['Basic', 'Layout'],
  },
  {
    description: 'Code block component with syntax highlighting and copy-to-clipboard support.',
    element: <CodeBlockDoc />,
    name: 'CodeBlock',
    order: 35,
    path: '/components/code-block',
    tags: ['Documentation'],
  },
  {
    description: 'Demo section component for showcasing runnable examples with source code.',
    element: <DemoSectionDoc />,
    name: 'DemoSection',
    order: 36,
    path: '/components/demo-section',
    tags: ['Documentation'],
  },
  {
    description: 'Documentation template that composes a single component API reference page.',
    element: <DocTemplateDoc />,
    name: 'DocTemplate',
    order: 37,
    path: '/components/doc-template',
    tags: ['Documentation'],
  },
  {
    description: 'Color badge component that derives a stable background color from a name.',
    element: <NameColorBadgeDoc />,
    name: 'NameColorBadge',
    order: 38,
    path: '/components/name-badge',
    tags: ['Documentation'],
  },
  {
    description: 'Collapsible table of contents for documentation navigation.',
    element: <TableOfContentsDoc />,
    name: 'TableOfContents',
    order: 39,
    path: '/components/table-of-contents',
    tags: ['Documentation'],
  },
  {
    description: 'Documentation home component that renders component entries as a card grid.',
    element: <DocsHomeDoc />,
    name: 'DocsHome',
    order: 40,
    path: '/components/docs-home',
    tags: ['Documentation', 'Layout'],
  },
  {
    description: 'Documentation layout component with sidebar navigation and footer.',
    element: <DocsLayoutDoc />,
    name: 'DocsLayout',
    order: 41,
    path: '/components/docs-layout',
    tags: ['Documentation', 'Layout'],
  },
];

const HOME_DESCRIPTION =
  'React component library based on Bootstrap 5, with documentation and usage guides for all components below.';
const HOME_TITLE = 'React Bootstrap';

const renderLink: RenderLink = ({ children, className, to }) => (
  <Link className={className} to={to}>
    {children}
  </Link>
);

const PageFallback = () => (
  <div className="d-flex justify-content-center py-5">
    <Spinner />
  </div>
);

const DocsRoute = () => {
  const { pathname } = useLocation();

  return (
    <DocsLayout
      docs={docsConfig}
      githubUrl={GITHUB_URL}
      pathname={pathname}
      renderLink={renderLink}
    >
      <Outlet />
    </DocsLayout>
  );
};

const appRoutes: RouteObject[] = [
  {
    children: [
      {
        element: (
          <DocsHome
            description={HOME_DESCRIPTION}
            docs={docsConfig}
            renderLink={renderLink}
            title={HOME_TITLE}
          />
        ),
        index: true,
      },
      ...docsConfig.map((doc): RouteObject => ({
        element: <Suspense fallback={<PageFallback />}>{doc.element}</Suspense>,
        path: doc.path.slice(1),
      })),
    ],
    element: <DocsRoute />,
    path: '/',
  },
];

export default appRoutes;
