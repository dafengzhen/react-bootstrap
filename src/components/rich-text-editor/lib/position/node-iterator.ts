import type { Node } from '../model/node.ts';

import { ErrorCode, schemaError } from '../util/errors.ts';
import { resolvePosition } from './resolved-pos.ts';

/**
 * What a node iterator should do after visiting a node.
 *
 * A frozen object rather than a TypeScript `enum`, for the same reason `NodeStyle` is one: enums emit
 * runtime code, and this project is compiled with `erasableSyntaxOnly`.
 */
export const IteratorAction = Object.freeze({
  /** Keep descending into the node. */
  Descend: 0,
  /** Skip the node's content. */
  Skip: 1,
  /** Stop iterating entirely. */
  Stop: 2,
} as const);

/** One of the actions an iterator callback can return. */
export type IteratorAction = (typeof IteratorAction)[keyof typeof IteratorAction];

/**
 * Walks the nodes between two positions in document order.
 *
 * Used by search, plain text extraction and serialization: iterating the document
 * model directly avoids ever touching the DOM.
 */
export class NodeIterator {
  /** Document being iterated. */
  readonly doc: Node;

  /** Resolved start position. */
  get $from() {
    return resolvePosition(this.doc, this.from);
  }

  /** Resolved end position. */
  get $to() {
    return resolvePosition(this.doc, this.to);
  }

  private readonly from: number;

  private readonly to: number;

  constructor(doc: Node, from = 0, to = doc.content.size) {
    if (from < 0 || to > doc.content.size || from > to) {
      throw schemaError(ErrorCode.INVALID_RANGE, `Invalid iteration range ${from}..${to}`, {
        documentSize: doc.content.size,
        from,
        to,
      });
    }

    this.doc = doc;
    this.from = from;
    this.to = to;
  }

  /**
   * Visits every node whose position range intersects `[from, to)`.
   *
   * `f` receives the node and its start position and returns an
   * {@link IteratorAction}; returning `false` or `Stop` ends the walk.
   */
  forEach(
    f: (node: Node, pos: number, parent: Node | null) => boolean | IteratorAction | void,
  ): void {
    let stopped = false;

    const walk = (node: Node, start: number, _parent: Node | null): void => {
      if (stopped) {
        return;
      }

      let offset = start;

      for (let index = 0; index < node.childCount; index++) {
        const child = node.child(index);
        const childStart = offset + 1;
        const childEnd = childStart + child.nodeSize;

        offset = childEnd - 1;

        if (childEnd <= this.from || childStart > this.to) {
          continue;
        }

        const action = f(child, childStart, node);

        if (action === IteratorAction.Stop || action === false) {
          stopped = true;
          return;
        }

        if (action !== IteratorAction.Skip && !child.isLeaf) {
          walk(child, childStart, node);
        }
      }
    };

    walk(this.doc, -1, null);
  }

  /** Collects every visited node into an array. */
  toArray(): { node: Node; pos: number }[] {
    const result: { node: Node; pos: number }[] = [];

    this.forEach((node, pos) => {
      result.push({ node, pos });
    });

    return result;
  }
}
