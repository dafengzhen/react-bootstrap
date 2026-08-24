import type { ElementType, HTMLAttributes, MouseEvent, ReactNode, SyntheticEvent } from 'react';

import type { CollapseProps } from '../collapse';

export interface AccordionBodyProps extends Omit<CollapseProps, 'children' | 'in'> {
  as?: ElementType;
  children?: ReactNode;
  className?: string;
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

export interface AccordionCollapseProps extends Omit<CollapseProps, 'in'> {
  eventKey?: AccordionEventKey;
}

export interface AccordionContextValue {
  activeKeys: AccordionEventKey[];
  alwaysOpen: boolean;
  id?: string;
  onSelect: AccordionSelectCallback;
}

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
