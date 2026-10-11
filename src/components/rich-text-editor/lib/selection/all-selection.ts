import type { Node } from '../model/node.ts';
import type { ResolvedPos } from '../position/resolved-pos.ts';
import type { PositionMapper, SelectionJSON } from './selection.ts';

import { resolveCautiously, Selection } from './selection.ts';

/**
 * A selection covering the whole document.
 *
 * Used by "select all" and by commands that operate on the entire document, so they do not have to
 * special case a range that spans every block.
 */
export class AllSelection extends Selection {
  /** @inheritdoc */
  readonly $anchor: ResolvedPos;

  /** @inheritdoc */
  readonly $head: ResolvedPos;

  /** Whether the selection is empty; never true for a document with content. */
  get empty(): boolean {
    return this.anchor === this.head;
  }

  constructor(doc: Node) {
    super(0, doc.content.size);
    this.$anchor = resolveCautiously(doc, 0);
    this.$head = resolveCautiously(doc, doc.content.size);
  }

  /** @inheritdoc */
  override eq(other: null | Selection | undefined): boolean {
    return !!other && other instanceof AllSelection;
  }

  /** @inheritdoc */
  map(doc: Node, _mapping: PositionMapper): Selection {
    return new AllSelection(doc);
  }

  /** @inheritdoc */
  override toJSON(): SelectionJSON {
    return { anchor: this.anchor, head: this.head, type: 'all' };
  }
}
