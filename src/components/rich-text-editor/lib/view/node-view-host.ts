import type { Node as DocNode } from '../model/node.ts';
import type { DOMElement } from './dom-types.ts';
import type { NodeView, NodeViewContext, NodeViewFactory } from './node-view.ts';

/** Node views by node name; the registry the host reads. */
type NodeViewRegistryLike = Record<string, NodeViewFactory>;

/**
 * The node views a view currently has mounted.
 *
 * A node view is cached by the identity of the document node it renders, which is what makes a
 * re-render cheap: a document is immutable, so the same node object means the same DOM and the view
 * can be reused. The cache is also the reason this class exists: caching "every node view that was
 * ever created" keeps a view alive long after its node is gone — a paragraph of ten thousand
 * replaced images would leave ten thousand live views, each holding its element, its observers and
 * whatever the extension closed over.
 *
 * So the cache is reconciled instead of accumulated: a render marks the views it used and the host
 * releases unmarked views that are no longer in the editable root. Leaving the document triggers
 * a `destroy()` call. A reconciliation runs only when a render actually happened, so a transaction
 * that just moved the selection touches nothing.
 *
 * ```ts
 * const host = new NodeViewHost(registry, () => ({ document }));
 *
 * host.beginRender();
 * const view = host.viewFor(node);   // during the render
 * host.endRender();                  // destroys what the render left behind
 * ```
 */
export class NodeViewHost {
  /** Number of node views currently mounted; used by tests and diagnostics. */
  get size(): number {
    return this.mounted.size;
  }

  /**
   * What a factory is called with, read lazily.
   *
   * A factory needs the document the view renders into, and the document is the view's own — which
   * is why this is a thunk rather than a value: the host is built before the view has finished
   * constructing itself, and a factory is only ever called during a render, long after that.
   */
  private readonly context: () => NodeViewContext;

  /** Views the render in progress asked for. */
  private inUse: null | Set<NodeView> = null;

  /** Views kept for nodes that are still in the document, by node identity. */
  private readonly mounted = new Map<DocNode, NodeView>();

  /** Node views by node name. */
  private readonly registry: NodeViewRegistryLike;

  constructor(
    registry: NodeViewRegistryLike = {},
    context: (() => NodeViewContext) | NodeViewContext = { document: globalThis.document! },
  ) {
    this.registry = registry;
    this.context = typeof context === 'function' ? context : () => context;
  }

  /**
   * Starts a render, so `viewFor` can tell reuse from repetition.
   *
   * A render asks for a node view once per node, but the same node can legitimately be asked for
   * twice — a decoration pass and a block pass both walk the document — so the mark is a set rather
   * than a counter.
   */
  beginRender(): void {
    this.inUse = new Set();
  }

  /** Destroys every mounted view; the view itself is going away. */
  destroyAll(): void {
    for (const view of this.mounted.values()) {
      this.destroyView(view);
    }

    this.mounted.clear();
    this.inUse = null;
  }

  /**
   * Destroys every mounted view the render did not ask for, except views still inside `root`.
   *
   * Called once at the end of a render, whatever the render did: rebuilding the whole document,
   * replacing one block and appending a fragment all end here, which is what keeps the cache in
   * step with the DOM no matter which path produced it. For a partial render, pass the editable
   * root to preserve views in blocks that were not rebuilt, even when the root is detached.
   */
  endRender(root?: DOMElement): void {
    const used = this.inUse;

    this.inUse = null;

    if (!used) {
      return;
    }

    // The entries are collected first: the sweep deletes from the map it walks, and a `destroy` an
    // extension wrote is free to mount or unmount node views of its own.
    const mounted = Array.from(this.mounted);

    for (const [node, view] of mounted) {
      if (!used.has(view) && !root?.contains(view.dom)) {
        this.mounted.delete(node);
        this.destroyView(view);
      }
    }
  }

  /**
   * View of `node`, reused while the node keeps its identity.
   *
   * Returns `null` when no extension registered a factory for the node's type, which tells the
   * renderer to build the default element instead.
   */
  viewFor(node: DocNode): NodeView | null {
    const cached = this.mounted.get(node);

    if (cached) {
      this.inUse?.add(cached);

      return cached;
    }

    const factory = this.registry[node.name];

    if (!factory) {
      return null;
    }

    const created = factory(node, this.context());

    if (created) {
      this.mounted.set(node, created);
      this.inUse?.add(created);
    }

    return created;
  }

  /** Calls `destroy` on a node view without letting a broken one stop the sweep. */
  private destroyView(view: NodeView): void {
    try {
      view.destroy?.();
    } catch {
      // A node view that throws while it is being thrown away must not keep the rest of the cache
      // alive: the editor is releasing resources, and one bad extension is not a reason to leak
      // every other one.
    }
  }
}
