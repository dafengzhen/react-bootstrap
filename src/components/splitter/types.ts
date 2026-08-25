import type { ElementType, HTMLAttributes, ReactNode } from 'react';

export interface SplitterBarRenderProps extends HTMLAttributes<HTMLElement> {
  'data-splitter-bar': number;
}

export interface SplitterContextValue {
  barSize: number;
  collapsed: boolean[];
  disabled: boolean;
  layout: SplitterLayout;
  panelCount: number;
  resizingIndex: null | number;
  sizes: SplitterSize[];
}

export type SplitterLayout = 'horizontal' | 'vertical';

export interface SplitterPanelProps extends HTMLAttributes<HTMLElement> {
  as?: ElementType;
  children?: ReactNode;
  className?: string;
  collapsed?: boolean;
  collapsedSize?: number | string;
  collapsible?: boolean;
  defaultCollapsed?: boolean;
  defaultSize?: number | string;
  index?: number;
  max?: number | string;
  min?: number | string;
  onCollapse?: (collapsed: boolean) => void;
  resizable?: boolean;
}

export interface SplitterProps extends Omit<HTMLAttributes<HTMLElement>, 'onChange'> {
  as?: ElementType;
  barSize?: number;
  children?: ReactNode;
  className?: string;
  defaultSizes?: SplitterSize[];
  disabled?: boolean;
  layout?: SplitterLayout;
  onChange?: (sizes: SplitterSize[]) => void;
  onResizeEnd?: (sizes: SplitterSize[]) => void;
  onResizeStart?: (sizes: SplitterSize[]) => void;
  renderBar?: (props: SplitterBarRenderProps, index: number) => ReactNode;
  sizes?: SplitterSize[];
}

export type SplitterSize = number | string;
