import type { ButtonHTMLAttributes } from 'react';

export interface CloseButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  className?: string;
  disabled?: boolean;
  variant?: CloseButtonVariant;
}

export type CloseButtonVariant = 'white';
