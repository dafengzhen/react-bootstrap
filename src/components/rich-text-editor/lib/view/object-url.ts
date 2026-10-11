/**
 * Ownership of the object URLs a view creates.
 *
 * A dropped or pasted file becomes a `blob:` URL — the only way to show a picture that has not been
 * uploaded anywhere — and that URL pins the file in memory until somebody revokes it. The view is
 * not the owner in a useful sense: the same file can be dropped twice, a node can be replaced by an
 * undo, and an editor can be destroyed with a preview still on screen, so without an owner that
 * answers "who releases this, and when" every preview a user ever created stays alive for the
 * lifetime of the document.
 *
 * This registry is that owner: a URL is acquired once per source file, shared between the node
 * views that show it, and released when the last of them goes away. `revokeAll` is what
 * `EditorView.destroy` calls, because at that point nothing can still be showing the file.
 *
 * ```ts
 * const urls = new ObjectUrlRegistry();
 * const preview = urls.acquire(file);   // one URL per file, however often it is dropped
 *
 * urls.release(preview);                // revokes when the last holder lets go
 * urls.revokeAll();                     // the view is going away
 * ```
 */
export class ObjectUrlRegistry {
  /** Number of URLs that are currently alive; used by tests and diagnostics. */
  get size(): number {
    return this.counts.size;
  }

  /** URL per file, so dropping one file twice shows the same preview. */
  private readonly bySource = new Map<Blob, string>();

  /** How many holders each URL has. */
  private readonly counts = new Map<string, number>();

  /**
   * URL that shows `blob`, creating it on first use.
   *
   * Returns an empty string when the environment has no `URL.createObjectURL` — a server render or
   * a test realm — so a caller can fall back instead of throwing.
   */
  acquire(blob: Blob): string {
    const existing = this.bySource.get(blob);

    if (existing !== undefined) {
      this.counts.set(existing, (this.counts.get(existing) ?? 0) + 1);

      return existing;
    }

    const url = createUrl(blob);

    if (url !== '') {
      this.bySource.set(blob, url);
      this.counts.set(url, 1);
    }

    return url;
  }

  /** Gives one holder's claim back, revoking the URL when it was the last one. */
  release(url: string): void {
    const count = this.counts.get(url);

    if (count === undefined) {
      return;
    }

    if (count > 1) {
      this.counts.set(url, count - 1);

      return;
    }

    this.counts.delete(url);
    this.forgetSource(url);
    revokeUrl(url);
  }

  /** Revokes every URL; the view that created them is going away. */
  revokeAll(): void {
    // Iterating the live key set is safe here: `revokeUrl` touches the browser, not this map, and
    // the map is cleared once, after the loop.
    for (const url of this.counts.keys()) {
      revokeUrl(url);
    }

    this.counts.clear();
    this.bySource.clear();
  }

  /** Drops the `blob` to URL entry of a URL that is being revoked. */
  private forgetSource(url: string): void {
    for (const [blob, mapped] of this.bySource) {
      if (mapped === url) {
        this.bySource.delete(blob);

        return;
      }
    }
  }
}

/** Whether this realm can create object URLs at all. */
export function canCreateObjectUrl(): boolean {
  return typeof URL !== 'undefined' && typeof URL.createObjectURL === 'function';
}

/** `URL.createObjectURL(blob)`, or an empty string when the realm has no object URLs. */
export function createUrl(blob: Blob): string {
  return canCreateObjectUrl() ? URL.createObjectURL(blob) : '';
}

/** `URL.revokeObjectURL(url)`, ignoring a realm that cannot create them. */
export function revokeUrl(url: string): void {
  if (typeof URL !== 'undefined' && typeof URL.revokeObjectURL === 'function') {
    URL.revokeObjectURL(url);
  }
}
