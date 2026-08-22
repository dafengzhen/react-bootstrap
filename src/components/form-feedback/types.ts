import type { ElementType, HTMLAttributes } from 'react';

export interface FormFeedbackProps extends HTMLAttributes<HTMLElement> {
  as?: ElementType;
  tooltip?: boolean;
  type?: FormFeedbackType;
}

export type FormFeedbackType = 'invalid' | 'valid';
