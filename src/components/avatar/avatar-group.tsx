import type { CSSProperties } from 'react';

import clsx from 'clsx';
import { Children, forwardRef, isValidElement, useMemo } from 'react';

import type { AvatarGroupProps } from './types';

import { Avatar } from './avatar';
import { AvatarGroupContext } from './avatar-context';
import styles from './avatar.module.css';

const DEFAULT_OVERLAP = 8;

export const AvatarGroup = forwardRef<HTMLElement, AvatarGroupProps>(
  (
    {
      as: Component = 'div',
      bg,
      border = true,
      children,
      className,
      max,
      overlap = DEFAULT_OVERLAP,
      shape,
      size,
      ...rest
    },
    ref,
  ) => {
    const contextValue = useMemo(() => ({ bg, border, shape, size }), [bg, border, shape, size]);

    const items = Children.toArray(children).filter(isValidElement);
    const exceeded = max != null && max > 0 && items.length > max;
    const visibleItems = exceeded ? items.slice(0, Math.max(0, max - 1)) : items;
    const remainingCount = items.length - visibleItems.length;

    const groupStyle: CSSProperties | undefined =
      overlap === DEFAULT_OVERLAP
        ? undefined
        : ({ '--rbs-avatar-group-overlap': typeof overlap === 'number' ? `${overlap}px` : overlap } as CSSProperties);

    return (
      <AvatarGroupContext.Provider value={contextValue}>
        <Component className={clsx(styles.group, className)} ref={ref} style={groupStyle} {...rest}>
          {visibleItems}
          {exceeded && <Avatar bg="secondary">+{remainingCount}</Avatar>}
        </Component>
      </AvatarGroupContext.Provider>
    );
  },
);

AvatarGroup.displayName = 'AvatarGroup';

export default AvatarGroup;
