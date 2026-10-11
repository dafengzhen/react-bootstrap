/**
 * The DOM listeners one view owns.
 *
 * A view binds a dozen listeners across two targets — the editable host and the document — and
 * every one has to be removed again, exactly once, when the view goes away. An array plus a `for`
 * loop in `destroy` makes that a rule three places have to remember (`bindEvents`, `destroy`, and
 * whatever is added later); this class is the rule instead, since registering is binding and
 * {@link ViewListeners.destroy} is the only way to unbind.
 *
 * ```ts
 * const listeners = new ViewListeners();
 *
 * listeners.on(host, 'keydown', (event) => { ... });
 * listeners.destroy(); // every listener, once
 * ```
 */
export class ViewListeners {
  /** Number of live listeners; used by tests and diagnostics. */
  get size(): number {
    return this.bound.length;
  }

  /** Registered listeners, in the order they were bound. */
  private readonly bound: [EventTarget, string, EventListener][] = [];

  /** Whether {@link ViewListeners.destroy} has run. */
  private destroyed = false;

  /** Targets currently bound to, so a duplicate registration can be recognised. */
  private readonly seen = new WeakMap<EventTarget, Map<string, Set<EventListener>>>();

  /** Removes every listener that was bound. Safe to call more than once. */
  destroy(): void {
    for (const [target, type, listener] of this.bound) {
      target.removeEventListener(type, listener);
    }

    this.bound.length = 0;
    this.destroyed = true;
  }

  /**
   * Binds `listener` and returns a function that removes just this one.
   *
   * Binding the same triple twice is a no-op, because two identical registrations are always a
   * mistake: the browser would call the listener twice per event and `destroy` would remove it
   * once.
   */
  on(target: EventTarget, type: string, listener: EventListener): () => void {
    if (this.destroyed || this.has(target, type, listener)) {
      return () => {
        // nothing was bound
      };
    }

    this.remember(target, type, listener);
    this.bound.push([target, type, listener]);
    target.addEventListener(type, listener);

    return () => this.off(target, type, listener);
  }

  /** Whether this exact triple is currently bound. */
  private has(target: EventTarget, type: string, listener: EventListener): boolean {
    return this.seen.get(target)?.get(type)?.has(listener) === true;
  }

  /** Unbinds one triple, whether or not the view is being destroyed. */
  private off(target: EventTarget, type: string, listener: EventListener): void {
    if (!this.has(target, type, listener)) {
      return;
    }

    this.seen.get(target)?.get(type)?.delete(listener);
    target.removeEventListener(type, listener);

    const index = this.bound.findIndex(
      ([boundTarget, boundType, boundListener]) =>
        boundTarget === target && boundType === type && boundListener === listener,
    );

    if (index >= 0) {
      this.bound.splice(index, 1);
    }
  }

  /** Records one binding in the lookup that {@link ViewListeners.has} reads. */
  private remember(target: EventTarget, type: string, listener: EventListener): void {
    const byType = this.seen.get(target) ?? new Map<string, Set<EventListener>>();
    const listeners = byType.get(type) ?? new Set<EventListener>();

    listeners.add(listener);
    byType.set(type, listeners);
    this.seen.set(target, byType);
  }
}
