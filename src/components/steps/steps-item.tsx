import clsx from 'clsx';
import { forwardRef } from 'react';

import type { StepsItemProps } from './types';

import { useSteps } from './steps-context';
import { renderStepsIndicator, resolveStepsStatus } from './steps-utils';
import styles from './steps.module.css';

export const StepsItem = forwardRef<HTMLElement, StepsItemProps>(
  (
    {
      as: Component = 'li',
      children,
      className,
      description,
      disabled = false,
      icon,
      index = 0,
      status,
      title,
      ...rest
    },
    ref,
  ) => {
    const context = useSteps();
    const isActive = context !== null && index === context.active;
    const isClickable = context !== null && context.clickable && !disabled;
    const resolvedStatus = resolveStepsStatus(index, context?.active ?? -1, status);

    const content = (
      <>
        <span className={styles.indicator}>
          {renderStepsIndicator(index, icon, resolvedStatus, context?.variant ?? 'default')}
        </span>
        <span className={styles.content}>
          {title !== undefined && <span className={styles.title}>{title}</span>}
          {description !== undefined && <span className={styles.description}>{description}</span>}
          {children}
        </span>
      </>
    );

    const inner =
      context !== null && isClickable ? (
        <button
          className={styles.inner}
          disabled={disabled}
          onClick={() => context.handleSelect(index)}
          type="button"
        >
          {content}
        </button>
      ) : (
        <span className={styles.inner}>{content}</span>
      );

    return (
      <Component
        aria-current={isActive ? 'step' : undefined}
        className={clsx(styles.item, disabled && styles.disabled, className)}
        data-status={resolvedStatus}
        ref={ref}
        {...rest}
      >
        {inner}
      </Component>
    );
  },
);

StepsItem.displayName = 'StepsItem';

export default StepsItem;
