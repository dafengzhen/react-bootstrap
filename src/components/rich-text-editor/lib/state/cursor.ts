import type { Transaction } from './transaction.ts';

import { TextSelection } from '../selection/text-selection.ts';

/**
 * Puts a cursor at `pos`, clamped into the document.
 *
 * A command that rebuilds the block around the selection knows where the caret belongs
 * afterwards; mapping cannot. A position inside a replaced range maps to the end of the
 * inserted content, so a block swapped for one of the same size would leave the caret
 * after the whole block.
 */
export function placeCursor(tr: Transaction, pos: number): Transaction {
  const clamped = Math.min(Math.max(pos, 1), tr.doc.content.size);

  return tr.setSelection(TextSelection.create(tr.doc, clamped));
}
