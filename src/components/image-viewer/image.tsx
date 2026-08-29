import clsx from 'clsx';
import { ZoomIn } from 'lucide-react';
import { forwardRef, useCallback, useEffect, useId, useMemo, useState } from 'react';

import type { ImageProps, ImageViewerImage } from './types';

import { useImageGroup } from './image-group-context';
import { ImageViewer } from './image-viewer';
import styles from './image-viewer.module.css';

export const Image = forwardRef<HTMLImageElement, ImageProps>(
  (
    {
      alt = '',
      className,
      draggable = false,
      fluid = false,
      preview = true,
      previewSrc,
      rounded = false,
      roundedCircle = false,
      showPreviewMask = true,
      src,
      thumbnail = false,
      viewerProps,
      ...rest
    },
    ref,
  ) => {
    const [standaloneOpen, setStandaloneOpen] = useState(false);
    const group = useImageGroup();
    const id = useId();

    const previewImage = useMemo<ImageViewerImage>(
      () => ({ alt, src: previewSrc ?? src ?? '' }),
      [alt, previewSrc, src],
    );

    useEffect(() => {
      if (!group || !preview) {
        return;
      }
      group.register(id, previewImage);
      return () => {
        group.unregister(id);
      };
    }, [group, id, preview, previewImage]);

    const handleOpen = useCallback(() => {
      if (!preview || src == null) {
        return;
      }
      if (group) {
        group.openAt(id);
      } else {
        setStandaloneOpen(true);
      }
    }, [group, id, preview, src]);

    const imageElement = (
      <img
        alt={alt}
        className={clsx(
          fluid && 'img-fluid',
          rounded && 'rounded',
          roundedCircle && 'rounded-circle',
          thumbnail && 'img-thumbnail',
          className,
        )}
        draggable={draggable}
        ref={ref}
        src={src}
        {...rest}
      />
    );

    if (!preview) {
      return imageElement;
    }

    return (
      <>
        <button
          aria-label={`Preview ${alt || 'image'}`}
          className={clsx(
            styles.imagePreviewTrigger,
            (rounded || thumbnail) && 'rounded',
            roundedCircle && 'rounded-circle',
          )}
          onClick={handleOpen}
          type="button"
        >
          {imageElement}
          {showPreviewMask && (
            <span aria-hidden="true" className={styles.imageMask}>
              <ZoomIn aria-hidden="true" className={styles.imageMaskIcon} />
            </span>
          )}
        </button>
        {!group && (
          <ImageViewer
            images={[previewImage]}
            onOpenChange={setStandaloneOpen}
            open={standaloneOpen}
            {...viewerProps}
          />
        )}
      </>
    );
  },
);

Image.displayName = 'Image';

export default Image;
