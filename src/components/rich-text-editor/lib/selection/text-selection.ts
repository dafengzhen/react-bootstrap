import type { Node } from '../model/node.ts';
import type { ResolvedPos } from '../position/resolved-pos.ts';
import type { PositionMapper, SelectionJSON } from './selection.ts';

import { resolveCautiously, Selection } from './selection.ts';

/**
 * A cursor or a range between two positions.
 *
 * ```ts
 * TextSelection.create(doc, 3);                // a cursor at position 3
 * TextSelection.create(doc, 3, 8).textBetween; // "hello"
 * ```
 */
export class TextSelection extends Selection {
  /** Resolved anchor position. */
  readonly $anchor: ResolvedPos;

  /** Resolved head position. */
  readonly $head: ResolvedPos;

  /** Whether the selection covers no text. */
  get empty(): boolean {
    return this.anchor === this.head;
  }

  constructor($anchor: ResolvedPos, $head: ResolvedPos = $anchor) {
    super($anchor.pos, $head.pos);
    this.$anchor = $anchor;
    this.$head = $head;
  }

  /** Creates a cursor at `pos`. */
  static at(doc: Node, pos: number): TextSelection {
    return TextSelection.create(doc, pos);
  }

  /** Cursor at the last position of the document that can hold text. */
  static atEnd(doc: Node): TextSelection {
    return TextSelection.near(doc, doc.content.size, -1);
  }

  /** Cursor at the first position of the document that can hold text. */
  static atStart(doc: Node): TextSelection {
    return TextSelection.near(doc, 0, 1);
  }

  /** Creates a selection from numeric positions inside `doc`. */
  static create(doc: Node, anchor: number, head: number = anchor): TextSelection {
    return new TextSelection(resolveCautiously(doc, anchor), resolveCautiously(doc, head));
  }

  /**
   * Cursor at the position closest to `pos` that can hold text.
   *
   * Document edges are not always valid cursor positions — the position in front of a horizontal
   * rule, for instance, sits between two blocks — so this walks in `dir` until it finds one that
   * is.
   */
  static near(doc: Node, pos: number, dir: -1 | 1 = 1): TextSelection {
    const size = doc.content.size;
    let candidate = Math.max(0, Math.min(pos, size));

    while (candidate >= 0 && candidate <= size && !canHoldText(doc, candidate)) {
      candidate += dir;
    }

    return TextSelection.create(doc, candidate);
  }

  /** @inheritdoc */
  override eq(other: null | Selection | undefined): boolean {
    return (
      !!other &&
      other instanceof TextSelection &&
      this.anchor === other.anchor &&
      this.head === other.head
    );
  }

  /** Same anchor, head moved to `pos`. */
  extend(pos: number): TextSelection {
    return new TextSelection(this.$anchor, resolveCautiously(this.doc, pos));
  }

  /** @inheritdoc */
  map(doc: Node, mapping: PositionMapper, assoc = -1): TextSelection {
    const anchor = mapping.map(this.anchor, assoc);
    const head = this.empty ? anchor : mapping.map(this.head, assoc);

    return TextSelection.create(doc, anchor, head);
  }

  /** @inheritdoc */
  override toJSON(): SelectionJSON {
    return { anchor: this.anchor, head: this.head, type: 'text' };
  }
}

/**
 * Whether a text cursor can sit at `pos`.
 *
 * A cursor needs a block around it that accepts characters, which the content model reports by
 * allowing the schema's text node type.
 */
function canHoldText(doc: Node, pos: number): boolean {
  const $pos = resolveCautiously(doc, pos);

  for (let depth = $pos.depth; depth >= 0; depth--) {
    const node = $pos.node(depth);

    if (!node.isText) {
      return node.contentMatch.allowedTypes.some((type) => type.isText);
    }
  }

  return false;
}
