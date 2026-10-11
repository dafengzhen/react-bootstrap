import type { Node } from '../model/node.ts';
import type { ResolvedPos } from '../position/resolved-pos.ts';
import type { PositionMapper, SelectionJSON } from './selection.ts';

import { resolveCautiously, Selection } from './selection.ts';
import { TextSelection } from './text-selection.ts';

/**
 * A selection that covers a single node as a unit.
 *
 * Used for atoms (image, video, horizontal rule) and for whole blocks that the user selected from
 * the outside; deleting such a selection removes the node.
 */
export class NodeSelection extends Selection {
  /** Resolved position right before the selected node. */
  readonly $pos: ResolvedPos;

  /** The selected node. */
  readonly node: Node;

  /** @inheritdoc */
  override get $anchor(): ResolvedPos {
    return this.$pos;
  }

  /** @inheritdoc */
  override get $head(): ResolvedPos {
    return this.$pos;
  }

  /** Whether the selection can be created; node selections are never empty. */
  get empty(): boolean {
    return false;
  }

  constructor($pos: ResolvedPos, node: Node) {
    super($pos.pos, $pos.pos + node.nodeSize);
    this.$pos = $pos;
    this.node = node;
  }

  /**
   * Creates a node selection for the node directly after `pos`.
   *
   * A position with nothing after it — the end of the document, or the inside of a block — selects
   * the block the position resolves into, which is the node a caller meant.
   */
  static create(doc: Node, pos: number): NodeSelection {
    const $pos = resolveCautiously(doc, pos);
    const node = $pos.nodeAfter();

    if (!node) {
      return new NodeSelection($pos, $pos.node($pos.depth));
    }

    return new NodeSelection($pos, node);
  }

  /** Whether a node selection can be created at `pos`. */
  static isSelectable(doc: Node, pos: number): boolean {
    const node = resolveCautiously(doc, pos).nodeAfter();

    return !!node && node.selectable && !node.isText;
  }

  /** @inheritdoc */
  override eq(other: null | Selection | undefined): boolean {
    return (
      !!other &&
      other instanceof NodeSelection &&
      this.$pos.pos === other.$pos.pos &&
      this.node.eq(other.node)
    );
  }

  /** @inheritdoc */
  map(doc: Node, mapping: PositionMapper, assoc = -1): Selection {
    const pos = mapping.map(this.$pos.pos, assoc);

    if (NodeSelection.isSelectable(doc, pos)) {
      return NodeSelection.create(doc, pos);
    }

    return TextSelection.create(doc, pos);
  }

  /** @inheritdoc */
  override toJSON(): SelectionJSON {
    return { anchor: this.anchor, head: this.head, type: 'node' };
  }
}
