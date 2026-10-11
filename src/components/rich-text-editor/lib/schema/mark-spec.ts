import type { AttrSpecs } from './attrs.ts';

/** Value shape of a `MarkSpec.excludes` declaration before the schema resolves it. */
export type MarkExcludes = null | readonly string[] | string;

/**
 * Declaration of a mark type.
 *
 * ```ts
 * const bold: MarkSpec = { name: 'bold', excludes: 'bold' };
 * const link: MarkSpec = { name: 'link', attrs: { href: {} }, inclusive: false };
 * ```
 */
export interface MarkSpec {
  /** Attribute declarations. */
  attrs?: AttrSpecs;

  /** Mark types this mark cannot share text with. */
  excludes?: readonly string[];

  /** Whether typing after the mark should extend it; defaults to `true`. */
  inclusive?: boolean;

  /** Mark name, must match the key in the schema spec. */
  name: string;

  /**
   * Whether this declaration takes over a mark type another extension already declared.
   *
   * The mark half of `NodeSpec.replace`: a duplicate name is an error unless one of the two
   * declarations asks for the replacement explicitly.
   */
  replace?: boolean;
}
