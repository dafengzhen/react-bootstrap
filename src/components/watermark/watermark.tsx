import clsx from 'clsx';
import { type CSSProperties, forwardRef } from 'react';
import { createPortal } from 'react-dom';

import type { WatermarkProps } from './types';

import { useWatermark } from './use-watermark';
import styles from './watermark.module.css';

export const Watermark = forwardRef<HTMLDivElement, WatermarkProps>(
  (
    {
      children,
      className,
      content,
      font,
      fullscreen = false,
      gap,
      height,
      image,
      offset,
      opacity,
      rotate,
      style,
      width,
      zIndex,
      ...rest
    },
    ref,
  ) => {
    const {
      dataUrl,
      height: patternHeight,
      width: patternWidth,
    } = useWatermark({
      content,
      font,
      gap,
      height,
      image,
      opacity,
      rotate,
      width,
    });

    const [offsetX = 0, offsetY = 0] = offset ?? [];

    const watermarkStyle: CSSProperties = {
      backgroundImage: dataUrl ? `url('${dataUrl}')` : undefined,
      backgroundPosition: `${offsetX}px ${offsetY}px`,
      backgroundSize: `${patternWidth}px ${patternHeight}px`,
      zIndex,
    };

    const overlay = dataUrl ? (
      <div
        aria-hidden="true"
        className={clsx(styles.watermark, fullscreen && styles.watermarkFullscreen)}
        style={watermarkStyle}
      />
    ) : null;

    const fullscreenOverlay =
      fullscreen && typeof document !== 'undefined' ? createPortal(overlay, document.body) : null;

    return (
      <div className={clsx(styles.container, className)} ref={ref} style={style} {...rest}>
        {children}
        {fullscreen ? fullscreenOverlay : overlay}
      </div>
    );
  },
);

Watermark.displayName = 'Watermark';

export default Watermark;
