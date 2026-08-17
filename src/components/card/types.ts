import type { AnchorHTMLAttributes, HTMLAttributes, ImgHTMLAttributes, ReactNode } from 'react';

export interface CardBodyProps extends HTMLAttributes<HTMLDivElement> {
  children?: ReactNode;
  className?: string;
}

export type CardColor =
  | 'danger'
  | 'dark'
  | 'info'
  | 'light'
  | 'primary'
  | 'secondary'
  | 'success'
  | 'warning';

export interface CardFooterProps extends HTMLAttributes<HTMLDivElement> {
  children?: ReactNode;
  className?: string;
}

export interface CardGroupProps extends HTMLAttributes<HTMLDivElement> {
  children?: ReactNode;
  className?: string;
}

export interface CardHeaderProps extends HTMLAttributes<HTMLDivElement> {
  children?: ReactNode;
  className?: string;
}

export interface CardImgOverlayProps extends HTMLAttributes<HTMLDivElement> {
  children?: ReactNode;
  className?: string;
}

export interface CardImgProps extends ImgHTMLAttributes<HTMLImageElement> {
  className?: string;
  variant?: CardImgVariant;
}

export type CardImgVariant = 'bottom' | 'top';

export interface CardLinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  children?: ReactNode;
  className?: string;
  href?: string;
}

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  bg?: CardColor;
  body?: boolean;
  border?: CardColor;
  children?: ReactNode;
  className?: string;
  text?: CardTextColor;
}

export interface CardSubtitleProps extends HTMLAttributes<HTMLDivElement> {
  children?: ReactNode;
  className?: string;
}

export type CardTextColor = 'black' | 'body' | 'muted' | 'white' | CardColor;

export interface CardTextProps extends HTMLAttributes<HTMLParagraphElement> {
  children?: ReactNode;
  className?: string;
}

export interface CardTitleProps extends HTMLAttributes<HTMLDivElement> {
  children?: ReactNode;
  className?: string;
}
