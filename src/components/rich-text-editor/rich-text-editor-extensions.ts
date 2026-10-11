import type {
  Attrs,
  Command,
  DocNode,
  DOMAttrs,
  DOMRules,
  EditorState,
  Extension,
  ExtensionContext,
  NodeSpec,
} from './rich-text-editor-lib.ts';

import { isSafeUrl, sanitizeUrl } from './rich-text-editor-lib.ts';

/**
 * The nodes the insert toolbar needs and the starter kit does not define.
 *
 * Emoji, special symbols, a date stamp, a third-party embed and a custom card are the four kinds of
 * content a rich text editor is expected to insert but no document model can guess the shape of:
 * every product stores them differently. They are declared here as small atom nodes plus the
 * commands and DOM rules that make them work, so the toolbar can offer them and a host can replace
 * any of them through `extensions`.
 *
 * ```ts
 * const editor = new Editor({
 *   extensions: [StarterKit, MediaKit, extendedKit()],
 * });
 *
 * editor.commands.insertEmoji({ char: '🎉' });
 * editor.commands.insertSymbol({ char: '×' });
 * editor.commands.insertDate({ label: '2024-05-06', datetime: '2024-05-06' });
 * editor.commands.insertEmbed({ provider: 'youtube', url });
 * editor.commands.insertEmbedBlock({ html: '<blockquote class="twitter-tweet">…' });
 * ```
 *
 * Every node is an atom: the caret steps over it, and the document keeps the data rather than the
 * markup, which is what lets the HTML serializer, the JSON round trip and a paste all agree. Each
 * value that ends up in an attribute a browser executes — `src` of the embed, the card's raw
 * markup — is a light DOM value only: {@link extendedDOMRules} renders it out of a data attribute
 * the parser reads back, and {@link safeUrl} refuses anything the editor's URL policy refuses.
 */

/** Attributes of a custom card: markup a host renders inside the document. */
export interface CustomBlockAttrs {
  /** Raw markup of the card. */
  html?: string;
  /** Stable identifier a host can use to re-open the card's editor. */
  id?: string;
  /** Name of the card template, for instance `"poll"` or `"product"`. */
  kind?: string;
  /** Title shown above the card content. */
  title?: string;
}

/** Attributes of a date node. */
export interface DateAttrs {
  /** ISO 8601 timestamp the label stands for. */
  datetime: string;
  /** Text shown in the document; the timestamp itself when the host gives none. */
  label?: string;
}

/** Attributes of an embed block: a third-party resource rendered by its provider. */
export interface EmbedAttrs {
  /** Raw markup to frame when `provider` is `"custom"`. */
  html?: string;
  /** Provider id, when the provider has one. */
  id?: string;
  /** Poster image shown before the frame loads. */
  poster?: string;
  /** Provider the embed belongs to. */
  provider?: string;
  /** Title of the embedded resource, used as the frame's accessible name. */
  title?: string;
  /** URL of the embedded resource. */
  url?: string;
}

/** Attributes of an emoji node. */
export interface EmojiAttrs {
  /** The literal emoji character. */
  char: string;
  /** Name of the emoji, kept for search and for a text-only export. */
  name?: string;
}

/** Attributes of an inline special-symbol node. */
export interface SymbolAttrs {
  /** The literal character. */
  char: string;
  /** Name of the symbol, kept for search and for a text-only export. */
  name?: string;
}

/** Node names this extension adds, in the order the insert menu shows them. */
export const EXTENDED_NODE_NAMES: readonly string[] = [
  'emoji',
  'symbol',
  'date',
  'embed',
  'custom_block',
];

/** An inline emoji, an atom that occupies one position. */
export const emojiNode: NodeSpec = {
  attrs: {
    char: { default: '' },
    name: { default: null },
  },
  group: 'inline',
  inline: true,
  name: 'emoji',
  selectable: true,
};

/** An inline special symbol, an atom that occupies one position. */
export const symbolNode: NodeSpec = {
  attrs: {
    char: { default: '' },
    name: { default: null },
  },
  group: 'inline',
  inline: true,
  name: 'symbol',
  selectable: true,
};

/** An inline date stamp: the text a reader sees plus the timestamp it stands for. */
export const dateNode: NodeSpec = {
  attrs: {
    datetime: { default: '' },
    label: { default: null },
  },
  group: 'inline',
  inline: true,
  name: 'date',
  selectable: true,
};

/** A block embedding a third-party resource. */
export const embedNode: NodeSpec = {
  attrs: {
    html: { default: null },
    id: { default: null },
    poster: { default: null },
    provider: { default: 'custom' },
    title: { default: null },
    url: { default: null },
  },
  draggable: true,
  group: 'block',
  name: 'embed',
  selectable: true,
};

/** A block holding markup a host renders itself. */
export const customBlockNode: NodeSpec = {
  attrs: {
    html: { default: null },
    id: { default: null },
    kind: { default: 'custom' },
    title: { default: null },
  },
  draggable: true,
  group: 'block',
  name: 'custom_block',
  selectable: true,
};

/** Commands this extension registers, in the shape `editor.commands` exposes. */
export function extendedCommands(
  _context: ExtensionContext,
): Record<string, (options?: Attrs) => Command> {
  return {
    insertCustomBlock: (options) =>
      insertAtom('custom_block', 'block', () => customBlockAttrs(options)),
    insertDate: (options) => insertAtom('date', 'inline', () => dateAttrs(options)),
    insertEmbed: (options) => insertAtom('embed', 'block', () => embedAttrs(options)),
    insertEmbedBlock: (options) => insertAtom('embed', 'block', () => rawEmbedAttrs(options)),
    insertEmoji: (options) => insertAtom('emoji', 'inline', () => charAttrs(options)),
    insertSymbol: (options) => insertAtom('symbol', 'inline', () => charAttrs(options)),
  };
}

/**
 * DOM rules of the extended nodes.
 *
 * Every rule is a *pair*: `attrs` writes what the document holds into `data-` attributes, and
 * `parse` reads the same attributes back. Nothing is rendered as live markup, so a document loaded
 * from storage, pasted from a clipboard or re-parsed after a round trip cannot put script into the
 * page through one of these nodes — a host that wants to render a card does it in its own component,
 * from the attributes it reads.
 */
export function extendedDOMRules(): Partial<DOMRules> {
  return {
    marks: {},
    nodes: {
      custom_block: {
        attrs: (node) => ({
          class: 'rt-custom-block',
          'data-card-id': stringAttr(node, 'id'),
          'data-card-kind': stringAttr(node, 'kind'),
          'data-card-title': stringAttr(node, 'title'),
          'data-html': stringAttr(node, 'html'),
        }),
        parse: (element) => ({
          html: element.getAttribute('data-html'),
          id: element.getAttribute('data-card-id'),
          kind: element.getAttribute('data-card-kind') ?? 'custom',
          title: element.getAttribute('data-card-title'),
        }),
        tag: 'div',
      },
      date: {
        attrs: (node) => ({
          class: 'rt-date',
          'data-datetime': stringAttr(node, 'datetime'),
          'data-label': stringAttr(node, 'label'),
          'data-node': 'date',
        }),
        parse: (element) => {
          const datetime =
            element.getAttribute('datetime') ?? element.getAttribute('data-datetime');

          return datetime === null || datetime === ''
            ? null
            : { datetime, label: element.getAttribute('data-label') ?? element.textContent };
        },
        parseTags: ['time', 'span'],
        tag: 'span',
      },
      embed: {
        attrs: (node) => ({
          class: 'rt-embed',
          'data-embed-html': stringAttr(node, 'html'),
          'data-embed-id': stringAttr(node, 'id'),
          'data-embed-poster': stringAttr(node, 'poster'),
          'data-embed-title': stringAttr(node, 'title'),
          'data-embed-url': stringAttr(node, 'url'),
          'data-node': 'embed',
          'data-provider': stringAttr(node, 'provider') ?? 'custom',
        }),
        parse: (element) => ({
          html: element.getAttribute('data-embed-html'),
          id: element.getAttribute('data-embed-id'),
          poster: element.getAttribute('data-embed-poster'),
          provider: element.getAttribute('data-provider') ?? 'custom',
          title: element.getAttribute('data-embed-title'),
          url: element.getAttribute('data-embed-url'),
        }),
        tag: 'div',
      },
      emoji: {
        attrs: (node) => ({
          class: 'rt-emoji',
          'data-emoji': stringAttr(node, 'char'),
          'data-name': stringAttr(node, 'name'),
          'data-node': 'emoji',
        }),
        parse: (element) => {
          const char = element.getAttribute('data-emoji');

          return char === null || char === ''
            ? null
            : { char, name: element.getAttribute('data-name') };
        },
        parseTags: ['span'],
        tag: 'span',
      },
      symbol: {
        attrs: (node) => ({
          class: 'rt-symbol',
          'data-name': stringAttr(node, 'name'),
          'data-node': 'symbol',
          'data-symbol': stringAttr(node, 'char'),
        }),
        parse: (element) => {
          const char = element.getAttribute('data-symbol');

          return char === null || char === ''
            ? null
            : { char, name: element.getAttribute('data-name') };
        },
        parseTags: ['span'],
        tag: 'span',
      },
    },
  };
}

/**
 * The extension the insert toolbar builds on.
 *
 * It adds the five node specs and their commands. The DOM rules travel separately —
 * {@link extendedDOMRules} — because rules are an option of the view rather than an extension hook,
 * exactly like the media nodes.
 */
export function extendedKit(): Extension {
  return {
    addCommands: extendedCommands,
    addNodes: () => extendedNodes(),
    name: 'extended',
  };
}

/** Every node spec this extension contributes, keyed by name. */
export function extendedNodes(): Record<string, NodeSpec> {
  return {
    custom_block: customBlockNode,
    date: dateNode,
    embed: embedNode,
    emoji: emojiNode,
    symbol: symbolNode,
  };
}

/** Whether a document node holds the extended shape with a usable value. */
export function extendedNodeText(node: DocNode): string {
  const char = stringAttr(node, 'char');

  if (char !== null) {
    return char;
  }

  const label = stringAttr(node, 'label');

  if (label !== null) {
    return label;
  }

  return stringAttr(node, 'title') ?? '';
}

/** Attributes of a char atom, or `null` when the character is missing. */
function charAttrs(options: Attrs | undefined): Attrs | null {
  const char = String(options?.char ?? '').trim();

  return char === ''
    ? null
    : { char, name: options?.name === undefined ? null : String(options.name) };
}

/** Attributes of a custom card. */
function customBlockAttrs(options: Attrs | undefined): Attrs {
  return {
    html: options?.html === undefined ? null : String(options.html),
    id: options?.id === undefined ? null : String(options.id),
    kind: options?.kind === undefined ? 'custom' : String(options.kind),
    title: options?.title === undefined ? null : String(options.title),
  };
}

/** Attributes of a date stamp; the label defaults to the timestamp. */
function dateAttrs(options: Attrs | undefined): Attrs | null {
  const datetime = String(options?.datetime ?? '').trim();

  if (datetime === '') {
    return null;
  }

  const label = options?.label === undefined ? datetime : String(options.label);

  return { datetime, label: label === '' ? datetime : label };
}

/** Attributes of an embed, or `null` when it names neither a resource nor markup. */
function embedAttrs(options: Attrs | undefined): Attrs | null {
  const url = optionalUrl(options?.url);
  const html = options?.html === undefined ? null : String(options.html);

  if (url === null && (html === null || html.trim() === '')) {
    return null;
  }

  return {
    html,
    id: options?.id === undefined ? null : String(options.id),
    poster: optionalUrl(options?.poster),
    provider: options?.provider === undefined ? 'custom' : String(options.provider),
    title: options?.title === undefined ? null : String(options.title),
    url,
  };
}

/** Provider guessed from an embed's markup, `custom` when nothing is recognizable. */
function embedProviderOf(html: string): string {
  const lower = html.toLowerCase();

  for (const [token, provider] of EMBED_PROVIDER_TOKENS) {
    if (lower.includes(token)) {
      return provider;
    }
  }

  return 'custom';
}

/**
 * Inserts one atom: inline at the selection, or after the block the selection is in.
 *
 * The block placement matches `insertHorizontalRule` and the media commands, so every block a
 * toolbar inserts lands in the same place. A command that cannot build its node reports `false`
 * rather than throwing, which is what a toolbar button reads to disable itself.
 */
function insertAtom(name: string, mode: 'block' | 'inline', build: () => Attrs | null): Command {
  return (state, dispatch) => {
    const type = state.schema.nodes[name];
    const attrs = build();

    if (!type || !attrs) {
      return false;
    }

    const node = type.create(attrs);

    if (!dispatch) {
      return true;
    }

    const tr = state.tr;

    if (mode === 'inline') {
      tr.replaceSelectionWith(node);

      if (!tr.docChanged) {
        return false;
      }
    } else {
      const pos = insertPosition(state);

      if (pos === null) {
        return false;
      }

      tr.insert(pos, node);
    }

    tr.setMeta('historyGroup', 'insert');
    dispatch(tr.scrollIntoView());

    return true;
  };
}

/**
 * Where a block atom goes: after the block the selection sits in.
 *
 * A position directly behind a block belongs to the next one, so the atom is inserted in front of
 * that sibling; the end of the parent's content is the one place a block can always be appended to.
 * A selection that is already between two blocks is answered by the block after it.
 */
function insertPosition(state: EditorState): null | number {
  const $from = state.doc.resolve(state.selection.from);
  let depth = $from.depth;

  while (depth > 0 && $from.node(depth).isText) {
    depth--;
  }

  return depth === 0 ? Math.min($from.pos, state.doc.content.size) : $from.after(depth);
}

/**
 * Attributes of an embed built from markup alone, the shape a third-party embed script hands over.
 *
 * The `provider` is read from the markup's own classes so a host does not have to pass it twice.
 */
function rawEmbedAttrs(options: Attrs | undefined): Attrs | null {
  const html = options?.html === undefined ? '' : String(options.html).trim();

  if (html === '') {
    return null;
  }

  const provider =
    options?.provider === undefined ? embedProviderOf(html) : String(options.provider);

  return {
    html,
    id: options?.id === undefined ? null : String(options.id),
    poster: optionalUrl(options?.poster),
    provider,
    title: options?.title === undefined ? null : String(options.title),
    url: optionalUrl(options?.url),
  };
}

/** Markup tokens that identify an embed provider, longest first. */
const EMBED_PROVIDER_TOKENS: readonly (readonly [string, string])[] = [
  ['twitter-tweet', 'twitter'],
  ['platform.twitter', 'twitter'],
  ['instagram-media', 'custom'],
  ['player.bilibili', 'bilibili'],
  ['player.vimeo', 'vimeo'],
  ['youtube.com/embed', 'youtube'],
  ['youtu.be', 'youtube'],
  ['figma.com/embed', 'figma'],
  ['miro.com', 'miro'],
  ['google.com/maps', 'map'],
];

/** Renders one attribute bag, dropping the entries with no value. */
export function attrsOf(entries: Record<string, null | number | string | undefined>): DOMAttrs {
  const attrs: DOMAttrs = {};

  for (const [name, value] of Object.entries(entries)) {
    if (value !== null && value !== undefined && value !== '') {
      attrs[name] = value;
    }
  }

  return attrs;
}

/** Whether a URL could be stored on one of these nodes. */
export function isStorableUrl(url: string): boolean {
  return isSafeUrl(url);
}

/** Attribute of `node` as a string, or `null` when it is absent or empty. */
export function stringAttr(node: DocNode, name: string): null | string {
  const value = node.attr(name);

  return value === undefined || value === null || value === '' ? null : String(value);
}

/** A URL the editor's policy accepts, or `null` when it is absent or refused. */
function optionalUrl(value: unknown): null | string {
  if (value === undefined || value === null || String(value).trim() === '') {
    return null;
  }

  const url = sanitizeUrl(String(value));

  return url === '' ? null : url;
}
