import type { Node } from '../model/node.ts';
import type { ResolvedPos } from './resolved-pos.ts';

import { NodeRange } from '../model/node-range.ts';
import { registerRangeResolver } from '../model/node.ts';
import { resolveCautiously } from '../selection/selection.ts';
import { ErrorCode, schemaError } from '../util/errors.ts';

/**
 * Resolves `[from, to)` at a shared depth.
 *
 * Transforms that work on list items, table cells or blockquotes need both
 * endpoints at the same depth inside the same parent; this helper raises a
 * `SchemaError` when that is not the case instead of producing a broken range.
 *
 * Endpoints are resolved with cursor semantics, so a caller may pass a position
 * that points into text and get the surrounding block instead. `depth` is a
 * request: it is used when both ends can be resolved at it, otherwise the deepest
 * shared ancestor is used.
 *
 * @param depth - depth to resolve at; `0` picks the deepest shared ancestor
 */
export function resolveRange(doc: Node, from: number, to: number, depth = 0): NodeRange {
  const $from = resolveCautiously(doc, from);
  const $to = resolveCautiously(doc, to);
  const resolved =
    depth > 0 && depth <= $from.depth && depth <= $to.depth ? depth : sharedDepth($from, $to);

  if (resolved > $from.depth || resolved > $to.depth) {
    throw schemaError(
      ErrorCode.DEPTH_OUT_OF_RANGE,
      `Range depth ${resolved} exceeds the resolved depth`,
      { depth: resolved, fromDepth: $from.depth, toDepth: $to.depth },
    );
  }

  return new NodeRange($from, $to, resolved);
}

/** Depth of the deepest ancestor both positions share. */
export function sharedDepth($from: ResolvedPos, $to: ResolvedPos): number {
  let depth = 0;

  while (
    depth < $from.depth &&
    depth < $to.depth &&
    $from.node(depth + 1) === $to.node(depth + 1)
  ) {
    depth++;
  }

  return depth;
}

registerRangeResolver(resolveRange);

export { NodeRange } from '../model/node-range.ts';
