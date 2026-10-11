import type { KeyEventLike } from '../state/plugin.ts';

/**
 * Shortcut string of a key event, in the `Shift-Mod-z` form keymaps are written in.
 *
 * The core never sees a real `KeyboardEvent`; this is the one place that decides how
 * an observation made by a view turns into a keymap lookup.
 *
 * ```ts
 * keyName({ ctrlKey: true, key: 'b' });        // "Mod-b"
 * keyName({ key: 'Enter', shiftKey: true });   // "Shift-Enter"
 * ```
 */
export function keyName(event: KeyEventLike): string {
  const parts: string[] = [];

  if (event.shiftKey) {
    parts.push('Shift');
  }

  if (event.ctrlKey || event.metaKey) {
    parts.push('Mod');
  }

  if (event.altKey) {
    parts.push('Alt');
  }

  const key = event.key ?? '';

  if (key.length === 0) {
    return parts.join('-');
  }

  // A shifted letter arrives upper case, so a single character is folded down; named
  // keys such as `Enter` or `Backspace` keep their spelling.
  parts.push(key.length === 1 ? key.toLowerCase() : key);

  return parts.join('-');
}
