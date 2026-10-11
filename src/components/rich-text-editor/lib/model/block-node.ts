import type { Attrs } from '../util/object.ts';
import type { Fragment } from './fragment.ts';
import type { NodeType } from './node-type.ts';
import type { NodeJSON } from './node.ts';

import { compactAttrs, freezeAttrs } from '../util/object.ts';
import { Node } from './node.ts';

/**
 * Generic node implementation used for every non-text node: the differences between
 * `paragraph`, `heading`, `list_item`, `doc`, `image`, ... are described by the schema,
 * so one concrete class is enough for the headless core.
 */
export class BlockNode extends Node {
  override get isInline(): boolean {
    return this.type.spec.inline === true;
  }

  override get isLeaf(): boolean {
    return this.type.isLeaf;
  }

  override get isText(): boolean {
    return false;
  }

  /** @inheritdoc */
  override get nodeSize(): number {
    return this.type.nodeSize(this.content.size, this.textLength);
  }

  constructor(type: NodeType, attrs: Attrs, content: Fragment) {
    super(type, freezeAttrs(attrs), content);
  }

  override toJSON(): NodeJSON {
    const json: NodeJSON = { type: this.type.name };
    const attrs = compactAttrs(this.attrs);

    if (attrs && Object.keys(attrs).length > 0) {
      json.attrs = attrs;
    }

    if (this.content.childCount > 0) {
      json.content = this.content.children.map((child) => child.toJSON());
    }

    return json;
  }
}
