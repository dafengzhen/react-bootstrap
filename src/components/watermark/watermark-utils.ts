import type { UseWatermarkOptions, UseWatermarkResult, WatermarkFontOptions } from './types';

const DEFAULT_FONT_COLOR = 'rgba(0, 0, 0, 0.15)';
const DEFAULT_FONT_FAMILY = 'sans-serif';
const DEFAULT_FONT_SIZE = 14;
const DEFAULT_FONT_STYLE = 'normal';
const DEFAULT_FONT_WEIGHT = 'normal';
const DEFAULT_GAP: [number, number] = [100, 100];
const DEFAULT_OPACITY = 1;
const DEFAULT_ROTATE = -22;

export const EMPTY_WATERMARK_PATTERN: UseWatermarkResult = {
  dataUrl: '',
  height: 0,
  width: 0,
};

const clampValue = (value: number, min: number, max: number): number =>
  Math.min(max, Math.max(min, value));

const computeRotatedBounds = (
  width: number,
  height: number,
  rotate: number,
): { height: number; width: number } => {
  const radians = (rotate * Math.PI) / 180;
  const sin = Math.abs(Math.sin(radians));
  const cos = Math.abs(Math.cos(radians));
  return {
    height: Math.ceil(width * sin + height * cos),
    width: Math.ceil(width * cos + height * sin),
  };
};

const getPixelRatio = (): number => {
  if (typeof window === 'undefined') {
    return 1;
  }
  return Math.min(window.devicePixelRatio || 1, 2);
};

const loadWatermarkImage = (source: string): Promise<HTMLImageElement> =>
  new Promise((resolve, reject) => {
    const image = new Image();
    image.crossOrigin = 'anonymous';
    image.onerror = () => reject(new Error(`Failed to load watermark image: ${source}`));
    image.onload = () => resolve(image);
    image.src = source;
  });

const resolveFont = (font: WatermarkFontOptions = {}): Required<WatermarkFontOptions> => ({
  color: font.color ?? DEFAULT_FONT_COLOR,
  fontFamily: font.fontFamily ?? DEFAULT_FONT_FAMILY,
  fontSize: font.fontSize ?? DEFAULT_FONT_SIZE,
  fontStyle: font.fontStyle ?? DEFAULT_FONT_STYLE,
  fontWeight: font.fontWeight ?? DEFAULT_FONT_WEIGHT,
  textAlign: font.textAlign ?? 'center',
});

const toContentLines = (content: string | string[]): string[] =>
  typeof content === 'string' ? [content] : content;

export const generateWatermarkPattern = async (
  options: UseWatermarkOptions = {},
): Promise<UseWatermarkResult> => {
  const {
    content = '',
    font: fontOptions,
    gap = DEFAULT_GAP,
    height,
    image,
    opacity = DEFAULT_OPACITY,
    rotate = DEFAULT_ROTATE,
    width,
  } = options;

  const lines = toContentLines(content);
  if (!image && lines.every((line) => line.length === 0)) {
    return EMPTY_WATERMARK_PATTERN;
  }

  const [gapX, gapY] = gap;
  const font = resolveFont(fontOptions);

  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');

  if (context === null) {
    return EMPTY_WATERMARK_PATTERN;
  }

  let contentHeight = 0;
  let contentWidth = 0;
  let draw: () => void;

  if (image) {
    const element = await loadWatermarkImage(image);
    const naturalHeight = element.naturalHeight;
    const naturalWidth = element.naturalWidth;
    contentWidth = width ?? naturalWidth;
    contentHeight = height ?? naturalHeight;
    if (width !== undefined && height === undefined) {
      contentHeight = Math.round((width * naturalHeight) / naturalWidth);
    } else if (width === undefined && height !== undefined) {
      contentWidth = Math.round((height * naturalWidth) / naturalHeight);
    }
    draw = () => {
      context.drawImage(
        element,
        -contentWidth / 2,
        -contentHeight / 2,
        contentWidth,
        contentHeight,
      );
    };
  } else {
    const fontValue = `${font.fontStyle} ${font.fontWeight} ${font.fontSize}px ${font.fontFamily}`;
    context.font = fontValue;
    const lineWidths = lines.map((line) => context.measureText(line).width);
    contentWidth = Math.max(0, ...lineWidths);
    contentHeight = lines.length * font.fontSize;
    const startX =
      font.textAlign === 'center'
        ? 0
        : font.textAlign === 'left' || font.textAlign === 'start'
          ? -contentWidth / 2
          : contentWidth / 2;
    const startY = -contentHeight / 2 + font.fontSize / 2;
    draw = () => {
      context.font = fontValue;
      context.fillStyle = font.color;
      context.textAlign = font.textAlign;
      context.textBaseline = 'middle';
      lines.forEach((line, index) => {
        context.fillText(line, startX, startY + index * font.fontSize);
      });
    };
  }

  const bounds = computeRotatedBounds(contentWidth, contentHeight, rotate);
  const patternWidth = image ? bounds.width + gapX : (width ?? bounds.width + gapX);
  const patternHeight = image ? bounds.height + gapY : (height ?? bounds.height + gapY);
  const ratio = getPixelRatio();

  canvas.width = Math.max(1, Math.round(patternWidth * ratio));
  canvas.height = Math.max(1, Math.round(patternHeight * ratio));

  context.scale(ratio, ratio);
  context.translate(patternWidth / 2, patternHeight / 2);
  context.rotate((rotate * Math.PI) / 180);
  context.globalAlpha = clampValue(opacity, 0, 1);

  draw();

  return {
    dataUrl: canvas.toDataURL(),
    height: patternHeight,
    width: patternWidth,
  };
};
