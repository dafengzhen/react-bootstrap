import clsx from 'clsx';
import { forwardRef, useCallback, useMemo, useState } from 'react';

import type { ImageGroupProps, ImageViewerImage } from './types';

import { ImageGroupContext } from './image-group-context';
import { ImageViewer } from './image-viewer';
import styles from './image-viewer.module.css';

interface RegisteredImage {
  id: string;
  image: ImageViewerImage;
}

export const ImageGroup = forwardRef<HTMLElement, ImageGroupProps>(
  ({ as: Component = 'div', children, className, viewerProps, ...rest }, ref) => {
    const [index, setIndex] = useState(0);
    const [items, setItems] = useState<RegisteredImage[]>([]);
    const [open, setOpen] = useState(false);

    const register = useCallback((id: string, image: ImageViewerImage) => {
      setItems((previousItems) => {
        const existingIndex = previousItems.findIndex((item) => item.id === id);
        if (existingIndex === -1) {
          return [...previousItems, { id, image }];
        }
        const nextItems = [...previousItems];
        nextItems[existingIndex] = { id, image };
        return nextItems;
      });
    }, []);

    const unregister = useCallback((id: string) => {
      setItems((previousItems) => previousItems.filter((item) => item.id !== id));
    }, []);

    const openAt = useCallback(
      (id: string) => {
        const imageIndex = items.findIndex((item) => item.id === id);
        if (imageIndex === -1) {
          return;
        }
        setIndex(imageIndex);
        setOpen(true);
      },
      [items],
    );

    const contextValue = useMemo(
      () => ({ openAt, register, unregister }),
      [openAt, register, unregister],
    );

    const images = useMemo(() => items.map((item) => item.image), [items]);

    return (
      <ImageGroupContext.Provider value={contextValue}>
        <Component className={clsx(styles.imageGroup, className)} ref={ref} {...rest}>
          {children}
        </Component>
        <ImageViewer
          images={images}
          index={index}
          onIndexChange={setIndex}
          onOpenChange={setOpen}
          open={open}
          {...viewerProps}
        />
      </ImageGroupContext.Provider>
    );
  },
);

ImageGroup.displayName = 'ImageGroup';

export default ImageGroup;
