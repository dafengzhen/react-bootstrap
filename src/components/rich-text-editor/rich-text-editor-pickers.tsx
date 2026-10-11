import clsx from 'clsx';
import { useMemo, useState } from 'react';

import type {
  RichTextEditorEmojiGroup,
  RichTextEditorSymbolGroup,
} from './rich-text-editor-data.ts';

import { useRichTextEditor } from './rich-text-editor-context';
import { EMOJI_GROUPS, SYMBOL_GROUPS } from './rich-text-editor-data.ts';
import styles from './rich-text-editor.module.css';

/**
 * The emoji and symbol pickers.
 *
 * Both insert an atom rather than text: an emoji becomes an `emoji` node and a symbol a `symbol`
 * node, so the document keeps the *meaning* of what was inserted — a name to search for — instead of
 * a run of characters a reader can no longer tell apart from what the author typed.
 *
 * A picker is a panel of the toolbar rather than a dialog, because inserting is the whole
 * interaction: one click, no confirm step.
 */

/** The emoji panel of the toolbar, wired to the `emoji` node. */
export function EmojiPanel() {
  const { run } = useRichTextEditor();

  return (
    <EmojiPicker
      onInsert={(char, name) => {
        run('insertEmoji', { char, name });
      }}
    />
  );
}

/** Emoji picker: a searchable, grouped grid. */
export function EmojiPicker({ onInsert }: { onInsert: (char: string, name: string) => void }) {
  const [query, setQuery] = useState('');
  const [group, setGroup] = useState<string>(EMOJI_GROUPS[0]?.key ?? '');

  const filtered = useMemo(() => filterGroups(EMOJI_GROUPS, query), [query]);
  const visible = query === '' ? filtered.filter((entry) => entry.key === group) : filtered;

  return (
    <div className={styles.picker}>
      <div className={styles.pickerSearch}>
        <input
          aria-label="Search emoji"
          className="form-control form-control-sm"
          onChange={(event) => setQuery(event.target.value)}
          onPointerDown={(event) => event.stopPropagation()}
          placeholder="Search emoji"
          type="search"
          value={query}
        />
      </div>
      {query === '' ? (
        <div aria-label="Emoji groups" className={styles.pickerTabs}>
          {EMOJI_GROUPS.map((entry) => (
            <button
              aria-pressed={entry.key === group}
              className={clsx('btn', 'btn-sm', styles.pickerTab, entry.key === group && 'active')}
              key={entry.key}
              onClick={() => setGroup(entry.key)}
              onPointerDown={(event) => event.preventDefault()}
              type="button"
            >
              {entry.label}
            </button>
          ))}
        </div>
      ) : null}
      <div className={styles.pickerBody}>
        {visible.length === 0 ? (
          <p className={styles.pickerEmpty}>No emoji matches “{query}”</p>
        ) : (
          visible.map((entry) => (
            <div className={styles.pickerGroup} key={entry.key}>
              {query === '' ? <div className={styles.panelHeading}>{entry.label}</div> : null}
              <div className={styles.emojiGrid}>
                {entry.emojis.map((emoji) => (
                  <button
                    aria-label={`Emoji ${emoji.name}`}
                    className={styles.emoji}
                    key={`${entry.key}-${emoji.char}`}
                    onClick={() => onInsert(emoji.char, emoji.name)}
                    onPointerDown={(event) => event.preventDefault()}
                    title={emoji.name}
                    type="button"
                  >
                    {emoji.char}
                  </button>
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

/** The symbol panel of the toolbar, wired to the `symbol` node. */
export function SymbolPanel() {
  const { run } = useRichTextEditor();

  return (
    <SymbolPicker
      onInsert={(char, name) => {
        run('insertSymbol', { char, name });
      }}
    />
  );
}

/** Symbol picker: the same shape as the emoji picker, with literal characters. */
export function SymbolPicker({ onInsert }: { onInsert: (char: string, name: string) => void }) {
  const [query, setQuery] = useState('');
  const [group, setGroup] = useState<string>(SYMBOL_GROUPS[0]?.key ?? '');

  const filtered = useMemo(() => filterSymbolGroups(SYMBOL_GROUPS, query), [query]);
  const visible = query === '' ? filtered.filter((entry) => entry.key === group) : filtered;

  return (
    <div className={styles.picker}>
      <div className={styles.pickerSearch}>
        <input
          aria-label="Search symbols"
          className="form-control form-control-sm"
          onChange={(event) => setQuery(event.target.value)}
          onPointerDown={(event) => event.stopPropagation()}
          placeholder="Search symbols"
          type="search"
          value={query}
        />
      </div>
      {query === '' ? (
        <div aria-label="Symbol groups" className={styles.pickerTabs}>
          {SYMBOL_GROUPS.map((entry) => (
            <button
              aria-pressed={entry.key === group}
              className={clsx('btn', 'btn-sm', styles.pickerTab, entry.key === group && 'active')}
              key={entry.key}
              onClick={() => setGroup(entry.key)}
              onPointerDown={(event) => event.preventDefault()}
              type="button"
            >
              {entry.label}
            </button>
          ))}
        </div>
      ) : null}
      <div className={styles.pickerBody}>
        {visible.length === 0 ? (
          <p className={styles.pickerEmpty}>No symbol matches “{query}”</p>
        ) : (
          visible.map((entry) => (
            <div className={styles.pickerGroup} key={entry.key}>
              {query === '' ? <div className={styles.panelHeading}>{entry.label}</div> : null}
              <div className={styles.symbolGrid}>
                {entry.symbols.map((symbol) => (
                  <button
                    aria-label={`Symbol ${symbol.name}`}
                    className={styles.symbol}
                    key={`${entry.key}-${symbol.char}`}
                    onClick={() => onInsert(symbol.char, symbol.name)}
                    onPointerDown={(event) => event.preventDefault()}
                    title={`${symbol.name} (${symbol.char})`}
                    type="button"
                  >
                    {symbol.char}
                  </button>
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

/** Emoji groups whose entries match `query`, by character or by name. */
function filterGroups(
  groups: readonly RichTextEditorEmojiGroup[],
  query: string,
): RichTextEditorEmojiGroup[] {
  const needle = query.trim().toLocaleLowerCase();

  if (needle === '') {
    return [...groups];
  }

  return groups
    .map((group) => ({
      ...group,
      emojis: group.emojis.filter(
        (entry) => entry.name.toLocaleLowerCase().includes(needle) || entry.char === query.trim(),
      ),
    }))
    .filter((group) => group.emojis.length > 0);
}

/** Symbol groups whose entries match `query`, by character or by name. */
function filterSymbolGroups(
  groups: readonly RichTextEditorSymbolGroup[],
  query: string,
): RichTextEditorSymbolGroup[] {
  const needle = query.trim().toLocaleLowerCase();

  if (needle === '') {
    return [...groups];
  }

  return groups
    .map((group) => ({
      ...group,
      symbols: group.symbols.filter(
        (entry) => entry.name.toLocaleLowerCase().includes(needle) || entry.char === query.trim(),
      ),
    }))
    .filter((group) => group.symbols.length > 0);
}
