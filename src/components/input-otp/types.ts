import type {
  ChangeEvent,
  ClipboardEvent,
  ElementType,
  HTMLAttributes,
  InputHTMLAttributes,
  KeyboardEvent,
  ReactNode,
} from 'react';

export interface InputOtpContextValue {
  autoComplete: string;
  disabled: boolean;
  focusSlot: (index: number) => void;
  handleChange: (index: number, event: ChangeEvent<HTMLInputElement>) => void;
  handleKeyDown: (index: number, event: KeyboardEvent<HTMLInputElement>) => void;
  handlePaste: (index: number, event: ClipboardEvent<HTMLInputElement>) => void;
  inputMode?: InputHTMLAttributes<HTMLInputElement>['inputMode'];
  isInvalid: boolean;
  isValid: boolean;
  length: number;
  password: boolean;
  placeholder: string;
  readOnly: boolean;
  registerSlot: (index: number) => (element: HTMLInputElement | null) => void;
  size?: InputOtpSize;
  slots: string[];
}

export interface InputOtpProps extends Omit<HTMLAttributes<HTMLElement>, 'onChange'> {
  as?: ElementType;
  autoComplete?: string;
  autoFocus?: boolean;
  children?: ReactNode;
  className?: string;
  defaultValue?: string;
  disabled?: boolean;
  inputMode?: InputHTMLAttributes<HTMLInputElement>['inputMode'];
  isInvalid?: boolean;
  isValid?: boolean;
  length?: number;
  name?: string;
  onChange?: (value: string) => void;
  onComplete?: (value: string) => void;
  password?: boolean;
  pattern?: string;
  placeholder?: string;
  readOnly?: boolean;
  required?: boolean;
  separator?: ReactNode;
  size?: InputOtpSize;
  value?: string;
}

export type InputOtpSize = 'lg' | 'sm';

export interface InputOtpSlotProps extends Omit<
  InputHTMLAttributes<HTMLInputElement>,
  'size' | 'type'
> {
  className?: string;
  index: number;
}
