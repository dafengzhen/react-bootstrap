import type { Node } from '../model/node.ts';

/** Result of applying a step to a document. */
export class StepResult {
  /** Shared result of a step that changed nothing; `doc` and `failed` are both `null`. */
  static get ok(): StepResult {
    return OK;
  }

  /** Document produced by the step, when it succeeded. */
  readonly doc: Node | null;

  /** Why the step failed, when it did; `null` when it succeeded. */
  readonly failed: null | string;

  /** Whether the step produced a document. */
  get succeeded(): boolean {
    return this.failed === null && this.doc !== null;
  }

  /**
   * Step results are built through the static factories.
   *
   * @internal
   */
  constructor(doc: Node | null, failed: null | string) {
    this.doc = doc;
    this.failed = failed;
  }

  /** The step could not be applied for the given reason. */
  static fail(message: string): StepResult {
    return new StepResult(null, message);
  }

  /** The step produced `doc`. */
  static from(doc: Node): StepResult {
    return new StepResult(doc, null);
  }
}

const OK = new StepResult(null, null);

/** Reason a group of steps failed, with the failing step for diagnostics. */
export interface StepFailure {
  /** Index of the failing step inside the group. */
  index: number;
  /** Human readable reason. */
  message: string;
}
