import clsx from 'clsx';
import { type ChangeEvent, useState } from 'react';

import type { RichTextEditorColorGroup } from './rich-text-editor-data.ts';

import { contrastColor, isColorValue, normalizeColor } from './rich-text-editor-color-utils';
import styles from './rich-text-editor.module.css';

/** Props of {@link ColorPicker}. */
export interface ColorPickerProps {
  /** Whether the "clear" control is offered, which is what removes the mark. */
  allowClear?: boolean;
  /** Extra classes for the grid. */
  className?: string;
  /** Swatches to show, in the order they appear. */
  groups: readonly RichTextEditorColorGroup[];
  /** Called with the chosen color; an empty string means "remove the mark". */
  onChange: (color: string) => void;
  /** Color the selection currently carries. */
  value: null | string;
}

/**
 * The swatch grid a text-color or highlight picker shows.
 *
 * The grid is data driven: the groups come from the component's own tables, so a host that wants a
 * different palette passes its own, and every value the user picks is validated before it leaves —
 * a color the editor's style policy would refuse is dropped by the command and would look like a
 * broken button.
 */
export function ColorPicker({
  allowClear = true,
  className,
  groups,
  onChange,
  value,
}: ColorPickerProps) {
  const [draft, setDraft] = useState('');
  const current = value ? normalizeColor(value) : '';

  const commitDraft = (next: string) => {
    const color = normalizeColor(next);

    if (isColorValue(color)) {
      onChange(color);
      setDraft('');
    }
  };

  const onDraftChange = (event: ChangeEvent<HTMLInputElement>) => {
    setDraft(event.target.value);
  };

  return (
    <div className={clsx('rbs-rte-color-picker', styles.colorPicker, className)}>
      {groups.map((group) => (
        <div className="rbs-rte-color-group" key={group.label}>
          <div className={styles.panelHeading}>{group.label}</div>
          <div className={styles.colorGrid}>
            {group.colors.map((color) => (
              <button
                aria-label={`${group.label} ${color.label}`}
                aria-pressed={current === normalizeColor(color.value) || undefined}
                className={styles.colorSwatch}
                data-color={color.value}
                data-panel-item=""
                key={`${group.label}-${color.value}`}
                onClick={() => onChange(color.value)}
                onPointerDown={(event) => event.preventDefault()}
                style={{ backgroundColor: color.value, color: contrastColor(color.value) }}
                title={color.label}
                type="button"
              >
                {current === normalizeColor(color.value) ? (
                  <span aria-hidden="true" className={styles.colorCheck}>
                    ✓
                  </span>
                ) : null}
              </button>
            ))}
          </div>
        </div>
      ))}

      <div className={styles.colorCustom}>
        <input
          aria-label="Custom color"
          className="form-control form-control-color form-control-sm"
          onChange={(event) => commitDraft(event.target.value)}
          type="color"
          value={isColorValue(current) && current.startsWith('#') ? current : '#000000'}
        />
        <input
          aria-label="Color value"
          className="form-control form-control-sm"
          onChange={onDraftChange}
          onKeyDown={(event) => {
            if (event.key === 'Enter') {
              event.preventDefault();
              commitDraft(draft);
            }
          }}
          placeholder="#0d6efd"
          type="text"
          value={draft}
        />
        {allowClear ? (
          <button
            className={clsx('btn', 'btn-light', 'btn-sm', styles.colorClear)}
            onClick={() => onChange('')}
            onPointerDown={(event) => event.preventDefault()}
            type="button"
          >
            Clear
          </button>
        ) : null}
      </div>
    </div>
  );
}
