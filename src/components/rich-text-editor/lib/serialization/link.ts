import type { Attrs } from '../util/object.ts';

/** Attributes of an attachment. */
export interface AttachmentAttrs {
  /** Stable identifier of the uploaded file. */
  id?: string;
  mimeType?: string;
  name: string;
  /** Size in bytes. */
  size?: number;
  url: string;
}

/** Attributes of an audio node. */
export interface AudioAttrs {
  mimeType?: string;
  src: string;
  title?: string;
}

/** Attributes of a code block. */
export interface CodeBlockAttrs {
  /** Language used for syntax highlighting in the view layer. */
  language?: string;
  /** Whether the view shows line numbers. */
  lineNumbers?: boolean;
  /** Theme name passed to the highlighter. */
  theme?: string;
}

/** Crop rectangle for an image, in source pixels. */
export interface CropInfo {
  /** Height of the visible area. */
  height: number;
  /** Width of the visible area. */
  width: number;
  /** Horizontal offset of the visible area. */
  x: number;
  /** Vertical offset of the visible area. */
  y: number;
}

/** Attributes of a date node. */
export interface DateAttrs {
  /** ISO 8601 timestamp. */
  datetime: string;
  /** Text shown in the document. */
  label?: string;
}

/** Attributes of an embed node. */
export interface EmbedAttrs {
  /** Provider specific payload, for instance map coordinates. */
  data?: Attrs;
  /** Provider specific resource id. */
  id?: string;
  provider: EmbedProvider | string;
  /** Original URL the embed was created from. */
  url?: string;
}

/** Providers the embed node understands. */
export type EmbedProvider =
  | 'bilibili'
  | 'custom'
  | 'figma'
  | 'map'
  | 'miro'
  | 'poll'
  | 'twitter'
  | 'youtube';

/** Attributes of a formula node. */
export interface FormulaAttrs {
  display?: FormulaDisplay;
  /** Serialization format of `value`. */
  format?: FormulaFormat;
  value: string;
}

/** Where a formula is rendered. */
export type FormulaDisplay = 'block' | 'inline';

/** Formats a formula node can use. */
export type FormulaFormat = 'latex' | 'mathml';

/** Attributes of a heading. */
export interface HeadingAttrs {
  align: 'center' | 'justify' | 'left' | 'right';
  /** Heading level, 1 to 6. */
  level: number;
}

/** Attributes of an image node. */
export interface ImageAttrs {
  /** Alignment inside its block. */
  align?: 'center' | 'left' | 'right';
  alt?: string;
  /** Caption shown under the image. */
  caption?: string;
  /** Crop rectangle applied by the view layer. */
  crop?: CropInfo;
  /** Intrinsic height, in pixels. */
  height?: number;
  loading?: 'eager' | 'lazy';
  /** Source URL. */
  src: string;
  /** Advisory title. */
  title?: string;
  /** Intrinsic width, in pixels. */
  width?: number;
}

/** Attributes of a link mark. */
export interface LinkAttrs {
  /**
   * Target URL. The rule is the URL policy of `serialization/sanitize.ts`: relative, protocol
   * relative, `http`, `https`, `mailto` and `tel` URLs and `data:` URLs carrying media are
   * accepted; everything else — `javascript:`, `vbscript:`, `blob:`, `file:`, `about:`, a `data:`
   * URL carrying a document — is refused, and accepting `data:image/svg+xml` takes an explicit
   * opt-in.
   */
  href: string;
  /**
   * Link relation. The tokens are filtered rather than copied: only `external`, `nofollow`,
   * `noopener`, `noreferrer`, `sponsored` and `ugc` survive, `opener` never does, and a link with a
   * `_blank` target always ends up carrying `noopener noreferrer` in addition to the rest.
   */
  rel?: string;
  /**
   * Browsing context the link opens in: `_blank` for a new one, `_self` for the one the document is
   * already in.
   *
   * The type is also the runtime policy. A value outside it — `_parent`, `_top`, a named context —
   * that arrives in a JSON document rather than through this interface is dropped instead of
   * written out, because where a click lands is a decision for the host rather than for a document
   * loaded from storage or a clipboard.
   */
  target?: '_blank' | '_self';
  /**
   * Text to link when nothing is selected; only the `insertLink` command reads it, as the label the
   * toolbar shows while the URL is the `href`.
   */
  text?: string;
  /** Advisory title. */
  title?: string;
}

/** Attributes of a mention. */
export interface MentionAttrs {
  /** Identifier of the mentioned entity. */
  id: string;
  /** Text shown in the document. */
  label: string;
}

/** Attributes of a paragraph, matching the design document. */
export interface ParagraphAttrs {
  align: 'center' | 'justify' | 'left' | 'right';
  indent: number;
  /**
   * Line height: a number is a multiplier (`1.5` → `line-height: 1.5`), a string a CSS value
   * (`'150%'`, `'24px'`); a bare number is never a length, because a 1.5px line box is not what an
   * author who wrote `1.5` meant.
   */
  lineHeight?: null | number | string;
  /** Space below the paragraph: a number is pixels (`12` → `12px`), a string is CSS. */
  marginBottom?: null | number | string;
  /** Space above the paragraph: a number is pixels (`12` → `12px`), a string is CSS. */
  marginTop?: null | number | string;
}

/** Attributes of a table cell. */
export interface TableCellAttrs {
  backgroundColor?: string;
  /** Number of columns the cell spans. */
  colspan: number;
  /** Column widths of the columns the cell covers. */
  colwidth?: number[];
  /** Number of rows the cell spans. */
  rowspan: number;
  verticalAlign?: 'bottom' | 'middle' | 'top';
}

/** Attributes of a checklist entry. */
export interface TaskItemAttrs {
  checked: boolean;
}

/** Attributes of a video node. */
export interface VideoAttrs {
  height?: number;
  /** Provider specific id, when the provider has one. */
  id?: string;
  poster?: string;
  provider: VideoProvider;
  /** Original URL the video was created from. */
  url?: string;
  width?: number;
}

/** Providers the video node understands. */
export type VideoProvider = 'bilibili' | 'custom' | 'native' | 'vimeo' | 'youtube';
