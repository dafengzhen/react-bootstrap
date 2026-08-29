import type { ElementType, HTMLAttributes, ReactNode } from 'react';

export interface TypographyAutoSize {
  maxRows?: number;
  minRows?: number;
}

export type TypographyColor =
  | 'black'
  | 'body-emphasis'
  | 'body-secondary'
  | 'body-tertiary'
  | 'body'
  | 'danger'
  | 'dark'
  | 'info'
  | 'light'
  | 'muted'
  | 'primary'
  | 'secondary'
  | 'success'
  | 'warning'
  | 'white';

export interface TypographyCommonProps extends HTMLAttributes<HTMLElement> {
  as?: ElementType;
  children?: ReactNode;
  className?: string;
  code?: boolean;
  copyable?: TypographyCopyable;
  delete?: boolean;
  disabled?: boolean;
  editable?: TypographyEditable;
  ellipsis?: TypographyEllipsis;
  italic?: boolean;
  keyboard?: boolean;
  mark?: boolean;
  muted?: boolean;
  strong?: boolean;
  type?: TypographyColor;
  underline?: boolean;
}

export interface TypographyContextValue {
  code?: boolean;
  copyable?: TypographyCopyable;
  delete?: boolean;
  disabled?: boolean;
  editable?: TypographyEditable;
  ellipsis?: TypographyEllipsis;
  italic?: boolean;
  keyboard?: boolean;
  mark?: boolean;
  muted?: boolean;
  strong?: boolean;
  type?: TypographyColor;
  underline?: boolean;
}

export type TypographyCopyable = boolean | TypographyCopyableConfig;

export interface TypographyCopyableConfig {
  onCopy?: (text: string) => void;
  text?: string;
  tooltips?: [string, string];
}

export type TypographyEditable = boolean | TypographyEditableConfig;

export interface TypographyEditableConfig {
  autoSize?: boolean | TypographyAutoSize;
  maxLength?: number;
  onChange?: (value: string) => void;
  onEnd?: () => void;
  onStart?: () => void;
  text?: string;
  tooltip?: string;
}

export type TypographyEllipsis = boolean | TypographyEllipsisConfig;

export interface TypographyEllipsisConfig {
  expandable?: boolean;
  onExpand?: (expanded: boolean) => void;
  rows?: number;
  symbol?: ((expanded: boolean) => ReactNode) | ReactNode;
  tooltip?: boolean | string;
}

export interface TypographyLinkProps extends TypographyCommonProps {
  href?: string;
  rel?: string;
  target?: string;
}

export type TypographyParagraphProps = TypographyCommonProps;

export interface TypographyProps {
  children?: ReactNode;
  code?: boolean;
  copyable?: TypographyCopyable;
  delete?: boolean;
  disabled?: boolean;
  editable?: TypographyEditable;
  ellipsis?: TypographyEllipsis;
  italic?: boolean;
  keyboard?: boolean;
  mark?: boolean;
  muted?: boolean;
  strong?: boolean;
  type?: TypographyColor;
  underline?: boolean;
}

export type TypographyTextProps = TypographyCommonProps;

export type TypographyTitleLevel = 1 | 2 | 3 | 4 | 5 | 6;

export interface TypographyTitleProps extends TypographyCommonProps {
  level?: TypographyTitleLevel;
}
