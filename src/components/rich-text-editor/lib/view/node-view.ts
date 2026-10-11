import type { Node as DocNode } from '../model/node.ts';
import type { DOMElement } from './dom-types.ts';

/**
 * Custom rendering for a node whose DOM is more than one element with attributes.
 *
 * Images, videos, tables, formulas and embeds all need their own element, their own updates and
 * sometimes their own children; a `NodeView` is how an extension supplies that without teaching the
 * core about the node.
 *
 * ```ts
 * const imageView: NodeViewFactory = (node, { document }) => ({
 *   dom: renderImage(document, node),
 *   update: (next) => next.eq(node),
 * });
 * ```
 */
export interface NodeView {
  /** Element the node's children are rendered into; defaults to `dom`. */
  contentDOM?: DOMElement;
  /** Called when the node stops being the selection. */
  deselect?: () => void;
  /** Called when the view is thrown away. */
  destroy?: () => void;
  /**
   * Element the view puts into the document DOM. Set `data-node-selection="controls"` when the
   * view shows its own selection controls and should not have a native selection painted over it.
   */
  dom: DOMElement;
  /** Called when the node becomes the selection. */
  select?: () => void;
  /** Called after the node changed; returning `false` asks for a fresh view. */
  update?: (node: DocNode) => boolean;
}

/**
 * What a node view is built with, besides the node itself.
 *
 * A factory that builds elements has to know which document to build them in: reading
 * `globalThis.document` works for a page and breaks for an editor inside an iframe, a popup or
 * another realm, whose `ownerDocument` is its own. An element created in the wrong document is
 * adopted by the browser at best — taking its styles, custom elements and event behaviour from the
 * wrong realm — and left detached at worst.
 *
 * ```ts
 * const imageView: NodeViewFactory = (node, { document }) => ({
 *   dom: document.createElement('img'),
 * });
 * ```
 */
export interface NodeViewContext {
  /** Document the view creates its elements in; the editor's own `ownerDocument`. */
  document: Document;
  /** The view the node view belongs to. */
  view?: unknown;
}

/** Builds the view of a node. */
export type NodeViewFactory = (node: DocNode, context: NodeViewContext) => NodeView | null;

/** Node views by node name. */
export type NodeViewRegistry = Record<string, NodeViewFactory>;
