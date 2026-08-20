import type { ButtonHTMLAttributes, CSSProperties, HTMLAttributes, ReactNode } from 'react';

export type CarouselAnimationStatus = 'idle' | 'prepared' | 'sliding';

export interface CarouselCaptionProps extends HTMLAttributes<HTMLDivElement> {
  children?: ReactNode;
  className?: string;
}

export interface CarouselContextValue {
  activeIndex: number;
  autoPlaying: boolean;
  direction: CarouselDirection | null;
  duration: number;
  fade: boolean;
  goTo: (index: number, direction?: CarouselDirection) => void;
  itemCount: number;
  next: () => void;
  notifySlideEnd: () => void;
  pause: () => void;
  paused: boolean;
  pendingIndex: null | number;
  play: () => void;
  prev: () => void;
  registerItemInterval: (index: number, interval: number | undefined) => void;
  setItemCount: (count: number) => void;
  status: CarouselAnimationStatus;
  wrap: boolean;
}

export interface CarouselControlProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children?: ReactNode;
  className?: string;
  direction: CarouselDirection;
  label?: string;
}

export type CarouselCssProperties = {
  '--rbs-carousel-control-disabled-opacity'?: number | string;
  '--rbs-carousel-control-duration'?: string;
  '--rbs-carousel-duration'?: string;
  '--rbs-carousel-easing'?: string;
  '--rbs-carousel-indicator-duration'?: string;
  '--rbs-carousel-slide-offset'?: string;
} & CSSProperties;

export type CarouselDirection = 'next' | 'prev';

export interface CarouselIndicatorProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children?: ReactNode;
  className?: string;
  index: number;
}

export interface CarouselIndicatorsProps extends HTMLAttributes<HTMLDivElement> {
  children?: ReactNode;
  className?: string;
  labels?: string[];
}

export interface CarouselInnerProps extends HTMLAttributes<HTMLDivElement> {
  children?: ReactNode;
  className?: string;
}

export interface CarouselItemProps extends HTMLAttributes<HTMLDivElement> {
  children?: ReactNode;
  className?: string;
  index?: number;
  interval?: number;
}

export type CarouselItemRole = 'active' | 'entering' | 'inactive' | 'leaving';

export type CarouselPause = 'hover' | false;

export interface CarouselProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onSelect'> {
  activeIndex?: number;
  children?: ReactNode;
  className?: string;
  defaultActiveIndex?: number;
  duration?: number;
  fade?: boolean;
  interval?: null | number;
  keyboard?: boolean;
  onSelect?: (index: number, direction: CarouselDirection) => void;
  onSlid?: (index: number, direction: CarouselDirection) => void;
  onSlide?: (index: number, direction: CarouselDirection) => void;
  pause?: CarouselPause;
  ride?: CarouselRide;
  slide?: boolean;
  style?: CarouselCssProperties;
  touch?: boolean;
  wrap?: boolean;
}

export type CarouselRide = 'carousel' | boolean;
