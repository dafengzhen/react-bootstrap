export interface RootMarginValue {
  unit: '%' | 'px';
  value: number;
}

export interface RootMarginValues {
  bottom: RootMarginValue;
  top: RootMarginValue;
}

export interface ScrollSpySectionRect {
  height: number;
  id: string;
  top: number;
}

export interface ScrollSpySelectionOptions {
  atTop: boolean;
  bandBottom: number;
  bandTop: number;
  enterThreshold: number;
}

const DEFAULT_MARGIN: RootMarginValue = {
  unit: 'px',
  value: 0,
};

const CROSS_LINE_TOLERANCE = 1;

const MARGIN_PART_RE = /^(-?\d+(?:\.\d+)?)(px|%)$/;

const parseMarginPart = (part: string): RootMarginValue => {
  const match = MARGIN_PART_RE.exec(part.trim());

  if (!match) {
    return {
      unit: 'px',
      value: 0,
    };
  }

  return {
    unit: match[2] as '%' | 'px',
    value: Number(match[1]),
  };
};

export const clamp = (value: number, min: number, max: number): number =>
  Math.min(Math.max(value, min), max);

const getIntersection = (
  section: ScrollSpySectionRect,
  bandTop: number,
  bandBottom: number,
): number => {
  const top = Math.max(section.top, bandTop);

  const bottom = Math.min(section.top + section.height, bandBottom);

  return Math.max(0, bottom - top);
};

const getVisibleRatio = (
  section: ScrollSpySectionRect,
  bandTop: number,
  bandBottom: number,
): number => {
  if (section.height <= 0) {
    return 0;
  }

  return clamp(getIntersection(section, bandTop, bandBottom) / section.height, 0, 1);
};

export const computeActiveId = (
  sections: ScrollSpySectionRect[],
  options: ScrollSpySelectionOptions,
): null | string => {
  const { atTop, bandBottom, bandTop, enterThreshold } = options;

  if (sections.length === 0) {
    return null;
  }

  const orderedSections = sections
    .filter((section) => Number.isFinite(section.top) && Number.isFinite(section.height))
    .slice()
    .sort((a, b) => a.top - b.top);

  if (orderedSections.length === 0) {
    return null;
  }

  if (atTop) {
    for (const section of orderedSections) {
      if (getIntersection(section, bandTop, bandBottom) > 0) {
        return section.id;
      }
    }

    return null;
  }

  let latestCrossedId: null | string = null;

  let latestCrossedTop = Number.NEGATIVE_INFINITY;

  let latestQualifiedId: null | string = null;

  let latestQualifiedTop = Number.NEGATIVE_INFINITY;

  let firstVisibleId: null | string = null;

  for (const section of orderedSections) {
    const { height, id, top } = section;

    const bottom = top + height;

    const intersects = bottom > bandTop && top < bandBottom;

    if (top > bandTop + CROSS_LINE_TOLERANCE) {
      if (intersects && firstVisibleId === null) {
        firstVisibleId = id;
      }

      continue;
    }

    if (top >= latestCrossedTop) {
      latestCrossedTop = top;
      latestCrossedId = id;
    }

    if (!intersects) {
      continue;
    }

    if (height <= 0) {
      continue;
    }

    const ratio = getVisibleRatio(section, bandTop, bandBottom);

    if (ratio >= enterThreshold && top >= latestQualifiedTop) {
      latestQualifiedTop = top;
      latestQualifiedId = id;
    }
  }

  if (latestQualifiedId !== null) {
    return latestQualifiedId;
  }

  if (latestCrossedId !== null) {
    return latestCrossedId;
  }

  return firstVisibleId;
};

export const getHashTargetId = (href: string): null | string => {
  if (!href.startsWith('#')) {
    return null;
  }

  const id = href.slice(1);

  if (!id) {
    return null;
  }

  try {
    return decodeURIComponent(id);
  } catch {
    return id;
  }
};

export const isDisabled = (element: Element): boolean => {
  if (element.classList.contains('disabled')) {
    return true;
  }

  if ('disabled' in element) {
    return (element as HTMLButtonElement | HTMLInputElement).disabled;
  }

  return element.hasAttribute('disabled') && element.getAttribute('disabled') !== 'false';
};

export const isVisible = (element: Element): boolean => {
  if (element.getClientRects().length === 0) {
    return false;
  }

  const visible = getComputedStyle(element).getPropertyValue('visibility') === 'visible';

  const closedDetails = element.closest('details:not([open])');

  if (!closedDetails || closedDetails === element) {
    return visible;
  }

  const summary = element.closest('summary');

  return summary !== null && summary.parentNode === closedDetails && visible;
};

export const parseRootMargin = (rootMargin: string): RootMarginValues => {
  const parts = rootMargin.trim().split(/\s+/).filter(Boolean).map(parseMarginPart);

  if (parts.length === 0) {
    return {
      bottom: DEFAULT_MARGIN,
      top: DEFAULT_MARGIN,
    };
  }

  switch (parts.length) {
    case 1: {
      const [value] = parts;

      return {
        bottom: value,
        top: value,
      };
    }

    case 2: {
      const [vertical] = parts;

      return {
        bottom: vertical,
        top: vertical,
      };
    }

    case 3: {
      const [top, , bottom] = parts;

      return {
        bottom,
        top,
      };
    }

    default: {
      const [top, , bottom] = parts;

      return {
        bottom,
        top,
      };
    }
  }
};
