export type Placement =
  | 'bottom-end'
  | 'bottom-start'
  | 'bottom'
  | 'left-end'
  | 'left-start'
  | 'left'
  | 'right-end'
  | 'right-start'
  | 'right'
  | 'top-end'
  | 'top-start'
  | 'top';

export interface PositionConfig {
  flip: boolean;
  offset: readonly [number, number];
  padding: number;
  placement: Placement;
}

export interface PositionOptions extends PositionConfig {
  floatingHeight: number;
  floatingWidth: number;
  isRtl: boolean;
  reference: PositionRect;
}

export interface PositionRect {
  height: number;
  width: number;
  x: number;
  y: number;
}

export interface PositionResult {
  placement: Placement;
  x: number;
  y: number;
}

type BasePlacement = 'bottom' | 'left' | 'right' | 'top';

type PlacementVariation = 'end' | 'start';

interface PositionCoordinates {
  x: number;
  y: number;
}

interface PositionViewport {
  bottom: number;
  left: number;
  right: number;
  top: number;
}

const FALLBACK_PLACEMENTS: Partial<Record<Placement, Placement[]>> = {
  bottom: ['top'],
  'bottom-end': ['bottom-start', 'top-end', 'top-start'],
  'bottom-start': ['bottom-end', 'top-end', 'top-start'],
  'left-end': ['left-start', 'right-end', 'right-start'],
  'left-start': ['left-end', 'right-end', 'right-start'],
  'right-end': ['left-end', 'left-start', 'right-start'],
  'right-start': ['left-end', 'left-start', 'right-end'],
  top: ['bottom'],
  'top-end': ['bottom-end', 'bottom-start', 'top-start'],
  'top-start': ['bottom-end', 'bottom-start', 'top-end'],
};

const clamp = (value: number, min: number, max: number): number =>
  Math.min(Math.max(value, min), max);

const getBasePlacement = (placement: Placement): BasePlacement =>
  placement.split('-')[0] as BasePlacement;

const getVariation = (placement: Placement): PlacementVariation | undefined => {
  const [base, variation] = placement.split('-');
  return base && variation ? (variation as PlacementVariation) : undefined;
};

const getViewport = (padding: number): PositionViewport => ({
  bottom: window.innerHeight - padding,
  left: padding,
  right: window.innerWidth - padding,
  top: padding,
});

const resolveAlign = (
  start: number,
  size: number,
  floatingSize: number,
  skidding: number,
  variation?: PlacementVariation,
): number => {
  switch (variation) {
    case 'end':
      return start + size - floatingSize;
    case 'start':
      return start + skidding;
    default:
      return start + size / 2 - floatingSize / 2;
  }
};

const computeCoordinates = (
  placement: Placement,
  reference: PositionRect,
  floatingWidth: number,
  floatingHeight: number,
  offset: readonly [number, number],
  isRtl: boolean,
): PositionCoordinates => {
  const [skidding, distance] = offset;
  let base = getBasePlacement(placement);
  let variation = getVariation(placement);

  if (isRtl) {
    base = base === 'left' ? 'right' : base === 'right' ? 'left' : base;
    variation = variation === 'end' ? 'start' : variation === 'start' ? 'end' : variation;
  }

  const x = resolveAlign(reference.x, reference.width, floatingWidth, skidding, variation);
  const y = resolveAlign(reference.y, reference.height, floatingHeight, skidding, variation);

  switch (base) {
    case 'bottom':
      return { x, y: reference.y + reference.height + distance };
    case 'left':
      return { x: reference.x - floatingWidth - distance, y };
    case 'right':
      return { x: reference.x + reference.width + distance, y };
    default:
      return { x, y: reference.y - floatingHeight - distance };
  }
};

export const computePosition = (options: PositionOptions): PositionResult => {
  const { flip, floatingHeight, floatingWidth, isRtl, offset, padding, placement, reference } =
    options;
  const viewport = getViewport(padding);

  const fits = (coordinates: PositionCoordinates): boolean =>
    coordinates.x >= viewport.left &&
    coordinates.y >= viewport.top &&
    coordinates.x + floatingWidth <= viewport.right &&
    coordinates.y + floatingHeight <= viewport.bottom;

  const candidates = flip ? [placement, ...(FALLBACK_PLACEMENTS[placement] ?? [])] : [placement];

  let chosenPlacement = placement;
  let chosenCoordinates = computeCoordinates(
    placement,
    reference,
    floatingWidth,
    floatingHeight,
    offset,
    isRtl,
  );

  for (const candidate of candidates) {
    const coordinates = computeCoordinates(
      candidate,
      reference,
      floatingWidth,
      floatingHeight,
      offset,
      isRtl,
    );
    if (fits(coordinates)) {
      chosenPlacement = candidate;
      chosenCoordinates = coordinates;
      break;
    }
  }

  return {
    placement: chosenPlacement,
    x: clamp(
      chosenCoordinates.x,
      viewport.left,
      Math.max(viewport.left, viewport.right - floatingWidth),
    ),
    y: clamp(
      chosenCoordinates.y,
      viewport.top,
      Math.max(viewport.top, viewport.bottom - floatingHeight),
    ),
  };
};

export const positionElement = (
  floating: HTMLElement,
  reference: HTMLElement,
  config: PositionConfig,
): Placement => {
  const { flip, offset, padding, placement } = config;
  const isRtl = getComputedStyle(floating).direction === 'rtl';

  floating.style.margin = '0';
  floating.style.position = 'absolute';

  const referenceRect = reference.getBoundingClientRect();
  const floatingRect = floating.getBoundingClientRect();

  const {
    placement: nextPlacement,
    x,
    y,
  } = computePosition({
    flip,
    floatingHeight: floatingRect.height,
    floatingWidth: floatingRect.width,
    isRtl,
    offset,
    padding,
    placement,
    reference: {
      height: referenceRect.height,
      width: referenceRect.width,
      x: referenceRect.left,
      y: referenceRect.top,
    },
  });

  const offsetParent = floating.offsetParent as HTMLElement | null;
  const originLeft = offsetParent
    ? offsetParent.getBoundingClientRect().left + offsetParent.clientLeft
    : -window.scrollX;
  const originTop = offsetParent
    ? offsetParent.getBoundingClientRect().top + offsetParent.clientTop
    : -window.scrollY;

  floating.style.bottom = 'auto';
  floating.style.left = `${x - originLeft}px`;
  floating.style.right = 'auto';
  floating.style.top = `${y - originTop}px`;

  positionArrow(floating, {
    floatingRect,
    placement: nextPlacement,
    reference: {
      height: referenceRect.height,
      width: referenceRect.width,
      x: referenceRect.left,
      y: referenceRect.top,
    },
    x,
    y,
  });

  return nextPlacement;
};

interface PositionArrowConfig {
  floatingRect: PositionRect;
  placement: Placement;
  reference: PositionRect;
  x: number;
  y: number;
}

const positionArrow = (floating: HTMLElement, config: PositionArrowConfig): void => {
  const { floatingRect, placement, reference, x, y } = config;
  const arrow = floating.querySelector<HTMLElement>('.tooltip-arrow');
  if (!arrow) {
    return;
  }

  arrow.style.position = 'absolute';
  arrow.style.transform = '';

  const base = getBasePlacement(placement);
  const arrowRect = arrow.getBoundingClientRect();

  if (base === 'left' || base === 'right') {
    arrow.style.top = `${clamp(
      reference.y + reference.height / 2 - y - arrowRect.height / 2,
      0,
      floatingRect.height - arrowRect.height,
    )}px`;
  } else {
    arrow.style.left = `${clamp(
      reference.x + reference.width / 2 - x - arrowRect.width / 2,
      0,
      floatingRect.width - arrowRect.width,
    )}px`;
  }
};

export const resetPosition = (floating: HTMLElement): void => {
  floating.style.bottom = '';
  floating.style.left = '';
  floating.style.margin = '';
  floating.style.right = '';
  floating.style.top = '';

  const arrow = floating.querySelector<HTMLElement>('.tooltip-arrow');
  if (arrow) {
    arrow.style.left = '';
    arrow.style.top = '';
    arrow.style.transform = '';
  }
};
