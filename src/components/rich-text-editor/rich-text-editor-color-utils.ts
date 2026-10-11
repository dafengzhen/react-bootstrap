import type { RichTextEditorColorGroup } from './rich-text-editor-data.ts';

/**
 * The value a color control stores.
 *
 * The editor's mark attributes accept the CSS colors a browser can paint and nothing else — a hex
 * value, an `rgb()`/`hsl()` function or a named color — so a value that arrives from an `<input
 * type="color">` or from a host's own picker is checked here before a command is run with it. A
 * value the editor would refuse makes the command report `false` and silently do nothing, and a
 * toolbar that only reports "it did not work" is worse than one that keeps the old value.
 */

/** Names the CSS color grammar accepts, for the values an `<input type="color">` cannot produce. */
const COLOR_KEYWORDS: readonly string[] = [
  'black',
  'blue',
  'brown',
  'coral',
  'crimson',
  'cyan',
  'darkblue',
  'darkgray',
  'darkgreen',
  'darkorange',
  'darkred',
  'gold',
  'gray',
  'green',
  'indigo',
  'lightblue',
  'lightgray',
  'lime',
  'magenta',
  'maroon',
  'navy',
  'olive',
  'orange',
  'orchid',
  'pink',
  'plum',
  'purple',
  'red',
  'salmon',
  'silver',
  'teal',
  'tomato',
  'transparent',
  'turquoise',
  'violet',
  'white',
  'yellow',
];

/** Contrast color for a swatch's check mark: black on light fills, white on dark ones. */
export function contrastColor(color: string): string {
  const rgb = rgbOf(color);

  if (!rgb) {
    return '#ffffff';
  }

  const [r, g, b] = rgb;
  // Rec. 601 luma, the cheap approximation every UI toolkit uses for this decision.
  const luma = (0.299 * r + 0.587 * g + 0.114 * b) / 255;

  return luma > 0.6 ? '#212529' : '#ffffff';
}

/** Every color of the pickers, for the "current value" lookup. */
export function flattenColorGroups(groups: readonly RichTextEditorColorGroup[]): string[] {
  return groups.flatMap((group) => group.colors.map((color) => color.value));
}

/** Whether `value` is a color the editor's style policy accepts. */
export function isColorValue(value: unknown): boolean {
  const text = String(value ?? '').trim();

  if (text === '') {
    return false;
  }

  if (/^#[\da-f]{3}(?:[\da-f]{1}|[\da-f]{3}|[\da-f]{5})?$/i.test(text)) {
    return true;
  }

  if (/^(?:rgb|rgba|hsl|hsla)\([\d.,%+\-\s/]+\)$/i.test(text)) {
    return true;
  }

  return /^[a-z]+$/i.test(text) && COLOR_KEYWORDS.includes(text.toLowerCase());
}

/**
 * Normalizes a color a host typed or a browser produced.
 *
 * A three-digit hex expands to six so the value stored on the document is the one a reader sees in
 * the picker's own input, which is what makes "the swatch is highlighted" and "the document holds
 * this value" agree.
 */
export function normalizeColor(value: string): string {
  const text = value.trim().toLowerCase();

  if (/^#[\da-f]{3}$/.test(text)) {
    return `#${text[1]}${text[1]}${text[2]}${text[2]}${text[3]}${text[3]}`;
  }

  return text;
}

/** Red, green and blue of a hex or `rgb()` color, or `null` when it cannot be read. */
export function rgbOf(color: string): [number, number, number] | null {
  const text = color.trim().toLowerCase();
  const hex = /^#([\da-f]{3}|[\da-f]{6})$/.exec(text);

  if (hex?.[1]) {
    const digits =
      hex[1].length === 3
        ? `${hex[1][0]}${hex[1][0]}${hex[1][1]}${hex[1][1]}${hex[1][2]}${hex[1][2]}`
        : hex[1];

    return [
      Number.parseInt(digits.slice(0, 2), 16),
      Number.parseInt(digits.slice(2, 4), 16),
      Number.parseInt(digits.slice(4, 6), 16),
    ];
  }

  const functional = /^rgba?\(([^)]+)\)$/.exec(text);

  if (!functional?.[1]) {
    return null;
  }

  const parts = functional[1].split(',').map((part) => part.trim());

  if (parts.length < 3) {
    return null;
  }

  const channels = parts.slice(0, 3).map((part) => {
    const value = part.endsWith('%')
      ? (Number.parseFloat(part) / 100) * 255
      : Number.parseFloat(part);

    return Number.isFinite(value) ? Math.max(0, Math.min(255, Math.round(value))) : 0;
  });

  return [channels[0] ?? 0, channels[1] ?? 0, channels[2] ?? 0];
}
