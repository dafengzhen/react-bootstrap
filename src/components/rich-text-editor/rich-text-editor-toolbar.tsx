import type { ReactNode } from 'react';

import clsx from 'clsx';
import {
  AlignCenter,
  AlignJustify,
  AlignLeft,
  AlignRight,
  Bold,
  CalendarDays,
  ChevronDown,
  Clipboard,
  ClipboardPaste,
  Code,
  Columns3,
  Component,
  Copy,
  FileUp,
  Heading,
  Highlighter,
  ImagePlus,
  IndentDecrease,
  IndentIncrease,
  Italic,
  Link2,
  List,
  ListChecks,
  ListOrdered,
  type LucideIcon,
  Merge,
  Minus,
  Music,
  Paintbrush,
  Palette,
  Pilcrow,
  PilcrowLeft,
  Quote,
  Redo2,
  RemoveFormatting,
  Rows3,
  Scissors,
  Search,
  Sigma,
  SmilePlus,
  SquareCode,
  SquareDashed,
  SquarePlay,
  Strikethrough,
  Subscript,
  Superscript,
  Table2,
  Trash2,
  Type,
  Underline,
  Undo2,
  UnfoldVertical,
  Video,
} from 'lucide-react';
import { createContext, useContext } from 'react';

import type { RichTextEditorPanel } from './types';

import { ColorPicker } from './rich-text-editor-color-picker';
import { useRichTextEditor } from './rich-text-editor-context';
import {
  BLOCK_TYPE_CHOICES,
  CODE_LANGUAGE_CHOICES,
  FONT_FAMILY_CHOICES,
  FONT_SIZE_CHOICES,
  HIGHLIGHT_COLOR_GROUPS,
  LINE_HEIGHT_CHOICES,
  SPACING_CHOICES,
  TEXT_COLOR_GROUPS,
} from './rich-text-editor-data.ts';
import { DateTimePickerPanel } from './rich-text-editor-datetime';
import { EmojiPanel, SymbolPanel } from './rich-text-editor-pickers';
import {
  canEditTable,
  tableAtSelection,
  tableColumnCount,
  tableRowCount,
  tableTargetAtSelection,
} from './rich-text-editor-table-utils';
import { ToolbarButton, ToolbarGroup, ToolbarSeparator } from './rich-text-editor-toolbar-button';
import { ToolbarMenuItem } from './rich-text-editor-toolbar-dropdown';
import { ToolbarPanelTrigger } from './rich-text-editor-toolbar-panel';
import { headingLevel, lineHeightOf, spacingOf } from './rich-text-editor-utils';
import styles from './rich-text-editor.module.css';

/**
 * The default toolbar.
 *
 * Every control acts on the selection, and the component keeps the caret in the editor while a
 * control is pressed, so a command runs against the range the user selected rather than a collapsed
 * caret. A control is disabled when the command it runs reports that it cannot run, which is how a
 * read-only editor turns the whole toolbar into a set of inert buttons instead of a set of buttons
 * that do nothing.
 *
 * The toolbar renders controls and nothing else: everything that needs the dialog layer, the
 * clipboard or a piece of state that outlives one press is delegated to {@link
 * RichTextEditorToolbarActions}, so there is one implementation of each operation.
 */

/** Dialog a toolbar control can open; the component owns which one is showing. */
export type RichTextEditorDialog = 'find' | 'image' | 'link' | 'media' | 'table';

/** The operations the component owns because they reach outside the editor. */
export type RichTextEditorToolbarAction =
  | 'copy'
  | 'cut'
  | 'find'
  | 'format-painter'
  | 'insert-date'
  | 'insert-horizontal-rule'
  | 'paste-plain'
  | 'paste';

/** What the toolbar asks of the component around it. */
export interface RichTextEditorToolbarActions {
  /** Whether the format painter is currently holding a format. */
  formatPainterActive: boolean;
  /** Opens a dialog, when the command behind a control needs one. */
  openDialog: (dialog: RichTextEditorDialog) => void;
  /** Opens a panel, or closes the open one with `null`. */
  openPanel: (panel: RichTextEditorPanel) => void;
  /** Panel that is open right now. */
  panel: RichTextEditorPanel;
  /** Runs one of the operations the engine has no command for. */
  perform: (action: RichTextEditorToolbarAction) => void;
}

/** The default toolbar. */
export function RichTextEditorToolbar({
  actions,
  extra,
}: {
  actions: RichTextEditorToolbarActions;
  extra?: ReactNode;
}) {
  return (
    <RichTextEditorToolbarContext.Provider value={actions}>
      <div
        aria-label="Editor toolbar"
        className={clsx('rbs-rte-toolbar', styles.toolbar)}
        role="toolbar"
      >
        <ToolbarGroup label="History">
          <CommandButton command="undo" label="Undo" shortcut="Ctrl+Z" />
          <CommandButton command="redo" label="Redo" shortcut="Ctrl+Shift+Z" />
        </ToolbarGroup>

        <ToolbarSeparator />

        <ToolbarGroup label="Clipboard">
          <ActionButton action="cut" label="Cut" shortcut="Ctrl+X" />
          <ActionButton action="copy" label="Copy" shortcut="Ctrl+C" />
          <ActionButton action="paste" label="Paste" shortcut="Ctrl+V" />
          <ActionButton action="paste-plain" label="Paste as plain text" shortcut="Ctrl+Shift+V" />
          <CommandButton command="selectAll" label="Select all" shortcut="Ctrl+A" />
        </ToolbarGroup>

        <ToolbarSeparator />

        <ToolbarGroup label="Text style">
          <CommandButton command="toggleBold" label="Bold" shortcut="Ctrl+B" />
          <CommandButton command="toggleItalic" label="Italic" shortcut="Ctrl+I" />
          <CommandButton command="toggleUnderline" label="Underline" shortcut="Ctrl+U" />
          <CommandButton command="toggleStrike" label="Strikethrough" shortcut="Ctrl+Shift+X" />
          <CommandButton command="toggleInlineCode" label="Inline code" shortcut="Ctrl+E" />
          <CommandButton command="toggleSuperscript" label="Superscript" />
          <CommandButton command="toggleSubscript" label="Subscript" />
          <CommandButton command="clearFormatting" label="Clear formatting" />
        </ToolbarGroup>

        <ToolbarSeparator />

        <ToolbarGroup label="Typography">
          <PanelTrigger
            actions={actions}
            icon={<Type aria-hidden="true" />}
            label="Font family"
            panel="font-family"
          >
            <FontFamilyPanel />
          </PanelTrigger>
          <PanelTrigger
            actions={actions}
            icon={<ChevronDown aria-hidden="true" />}
            label="Font size"
            panel="font-size"
          >
            <FontSizePanel />
          </PanelTrigger>
          <PanelTrigger
            actions={actions}
            icon={<Palette aria-hidden="true" />}
            label="Text color"
            panel="color"
          >
            <TextColorPanel />
          </PanelTrigger>
          <PanelTrigger
            actions={actions}
            icon={<Highlighter aria-hidden="true" />}
            label="Highlight color"
            panel="highlight"
          >
            <HighlightPanel />
          </PanelTrigger>
        </ToolbarGroup>

        <ToolbarSeparator />

        <ToolbarGroup label="Paragraph">
          <PanelTrigger
            actions={actions}
            icon={<Pilcrow aria-hidden="true" />}
            label="Paragraph style"
            panel="block-type"
          >
            <BlockTypePanel />
          </PanelTrigger>
          <CommandButton command="align-left" label="Align left" />
          <CommandButton command="align-center" label="Align center" />
          <CommandButton command="align-right" label="Align right" />
          <CommandButton command="align-justify" label="Justify" />
          <CommandButton command="toggleBulletList" label="Bulleted list" />
          <CommandButton command="toggleOrderedList" label="Numbered list" />
          <CommandButton command="toggleTaskList" label="Checklist" />
          <CommandButton command="indent" label="Increase indent" />
          <CommandButton command="outdent" label="Decrease indent" />
          <PanelTrigger
            actions={actions}
            icon={<UnfoldVertical aria-hidden="true" />}
            label="Line height"
            panel="line-height"
          >
            <LineHeightPanel />
          </PanelTrigger>
          <PanelTrigger
            actions={actions}
            icon={<PilcrowLeft aria-hidden="true" />}
            label="Paragraph spacing"
            panel="spacing"
          >
            <SpacingPanel />
          </PanelTrigger>
          <CommandButton command="toggleBlockquote" label="Blockquote" />
          <PanelTrigger
            actions={actions}
            icon={<SquareCode aria-hidden="true" />}
            label="Code block"
            panel="code-language"
          >
            <CodeLanguagePanel />
          </PanelTrigger>
          <ActionButton action="insert-horizontal-rule" label="Horizontal rule" />
          <PanelTrigger
            actions={actions}
            icon={<Table2 aria-hidden="true" />}
            label="Table"
            panel="table"
          >
            <TablePanel />
          </PanelTrigger>
        </ToolbarGroup>

        <ToolbarSeparator />

        <ToolbarGroup label="Insert">
          <DialogButton dialog="link" label="Link" shortcut="Ctrl+K" />
          <DialogButton dialog="image" label="Image" />
          <PanelTrigger
            actions={actions}
            icon={<SmilePlus aria-hidden="true" />}
            label="Emoji"
            panel="emoji"
          >
            <EmojiPanel onInserted={() => actions.openPanel(null)} />
          </PanelTrigger>
          <PanelTrigger
            actions={actions}
            icon={<Sigma aria-hidden="true" />}
            label="Special symbol"
            panel="symbol"
          >
            <SymbolPanel />
          </PanelTrigger>
          <PanelTrigger
            actions={actions}
            icon={<CalendarDays aria-hidden="true" />}
            label="Date and time"
            panel="datetime"
          >
            <DateTimePickerPanel />
          </PanelTrigger>
          <PanelTrigger
            actions={actions}
            icon={<ChevronDown aria-hidden="true" />}
            label="More insert options"
            panel="insert"
          >
            <InsertPanel actions={actions} />
          </PanelTrigger>
        </ToolbarGroup>

        <ToolbarSeparator />

        <ToolbarGroup label="Tools">
          <DialogButton dialog="find" label="Find and replace" shortcut="Ctrl+F" />
          <ToolbarButton
            active={actions.formatPainterActive}
            keepFocus={false}
            onClick={() => actions.perform('format-painter')}
            shortcut="Ctrl+Shift+C"
            title="Format painter"
          >
            <Paintbrush aria-hidden="true" />
          </ToolbarButton>
        </ToolbarGroup>

        {extra ? (
          <>
            <ToolbarSeparator />
            <ToolbarGroup label="Extra">{extra}</ToolbarGroup>
          </>
        ) : null}
      </div>
    </RichTextEditorToolbarContext.Provider>
  );
}

/** Extra controls rendered at the end of the toolbar. */
const RichTextEditorToolbarContext = createContext<null | RichTextEditorToolbarActions>(null);

/** A button that runs a registered command and mirrors its state. */
export function CommandButton({
  command,
  label,
  options,
  shortcut,
  text = false,
}: {
  command: string;
  label: string;
  options?: Record<string, unknown>;
  shortcut?: string;
  text?: boolean;
}) {
  const { can, isActive, run } = useRichTextEditor();
  const align = ALIGN_COMMANDS[command];
  const Icon = text ? null : (COMMAND_ICONS[command] ?? null);
  const disabled = align ? !can('setTextAlign', { align }) : !can(command, options);
  const active = align
    ? isActive('paragraph', { align }) || isActive('heading', { align })
    : activeFor(command);

  return (
    <ToolbarButton
      active={active}
      data-command={command}
      disabled={disabled}
      onClick={() => (align ? run('setTextAlign', { align }) : run(command, options))}
      shortcut={shortcut}
      title={label}
    >
      {/* A command the toolbar has no icon for is a command a host added; its name is what is left. */}
      {Icon ? <Icon aria-hidden="true" /> : <span className={styles.toolText}>{label}</span>}
    </ToolbarButton>
  );

  function activeFor(name: string): boolean {
    const mark = MARK_COMMANDS[name];

    return mark ? isActive(mark) : false;
  }
}

/** A button that asks the component to do something the engine has no command for. */
function ActionButton({
  action,
  label,
  shortcut,
  text = false,
}: {
  action: RichTextEditorToolbarAction;
  label: string;
  shortcut?: string;
  text?: boolean;
}) {
  const { editable } = useRichTextEditor();
  const { perform } = useToolbarActions();
  const Icon = text ? null : (ACTION_ICONS[action] ?? null);
  const needsClipboard = action === 'cut' || action === 'paste' || action === 'paste-plain';
  const needsDocument = needsClipboard || action === 'insert-horizontal-rule';
  const disabled = needsDocument && !editable;

  return (
    <ToolbarButton
      data-command={action}
      disabled={disabled}
      keepFocus={action === 'insert-date'}
      onClick={() => perform(action)}
      shortcut={shortcut}
      title={label}
    >
      {Icon ? <Icon aria-hidden="true" /> : <span className={styles.toolText}>{label}</span>}
    </ToolbarButton>
  );
}

/** The paragraph-style picker: paragraph, the six heading levels. */
function BlockTypePanel() {
  const context = useRichTextEditor();
  const level = headingLevel(context.state);
  const current = level === null ? 'paragraph' : `h${level}`;

  return (
    <div className={styles.choiceList}>
      {BLOCK_TYPE_CHOICES.map((choice) => (
        <ToolbarMenuItem
          active={current === choice.value}
          icon={choice.value === 'paragraph' ? <Pilcrow /> : <Heading />}
          key={choice.value}
          label={choice.label}
          onSelect={() => {
            if (choice.value === 'paragraph') {
              context.run('setParagraph');
            } else {
              context.run('setHeading', { level: Number(choice.value.slice(1)) });
            }
          }}
        />
      ))}
    </div>
  );
}

/** Code language has its own panel rather than sharing the paragraph spacing controls. */
function CodeLanguagePanel() {
  const context = useRichTextEditor();

  return (
    <div className={styles.choicePanel}>
      <ToolbarMenuItem label="Normal text" onSelect={() => context.run('setParagraph')} />
      <div className={styles.panelHeading}>Code block language</div>
      <div className={styles.choiceList}>
        {CODE_LANGUAGE_CHOICES.map((choice) => (
          <ToolbarMenuItem
            active={context.getAttributes('code_block').language === choice.value}
            disabled={!context.editable}
            key={choice.value}
            label={choice.label}
            onSelect={() => {
              if (!context.isActive('code_block')) {
                if (!context.run('toggleCodeBlock')) {
                  return;
                }
              }
              context.run('setCodeBlockLanguage', { language: choice.value });
            }}
          />
        ))}
      </div>
    </div>
  );
}

/** A button that opens one of the component's dialogs. */
function DialogButton({
  dialog,
  label,
  shortcut,
}: {
  dialog: RichTextEditorDialog;
  label: string;
  shortcut?: string;
}) {
  const { editable } = useRichTextEditor();
  const { openDialog } = useToolbarActions();
  const Icon = DIALOG_ICONS[dialog];
  const disabled = !editable && dialog !== 'find';

  return (
    <ToolbarButton
      disabled={disabled}
      keepFocus={false}
      onClick={() => openDialog(dialog)}
      shortcut={shortcut}
      title={label}
    >
      <Icon aria-hidden="true" />
    </ToolbarButton>
  );
}

/** Font family picker. */
function FontFamilyPanel() {
  const context = useRichTextEditor();

  return (
    <div className={styles.choicePanel}>
      <div className={styles.panelHeading}>Font family</div>
      <div className={styles.choiceList}>
        {FONT_FAMILY_CHOICES.map((choice) => (
          <ToolbarMenuItem
            active={String(context.getAttributes('font_family').family ?? '') === choice.value}
            key={choice.value}
            label={<span style={{ fontFamily: choice.value }}>{choice.label}</span>}
            onSelect={() => context.run('setFontFamily', { family: choice.value })}
          />
        ))}
      </div>
      <ResetRow label="Default font" onSelect={() => context.run('unsetFontFamily')} />
    </div>
  );
}

/** Font size picker. */
function FontSizePanel() {
  const context = useRichTextEditor();

  return (
    <div className={styles.choicePanel}>
      <div className={styles.panelHeading}>Font size</div>
      <div className={styles.choiceList}>
        {FONT_SIZE_CHOICES.map((choice) => (
          <ToolbarMenuItem
            active={String(context.getAttributes('font_size').size ?? '') === choice.value}
            key={choice.value}
            label={choice.label}
            onSelect={() => context.run('setFontSize', { size: choice.value })}
          />
        ))}
      </div>
      <ResetRow label="Default size" onSelect={() => context.run('unsetFontSize')} />
    </div>
  );
}

/** Highlight picker. */
function HighlightPanel() {
  const context = useRichTextEditor();

  return (
    <ColorPicker
      groups={HIGHLIGHT_COLOR_GROUPS}
      onChange={(color) =>
        color === '' ? context.run('unsetHighlight') : context.run('setHighlight', { color })
      }
      value={String(context.getAttributes('highlight').color ?? '') || null}
    />
  );
}

/** The "more insert options" panel: everything the two direct buttons do not cover. */
function InsertPanel({ actions }: { actions: RichTextEditorToolbarActions }) {
  const rows: { icon: LucideIcon; label: string; run: () => void }[] = [
    { icon: Link2, label: 'Link', run: () => actions.openDialog('link') },
    { icon: ImagePlus, label: 'Image', run: () => actions.openDialog('image') },
    { icon: Video, label: 'Video', run: () => actions.openDialog('media') },
    { icon: Music, label: 'Audio', run: () => actions.openDialog('media') },
    { icon: FileUp, label: 'Attachment', run: () => actions.openDialog('media') },
    { icon: Table2, label: 'Table', run: () => actions.openDialog('table') },
    { icon: SmilePlus, label: 'Emoji', run: () => actions.openPanel('emoji') },
    { icon: Code, label: 'Symbol', run: () => actions.openPanel('symbol') },
    { icon: CalendarDays, label: 'Date and time', run: () => actions.perform('insert-date') },
    { icon: SquarePlay, label: 'Embed', run: () => actions.openDialog('media') },
    { icon: Component, label: 'Custom card', run: () => actions.openDialog('media') },
    { icon: Minus, label: 'Horizontal rule', run: () => actions.perform('insert-horizontal-rule') },
  ];

  return (
    <div className={styles.insertPanel}>
      {rows.map((row) => (
        <button
          className={styles.insertItem}
          data-panel-item=""
          key={row.label}
          onClick={() => {
            actions.openPanel(null);
            row.run();
          }}
          onPointerDown={(event) => event.preventDefault()}
          type="button"
        >
          <row.icon aria-hidden="true" />
          <span>{row.label}</span>
        </button>
      ))}
    </div>
  );
}

/** Line height options. */
function LineHeightPanel() {
  const context = useRichTextEditor();
  const lineHeight = lineHeightOf(context.state);

  return (
    <div className={styles.spacingPanel}>
      <div className={styles.panelHeading}>Line height</div>
      <div className={styles.choiceList}>
        {LINE_HEIGHT_CHOICES.map((choice) => (
          <ToolbarMenuItem
            active={String(lineHeight) === String(choice.value)}
            key={choice.label}
            label={choice.label}
            onSelect={() => context.run('setLineHeight', { lineHeight: choice.value })}
          />
        ))}
      </div>
      <ResetRow
        label="Default line height"
        onSelect={() => context.run('setLineHeight', { lineHeight: null })}
      />
    </div>
  );
}

/** A dropdown wired to the toolbar's single open panel. */
function PanelTrigger({
  actions,
  children,
  icon,
  label,
  panel,
}: {
  actions: RichTextEditorToolbarActions;
  children: ReactNode;
  icon?: ReactNode;
  label: string;
  panel: Exclude<RichTextEditorPanel, null>;
}) {
  return (
    <ToolbarPanelTrigger
      context={useRichTextEditor()}
      icon={icon}
      label={label}
      onOpenChange={actions.openPanel}
      open={actions.panel === panel}
      panel={panel}
    >
      {children}
    </ToolbarPanelTrigger>
  );
}

/** A row that resets one of the values a panel offers. */
function ResetRow({ label, onSelect }: { label: string; onSelect: () => void }) {
  return (
    <button
      className={clsx('dropdown-item', 'rbs-rte-panel-item', styles.panelItem, styles.panelReset)}
      onClick={onSelect}
      onPointerDown={(event) => event.preventDefault()}
      type="button"
    >
      <span className={styles.panelItemLabel}>{label}</span>
    </button>
  );
}

/** Paragraph spacing is independent from line height. */
function SpacingPanel() {
  const context = useRichTextEditor();
  const spacing = spacingOf(context.state);

  return (
    <div className={styles.spacingPanel}>
      <div className={styles.panelHeading}>Paragraph spacing</div>
      <div className={styles.choiceList}>
        {SPACING_CHOICES.map((choice) => (
          <ToolbarMenuItem
            active={
              String(spacing.marginTop ?? '') === String(choice.marginTop ?? '') &&
              String(spacing.marginBottom ?? '') === String(choice.marginBottom ?? '')
            }
            key={choice.value}
            label={choice.label}
            onSelect={() =>
              context.run('setParagraphSpacing', {
                marginBottom: choice.marginBottom,
                marginTop: choice.marginTop,
              })
            }
          />
        ))}
      </div>
    </div>
  );
}

/** Table controls: what the table the caret is in can do next. */
function TablePanel() {
  const { can, run, state } = useRichTextEditor();
  const location = tableAtSelection(state);

  if (!location) {
    return (
      <div className={styles.choicePanel}>
        <div className={styles.panelHeading}>Table</div>
        <p className="mb-0 px-2 small text-body-secondary">
          Put the caret inside a table to add rows and columns, merge cells or delete it.
        </p>
      </div>
    );
  }

  const edits = canEditTable(state);
  const rows = tableRowCount(state);
  const columns = tableColumnCount(state);
  const target = tableTargetAtSelection(state) ?? undefined;

  return (
    <div className={styles.choicePanel}>
      <div className={styles.panelHeading}>
        Row {location.row + 1} of {rows} · cell {location.cell + 1} of {columns}
      </div>
      <div className={styles.choiceList}>
        <ToolbarMenuItem
          disabled={!edits}
          icon={<Rows3 />}
          label="Add row below"
          onSelect={() => run('addTableRow', { ...target, row: location.row })}
        />
        <ToolbarMenuItem
          disabled={!edits}
          icon={<Columns3 />}
          label="Add column after"
          onSelect={() => run('addTableColumn', { ...target, column: location.cell })}
        />
        <ToolbarMenuItem
          disabled={!edits || location.cell + 1 >= columns}
          icon={<Merge />}
          label="Merge with the cell on the right"
          onSelect={() => run('mergeTableCells', { ...target, column: location.cell })}
        />
        <ToolbarMenuItem
          disabled={!can('deleteNode', { pos: location.tablePos })}
          icon={<Trash2 />}
          label="Delete the table"
          onSelect={() => run('deleteNode', { pos: location.tablePos })}
        />
      </div>
      {edits ? null : (
        <p className="mb-0 mt-1 px-2 small text-body-secondary">
          A table with vertically merged cells or rows of different widths is left alone: rebuilding
          it would corrupt the spans.
        </p>
      )}
    </div>
  );
}

/** Text color picker. */
function TextColorPanel() {
  const context = useRichTextEditor();

  return (
    <ColorPicker
      groups={TEXT_COLOR_GROUPS}
      onChange={(color) =>
        color === '' ? context.run('unsetTextColor') : context.run('setTextColor', { color })
      }
      value={String(context.getAttributes('text_color').color ?? '') || null}
    />
  );
}

/** The actions of the surrounding toolbar; throws outside one, which is a wiring mistake. */
function useToolbarActions(): RichTextEditorToolbarActions {
  const actions = useContext(RichTextEditorToolbarContext);

  if (!actions) {
    throw new Error('RichTextEditor: this control must be used inside a <RichTextEditorToolbar>');
  }

  return actions;
}

/** Mark a command toggles, for the "is it active" lookup. */
const MARK_COMMANDS: Record<string, string> = {
  toggleBlockquote: 'blockquote',
  toggleBold: 'bold',
  toggleBulletList: 'bullet_list',
  toggleCodeBlock: 'code_block',
  toggleInlineCode: 'inline_code',
  toggleItalic: 'italic',
  toggleOrderedList: 'ordered_list',
  toggleStrike: 'strike',
  toggleSubscript: 'subscript',
  toggleSuperscript: 'superscript',
  toggleTaskList: 'task_list',
  toggleUnderline: 'underline',
};

/** Alignment commands the toolbar exposes as four buttons. */
const ALIGN_COMMANDS: Record<string, 'center' | 'justify' | 'left' | 'right' | undefined> = {
  'align-center': 'center',
  'align-justify': 'justify',
  'align-left': 'left',
  'align-right': 'right',
};

/** Icon of a command button. */
const COMMAND_ICONS: Record<string, LucideIcon> = {
  'align-center': AlignCenter,
  'align-justify': AlignJustify,
  'align-left': AlignLeft,
  'align-right': AlignRight,
  clearFormatting: RemoveFormatting,
  indent: IndentIncrease,
  outdent: IndentDecrease,
  redo: Redo2,
  selectAll: SquareDashed,
  toggleBlockquote: Quote,
  toggleBold: Bold,
  toggleBulletList: List,
  toggleCodeBlock: SquareCode,
  toggleInlineCode: Code,
  toggleItalic: Italic,
  toggleOrderedList: ListOrdered,
  toggleStrike: Strikethrough,
  toggleSubscript: Subscript,
  toggleSuperscript: Superscript,
  toggleTaskList: ListChecks,
  toggleUnderline: Underline,
  undo: Undo2,
};

/** Icon of an action button. */
const ACTION_ICONS: Record<string, LucideIcon> = {
  copy: Copy,
  cut: Scissors,
  'insert-horizontal-rule': Minus,
  paste: ClipboardPaste,
  'paste-plain': Clipboard,
};

/** Icon of a dialog button. */
const DIALOG_ICONS: Record<RichTextEditorDialog, LucideIcon> = {
  find: Search,
  image: ImagePlus,
  link: Link2,
  media: SquarePlay,
  table: Table2,
};
