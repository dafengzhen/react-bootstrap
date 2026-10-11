/**
 * DOM types, named apart from the document model.
 *
 * The model has a `Node` and the browser does too; the aliases keep the view readable and are the
 * only place where the DOM type names are pinned down.
 */

/** A DOM element. */
export type DOMElement = globalThis.HTMLElement;

/** A DOM node. */
export type DOMNode = globalThis.Node;

/** A DOM text node. */
export type DOMText = globalThis.Text;
