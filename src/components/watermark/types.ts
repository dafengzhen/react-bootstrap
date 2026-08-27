import type { HTMLAttributes, ReactNode } from 'react';

export interface UseWatermarkOptions {
  content?: string | string[];
  font?: WatermarkFontOptions;
  gap?: [number, number];
  height?: number;
  image?: string;
  opacity?: number;
  rotate?: number;
  width?: number;
}

export interface UseWatermarkResult {
  dataUrl: string;
  height: number;
  width: number;
}

export interface WatermarkFontOptions {
  color?: string;
  fontFamily?: string;
  fontSize?: number;
  fontStyle?: string;
  fontWeight?: number | string;
  textAlign?: WatermarkTextAlign;
}

export interface WatermarkProps extends Omit<HTMLAttributes<HTMLDivElement>, 'content'> {
  children?: ReactNode;
  className?: string;
  content?: string | string[];
  font?: WatermarkFontOptions;
  fullscreen?: boolean;
  gap?: [number, number];
  height?: number;
  image?: string;
  offset?: [number, number];
  opacity?: number;
  rotate?: number;
  width?: number;
  zIndex?: number;
}

export type WatermarkTextAlign = 'center' | 'end' | 'left' | 'right' | 'start';
