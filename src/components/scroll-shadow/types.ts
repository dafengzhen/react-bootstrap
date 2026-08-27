import type { ElementType, HTMLAttributes, ReactNode, RefCallback, UIEventHandler } from 'react';

export type ScrollShadowDirection = 'both' | 'horizontal' | 'vertical';

export interface ScrollShadowProps extends Omit<HTMLAttributes<HTMLElement>, 'onChange'> {
  as?: ElementType;
  children?: ReactNode;
  className?: string;
  direction?: ScrollShadowDirection;
  disabled?: boolean;
  onChange?: (visibility: ScrollShadowVisibility) => void;
  onScroll?: UIEventHandler<HTMLElement>;
  shadowColor?: string;
  shadowSize?: number;
  tabIndex?: number;
}

export interface ScrollShadowVisibility {
  bottom: boolean;
  left: boolean;
  right: boolean;
  top: boolean;
}

export interface UseScrollShadowOptions {
  direction?: ScrollShadowDirection;
  disabled?: boolean;
  onChange?: (visibility: ScrollShadowVisibility) => void;
}

export interface UseScrollShadowResult<T extends HTMLElement = HTMLElement> {
  ref: RefCallback<T>;
  visibility: ScrollShadowVisibility;
}
