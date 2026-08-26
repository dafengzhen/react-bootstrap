import type { CSSProperties } from 'react';

import clsx from 'clsx';
import { forwardRef, useCallback, useState } from 'react';

import type { AvatarProps } from './types';

import { useAvatarGroup } from './avatar-context';
import { getAvatarInitials } from './avatar-utils';
import styles from './avatar.module.css';

export const Avatar = forwardRef<HTMLElement, AvatarProps>(
  (
    {
      alt,
      as: Component = 'span',
      bg,
      border,
      children,
      className,
      name,
      shape,
      size,
      src,
      ...rest
    },
    ref,
  ) => {
    const group = useAvatarGroup();
    const resolvedBg = bg ?? group?.bg ?? 'secondary';
    const resolvedBorder = border ?? group?.border ?? false;
    const resolvedShape = shape ?? group?.shape ?? 'circle';
    const resolvedSize = size ?? group?.size ?? 'md';

    const [failedSrc, setFailedSrc] = useState<null | string>(null);

    if (failedSrc !== null && failedSrc !== src) {
      setFailedSrc(null);
    }

    const handleImageError = useCallback(() => {
      setFailedSrc(src ?? null);
    }, [src]);

    const showImage = src != null && src !== '' && failedSrc !== src;
    const fallback = children ?? (name != null ? getAvatarInitials(name) : '?');

    const sizeStyle: CSSProperties | undefined =
      typeof resolvedSize === 'number'
        ? ({ '--rbs-avatar-size': `${resolvedSize}px` } as CSSProperties)
        : undefined;

    return (
      <Component
        className={clsx(
          styles.avatar,
          styles[resolvedShape],
          resolvedBorder && styles.border,
          typeof resolvedSize === 'string' && styles[resolvedSize],
          `text-bg-${resolvedBg}`,
          className,
        )}
        ref={ref}
        style={sizeStyle}
        {...rest}
      >
        {showImage ? (
          <img
            alt={alt ?? name ?? ''}
            className={styles.image}
            onError={handleImageError}
            src={src}
          />
        ) : (
          <span className={styles.fallback}>{fallback}</span>
        )}
      </Component>
    );
  },
);

Avatar.displayName = 'Avatar';

export default Avatar;
