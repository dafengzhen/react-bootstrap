import type { ElementType, HTMLAttributes, LabelHTMLAttributes } from 'react';

export type ColOrder = 'first' | 'last' | number;

export interface ColProps extends HTMLAttributes<HTMLElement> {
  as?: ElementType;
  className?: string;
  lg?: ColSize;
  md?: ColSize;
  sm?: ColSize;
  xl?: ColSize;
  xs?: ColSize;
  xxl?: ColSize;
}

export type ColSize = boolean | ColSizeObject | ColSpan;

export interface ColSizeObject {
  offset?: number;
  order?: ColOrder;
  span?: ColSpan;
}

export type ColSpan = 'auto' | number;

export type FormLabelColumn = 'lg' | 'sm' | boolean;

export interface FormLabelProps
  extends
    LabelHTMLAttributes<HTMLLabelElement>,
    Pick<ColProps, 'lg' | 'md' | 'sm' | 'xl' | 'xs' | 'xxl'> {
  as?: ElementType;
  className?: string;
  column?: FormLabelColumn;
  htmlFor?: string;
  visuallyHidden?: boolean;
}

export type RowCols = 'auto' | number;

export interface RowProps extends HTMLAttributes<HTMLElement> {
  as?: ElementType;
  className?: string;
  lg?: RowCols;
  md?: RowCols;
  sm?: RowCols;
  xl?: RowCols;
  xs?: RowCols;
  xxl?: RowCols;
}
