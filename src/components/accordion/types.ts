import type {
  CSSProperties,
  ElementType,
  HTMLAttributes,
  MouseEvent,
  ReactNode,
  SyntheticEvent,
} from 'react';

export type AccordionAnimationStatus = 'closed' | 'closing' | 'opened' | 'opening';

export interface AccordionBodyProps extends Omit<AccordionCollapseProps, 'children' | 'eventKey'> {
  as?: ElementType;
  children?: ReactNode;
}

export interface AccordionButtonHandleProps {
  'aria-controls'?: string;
  'aria-expanded': boolean;
  id?: string;
  onClick: (event: MouseEvent<HTMLElement>) => void;
}

export interface AccordionButtonProps extends Omit<HTMLAttributes<HTMLElement>, 'onClick'> {
  as?: ElementType;
  children?: ReactNode;
  className?: string;
  onClick?: (event: MouseEvent<HTMLElement>) => void;
  type?: 'button' | 'reset' | 'submit';
}

export type AccordionCollapseDimension = 'height' | 'width';

export interface AccordionCollapseProps extends HTMLAttributes<HTMLDivElement> {
  children?: ReactNode;
  className?: string;
  dimension?: AccordionCollapseDimension;
  duration?: number;
  eventKey?: AccordionEventKey;
  onEnter?: () => void;
  onEntered?: () => void;
  onEntering?: () => void;
  onExit?: () => void;
  onExited?: () => void;
  onExiting?: () => void;
}

export interface AccordionContextValue {
  activeKeys: AccordionEventKey[];
  alwaysOpen: boolean;
  id?: string;
  onSelect: AccordionSelectCallback;
}

export type AccordionCssProperties = {
  '--rbs-accordion-duration'?: string;
} & CSSProperties;

export type AccordionEventKey = null | number | string;

export interface AccordionHeaderProps extends Omit<HTMLAttributes<HTMLElement>, 'onClick'> {
  as?: ElementType;
  children?: ReactNode;
  className?: string;
  onClick?: (event: MouseEvent<HTMLElement>) => void;
}

export interface AccordionItemContextValue {
  eventKey: AccordionEventKey;
}

export interface AccordionItemProps extends HTMLAttributes<HTMLElement> {
  as?: ElementType;
  children?: ReactNode;
  className?: string;
  eventKey?: AccordionEventKey;
}

export interface AccordionProps extends Omit<HTMLAttributes<HTMLElement>, 'onSelect'> {
  activeKey?: AccordionEventKey | AccordionEventKey[];
  alwaysOpen?: boolean;
  as?: ElementType;
  children?: ReactNode;
  className?: string;
  defaultActiveKey?: AccordionEventKey | AccordionEventKey[];
  flush?: boolean;
  id?: string;
  onSelect?: AccordionSelectCallback;
}

export type AccordionSelectCallback = (eventKey: AccordionEventKey, event: SyntheticEvent) => void;
