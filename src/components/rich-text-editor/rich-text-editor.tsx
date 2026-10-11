import clsx from 'clsx';
import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import type { Editor, EditorLocale, EditorState, FileUploader } from './rich-text-editor-lib.ts';
import type {
  RichTextEditorContextValue,
  RichTextEditorHandle,
  RichTextEditorPanel,
  RichTextEditorProps,
} from './types';

import { editorKit } from './rich-text-editor-commands';
import { RichTextEditorContext, useRichTextEditor } from './rich-text-editor-context';
import { RichTextEditorDialogs } from './rich-text-editor-dialogs';
import { extendedDOMRules, extendedKit } from './rich-text-editor-extensions';
import {
  createEditorView,
  defaultDOMRules,
  Editor as EditorClass,
  mediaDOMRules,
  MediaKit,
  mergeDOMRules,
  StarterKit,
  TableKit,
  uploadsOf,
} from './rich-text-editor-lib.ts';
import {
  type RichTextEditorDialog,
  RichTextEditorToolbar,
  type RichTextEditorToolbarAction,
} from './rich-text-editor-toolbar';
import { applyFormatPainter, insertPlainText, painterFrom } from './rich-text-editor-utils';
import { formatDateTime } from './rich-text-editor-video.ts';
import styles from './rich-text-editor.module.css';

/**
 * A rich text editor: the toolbar, the dialogs and the editable area.
 *
 * The engine is headless and knows nothing about React; this component owns the three things a
 * React host has to get right, and nothing else:
 *
 * - **The lifetime of one editor.** One `Editor` is built when the element mounts and destroyed when
 *   it unmounts, so a re-render never loses the document, the undo history or the caret.
 * - **The selection while the toolbar is used.** A press moves the focus and the browser collapses
 *   the caret in an editable element when it loses focus, so every control cancels the default of
 *   its pointer-down and a dialog restores the range it captured when it opened.
 * - **The actions the engine does not register.** Line height, paragraph spacing and a code block's
 *   language are values a *user* picks; the clipboard is the browser's, not the document's. Both are
 *   driven from here rather than hard-coded in the engine.
 *
 * ```tsx
 * <RichTextEditor
 *   content="<p>Hello <strong>world</strong></p>"
 *   onChange={(editor) => save(editor.getHTML())}
 *   placeholder="Write something…"
 * />
 * ```
 */
export const RichTextEditor = forwardRef<RichTextEditorHandle, RichTextEditorProps>(
  (
    {
      className,
      content,
      editable = true,
      extensions,
      gallery = [],
      hideToolbar = false,
      locale,
      onChange,
      onHTMLChange,
      placeholder,
      toolbarExtra,
      upload,
      ...rest
    },
    ref,
  ) => {
    const hostRef = useRef<HTMLDivElement>(null);
    const rootRef = useRef<HTMLDivElement>(null);
    const editorRef = useRef<Editor | null>(null);
    const viewRef = useRef<null | ReturnType<typeof createEditorView>>(null);
    const [editor, setEditor] = useState<Editor | null>(null);
    const [state, setState] = useState<EditorState | null>(null);
    const [panel, setPanel] = useState<RichTextEditorPanel>(null);
    const [dialog, setDialog] = useState<null | RichTextEditorDialog>(null);
    const [painter, setPainter] = useState<null | ReturnType<typeof painterFrom>>(null);
    const [error, setError] = useState<null | string>(null);
    const [revision, setRevision] = useState(0);

    // Callbacks are read through a ref so that changing one does not rebuild the editor: a host that
    // passes an inline arrow function would otherwise lose the document on every render.
    const latest = useRef({ onChange, onHTMLChange });

    latest.current = { onChange, onHTMLChange };

    useLayoutEffect(() => {
      const host = hostRef.current;

      if (!host) {
        return;
      }

      let instance: Editor;

      try {
        instance = new EditorClass({
          content: typeof content === 'object' && content !== null ? content : undefined,
          editable,
          extensions: extensions ?? [StarterKit, MediaKit, TableKit, extendedKit(), editorKit()],
          locale: localeWithPlaceholder(locale, placeholder),
          upload: uploadToAdapters(upload),
        });
      } catch (thrown) {
        setError(thrown instanceof Error ? thrown.message : String(thrown));

        return;
      }

      if (typeof content === 'string' && content !== '') {
        instance.setHTML(content);
      }

      const view = createEditorView(instance, {
        element: host,
        locale: localeWithPlaceholder(locale, placeholder),
        nodeViews: MediaKit.nodeViews,
        rules: mergeDOMRules(mergeDOMRules(defaultDOMRules(), mediaDOMRules()), extendedDOMRules()),
      });
      const offTransaction = instance.on('transaction', (payload) => {
        setState(payload.state);

        // The HTML a host reads is the document, and a selection-only transaction leaves it alone;
        // serializing on every keystroke for a callback nobody passed would be work for nothing.
        if (payload.transaction.docChanged) {
          setRevision((value) => value + 1);
          latest.current.onChange?.(instance);
          latest.current.onHTMLChange?.(instance.getHTML());
        }
      });

      editorRef.current = instance;
      viewRef.current = view;

      setEditor(instance);
      setState(instance.state);

      return () => {
        offTransaction();
        view.destroy();
        instance.destroy();
        editorRef.current = null;
        viewRef.current = null;
      };
      // The editor is built once per mount on purpose. `content`, `locale`, `extensions` and the
      // upload adapters are read here and kept in step by the effects below.
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // A host that changes the `content` prop after mount replaces the document. The value this
    // component last saw is remembered, so typing does not fight with an unchanged prop.
    const lastContent = useRef<unknown>(content);

    useEffect(() => {
      const instance = editorRef.current;

      if (!instance || content === undefined || content === lastContent.current) {
        return;
      }

      lastContent.current = content;

      if (typeof content === 'string') {
        instance.setHTML(content);
      } else if (content) {
        instance.setJSON(content);
      }
    }, [content, revision]);

    useEffect(() => {
      editorRef.current?.setEditable(editable);
    }, [editable, revision]);

    /**
     * Whether this editor is the one the keyboard is talking to.
     *
     * The editable area is not the only place the focus can be while this editor is in use: a
     * dialog's field, the toolbar of another editor and the page body all sit outside it, so the
     * check walks the focused element's ancestors rather than comparing to the edit area itself.
     */
    const ownsFocus = useCallback(() => {
      const root = rootRef.current;
      const active = document.activeElement;

      /*
       * The document body counts as "nothing is focused", and `contains` answers `true` for it — an
       * element contains its own root. Comparing against the body first is what makes a click on the
       * page background leave every editor in the page alone.
       */
      if (!root || !active || active === document.body) {
        return false;
      }

      return root.contains(active);
    }, []);

    const run = useCallback(
      (name: string, options?: Record<string, unknown>) => {
        const instance = editorRef.current;

        if (!instance) {
          return false;
        }

        /*
         * A page can hold several editors, and the toolbar of one of them is a control the user can
         * reach while another editor has the focus. A command acts on the selection, and the selection
         * that matters is the focused one, so a control whose editor is not focused does nothing: the
         * alternative is inventing a mark for a document the user is not looking at, from a click they
         * aimed at the editor beside it.
         */
        /*
         * A command acts on the selection, and the selection that matters is the focused editor's: on a
         * page holding several editors, a control whose editor is not focused must not write into that
         * editor's document from a click the user aimed at the editor beside it.
         *
         * The exception is a control that *took* the focus to be reachable at all. A search field, a
         * panel button and a dialog confirm are all reached by focusing them, so the editor is given the
         * focus back before the command runs — which is also what makes the browser and the engine agree
         * on the range one last time.
         */
        if (!ownsFocus()) {
          if (!rootRef.current || !document.body.contains(rootRef.current)) {
            return false;
          }

          instance.focus();
        }

        try {
          return instance.runNamedCommand(name, options);
        } catch {
          // A command an extension list replaced is a control that cannot run, not a crash: the
          // toolbar renders from the same extension list and only offers what that list declares.
          return false;
        }
      },
      [ownsFocus],
    );

    const context = useMemo<null | RichTextEditorContextValue>(() => {
      if (!editor || !state) {
        return null;
      }

      return {
        can: (name, options) => {
          const can = editor.can()[name];

          return can ? can(options) : false;
        },
        editable,
        editor,
        getAttributes: (name) => editor.getAttributes(name),
        isActive: (name, attrs) => editor.isActive(name, attrs),
        run,
        state,
      };
    }, [editable, editor, run, state]);

    const perform = useCallback(
      (action: RichTextEditorToolbarAction) => {
        const instance = editorRef.current;

        if (!instance) {
          return;
        }

        switch (action) {
          case 'copy':
            void copySelection(instance);

            return;
          case 'cut':
            void cutSelection(instance);

            return;
          case 'find':
            setDialog('find');

            return;
          case 'format-painter': {
            if (painter) {
              instance.runCommand(applyFormatPainter(painter));
              setPainter(null);

              return;
            }

            setPainter(painterFrom(instance.state));

            return;
          }
          case 'insert-date': {
            const now = new Date();

            run('insertDate', { datetime: now.toISOString(), label: formatDateTime(now, 'date') });

            return;
          }
          case 'insert-horizontal-rule':
            run('insertHorizontalRule');

            return;
          case 'paste':
            void pasteFromClipboard(instance);

            return;
          case 'paste-plain':
            void pasteAsPlainText(instance);

            return;
          default:
            return;
        }
      },
      [painter, run],
    );

    /*
     * The shortcuts of the actions that reach outside the document. The engine owns the shortcuts
     * that change one and claims them on the editable element; these are document-level because the
     * browser claims `Ctrl+F` and `Ctrl+K` for itself before any element sees them.
     *
     * A document-level listener belongs to *every* editor on the page, so the handler acts only for
     * the editor that has the focus: a page showing five editors otherwise opens five find dialogs
     * on one press, and a dialog that opens while another editor is focused reads the wrong
     * selection.
     */
    useEffect(() => {
      if (!editor) {
        return;
      }

      const onKeyDown = (event: KeyboardEvent) => {
        if (!(event.ctrlKey || event.metaKey) || event.altKey) {
          return;
        }

        if (!ownsFocus()) {
          return;
        }
        const key = event.key.toLowerCase();

        if (key === 'k') {
          event.preventDefault();
          setDialog('link');

          return;
        }

        if (key === 'f') {
          event.preventDefault();
          setDialog('find');

          return;
        }

        if (key === 'c' && event.shiftKey) {
          event.preventDefault();
          perform('format-painter');

          return;
        }

        if (key === 'v' && event.shiftKey) {
          event.preventDefault();
          void pasteAsPlainText(editor);
        }
      };

      document.addEventListener('keydown', onKeyDown);

      return () => document.removeEventListener('keydown', onKeyDown);
    }, [editor, ownsFocus, perform]);

    useImperativeHandle(
      ref,
      (): RichTextEditorHandle => ({
        focus: () => editorRef.current?.focus(),
        getEditor: () => editorRef.current as Editor,
        getHTML: () => editorRef.current?.getHTML() ?? '',
        getJSON: () => editorRef.current?.getJSON() as never,
        getMarkdown: () => editorRef.current?.getMarkdown() ?? '',
        getText: () => editorRef.current?.getText() ?? '',
        getView: () => viewRef.current,
        redo: () => run('redo'),
        setHTML: (html: string) => editorRef.current?.setHTML(html),
        setJSON: (value) => editorRef.current?.setJSON(value),
        undo: () => run('undo'),
      }),
      [run],
    );

    return (
      <div
        className={clsx(
          'rbs-rte',
          styles.root,
          !editable && 'rbs-rte-readonly',
          !editable && styles.readonly,
          className,
        )}
        ref={rootRef}
        {...rest}
      >
        {context ? (
          <RichTextEditorContext.Provider value={context}>
            {hideToolbar ? null : (
              <RichTextEditorToolbar
                actions={{
                  formatPainterActive: painter !== null,
                  openDialog: setDialog,
                  openPanel: setPanel,
                  panel,
                  perform,
                }}
                extra={toolbarExtra}
              />
            )}
            <RichTextEditorDialogs
              gallery={gallery}
              onClose={() => setDialog(null)}
              open={dialog}
              uploadFile={(file) => uploadOne('file', file, run)}
              uploadImage={(file) => uploadOne('image', file, run)}
            />
            <UploadProgress />
          </RichTextEditorContext.Provider>
        ) : null}
        {/*
          The editable area is an element of its own inside the root. The engine renders the document
          into it, so it must hold nothing React wrote: the toolbar, the dialogs and the upload
          status stay outside it, where the editor can never turn them into content.
        */}
        <div className={clsx('rbs-rte-content', styles.content)} ref={hostRef} />
        {error ? <div className={styles.error}>{error}</div> : null}
      </div>
    );
  },
);

RichTextEditor.displayName = 'RichTextEditor';

/**
 * Copies the selection to the clipboard.
 *
 * The browser owns the clipboard, so the write goes through `navigator.clipboard` and falls back to
 * the browser's own copy command: a document without the `clipboard-write` permission has no usable
 * API at all, and the user's Ctrl+C is always the way out.
 */
async function copySelection(editor: Editor): Promise<void> {
  const text = editor.getText('\n');

  if (text === '') {
    return;
  }

  try {
    await navigator.clipboard.writeText(text);
  } catch {
    try {
      document.execCommand('copy');
    } catch {
      // Nothing else to try: the user's own Ctrl+C still works.
    }
  }
}

/** Cuts the selection: it is copied first, then removed as one undo step. */
async function cutSelection(editor: Editor): Promise<void> {
  await copySelection(editor);

  editor.runCommand((state, dispatch) => {
    const { empty, from, to } = state.selection;

    if (empty) {
      return false;
    }

    if (!dispatch) {
      return true;
    }

    const tr = state.tr;

    tr.delete(from, to);
    tr.setMeta('historyGroup', 'delete');
    dispatch(tr);

    return true;
  });
  editor.focus();
}

/**
 * The locale the editor is built with, with the `placeholder` prop folded in.
 *
 * The engine owns the `data-placeholder` attribute: it writes the copy while an empty document is
 * rendered and takes it off again once there is text, because only the view knows when the edit
 * area's children changed under the browser's own editing. The prop is therefore *translated* here
 * rather than applied beside the engine — a second writer of the same attribute is a race, and the
 * engine wins it on the first render.
 */
function localeWithPlaceholder(
  locale: EditorLocale | undefined,
  placeholder: string | undefined,
): EditorLocale | undefined {
  if (placeholder === undefined) {
    return locale;
  }

  return { ...locale, placeholder };
}

/** Pastes the clipboard as plain text, which is what the editor can always represent. */
async function pasteAsPlainText(editor: Editor): Promise<void> {
  const text = await readClipboardText();

  if (text === '') {
    return;
  }

  editor.runCommand(insertPlainText(text));
  editor.focus();
}

/** Pastes the clipboard; a rich payload is left to the browser's own paste event. */
async function pasteFromClipboard(editor: Editor): Promise<void> {
  await pasteAsPlainText(editor);
}

/** Clipboard text, or an empty string when the browser refuses to hand it over. */
async function readClipboardText(): Promise<string> {
  try {
    return await navigator.clipboard.readText();
  } catch {
    return '';
  }
}

/** Uploads one file through the editor's adapters, as the image or the file kind. */
function uploadOne(
  kind: 'file' | 'image',
  file: File,
  run: (name: string, options?: Record<string, unknown>) => boolean,
): void {
  run('uploadAndInsert', { file, kind });
}

/** Upload status, rendered here because the engine publishes data rather than copy. */
function UploadProgress() {
  const { state } = useRichTextEditor();
  const tasks = uploadsOf(state);

  if (tasks.length === 0) {
    return null;
  }

  return (
    <div aria-live="polite" className={styles.uploads}>
      {tasks.map((task) => (
        <div className={styles.upload} key={task.id}>
          <span className={styles.uploadName}>{task.name}</span>
          <span className={clsx('progress', styles.uploadProgress)}>
            <span
              className={clsx(
                'progress-bar',
                task.status === 'error' && 'bg-danger',
                task.status === 'success' && 'bg-success',
              )}
              style={{ width: `${Math.round(task.progress * 100)}%` }}
            />
          </span>
          <span className={styles.uploadStatus}>
            {task.status === 'error' ? task.error : task.status}
          </span>
        </div>
      ))}
    </div>
  );
}

/** Turns the two upload adapters a host passes into the shape the engine's options expect. */
function uploadToAdapters(
  upload: { file?: FileUploader; image?: FileUploader } | undefined,
): { file?: FileUploader; image?: FileUploader } | undefined {
  if (!upload || (!upload.file && !upload.image)) {
    return undefined;
  }

  return {
    ...(upload.file ? { file: upload.file } : {}),
    ...(upload.image ? { image: upload.image } : {}),
  };
}
