export interface DocEntry {
  description: string;
  file: string;
  name: string;
  order?: number;
  path: string;
  tags?: string[];
}

export const GITHUB_URL = 'https://github.com/dafengzhen/react-bootstrap';

export const HOME_DESCRIPTION =
  'React component library based on Bootstrap 5, with documentation and usage guides for all components below.';
export const HOME_TITLE = 'React Bootstrap';

export const NAV_ITEMS = [
  { label: 'Getting Started', to: '/getting-started' },
  { label: 'Components', to: '/components' },
  { label: 'Blog', to: '/blog' },
];

export const docs: DocEntry[] = [
  {
    description: 'General-purpose button component, supports multiple variants, sizes, and states.',
    file: 'components/button/button.doc.tsx',
    name: 'Button',
    order: 1,
    path: '/components/button',
    tags: ['Basic', 'Forms'],
  },
  {
    description:
      'Button group component that combines multiple buttons into a single unit, supporting horizontal/vertical arrangement and uniform sizing.',
    file: 'components/button-group/button-group.doc.tsx',
    name: 'ButtonGroup',
    order: 2,
    path: '/components/button-group',
    tags: ['Basic', 'Layout'],
  },
  {
    description:
      'List group component that displays a series of content in a flexible list container, supporting active/disabled states, links and buttons, flush and numbered styles, horizontal layout, contextual colors, badges and custom content.',
    file: 'components/list-group/list-group.doc.tsx',
    name: 'ListGroup',
    order: 3,
    path: '/components/list-group',
    tags: ['Basic', 'Navigation'],
  },
  {
    description:
      'Card component that provides a flexible and extensible content container, supporting header/footer, images, overlays, navigation and various color styles.',
    file: 'components/card/card.doc.tsx',
    name: 'Card',
    order: 4,
    path: '/components/card',
    tags: ['Basic', 'Layout'],
  },
  {
    description:
      'Close button component for dismissing content such as modals, alerts and toasts, with white variant and disabled state support.',
    file: 'components/close-button/close-button.doc.tsx',
    name: 'CloseButton',
    order: 5,
    path: '/components/close-button',
    tags: ['Basic', 'Dialog'],
  },
  {
    description:
      'Modal component that renders content in a dialog layer above the page, supporting sizes, fullscreen, centered/scrollable layouts, placements, custom sizing, static backdrops, focus trapping and transition animations.',
    file: 'components/modal/modal.doc.tsx',
    name: 'Modal',
    order: 6,
    path: '/components/modal',
    tags: ['Basic', 'Dialog'],
  },
  {
    description:
      'Offcanvas component that renders a hidden side drawer panel above the page, supporting four placements with custom slide transitions, backdrop and keyboard options, body scroll control, focus management and reduced-motion preferences.',
    file: 'components/offcanvas/offcanvas.doc.tsx',
    name: 'Offcanvas',
    order: 7,
    path: '/components/offcanvas',
    tags: ['Basic', 'Dialog'],
  },
  {
    description:
      'Dropdown component that toggles contextual overlays for displaying lists of links and actions, supporting split buttons, sizing, dark menus, six directions, menu items with active/disabled states, headers/dividers/text, forms, alignment, auto-close behavior and keyboard navigation.',
    file: 'components/dropdown/dropdown.doc.tsx',
    name: 'Dropdown',
    order: 8,
    path: '/components/dropdown',
    tags: ['Basic', 'Navigation'],
  },
  {
    description:
      'Navbar component that builds responsive navigation headers, supporting brand, navigation links, forms and text, responsive collapse with toggler, color schemes, containers, fixed/sticky placement, scrolling navs and offcanvas drawers.',
    file: 'components/navbar/navbar.doc.tsx',
    name: 'Navbar',
    order: 9,
    path: '/components/navbar',
    tags: ['Basic', 'Navigation'],
  },
  {
    description:
      'Alert component that provides contextual feedback messages for typical user actions, supporting eight variants, dismissible mode with fade animation, links, headings and icons.',
    file: 'components/alert/alert.doc.tsx',
    name: 'Alert',
    order: 10,
    path: '/components/alert',
    tags: ['Basic', 'Feedback'],
  },
  {
    description:
      'Badge component that displays status, counts or labels in small inline content, supporting multiple background colors, pill shape, buttons and links, scaling with the parent font size.',
    file: 'components/badge/badge.doc.tsx',
    name: 'Badge',
    order: 11,
    path: '/components/badge',
    tags: ['Basic', 'Feedback'],
  },
  {
    description:
      'Avatar component that displays user images or name initials, supporting automatic fallback when images fail to load, multiple sizes and shapes, background color variants and borders, plus AvatarGroup for stacked display, max-count folding and group-level defaults.',
    file: 'components/avatar/avatar.doc.tsx',
    name: 'Avatar',
    order: 12,
    path: '/components/avatar',
    tags: ['Basic', 'Feedback'],
  },
  {
    description:
      'Breadcrumb component that indicates the current page location within a navigational hierarchy, supporting links, active state, custom dividers and accessible labels.',
    file: 'components/breadcrumb/breadcrumb.doc.tsx',
    name: 'Breadcrumb',
    order: 13,
    path: '/components/breadcrumb',
    tags: ['Basic', 'Navigation'],
  },
  {
    description:
      'Pagination component that splits a set of links across multiple pages, supporting icon links, active/disabled states, sizing, alignment and accessible labels.',
    file: 'components/pagination/pagination.doc.tsx',
    name: 'Pagination',
    order: 14,
    path: '/components/pagination',
    tags: ['Basic', 'Navigation'],
  },
  {
    description:
      'Placeholder component that renders skeleton loading placeholders for components and pages, supporting grid column widths, background colors, sizing, glow/wave animations and placeholder buttons.',
    file: 'components/placeholder/placeholder.doc.tsx',
    name: 'Placeholder',
    order: 15,
    path: '/components/placeholder',
    tags: ['Basic', 'Feedback'],
  },
  {
    description:
      'Popover component that shows extended content in a floating card beside trigger elements, supporting header/body structure, four directions with alignment variations, HTML content, custom styling, delays, click/hover/focus/manual triggers, controlled mode, disabled elements and flip positioning.',
    file: 'components/popover/popover.doc.tsx',
    name: 'Popover',
    order: 16,
    path: '/components/popover',
    tags: ['Basic', 'Feedback'],
  },
  {
    description:
      'Spinner component that indicates the loading state of a component or page, supporting border/grow animations, color variants, sizes and usage inside buttons.',
    file: 'components/spinner/spinner.doc.tsx',
    name: 'Spinner',
    order: 17,
    path: '/components/spinner',
    tags: ['Basic', 'Feedback'],
  },
  {
    description:
      'Tabs component that builds navigation and tabbed panels, supporting tabs/pills/underline variants, fill and justify layouts, vertical arrangement, active/disabled states and fade transitions.',
    file: 'components/tabs/tabs.doc.tsx',
    name: 'Tabs',
    order: 18,
    path: '/components/tabs',
    tags: ['Basic', 'Navigation'],
  },
  {
    description:
      'Toast component that pushes lightweight notifications to users, supporting header/body structure, stacking, nine placements, color schemes, autohide with hover pause and custom transitions.',
    file: 'components/toast/toast.doc.tsx',
    name: 'Toast',
    order: 19,
    path: '/components/toast',
    tags: ['Basic', 'Feedback'],
  },
  {
    description:
      'Tooltip component that shows contextual hints beside trigger elements, supporting four directions with alignment variations, HTML content, custom styling, delays, click/hover/focus/manual triggers, controlled mode, disabled elements and flip positioning.',
    file: 'components/tooltip/tooltip.doc.tsx',
    name: 'Tooltip',
    order: 20,
    path: '/components/tooltip',
    tags: ['Basic', 'Feedback'],
  },
  {
    description:
      'Progress component that displays the completion state of a task or workflow, supporting labels, custom heights, color variants, striped and animated stripes, stacked segments and manual composition of multiple bars.',
    file: 'components/progress/progress.doc.tsx',
    name: 'Progress',
    order: 21,
    path: '/components/progress',
    tags: ['Basic', 'Feedback'],
  },
  {
    description:
      'Steps component that displays progress through a sequence of operations, supporting horizontal/vertical and centered layouts, dot indicators, custom icons, error status, disabled steps and clickable switching in controlled or uncontrolled mode.',
    file: 'components/steps/steps.doc.tsx',
    name: 'Steps',
    order: 22,
    path: '/components/steps',
    tags: ['Basic', 'Feedback'],
  },
  {
    description:
      'Collapse component that toggles the visibility of content with an animated height or width transition, supporting vertical and horizontal dimensions, multiple targets, transition callbacks and reduced-motion preferences.',
    file: 'components/collapse/collapse.doc.tsx',
    name: 'Collapse',
    order: 23,
    path: '/components/collapse',
    tags: ['Basic', 'Layout'],
  },
  {
    description:
      'Accordion component that collapses vertically stacked content sections into interactive expandable panels, supporting single or multiple open items, flush styling, controlled/uncontrolled active keys, custom triggers and accessible button/collapse associations.',
    file: 'components/accordion/accordion.doc.tsx',
    name: 'Accordion',
    order: 24,
    path: '/components/accordion',
    tags: ['Basic', 'Layout'],
  },
  {
    description:
      'Carousel component that cycles through slides with reducer-driven custom slide and crossfade transitions, supporting indicators, controls, captions, autoplay with hover pause, per-slide intervals, keyboard and touch navigation, controlled mode and reduced-motion preferences.',
    file: 'components/carousel/carousel.doc.tsx',
    name: 'Carousel',
    order: 25,
    path: '/components/carousel',
    tags: ['Basic', 'Layout'],
  },
  {
    description:
      'ScrollSpy component that automatically updates navigation links based on the scroll position of a container or the page, supporting rootMargin/threshold observation options, smooth scrolling, controlled mode, context-based ScrollSpyLink links and plain HTML targets via selector.',
    file: 'components/scrollspy/scrollspy.doc.tsx',
    name: 'ScrollSpy',
    order: 26,
    path: '/components/scrollspy',
    tags: ['Basic', 'Navigation'],
  },
  {
    description:
      'Form component that composes form groups and controls, providing the Form container with native constraint validation support and FormGroup with controlId-based label/control auto-association, plus a single import surface for all form parts.',
    file: 'components/form/form.doc.tsx',
    name: 'Form',
    order: 27,
    path: '/components/form',
    tags: ['Basic', 'Forms'],
  },
  {
    description:
      'Form control component that renders inputs, selects and textareas with consistent Bootstrap styles, supporting sizing, disabled and readonly states, readonly plain text, file and color inputs, datalists, valid/invalid states, and the FormText helper text component.',
    file: 'components/form-control/form-control.doc.tsx',
    name: 'FormControl',
    order: 28,
    path: '/components/form-control',
    tags: ['Basic', 'Forms'],
  },
  {
    description:
      'Floating label component that renders a form control with a label that floats above the input, supporting textareas, selects, disabled and readonly plaintext states, input groups, validation states and grid layouts.',
    file: 'components/floating-label/floating-label.doc.tsx',
    name: 'FloatingLabel',
    order: 29,
    path: '/components/floating-label',
    tags: ['Basic', 'Forms'],
  },
  {
    description:
      'Input group component that combines text addons, buttons, dropdowns, checkboxes and radios with form controls, supporting prefix/suffix and multiple addons, multiple inputs, button and dropdown addons, segmented buttons, custom selects and file inputs, wrapping, sizing and validation states.',
    file: 'components/input-group/input-group.doc.tsx',
    name: 'InputGroup',
    order: 30,
    path: '/components/input-group',
    tags: ['Basic', 'Forms'],
  },
  {
    description:
      'Form select component that renders native selects with customized appearance, supporting small/large sizing, multiple selection, visible option count, disabled state and valid/invalid validation states.',
    file: 'components/form-select/form-select.doc.tsx',
    name: 'FormSelect',
    order: 31,
    path: '/components/form-select',
    tags: ['Basic', 'Forms'],
  },
  {
    description:
      'Form check component that renders consistent checkboxes, radios and switches, composing FormCheck, FormCheckInput and FormCheckLabel, supporting indeterminate and disabled states, inline/reverse layouts and valid/invalid validation states.',
    file: 'components/form-check/form-check.doc.tsx',
    name: 'FormCheck',
    order: 32,
    path: '/components/form-check',
    tags: ['Basic', 'Forms'],
  },
  {
    description:
      'Form range component that renders a styled native range input, supporting min/max values, step intervals, disabled state and valid/invalid validation states.',
    file: 'components/form-range/form-range.doc.tsx',
    name: 'FormRange',
    order: 33,
    path: '/components/form-range',
    tags: ['Basic', 'Forms'],
  },
  {
    description:
      'Form feedback component that renders valid/invalid feedback text for form controls, supporting tooltip variants, browser native constraint validation with the was-validated form class and server-side validation states.',
    file: 'components/form-feedback/form-feedback.doc.tsx',
    name: 'FormFeedback',
    order: 34,
    path: '/components/form-feedback',
    tags: ['Basic', 'Forms'],
  },
  {
    description:
      'Layout components that structure forms with the grid system, providing Row and Col for multi-column form grids, gutters and alignment utilities, horizontal form labels with size variants, column sizing and auto-sizing, and responsive inline forms.',
    file: 'components/layout/layout.doc.tsx',
    name: 'Layout',
    order: 35,
    path: '/components/layout',
    tags: ['Basic', 'Forms', 'Layout'],
  },
  {
    description:
      'Container component that fixes the content width at each responsive breakpoint, supporting default, fluid and per-breakpoint responsive containers, custom semantic elements, and composition with the grid Row/Col components.',
    file: 'components/container/container.doc.tsx',
    name: 'Container',
    order: 36,
    path: '/components/container',
    tags: ['Basic', 'Layout'],
  },
  {
    description:
      'Upload component that collects files for submission, supporting click and drag-and-drop selection, multiple files and accept filtering, disabled state, max count and max size limits, per-file beforeUpload validation, controlled file lists, custom triggers and lists, plus UploadItem/UploadList/useUpload for flexible composition.',
    file: 'components/upload/upload.doc.tsx',
    name: 'Upload',
    order: 37,
    path: '/components/upload',
    tags: ['Basic', 'Forms'],
  },
  {
    description:
      'Input OTP component that captures one-time verification codes in single-character slots, supporting auto-advance, backspace and arrow key navigation, paste distribution, per-character patterns, password masking, separators, validation states, completion callbacks, controlled mode, hidden-field form submission, plus InputOtpSlot/useInputOtp for custom slot composition.',
    file: 'components/input-otp/input-otp.doc.tsx',
    name: 'InputOtp',
    order: 38,
    path: '/components/input-otp',
    tags: ['Basic', 'Forms'],
  },
  {
    description:
      'Table component that displays tabular data with Bootstrap styles, providing structural helpers for head/body/footer, rows, cells and captions, supporting contextual variants, striped rows/columns, hover and active states, bordered/borderless styles, small sizing, group dividers, vertical alignment, nesting, top captions, responsive scroll wrappers, plus selection cells, inline editable cells, loading/empty rows and useTable/useTableSelection/useTableEditing hooks for full CRUD interactions.',
    file: 'components/table/table.doc.tsx',
    name: 'Table',
    order: 39,
    path: '/components/table',
    tags: ['Basic', 'Layout'],
  },
  {
    description: 'Code block component with syntax highlighting and copy-to-clipboard support.',
    file: 'components/doc-template/code-block.doc.tsx',
    name: 'CodeBlock',
    order: 40,
    path: '/components/code-block',
    tags: ['Documentation'],
  },
  {
    description: 'Demo section component for showcasing runnable examples with source code.',
    file: 'components/doc-template/demo-section.doc.tsx',
    name: 'DemoSection',
    order: 41,
    path: '/components/demo-section',
    tags: ['Documentation'],
  },
  {
    description: 'Documentation template that composes a single component API reference page.',
    file: 'components/doc-template/doc-template.doc.tsx',
    name: 'DocTemplate',
    order: 42,
    path: '/components/doc-template',
    tags: ['Documentation'],
  },
  {
    description: 'Color badge component that derives a stable background color from a name.',
    file: 'components/doc-template/name-color-badge.doc.tsx',
    name: 'NameColorBadge',
    order: 43,
    path: '/components/name-badge',
    tags: ['Documentation'],
  },
  {
    description: 'Collapsible table of contents for documentation navigation.',
    file: 'components/doc-template/table-of-contents.doc.tsx',
    name: 'TableOfContents',
    order: 44,
    path: '/components/table-of-contents',
    tags: ['Documentation'],
  },
  {
    description: 'Documentation home component that renders component entries as a card grid.',
    file: 'components/docs/docs-home.doc.tsx',
    name: 'DocsHome',
    order: 45,
    path: '/components/docs-home',
    tags: ['Documentation', 'Layout'],
  },
  {
    description: 'Documentation layout component with sidebar navigation and footer.',
    file: 'components/docs/docs-layout.doc.tsx',
    name: 'DocsLayout',
    order: 46,
    path: '/components/docs-layout',
    tags: ['Documentation', 'Layout'],
  },
  {
    description:
      'Splitter component that divides content into resizable panels, supporting horizontal/vertical layouts, pixel/percentage/auto sizes, min/max constraints, collapsible panels, keyboard resizing, custom bars and controlled/uncontrolled modes.',
    file: 'components/splitter/splitter.doc.tsx',
    name: 'Splitter',
    order: 47,
    path: '/components/splitter',
    tags: ['Basic', 'Layout'],
  },
  {
    description:
      'Empty component that displays placeholder states for empty content areas, composing image, title, description and action buttons, with an EmptyImage placeholder supporting Lorem Picsum image URLs, solid color fallbacks when images fail to load, color variants, shapes and sizes.',
    file: 'components/empty/empty.doc.tsx',
    name: 'Empty',
    order: 48,
    path: '/components/empty',
    tags: ['Basic', 'Feedback'],
  },
  {
    description:
      'Timeline component that displays events in chronological order along a vertical line, supporting left/right/alternate alignments, contextual node colors, custom dots, timestamps and rich item content, with the alternate layout collapsing to left alignment on narrow screens.',
    file: 'components/timeline/timeline.doc.tsx',
    name: 'Timeline',
    order: 49,
    path: '/components/timeline',
    tags: ['Basic', 'Feedback'],
  },
  {
    description:
      'Kbd component that indicates keyboard input, rendering key caps and key combinations, supporting nested combined shortcuts, automatic scaling with the parent font size and custom element rendering.',
    file: 'components/kbd/kbd.doc.tsx',
    name: 'Kbd',
    order: 50,
    path: '/components/kbd',
    tags: ['Basic', 'Typography'],
  },
  {
    description:
      'ScrollShadow component that adds gradient scroll shadows to the edges of a scrollable container, supporting vertical, horizontal and bidirectional scrolling, custom shadow size and color, visibility change callbacks, RTL layouts and a useScrollShadow hook for custom composition.',
    file: 'components/scroll-shadow/scroll-shadow.doc.tsx',
    name: 'ScrollShadow',
    order: 51,
    path: '/components/scroll-shadow',
    tags: ['Basic', 'Layout'],
  },
  {
    description:
      'Watermark component that overlays tiled text or image watermarks on content, supporting multiline text, image watermarks, rotation, gap, offset, opacity and z-index customization, fullscreen portal mode, plus a useWatermark hook for custom composition.',
    file: 'components/watermark/watermark.doc.tsx',
    name: 'Watermark',
    order: 52,
    path: '/components/watermark',
    tags: ['Basic', 'Layout'],
  },
  {
    description:
      'Sidebar component that builds application side navigation, supporting header/body/footer regions, grouped navigation items with icons, badges and active/disabled states, a collapsible icon-only rail mode, a responsive off-canvas drawer with backdrop on viewports below a configurable breakpoint, light/dark variants and start/end placements, plus SidebarProvider/useSidebar for controlled composition.',
    file: 'components/sidebar/sidebar.doc.tsx',
    name: 'Sidebar',
    order: 53,
    path: '/components/sidebar',
    tags: ['Basic', 'Navigation'],
  },
  {
    description:
      'Ratio component that creates a responsive fixed-aspect-ratio container for images, videos, iframes and other media content, supporting the 1x1/4x3/16x9/21x9 presets, custom numeric and string ratios, and custom element rendering.',
    file: 'components/ratio/ratio.doc.tsx',
    name: 'Ratio',
    order: 54,
    path: '/components/ratio',
    tags: ['Basic', 'Layout'],
  },
  {
    description:
      'Image viewer components that preview images in an immersive lightbox, featuring click-to-preview Image thumbnails with fluid/rounded/thumbnail styles, ImageGroup for grouped multi-image browsing, and a full-featured ImageViewer with zoom, rotation, drag panning, keyboard shortcuts, thumbnail navigation, fullscreen and download support, plus useImageViewer for custom composition.',
    file: 'components/image-viewer/image-viewer.doc.tsx',
    name: 'ImageViewer',
    order: 55,
    path: '/components/image-viewer',
    tags: ['Basic', 'Feedback'],
  },
];
