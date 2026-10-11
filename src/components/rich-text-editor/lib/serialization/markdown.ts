import type { Mark } from '../model/mark.ts';
import type { Node as DocNode } from '../model/node.ts';

import { isTextNode } from '../model/text-node.ts';

/**
 * Serializes a document to Markdown.
 *
 * Markdown is an adapter, never the internal model: the document tree stays the
 * source of truth and this walks it once. Inline content is escaped so that a
 * literal `*` in a paragraph cannot turn into emphasis on the way back.
 *
 * ```ts
 * getMarkdown(doc); // "# Title\n\nBody with **bold** text"
 * ```
 */
export function serializeMarkdown(doc: DocNode): string {
  const blocks: string[] = [];

  doc.content.forEach((node) => blocks.push(blockToMarkdown(node, 0)));

  return blocks.filter((block) => block.length > 0).join('\n\n');
}

/** Serializes a blockquote, prefixing every line. */
function blockquoteToMarkdown(node: DocNode): string {
  const blocks: string[] = [];

  node.content.forEach((child) => blocks.push(blockToMarkdown(child, 0)));

  return blocks
    .join('\n\n')
    .split('\n')
    .map((line) => (line.length > 0 ? `> ${line}` : '>'))
    .join('\n');
}

/** Serializes one block, with a list nesting level. */
function blockToMarkdown(node: DocNode, indent: number): string {
  const prefix = '  '.repeat(indent);

  switch (node.name) {
    case 'blockquote':
      return blockquoteToMarkdown(node);
    case 'bullet_list':
      return listToMarkdown(node, indent, () => '-');
    case 'code_block': {
      const language = node.attr('language');

      return `\`\`\`${typeof language === 'string' ? language : ''}\n${node.textContent}\n\`\`\``;
    }
    case 'heading': {
      const level = Number(node.attr('level') ?? 1);

      return `${'#'.repeat(Math.max(1, Math.min(6, level)))} ${inlineToMarkdown(node)}`;
    }
    case 'horizontal_rule':
      return '---';
    case 'image':
      return `${prefix}![${String(node.attr('alt') ?? '')}](${String(node.attr('src') ?? '')})`;
    case 'ordered_list':
      return listToMarkdown(node, indent, (index) => `${Number(node.attr('order') ?? 1) + index}.`);
    case 'paragraph':
      return inlineToMarkdown(node);
    case 'task_list':
      return taskListToMarkdown(node, indent);
    default:
      return node.textContent;
  }
}

/** Escapes characters that would otherwise turn into markdown syntax. */
function escapeInline(value: string): string {
  return value.replace(/([\\`*_[\]])/g, '\\$1');
}

/** Serializes the inline content of a block. */
function inlineToMarkdown(node: DocNode): string {
  const parts: string[] = [];

  node.content.forEach((child) => {
    if (isTextNode(child)) {
      parts.push(textToMarkdown(child));
      return;
    }

    if (child.name === 'image') {
      parts.push(`![${String(child.attr('alt') ?? '')}](${String(child.attr('src') ?? '')})`);
      return;
    }

    parts.push(child.textContent);
  });

  return parts.join('');
}

/** Serializes one list item, keeping nested lists on their own lines. */
function itemToMarkdown(item: DocNode, indent: number): string {
  const blocks: string[] = [];

  item.content.forEach((child) => blocks.push(blockToMarkdown(child, indent + 1)));

  const [first, ...rest] = blocks;

  return rest.length === 0 ? (first ?? '') : `${first ?? ''}\n${rest.join('\n')}`;
}

/** Serializes a bullet or ordered list. */
function listToMarkdown(node: DocNode, indent: number, bullet: (index: number) => string): string {
  const lines: string[] = [];

  node.content.forEach((item, index) => {
    lines.push(`${'  '.repeat(indent)}${bullet(index)} ${itemToMarkdown(item, indent)}`);
  });

  return lines.join('\n');
}

/** Serializes a checklist with markdown task markers. */
function taskListToMarkdown(node: DocNode, indent: number): string {
  const lines: string[] = [];

  node.content.forEach((item) => {
    const box = item.attr('checked') === true ? '[x]' : '[ ]';

    lines.push(`${'  '.repeat(indent)}- ${box} ${item.textContent}`);
  });

  return lines.join('\n');
}

/** Serializes a text node with its marks applied. */
function textToMarkdown(node: DocNode): string {
  if (node.type.name !== 'text') {
    return node.textContent;
  }

  const raw = node.rawText;
  const marks = node.markSet;

  if (marks.length === 0) {
    return escapeInline(raw);
  }

  const link = marks.find((mark) => mark.type.name === 'link');
  const code = marks.find((mark) => mark.type.name === 'inline_code');

  if (code) {
    return `\`${raw}\``;
  }

  let result = escapeInline(raw);

  for (const mark of marks) {
    result = wrapMark(mark, result);
  }

  if (link) {
    const href = String(link.attrs.href ?? '');

    return `[${result}](${href})`;
  }

  return result;
}

/** Wraps `text` in the markdown syntax of a mark. */
function wrapMark(mark: Mark, text: string): string {
  switch (mark.type.name) {
    case 'bold':
      return `**${text}**`;
    case 'italic':
      return `*${text}*`;
    case 'strike':
      return `~~${text}~~`;
    case 'subscript':
      return `<sub>${text}</sub>`;
    case 'superscript':
      return `<sup>${text}</sup>`;
    case 'underline':
      // Markdown has no underline, so the HTML tag is the closest portable form.
      return `<u>${text}</u>`;
    default:
      return text;
  }
}
