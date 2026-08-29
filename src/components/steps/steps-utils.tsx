import type { ReactNode } from 'react';

import { Check, X } from 'lucide-react';

import type { StepsStatus, StepsVariant } from './types';

export const renderStepsIndicator = (
  index: number,
  icon: ReactNode | undefined,
  status: StepsStatus,
  variant: StepsVariant,
): ReactNode => {
  if (icon !== undefined) {
    return icon;
  }
  if (variant === 'dots') {
    return null;
  }
  if (status === 'finish') {
    return <Check aria-hidden="true" />;
  }
  if (status === 'error') {
    return <X aria-hidden="true" />;
  }
  return index + 1;
};

export const resolveStepsStatus = (
  index: number,
  active: number,
  status: StepsStatus | undefined,
): StepsStatus => {
  if (status !== undefined) {
    return status;
  }
  if (index < active) {
    return 'finish';
  }
  if (index === active) {
    return 'process';
  }
  return 'wait';
};
