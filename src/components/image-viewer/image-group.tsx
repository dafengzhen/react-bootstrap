import clsx from 'clsx';
import { forwardRef, useCallback, useMemo, useRef, useState } from 'react';

import type { ImageGroupProps, ImageViewerImage } from './types';

import { ImageGroupContext } from './image-group-context';
import { ImageViewer } from './image-viewer';
import styles from './image-viewer.module.css';

interface RegisteredImage {
  id: string;
  image: ImageViewerImage;
}

const isSameImage = (current: ImageViewerImage, next: ImageViewerImage): boolean =>
  current.alt === next.alt &&
  current.caption === next.caption &&
  current.name === next.name &&
  current.src === next.src;

export const ImageGroup = forwardRef<HTMLElement, ImageGroupProps>(
  ({ as: Component = 'div', children, className, viewerProps, ...rest }, ref) => {
    const [index, setIndex] = useState(0);
    const [items, setItems] = useState<RegisteredImage[]>([]);
    const [open, setOpen] = useState(false);
    // Registry mirror so the context callbacks never change identity, otherwise child
    // effects that register themselves would run again on every registration.
    const itemsRef = useRef<RegisteredImage[]>(items);

    const register = useCallback((id: string, image: ImageViewerImage) => {
      const previousItems = itemsRef.current;
      const existingIndex = previousItems.findIndex((item) => item.id === id);

      if (existingIndex !== -1 && isSameImage(previousItems[existingIndex].image, image)) {
        return;
      }

      const nextItems =
        existingIndex === -1
          ? [...previousItems, { id, image }]
          : previousItems.map((item, itemIndex) =>
              itemIndex === existingIndex ? { id, image } : item,
            );

      itemsRef.current = nextItems;
      setItems(nextItems);
    }, []);

    const unregister = useCallback((id: string) => {
      const previousItems = itemsRef.current;
      const nextItems = previousItems.filter((item) => item.id !== id);

      if (nextItems.length === previousItems.length) {
        return;
      }

      itemsRef.current = nextItems;
      setItems(nextItems);
    }, []);

    const openAt = useCallback((id: string) => {
      const imageIndex = itemsRef.current.findIndex((item) => item.id === id);

      if (imageIndex === -1) {
        return;
      }

      setIndex(imageIndex);
      setOpen(true);
    }, []);

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
