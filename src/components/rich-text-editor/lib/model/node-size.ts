/**
 * Node sizing rules for the flat position space, by style:
 *
 * - `text`   — `text.length` positions
 * - `leaf`   — one position (atoms: image, video, horizontal rule, ...)
 * - `inline` — its content plus one boundary position on each side
 * - `block`  — same as `inline`; blocks simply live in block content
 */
/**
 * Style of a node, which is what decides its size in the flat position space.
 *
 * A frozen object rather than a TypeScript `enum`: the project is compiled with `erasableSyntaxOnly`,
 * where only syntax that a transpiler can delete is allowed, and an enum emits a runtime object. The
 * members and their values are exactly the ones the enum declared.
 */
export const NodeStyle = Object.freeze({
  /** Textblock that holds inline content (paragraph, heading, ...). */
  Block: 1,
  /** Inline container that holds inline content (e.g. a future inline wrapper). */
  Inline: 2,
  /** Inline atom without content (image, mention, formula, ...). */
  Leaf: 3,
  /** Text node. */
  Text: 4,
} as const);

/** A style of a node; the type of a {@link NodeStyle} member. */
export type NodeStyle = (typeof NodeStyle)[keyof typeof NodeStyle];

/** Size of the boundary positions a container node contributes. */
export const NODE_CONTAINER_SIZE = 2;

/** Index of the last child of `size`, allowing for the closing boundary token. */
export function maxChildIndex(size: number, contentSize: number, isLeaf: boolean): number {
  return isLeaf ? 0 : contentSize + NODE_CONTAINER_SIZE - size;
}

/** Size of a node whose style is already known, in the flat position space. */
export function nodeSizeOfStyle(style: NodeStyle, contentSize: number, textLength = 0): number {
  if (style === NodeStyle.Text) {
    return textLength;
  }

  if (style === NodeStyle.Leaf) {
    return 1;
  }

  return contentSize + NODE_CONTAINER_SIZE;
}

/** Size of a text node. */
export function textSize(text: string): number {
  return text.length;
}
