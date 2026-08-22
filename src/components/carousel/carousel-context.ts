import { createContext, useContext } from 'react';

import type { CarouselContextValue } from './types';

export const CarouselContext = createContext<CarouselContextValue | null>(null);

export const CarouselItemIndexContext = createContext<null | number>(null);

export const useCarousel = () => {
  const context = useContext(CarouselContext);
  if (!context) {
    throw new Error('Carousel parts must be used within Carousel.');
  }
  return context;
};

export const useCarouselItemIndex = () => useContext(CarouselItemIndexContext);
