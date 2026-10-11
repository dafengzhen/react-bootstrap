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
 *
 * No caller imports a value from here: `model.ts` and `editor.ts` only reach the
 * wiring with a bare `import './position/position.ts'`, and a bundler removes such
 * an import unless the package declares the module to have side effects. The
 * `sideEffects` field in `package.json` therefore names this file, `node-range.ts`
 * and the view entry: drop those entries and a production build throws "Position
 * resolver has not been registered" while the dev server keeps working, because
 * nothing in `npm test` ever bundles the wiring.
 */
registerPositionResolver(resolvePosition);
registerRangeResolver(resolveRange);

export { NodeIterator } from './node-iterator.ts';
export { resolvePosition } from './resolved-pos.ts';
export { ResolvedPos } from './resolved-pos.ts';
export type { ResolvedPathEntry } from './resolved-pos.ts';

/** Convenience alias matching the design document's `resolvePosition(pos)`. */
export type PositionResolver = (doc: Node, pos: number) => ResolvedPos;
