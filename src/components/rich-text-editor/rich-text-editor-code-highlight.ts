import hljs from 'highlight.js/lib/common';

import type { Node as DocNode } from './lib/model/node.ts';
import type { Decoration } from './lib/view/decoration.ts';
import type { DOMRules } from './lib/view/dom-rules.ts';

import { DecorationSet } from './lib/view/decoration.ts';
import { defaultDOMRules } from './lib/view/dom-rules.ts';

/** Syntax colours are decorations: text segments and caret mappings stay owned by the renderer. */
export function codeHighlightDOMRules(): Partial<DOMRules> {
  return {
    nodes: {
      code_block: {
        ...defaultDOMRules().nodes.code_block!,
        inlineDecorations: highlightCode,
      },
    },
  };
}

function highlightCode(node: DocNode, start: number, document: Document): Decoration[] {
  const language = String(node.attrs.language ?? '');
  if (!language || !hljs.getLanguage(language)) {
    return [];
  }

  const template = document.createElement('template');
  template.innerHTML = hljs.highlight(node.textContent, { ignoreIllegals: true, language }).value;
  const decorations: Decoration[] = [];
  let offset = start;
  const visit = (dom: globalThis.Node, classes: string[]): void => {
    if (dom.nodeType === 3) {
      const length = dom.textContent?.length ?? 0;
      if (length && classes.length) {
        decorations.push(
          DecorationSet.inline(offset, offset + length, { class: classes.join(' ') }),
        );
      }
      offset += length;
      return;
    }
    const ownClasses = dom.nodeType === 1 ? Array.from((dom as Element).classList) : [];
    for (const child of dom.childNodes) {
      visit(child, [...classes, ...ownClasses]);
    }
  };
  visit(template.content, []);
  return decorations;
}
