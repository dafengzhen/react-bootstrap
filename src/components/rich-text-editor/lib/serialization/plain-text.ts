import type { Node as DocNode } from '../model/node.ts';

/** Replacement character used for a leaf that carries no text, such as an image or a rule. */
export const LEAF_PLACEHOLDER = '\ufffc';

/** Whether the document holds neither text nor leaves, so that it renders as nothing. */
export function isEmptyDoc(doc: DocNode): boolean {
  return doc.textContent.length === 0 && doc.content.childCount === 0;
}

/** Text of one node, with no block separator between its blocks. */
export function nodeText(node: DocNode): string {
  return node.textContent;
}

/**
 * Converts a document to plain text.
 *
 * Blocks are separated by `blockSeparator`, and a leaf without text is written by `leafText`,
 * which defaults to {@link LEAF_PLACEHOLDER} — so an image dropped into a paragraph leaves a
 * visible mark rather than silently disappearing.
 *
 * ```ts
 * toPlainText(doc);          // paragraphs separated by a blank line
 * toPlainText(doc, '\n');    // one line per paragraph
 * ```
 */
export function toPlainText(
  doc: DocNode,
  blockSeparator = '\n\n',
  leafText?: (node: DocNode) => string,
): string {
  return doc.textBetween(0, doc.content.size, blockSeparator, leafText ?? (() => LEAF_PLACEHOLDER));
}
