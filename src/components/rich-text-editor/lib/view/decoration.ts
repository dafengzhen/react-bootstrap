import type { Attrs } from '../util/object.ts';

/**
 * Visual state that is not part of the document.
 *
 * Search highlights, spell check marks, syntax colours, collaborator cursors and comments all come
 * and go without being undoable content, so they live beside the document rather than inside it
 * (design §57).
 *
 * ```ts
 * const highlight = Decoration.inline(1, 6, { class: 'search-hit' });
 * const rule = Decoration.node(0, 4, { class: 'flagged' });
 * ```
 */
export interface Decoration {
  /** Attributes the decoration adds to the element it lands on. */
  attrs: Attrs;
  /** First position the decoration covers. */
  from: number;
  /** Last position the decoration covers. */
  to: number;
  /** What the decoration decorates. */
  type: 'inline' | 'node';
}

/** An ordered, immutable set of decorations. */
export class DecorationSet {
  /** Shared empty set. */
  static get empty(): DecorationSet {
    return EMPTY_SET;
  }

  /** Decorations, sorted by their start position. */
  readonly decorations: readonly Decoration[];

  /** Whether the set holds no decorations. */
  get isEmpty(): boolean {
    return this.decorations.length === 0;
  }

  /**
   * Build one through the static factories.
   *
   * @internal
   */
  constructor(decorations: readonly Decoration[] = []) {
    this.decorations = [...decorations].sort((a, b) => a.from - b.from || a.to - b.to);
  }

  /** Builds a set from a list of decorations. */
  static create(decorations: readonly Decoration[]): DecorationSet {
    return decorations.length === 0 ? DecorationSet.empty : new DecorationSet(decorations);
  }

  /** A decoration that adds attributes to the inline content of a range. */
  static inline(from: number, to: number, attrs: Attrs): Decoration {
    return { attrs, from, to, type: 'inline' };
  }

  /** A decoration that adds attributes to the node spanning a range. */
  static node(from: number, to: number, attrs: Attrs): Decoration {
    return { attrs, from, to, type: 'node' };
  }

  /** The set with `decoration` added. */
  add(decoration: Decoration): DecorationSet {
    return new DecorationSet([...this.decorations, decoration]);
  }

  /** Decorations that overlap `[from, to)`. */
  between(from: number, to: number, type?: Decoration['type']): Decoration[] {
    return this.decorations.filter(
      (decoration) =>
        (type === undefined || decoration.type === type) &&
        decoration.to > from &&
        decoration.from < to,
    );
  }

  /** The set without `decoration`. */
  remove(decoration: Decoration): DecorationSet {
    return new DecorationSet(this.decorations.filter((existing) => existing !== decoration));
  }
}

/** Backing instance for {@link DecorationSet.empty}. */
const EMPTY_SET = new DecorationSet([]);

/** Attributes of every inline decoration covering `pos`, in order. */
export function inlineAttrsAt(set: DecorationSet | undefined, pos: number): Attrs[] {
  if (!set) {
    return [];
  }

  return set.decorations
    .filter(
      (decoration) => decoration.type === 'inline' && decoration.from <= pos && pos < decoration.to,
    )
    .map((decoration) => decoration.attrs);
}
