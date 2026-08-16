import type { HTMLAttributes, ReactNode } from 'react';

import type { ButtonSize } from '../button';

export interface ButtonGroupProps extends HTMLAttributes<HTMLDivElement> {
  children?: ReactNode;
  className?: string;
  size?: ButtonSize;
  vertical?: boolean;
}

export interface ButtonToolbarProps extends HTMLAttributes<HTMLDivElement> {
  children?: ReactNode;
  className?: string;
}
