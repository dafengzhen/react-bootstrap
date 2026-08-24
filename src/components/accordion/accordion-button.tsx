import clsx from 'clsx';
import { forwardRef } from 'react';

import type { AccordionButtonProps } from './types';

import { useAccordionButton } from './use-accordion-button';

export const AccordionButton = forwardRef<HTMLElement, AccordionButtonProps>(
  ({ as: Component = 'button', children, className, onClick, type, ...rest }, ref) => {
    const buttonProps = useAccordionButton(undefined, onClick);
    const isNativeButton = Component === 'button';

    return (
      <Component
        className={clsx(
          'accordion-button',
          !buttonProps['aria-expanded'] && 'collapsed',
          className,
        )}
        ref={ref}
        {...buttonProps}
        {...(isNativeButton ? { type: type ?? 'button' } : {})}
        {...rest}
      >
        {children}
      </Component>
    );
  },
);

AccordionButton.displayName = 'AccordionButton';

export default AccordionButton;
