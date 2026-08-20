import type { CSSProperties, HTMLAttributes, ReactNode } from 'react';

export type CollapseAnimationStatus = 'closed' | 'closing' | 'opened' | 'opening';

export type CollapseCssProperties = {
  '--rbs-collapse-duration'?: string;
} & CSSProperties;

export type CollapseDimension = 'height' | 'width';

export interface CollapseProps extends HTMLAttributes<HTMLDivElement> {
  children?: ReactNode;
  className?: string;
  dimension?: CollapseDimension;
  duration?: number;
  in: boolean;
  onEnter?: () => void;
  onEntered?: () => void;
  onEntering?: () => void;
  onExit?: () => void;
  onExited?: () => void;
  onExiting?: () => void;
}
