/**
 * Attribute and Mark rules that map the document model to HTML.
 *
 * Every rule is data, not code, which keeps the serializer and the parser in sync: one table
 * describes how a node or mark is written and read back.
 */

/** How one mark type is written to HTML. */
export interface MarkRule {
  /** Attributes copied from the mark's attribute bag. */
  attrs?: Record<string, string>;
  /** Tag name used for the element. */
  tag: string;
  /** Mark type the rule applies to. */
  type: string;
}

/** How one node type is written to HTML. */
export interface NodeRule {
  /** Attributes copied from the node's attribute bag. */
  attrs?: Record<string, string>;
  /** Tag name used for the element. */
  tag: string;
  /** Node type the rule applies to. */
  type: string;
}

/** Node rules of the default schema. */
export const NODE_RULES: readonly NodeRule[] = [
  { tag: 'p', type: 'paragraph' },
  { tag: 'h1', type: 'heading' },
  { tag: 'blockquote', type: 'blockquote' },
  { tag: 'ul', type: 'bullet_list' },
  { tag: 'ol', type: 'ordered_list' },
  { tag: 'li', type: 'list_item' },
  { tag: 'ul', type: 'task_list' },
  { tag: 'li', type: 'task_item' },
  { tag: 'pre', type: 'code_block' },
  { tag: 'hr', type: 'horizontal_rule' },
  { tag: 'img', type: 'image' },
  { tag: 'video', type: 'video' },
  { tag: 'audio', type: 'audio' },
  { tag: 'p', type: 'formula' },
  { tag: 'a', type: 'attachment' },
  { tag: 'div', type: 'embed' },
  { tag: 'table', type: 'table' },
  { tag: 'tr', type: 'table_row' },
  { attrs: { colspan: 'colspan', rowspan: 'rowspan' }, tag: 'td', type: 'table_cell' },
];

/** Mark rules of the default schema. */
export const MARK_RULES: readonly MarkRule[] = [
  { tag: 'strong', type: 'bold' },
  { tag: 'em', type: 'italic' },
  { tag: 'u', type: 'underline' },
  { tag: 's', type: 'strike' },
  { tag: 'code', type: 'inline_code' },
  { tag: 'sup', type: 'superscript' },
  { tag: 'sub', type: 'subscript' },
  { attrs: { href: 'href', rel: 'rel', target: 'target', title: 'title' }, tag: 'a', type: 'link' },
  { attrs: { style: 'color' }, tag: 'span', type: 'text_color' },
  { attrs: { style: 'background-color' }, tag: 'mark', type: 'highlight' },
  { attrs: { style: 'font-family' }, tag: 'span', type: 'font_family' },
  { attrs: { style: 'font-size' }, tag: 'span', type: 'font_size' },
];

/** Heading level a tag name stands for, or `null`. */
export function headingLevel(tag: string): null | number {
  const match = /^h([1-6])$/.exec(tag.toLowerCase());

  return match ? Number(match[1]) : null;
}

/** Tag name written for a heading level. */
export function headingTag(level: number): string {
  const clamped = Math.max(1, Math.min(6, Math.round(level)));

  return `h${clamped}`;
}
