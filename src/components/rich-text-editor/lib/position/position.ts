import type { Node } from '../model/node.ts';
import type { ResolvedPos } from './resolved-pos.ts';

import { registerPositionResolver, registerRangeResolver } from '../model/node.ts';
import { resolveRange } from './node-range.ts';
import { resolvePosition } from './resolved-pos.ts';

/**
 * Position module wiring.
 *
 * `Node.resolve` and `Node.resolveRange` delegate to this module, which keeps the
 * model free of position arithmetic while still offering them as the public entry
 * points. Importing anything from `src/position/**` registers both resolvers, so
 * the model works as soon as a caller touches positions at all.
 */
registerPositionResolver(resolvePosition);
registerRangeResolver(resolveRange);

export { NodeIterator } from './node-iterator.ts';
export { resolvePosition } from './resolved-pos.ts';
export { ResolvedPos } from './resolved-pos.ts';
export type { ResolvedPathEntry } from './resolved-pos.ts';

/** Convenience alias matching the design document's `resolvePosition(pos)`. */
export type PositionResolver = (doc: Node, pos: number) => ResolvedPos;
