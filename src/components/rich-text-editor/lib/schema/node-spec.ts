import type { AttrSpecs } from './attrs.ts';

/**
 * Declaration of a node type.
 *
 * ```ts
 * const paragraph: NodeSpec = {
 *   name: 'paragraph',
 *   group: 'block',
 *   content: 'inline*',
 *   attrs: { align: { default: 'left' } },
 * };
 * ```
 */
export interface NodeSpec {
  /** Whether the node is a leaf that is not text; the core derives this from `content`. */
  atom?: boolean;

  /** Attribute declarations. */
  attrs?: AttrSpecs;

  /** Whether the node may not be split by Enter. */
  code?: boolean;

  /** Content expression, e.g. `"inline*"` or `"paragraph block*"`; omit for atoms. */
  content?: string;

  /** Whether the node sets a "moving" context such as a list or a blockquote. */
  defining?: boolean;

  /** Whether the node participates in drag & drop. */
  draggable?: boolean;

  /** Groups the node belongs to, space separated (`"block"`, `"inline"`). */
  group?: string;

  /** Whether the node is inline (text, image, mention, ...). */
  inline?: boolean;

  /** Whether the node isolates its content (table cells). */
  isolating?: boolean;

  /** Marks that may appear on this node; `"_"` means all marks are allowed. */
  marks?: string;

  /** Node name, must match the key in the schema spec. */
  name: string;

  /** Whether the node must contain at least one child block. */
  nonEmpty?: boolean;

  /**
   * Whether this declaration takes over a node type another extension already declared.
   *
   * Two extensions declaring one node name is an error by default, because the schema cannot
   * choose between them; an extension that means to replace a built-in type says so here. That
   * keeps the decision next to the replacement instead of encoding it in a priority number that
   * has to outrank an extension the host may not even know about.
   */
  replace?: boolean;

  /** Whether the node may be selected as a unit. */
  selectable?: boolean;
}
