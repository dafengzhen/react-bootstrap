import type { CSSProperties } from 'react';

import clsx from 'clsx';
import { forwardRef, useCallback, useState } from 'react';

import type { EmptyImageProps } from './types';

import styles from './empty.module.css';

export const EmptyImage = forwardRef<HTMLElement, EmptyImageProps>(
  (
    {
      alt = '',
      as: Component = 'span',
      bg = 'secondary',
      children,
      className,
      height = 160,
      label = '图片',
      shape = 'rounded',
      src,
      style,
      width = 240,
      ...rest
    },
    ref,
  ) => {
    const [failedSrc, setFailedSrc] = useState<null | string>(null);

    if (failedSrc !== null && failedSrc !== src) {
      setFailedSrc(null);
    }

    const handleImageError = useCallback(() => {
      setFailedSrc(src ?? null);
    }, [src]);

    const showImage = src != null && src !== '' && failedSrc !== src;
    const fallback = children ?? label;

    const sizeStyle: CSSProperties = {
      ...style,
      '--rbs-empty-image-height': typeof height === 'number' ? `${height}px` : height,
      '--rbs-empty-image-width': typeof width === 'number' ? `${width}px` : width,
    } as CSSProperties;

    return (
      <Component
        className={clsx(styles.emptyImage, styles[shape], `bg-${bg}-subtle`, className)}
        ref={ref}
        style={sizeStyle}
        {...rest}
      >
        {showImage ? (
          <img alt={alt} className={styles.emptyImageImg} onError={handleImageError} src={src} />
        ) : (
          <span className={clsx(styles.emptyImageFallback, `text-${bg}-emphasis`)}>{fallback}</span>
        )}
      </Component>
    );
  },
);

EmptyImage.displayName = 'EmptyImage';

export default EmptyImage;
