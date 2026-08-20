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
  line: number;
}

const MARGIN_PART_RE = /^(-?\d+(?:\.\d+)?)(px|%)$/;

const parseMarginPart = (part: string): RootMarginValue => {
  const match = MARGIN_PART_RE.exec(part.trim());
  if (!match) {
    return { unit: 'px', value: 0 };
  }
  return { unit: match[2] as '%' | 'px', value: Number(match[1]) };
};

export const clamp = (value: number, min: number, max: number): number =>
  Math.min(Math.max(value, min), max);

export const computeActiveId = (
  sections: ScrollSpySectionRect[],
  options: ScrollSpySelectionOptions,
): null | string => {
  const { atTop, bandBottom, bandTop, enterThreshold, line } = options;

  let candidateId: null | string = null;
  let candidateTop = Number.NEGATIVE_INFINITY;
  let firstId: null | string = null;
  let firstTop = Number.POSITIVE_INFINITY;
  let qualifiedId: null | string = null;
  let qualifiedTop = Number.NEGATIVE_INFINITY;

  for (const section of sections) {
    const { height, id, top } = section;
    const bottom = top + height;
    const inBand = bottom > bandTop && top < bandBottom;
    if (inBand && top < firstTop) {
      firstTop = top;
      firstId = id;
    }
    if (top > line) {
      continue;
    }
    if (top > candidateTop) {
      candidateTop = top;
      candidateId = id;
    }
    if (!inBand || height === 0) {
      continue;
    }
    const ratio = clamp((Math.min(bottom, bandBottom) - Math.max(top, bandTop)) / height, 0, 1);
    if (ratio >= enterThreshold && top > qualifiedTop) {
      qualifiedTop = top;
      qualifiedId = id;
    }
  }

  if (atTop) {
    return firstId ?? qualifiedId ?? candidateId;
  }
  return qualifiedId ?? candidateId;
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
  const parts = rootMargin.trim().split(/\s+/).map(parseMarginPart);
  const [top = { unit: 'px', value: 0 }, , bottom = { unit: 'px', value: 0 }] = parts;
  return { bottom, top };
};
