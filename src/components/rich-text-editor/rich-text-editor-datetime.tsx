import clsx from 'clsx';
import { useState } from 'react';

import { useRichTextEditor } from './rich-text-editor-context';
import { DATE_FORMAT_CHOICES } from './rich-text-editor-data.ts';
import { formatDateTime } from './rich-text-editor-video.ts';
import styles from './rich-text-editor.module.css';

/**
 * Date and time picker.
 *
 * The value inserted is the moment the control was used, formatted with the pattern the user picked:
 * a date in a document is a stamp of *when it was written*, so the control deliberately has no date
 * field of its own. What it inserts is a `date` node — the label a reader sees plus the ISO
 * timestamp it stands for — so a host can reformat, sort or filter by it later.
 */
export function DateTimePanel({
  format,
  onFormatChange,
  onInsert,
}: {
  /** Pattern key of the current choice; see `DATE_FORMAT_CHOICES`. */
  format: string;
  /** Called when the user picks another pattern. */
  onFormatChange: (format: string) => void;
  /** Called with the label to insert and the timestamp it stands for. */
  onInsert: (label: string, datetime: string) => void;
}) {
  const [date] = useState(() => new Date());

  return (
    <div className={styles.picker}>
      <div className={styles.panelHeading}>Insert date and time</div>
      <div className={styles.choiceList}>
        {DATE_FORMAT_CHOICES.map((choice) => (
          <button
            aria-pressed={choice.value === format || undefined}
            className={clsx(
              'dropdown-item',
              'rbs-rte-panel-item',
              styles.panelItem,
              choice.value === format && 'active',
            )}
            key={choice.value}
            onClick={() => {
              onFormatChange(choice.value);
              onInsert(formatDateTime(date, choice.value), date.toISOString());
            }}
            onPointerDown={(event) => event.preventDefault()}
            type="button"
          >
            <span className={styles.panelItemLabel}>{choice.label}</span>
          </button>
        ))}
      </div>
      <div className={styles.pickerPreview}>{formatDateTime(date, format)}</div>
    </div>
  );
}

/** The date panel of the toolbar, wired to the `date` node. */
export function DateTimePickerPanel() {
  const { run } = useRichTextEditor();
  const [format, setFormat] = useState('date');

  return (
    <DateTimePanel
      format={format}
      onFormatChange={setFormat}
      onInsert={(label, datetime) => run('insertDate', { datetime, label })}
    />
  );
}
