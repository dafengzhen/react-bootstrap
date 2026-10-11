/**
 * The editor's copy, and where a host replaces it.
 *
 * The kernel ships no translation system and picks no language: it ships only the text a rich text
 * editor cannot avoid writing into the DOM — the accessible name of the edit area and the
 * placeholder — and every one of those is a named slot here, so nothing the editor writes is an
 * unreplaceable literal. A slot set to `null` is *omitted* rather than defaulted, which is how a
 * host says "name this control yourself": the view then leaves `aria-label` off entirely and the
 * element's own `aria-label` or `aria-labelledby` takes over.
 *
 * ```ts
 * new Editor({ element: '#editor', extensions: [StarterKit], locale: { label: '正文编辑器' } });
 * ```
 *
 * Three boundaries are deliberate, and they are what keep this file small:
 *
 * - **Codes are not copy.** An error carries an `ErrorCode` and its details; the text a user reads
 *   comes from the host. See `src/util/errors.ts`.
 * - **The document is not copy.** Text a user typed is content, and is never routed through here.
 * - **Upload UI is not copy.** Progress, retry and failure states belong to the application that
 *   owns the storage provider: the upload plugin publishes status (`uploadsOf`) and the host
 *   renders it in its own words. The kernel has no string and no slot to contribute.
 */

/**
 * Every piece of copy the editor writes into the DOM.
 *
 * Fields are optional; whatever a host leaves out keeps the default below, so an app that does not
 * care still gets a usable, accessible editor — not because English is the editor's language.
 */
export interface EditorLocale {
  /**
   * Accessible name of the edit area, written as `aria-label`.
   *
   * Default: `"Rich text editor"`. A control with no name is announced as an unnamed text field, so
   * the default exists to avoid that; a host with a real field label either sets its own text or
   * passes `null` to leave the attribute off and name the control through the host element's own
   * `aria-label` / `aria-labelledby`.
   */
  label?: null | string;
  /**
   * Shown while the document is empty.
   *
   * Applied as `data-placeholder`, which is what a stylesheet keys off. Default: none, so no
   * placeholder attribute appears at all.
   */
  placeholder?: null | string;
  /**
   * Value of the root's `translate` attribute.
   *
   * `"no"` (the default) tells a browser's translation feature to leave the edit area alone, since
   * translating it would rewrite the document. Set `"yes"` when the editable content is meant to be
   * translated.
   */
  translate?: 'no' | 'yes' | null;
}

/** Every slot filled in, with `null` meaning "omit". */
export interface ResolvedEditorLocale {
  /** @see {@link EditorLocale.label} */
  label: null | string;
  /** @see {@link EditorLocale.placeholder} */
  placeholder: null | string;
  /** @see {@link EditorLocale.translate} */
  translate: 'no' | 'yes' | null;
}

/**
 * The defaults, as data.
 *
 * Exported so a host can build on them — `{ ...defaultLocale, label: '正文' }` — instead of restating
 * every slot to change one.
 */
export const defaultLocale: ResolvedEditorLocale = {
  label: 'Rich text editor',
  placeholder: null,
  translate: 'no',
};

/**
 * Fills in a host's copy over the defaults.
 *
 * A `null` override survives, because "omit this" is a decision and `undefined` is not: only a
 * field a host never mentioned falls back.
 *
 * @param locale - copy the host supplied, if any
 */
export function resolveLocale(locale?: EditorLocale): ResolvedEditorLocale {
  if (!locale) {
    return defaultLocale;
  }

  return {
    label: locale.label === undefined ? defaultLocale.label : locale.label,
    placeholder: locale.placeholder === undefined ? defaultLocale.placeholder : locale.placeholder,
    translate: locale.translate === undefined ? defaultLocale.translate : locale.translate,
  };
}
