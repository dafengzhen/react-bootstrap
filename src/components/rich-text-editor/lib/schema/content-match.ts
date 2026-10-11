/**
 * Content matching is implemented together with content expressions, because the automaton and
 * its match states are two halves of the same data structure.
 *
 * This module is the stable import path for the model, transform and normalization layers.
 */
export {
  ContentExpression,
  ContentMatch,
  parseContentExpression,
  quantifierRange,
} from './content-expression.ts';

export type {
  CompiledNFA,
  ContentExpressionAST,
  NFAState,
  NFATransition,
  Quantifier,
  TermSpec,
  TypeClass,
} from './content-expression.ts';
