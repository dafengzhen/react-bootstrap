import type { Fragment } from '../model/fragment.ts';
import type { NodeType } from '../model/node-type.ts';

import { ErrorCode, schemaError } from '../util/errors.ts';

/** Compiled automaton for one content expression. */
export interface CompiledNFA {
  /** Id of the accepting state. */
  readonly accept: number;
  /** Id of the initial state. */
  readonly start: number;
  /** All states, indexed by id. */
  readonly states: readonly NFAState[];
}

/** Parsed content expression. */
export type ContentExpressionAST = readonly TermSpec[];

/** One state of the compiled automaton. */
export interface NFAState {
  /** Whether the content may end in this state. */
  readonly end: boolean;
  /** Human readable origin, used for diagnostics. */
  readonly label: string;
  /** Outgoing transitions. */
  readonly transitions: readonly NFATransition[];
}

/** A transition of the compiled automaton. */
export interface NFATransition {
  /** Group name, when the transition was declared with one. */
  readonly group: null | string;
  /** Resolved node types accepted by this transition. */
  readonly resolved: readonly NodeType[];
  /** Target state id. */
  readonly to: number;
}

/** Quantifier suffixes accepted by a content expression. */
export type Quantifier =
  | '?'
  | ''
  | '*'
  | '+'
  | `{${number},}`
  | `{${number},${number}}`
  | `{${number}}`;

/** A single term of a content expression. */
export interface TermSpec {
  /** Quantifier applied to the term. */
  quantifier: Quantifier;
  /** Type names or group names accepted by this term. */
  types: readonly string[];
}

/** One alternative of a term: either resolved node types or an unresolved group. */
export interface TypeClass {
  /** Group name, if the alternative named a group. */
  readonly group: null | string;
  /** Resolved node types, if the alternative named a type. */
  readonly types: null | readonly NodeType[];
}

const QUANTIFIER_RE = /^(?:\*|\+|(?:\?)|(?:\{\d+(?:,\d*)?\}))$/;
const QUANTIFIER_AT_RE = /^(?:[*+?]|\{[^}]*\})/;
const TERM_RE = /^[A-Za-z0-9_$]+(?:\s*\|\s*[A-Za-z0-9_$]+)*/;

/**
 * Resolved content model of a node type: the expression compiled into an automaton whose state ids
 * answer what the transform layer asks — may this type go here
 * ({@link ContentMatch.matchType}), is the content complete ({@link ContentMatch.validEnd}), what
 * has to wrap it ({@link ContentMatch.findWrapping}).
 */
export class ContentExpression {
  /** Static form of {@link ContentExpression.emptyMatch}, for schema construction. */
  static get empty(): ContentMatch {
    return ContentMatch.empty;
  }

  /** Compiled automaton. */
  readonly nfa: CompiledNFA;

  /** Original expression, kept for diagnostics and serialization. */
  readonly source: string;

  /** Parsed terms. */
  readonly terms: ContentExpressionAST;

  /** Type class per term, resolved against the schema. */
  readonly termTypes: readonly (readonly TypeClass[])[];

  /** Whether zero nodes satisfy the expression. */
  get allowsEmpty(): boolean {
    return this.terms.every((term) => quantifierRange(term.quantifier).min === 0);
  }

  /** Every node type the expression can accept, resolving groups on demand. */
  get allTypes(): readonly NodeType[] {
    if (!this.cachedAllTypes) {
      const names = new Set<string>();
      const result: NodeType[] = [];
      const add = (type: NodeType): void => {
        if (!names.has(type.name)) {
          names.add(type.name);
          result.push(type);
        }
      };

      for (const typeClasses of this.termTypes) {
        for (const typeClass of typeClasses) {
          for (const type of typeClass.types ?? []) {
            add(type);
          }
        }
      }

      for (const state of this.nfa.states) {
        for (const transition of state.transitions) {
          for (const type of transition.resolved) {
            add(type);
          }

          if (transition.group) {
            for (const type of this.resolveGroup(transition.group)) {
              add(type);
            }
          }
        }
      }

      this.cachedAllTypes = result;
    }

    return this.cachedAllTypes;
  }

  /** A match that accepts nothing at all. */
  get emptyMatch(): ContentMatch {
    return ContentMatch.empty;
  }

  /** Whether the expression accepts no content at all. */
  get isEmpty(): boolean {
    return this.terms.length === 0;
  }

  /** Start state of the automaton. */
  get startMatch(): ContentMatch {
    return new ContentMatch(this, [this.nfa.start]);
  }

  /** Number of terms. */
  get termCount(): number {
    return this.terms.length;
  }

  private cachedAllTypes: null | readonly NodeType[] = null;

  /** Groups declared by the expression, resolved against the schema. */
  private readonly resolveGroup: (group: string) => readonly NodeType[];

  constructor(
    source: string,
    terms: ContentExpressionAST,
    resolveType: (name: string) => NodeType | undefined,
    resolveGroup: (group: string) => readonly NodeType[],
  ) {
    this.source = source;
    this.terms = terms;
    this.resolveGroup = resolveGroup;
    this.termTypes = terms.map((term) =>
      term.types.map((name) => {
        const type = resolveType(name);

        return type ? { group: null, types: [type] } : { group: name, types: null };
      }),
    );

    for (const [index, typeClasses] of this.termTypes.entries()) {
      if (typeClasses.length === 0) {
        throw schemaError(
          ErrorCode.INVALID_CONTENT_EXPRESSION,
          `Content expression "${source}" refers to unknown type or group "${terms[index]!.types.join(', ')}"`,
          { expression: source, names: terms[index]!.types },
        );
      }
    }

    this.nfa = buildAutomaton(terms, this.termTypes);
  }

  /** Whether `type` can appear anywhere in this expression. */
  allowsType(type: NodeType): boolean {
    return this.allTypes.includes(type);
  }

  /** Node types of a group declared in this schema. */
  groupTypes(group: string): readonly NodeType[] {
    return this.resolveGroup(group);
  }

  toString(): string {
    return this.source || '(empty content)';
  }

  /** Types declared by term `index`, resolving groups on demand. */
  typesAt(index: number): readonly NodeType[] {
    return (this.termTypes[index] ?? []).flatMap((typeClass) => typeClass.types ?? []);
  }

  /**
   * Verifies that every group the expression mentions resolves to at least one node type; `Schema`
   * calls it once the whole spec is known, because groups are filled in while the schema is built.
   *
   * @internal
   */
  validate(): void {
    for (const typeClasses of this.termTypes) {
      for (const typeClass of typeClasses) {
        if (typeClass.group && this.resolveGroup(typeClass.group).length === 0) {
          throw schemaError(
            ErrorCode.INVALID_CONTENT_EXPRESSION,
            `Content expression "${this.source}" refers to unknown group "${typeClass.group}"`,
            { expression: this.source, group: typeClass.group },
          );
        }
      }
    }
  }
}

/**
 * A state in the content matching automaton. Positions are plain state ids, so matches are cheap to
 * compare, join and keep inside a transaction.
 */
export class ContentMatch {
  /** A match that accepts no content. */
  static get empty(): ContentMatch {
    return EMPTY_MATCH;
  }

  /** Expression this match belongs to. */
  readonly expression: ContentExpression;

  /** Active automaton state ids. */
  readonly positions: readonly number[];

  /** Whether the content may end in this state. */
  readonly validEnd: boolean;

  /** Node types that may be inserted here. */
  get allowedTypes(): readonly NodeType[] {
    if (!this.cachedAllowed) {
      const names = new Set<string>();
      const result: NodeType[] = [];
      const add = (type: NodeType): void => {
        if (!names.has(type.name)) {
          names.add(type.name);
          result.push(type);
        }
      };

      for (const id of this.positions) {
        for (const transition of this.expression.nfa.states[id]!.transitions) {
          for (const type of transition.resolved) {
            add(type);
          }

          if (transition.group) {
            for (const type of this.expression.groupTypes(transition.group)) {
              add(type);
            }
          }
        }
      }

      this.cachedAllowed = result;
    }

    return this.cachedAllowed;
  }

  /** Whether zero nodes already satisfy the content model at this position. */
  get allowsEmpty(): boolean {
    return (
      this.positions.length === 1 &&
      this.positions[0] === this.expression.nfa.start &&
      this.expression.allowsEmpty
    );
  }

  /**
   * Types that can start filling this state: one already satisfiable by nothing — a textblock, an
   * atom, a wrapper with only optional content — before a container needing content of its own. It
   * is the type `Transform` creates when it has to fill a hole.
   */
  get defaultType(): NodeType | null {
    if (this.cachedDefault !== undefined) {
      return this.cachedDefault;
    }

    this.cachedDefault = this.computeDefaultType(new Set());

    return this.cachedDefault;
  }

  /** Whether more than one alternative is alive; used by tests and diagnostics. */
  get isAmbiguous(): boolean {
    return this.positions.length > 1;
  }

  /** Whether nothing can be inserted here. */
  get isEmpty(): boolean {
    return this.positions.length === 0;
  }

  private cachedAllowed: null | readonly NodeType[] = null;

  private cachedDefault: NodeType | null | undefined = undefined;

  constructor(expression: ContentExpression, positions: readonly number[]) {
    this.expression = expression;
    this.positions = positions;
    this.validEnd = positions.some((id) => expression.nfa.states[id]!.end);
  }

  /** Whether `type` may be inserted here. */
  allows(type: NodeType): boolean {
    for (const id of this.positions) {
      for (const transition of this.expression.nfa.states[id]!.transitions) {
        if (transitionAccepts(transition, type)) {
          return true;
        }
      }
    }

    return false;
  }

  /**
   * Whether the content `[from, to)` of a node using this model can be replaced by `content`.
   *
   * It walks the sequence like a parser: consume the first `from` children, feed the inserted
   * content to `matchType`, then replay the children after `to`, which rejects a replacement that
   * fits locally but leaves an unfillable hole behind it.
   *
   * @param content - the node's existing children
   * @param from - index of the first replaced child
   * @param to - index after the last replaced child
   * @param inserted - content that takes their place
   */
  canReplace(from: number, to: number, content: Fragment, inserted: Fragment): boolean {
    if (from > to || to > content.childCount) {
      return false;
    }

    const children = [
      ...content.children.slice(0, from),
      ...inserted.children,
      ...content.children.slice(to),
    ];
    const match = children.reduce<ContentMatch | null>(
      (current, child) => current?.matchType(child.type) ?? null,
      this,
    );

    return match !== null && match.validEnd;
  }

  /** Structural comparison. */
  eq(other: ContentMatch | null | undefined): boolean {
    if (!other) {
      return false;
    }

    if (this === other) {
      return true;
    }

    return (
      this.expression === other.expression &&
      this.positions.length === other.positions.length &&
      this.positions.every((id, index) => id === other.positions[index])
    );
  }

  /**
   * Types that have to be created around `type` for it to fit here, or `null` when no amount of
   * wrapping works. The list holds the outermost wrapper first and `type` last, the order the
   * levels have to be created in.
   */
  findWrapping(type: NodeType): { before: number; types: readonly NodeType[] } | null {
    if (this.validEndAt(type)) {
      return { before: 1, types: [type] };
    }

    for (const wrapper of this.allowedTypes) {
      if (wrapper.isText || wrapper === type || !wrapper.contentMatch.allows(type)) {
        continue;
      }

      if (wrapper.contentMatch.validEndAt(type)) {
        return { before: 1, types: [wrapper, type] };
      }

      const nested = wrapper.contentMatch.findWrapping(type);

      if (nested && nested.types[nested.types.length - 1] === type) {
        return { before: nested.before + 1, types: [wrapper, ...nested.types] };
      }
    }

    return null;
  }

  /** State after consuming `type`, or `null` when the type cannot appear here. */
  matchType(type: NodeType): ContentMatch | null {
    const next = this.nextPositions(type);

    return next === null ? null : new ContentMatch(this.expression, next);
  }

  toString(): string {
    return `ContentMatch(${this.expression.toString()})[${this.positions.join(',')}]`;
  }

  /** Whether `type` may be inserted here and immediately complete the content. */
  validEndAt(type: NodeType): boolean {
    const next = this.nextPositions(type);

    return next !== null && next.some((id) => this.expression.nfa.states[id]!.end);
  }

  private computeDefaultType(seen: Set<ContentExpression>): NodeType | null {
    if (seen.has(this.expression)) {
      return null;
    }

    seen.add(this.expression);

    for (const type of this.allowedTypes) {
      if (isImmediatelyUsable(type, new Set(seen))) {
        return type;
      }
    }

    return null;
  }

  private nextPositions(type: NodeType): null | number[] {
    const targets = new Set<number>();

    for (const id of this.positions) {
      for (const transition of this.expression.nfa.states[id]!.transitions) {
        if (transitionAccepts(transition, type)) {
          targets.add(transition.to);
        }
      }
    }

    return targets.size === 0 ? null : [...targets].sort((a, b) => a - b);
  }
}

/**
 * Parses a content expression into an AST.
 *
 * ```text
 * expression := term* | term := name ( "|" name )* quantifier?
 * quantifier := "*" | "+" | "?" | "{" n "}" | "{" n ",}" | "{" n "," m "}"
 *
 * "block+" doc | "inline*" paragraph, heading | "list_item+" bullet_list, ordered_list, task_list
 * "paragraph block*" list_item, task_item, table_cell | "table_row+" table
 * "paragraph | heading" alternatives | "" atoms (image, horizontal_rule, ...)
 * ```
 */
export function parseContentExpression(source: string): ContentExpressionAST {
  const terms: TermSpec[] = [];
  let index = 0;

  const skipSpace = () => {
    while (source[index] === ' ' || source[index] === '\n' || source[index] === '\t') {
      index++;
    }
  };

  while (index < source.length) {
    skipSpace();

    if (index >= source.length) {
      break;
    }

    const rest = source.slice(index);
    const termMatch = TERM_RE.exec(rest);

    if (!termMatch) {
      throw schemaError(
        ErrorCode.INVALID_CONTENT_EXPRESSION,
        `Invalid content expression "${source}": unexpected "${rest}"`,
        { expression: source, rest },
      );
    }

    const types = termMatch[0]
      .split('|')
      .map((name) => name.trim())
      .filter(Boolean);

    index += termMatch[0].length;

    let quantifier: Quantifier = '';
    const quantifierMatch = QUANTIFIER_AT_RE.exec(source.slice(index));

    if (quantifierMatch) {
      const candidate = quantifierMatch[0];

      if (!QUANTIFIER_RE.test(candidate)) {
        throw schemaError(
          ErrorCode.INVALID_CONTENT_EXPRESSION,
          `Invalid quantifier "${candidate}" in content expression "${source}"`,
          { expression: source, quantifier: candidate },
        );
      }

      quantifier = candidate as Quantifier;
      index += candidate.length;
    }

    terms.push({ quantifier, types });
  }

  return terms;
}

/** Lower and upper occurrence bounds of a quantifier. */
export function quantifierRange(quantifier: Quantifier): { max: number; min: number } {
  switch (quantifier) {
    case '':
      return { max: 1, min: 1 };
    case '?':
      return { max: 1, min: 0 };
    case '*':
      return { max: Infinity, min: 0 };
    case '+':
      return { max: Infinity, min: 1 };
    default: {
      const parts = quantifier.slice(1, -1).split(',');
      const min = Number(parts[0]);
      const max = parts.length === 1 ? min : parts[1] === '' ? Infinity : Number(parts[1]);

      return { max, min };
    }
  }
}

const EMPTY_MATCH = new ContentMatch(
  new ContentExpression(
    '',
    [],
    () => undefined,
    () => [],
  ),
  [],
);

/**
 * Builds the automaton for one content expression.
 *
 * Terms are laid out right to left: a term expands into its mandatory repetitions then its optional
 * ones, and the last repetition of an unbounded term loops back to the term's first state, turning
 * the finite chain into `+`, `*` and `{n,}`. The `end` flag is propagated backwards over the empty
 * transitions: a state may end when the accepting state is reachable from it consuming nothing else
 * — the `validEnd` question the transform layer asks before it stops inserting content.
 */
function buildAutomaton(
  terms: ContentExpressionAST,
  termTypes: readonly (readonly TypeClass[])[],
): CompiledNFA {
  const states: { end: boolean; label: string; transitions: NFATransition[] }[] = [];

  const push = (label: string): number => {
    states.push({ end: false, label, transitions: [] });
    return states.length - 1;
  };

  const accept = push('accept');
  states[accept]!.end = true;

  /**
   * Builds one term in front of `tail`.
   *
   * Each state's flag answers "may the content stop here?", derived from the term structure: a
   * repetition that may run for ever only lets the content stop once the term itself may finish, so
   * the entry of `block+` is not a valid end while its repeating state is.
   */
  const buildTerm = (
    index: number,
    tail: { canEnd: boolean; state: number },
  ): { canEnd: boolean; state: number } => {
    const typeClasses = termTypes[index]!;
    const { max, min } = quantifierRange(terms[index]!.quantifier);
    const label = `term${index}`;
    const transition = (to: number): NFATransition => ({
      group: typeClasses.length === 1 ? typeClasses[0]!.group : null,
      resolved: typeClasses.flatMap((typeClass) => typeClass.types ?? []),
      to,
    });

    /** Straight chain of `count` occurrences ending in `endState`. */
    const chain = (count: number, endState: number): number => {
      let next = endState;

      for (let i = 0; i < count; i++) {
        const state = push(`${label}#${i}`);
        states[state]!.transitions.push(transition(next));
        states[state]!.end = i === 0 && tail.canEnd;
        next = state;
      }

      return next;
    };

    if (min === 0 || max === Infinity) {
      // `x+` is `x x*` and `x*` is `x? x*`: an entry that either takes one occurrence or moves
      // straight to the tail, in front of a state that repeats itself. The entry of a mandatory
      // repetition is *not* a valid end, which keeps `block+ paragraph` from stopping after the
      // blocks.
      const loop = push(`${label}*`);
      states[loop]!.transitions.push(transition(loop), transition(tail.state));
      states[loop]!.end = tail.canEnd;

      const entry = push(`${label}?`);
      states[entry]!.transitions.push(
        transition(loop),
        ...(min === 0 ? [transition(tail.state)] : []),
      );
      states[entry]!.end = min === 0 ? tail.canEnd : false;

      return { canEnd: min === 0 ? tail.canEnd : false, state: chain(min - 1, entry) };
    }

    return { canEnd: tail.canEnd, state: chain(min, tail.state) };
  };

  let tail: { canEnd: boolean; state: number } = { canEnd: true, state: accept };

  for (let index = terms.length - 1; index >= 0; index--) {
    tail = buildTerm(index, tail);
  }

  return {
    accept,
    start: tail.state,
    states: states.map((state) => ({
      end: state.end,
      label: state.label,
      transitions: state.transitions,
    })),
  };
}

/**
 * Whether a type can be created without any further nesting decision.
 *
 * A leaf, or a type whose content may be empty, is immediately usable; the text type is not,
 * because a filler is built without characters. A container qualifies when the type it defaults to
 * qualifies too, which makes `list_item` usable inside a list though its own content model is not
 * optional.
 */
function isImmediatelyUsable(type: NodeType, seen: Set<ContentExpression>): boolean {
  if (type.isText) {
    return false;
  }

  if (type.isLeaf || type.contentMatch.allowsEmpty) {
    return true;
  }

  if (seen.has(type.contentMatch.expression)) {
    return false;
  }

  seen.add(type.contentMatch.expression);

  const inner = type.contentMatch.defaultType;

  return !!inner && inner !== type && isImmediatelyUsable(inner, seen);
}

function transitionAccepts(transition: NFATransition, type: NodeType): boolean {
  if (transition.group) {
    return type.inGroup(transition.group);
  }

  return transition.resolved.includes(type);
}
