import type { UploadStatus } from '../serialization/types.ts';
import type { EditorState } from '../state/editor-state.ts';
import type { Transaction } from '../state/transaction.ts';

import { PluginKey } from '../state/plugin-key.ts';
import { Plugin } from '../state/plugin.ts';

/**
 * Runtime upload state: an upload is never part of the persisted document (design §70). Progress,
 * temporary URL and failure are runtime data, so a document saved while a file uploads cannot
 * record a half finished upload; the plugin keeps one task per file, and every change goes through
 * a transaction, keeping the runtime state on the same path as the document.
 *
 * The plugin is headless — it never reads a file, calls `fetch` or touches the DOM. Uploading is
 * the application's own `FileUploader` adapter; this plugin only records what happened.
 *
 * ```ts
 * editor.dispatch(startUpload(editor.state, { id: 'a', name: 'photo.png' }));
 * uploadsOf(editor.state); // [{ id: 'a', progress: 0, status: 'uploading', ... }]
 * ```
 */

/**
 * One change to the runtime upload state, carried as transaction metadata and read by the plugin
 * while the state is applied, so nothing mutates the state in place.
 */
export type UploadAction =
  | { error: string; id: string; type: 'fail' }
  | { id: string; name: string; size?: number; status?: 'pending' | 'uploading'; type: 'start' }
  | { id: string; progress: number; type: 'progress' }
  | { id: string; type: 'finish'; url: string };

/** Options of {@link upload}. */
export interface UploadOptions {
  /** How many tasks to keep; the oldest ones are dropped. Defaults to `20`. */
  limit?: number;
}

/** Information a new task starts with. */
export interface UploadStart {
  /** Identifier of the task, unique within one editor. */
  id: string;
  name: string;
  /** Size in bytes, when the caller knows it. */
  size?: number;
  /**
   * Whether the task is already running or still queued; defaults to `"uploading"`. A caller that
   * uploads files one after another starts them as `"pending"`.
   */
  status?: 'pending' | 'uploading';
}

/** Everything the plugin remembers about one editor's uploads. */
export interface UploadState {
  /** Tasks of this editor, oldest first. */
  readonly tasks: readonly UploadTask[];
}

/** One upload known to the editor. */
export interface UploadTask {
  /** Failure message, or `null` while it is fine. */
  error: null | string;
  /** Identifier of the task, unique within one editor. */
  id: string;
  name: string;
  /** Fraction done, from `0` to `1`. */
  progress: number;
  size: null | number;
  status: UploadStatus;
  /** URL the uploader returned on success. */
  url: null | string;
}

/** Metadata key carrying an upload action. */
export const UPLOAD_META = 'uploadAction';

/** Key under which the runtime upload state lives. */
export const uploadKey = new PluginKey<UploadState>('upload');

const EMPTY_UPLOAD_STATE: UploadState = { tasks: [] };

/**
 * Attaches `action` to `tr`, so the plugin records it while the transaction is applied. It is the
 * primitive the four helpers below build on: a command attaches the action to the very transaction
 * that inserts the result, so status and document change in one step.
 */
export function applyUploadAction(tr: Transaction, action: UploadAction): Transaction {
  return tr.setMeta(UPLOAD_META, action);
}

/** Records that a file upload failed. */
export function failUpload(state: EditorState, id: string, error: string): Transaction {
  return applyUploadAction(state.tr, { error, id, type: 'fail' });
}

/** Records the URL an upload finished with. */
export function finishUpload(state: EditorState, id: string, url: string): Transaction {
  return applyUploadAction(state.tr, { id, type: 'finish', url });
}

/** Records that a file went into the upload state. */
export function startUpload(state: EditorState, info: UploadStart): Transaction {
  return applyUploadAction(state.tr, {
    id: info.id,
    name: info.name,
    size: info.size,
    status: info.status,
    type: 'start',
  });
}

/** Records how far an upload got. */
export function updateUpload(state: EditorState, id: string, progress: number): Transaction {
  return applyUploadAction(state.tr, { id, progress, type: 'progress' });
}

/**
 * The upload plugin: a task is added by {@link startUpload}, moved along by {@link updateUpload}
 * and closed by {@link finishUpload} or {@link failUpload}. Every change is dispatched like any
 * other transaction, so a view sees upload progress without the plugin knowing what a view is.
 */
export function upload(options: UploadOptions = {}): Plugin<UploadState> {
  const limit = Math.max(1, options.limit ?? 20);

  return new Plugin<UploadState>({
    key: uploadKey,
    state: {
      apply: (context, value) => {
        // `applyUploadAction` is the only writer of this metadata, so the value has the shape of an
        // `UploadAction`; transactions without it leave the state alone.
        const action = context.meta(UPLOAD_META) as undefined | UploadAction;

        return action ? reduceUpload(value, action, limit) : value;
      },
      init: () => EMPTY_UPLOAD_STATE,
    },
  });
}

/**
 * Upload tasks of `state`, oldest first. An editor without the plugin reports no uploads instead of
 * failing, so a caller can read progress without knowing how the editor was configured.
 */
export function uploadsOf(state: EditorState): readonly UploadTask[] {
  return uploadKey.getState(state)?.tasks ?? [];
}

/** Fraction of an upload, clamped to `0`–`1`; a non-finite value becomes `0`. */
function clampProgress(progress: number): number {
  if (!Number.isFinite(progress)) {
    return 0;
  }

  return Math.min(1, Math.max(0, progress));
}

function limitTasks(tasks: readonly UploadTask[], limit: number): readonly UploadTask[] {
  return tasks.length <= limit ? tasks : tasks.slice(tasks.length - limit);
}

/** Replaces the task with `id`, or keeps the state when there is none. */
function patchTask(
  state: UploadState,
  id: string,
  patch: (task: UploadTask) => UploadTask,
): readonly UploadTask[] {
  if (!state.tasks.some((task) => task.id === id)) {
    return state.tasks;
  }

  return state.tasks.map((task) => (task.id === id ? patch(task) : task));
}

/** Applies one action; one naming an unknown task changes nothing. */
function reduceUpload(state: UploadState, action: UploadAction, limit: number): UploadState {
  switch (action.type) {
    case 'fail':
      return {
        tasks: patchTask(state, action.id, (task) => ({
          ...task,
          error: action.error,
          status: 'error',
        })),
      };
    case 'finish':
      return {
        tasks: limitTasks(
          patchTask(state, action.id, (task) => ({
            ...task,
            error: null,
            progress: 1,
            status: 'success',
            url: action.url,
          })),
          limit,
        ),
      };
    case 'progress': {
      const progress = clampProgress(action.progress);

      // A closed task keeps its outcome: a late progress event must not revive a finished upload.
      return {
        tasks: patchTask(state, action.id, (task) =>
          task.status === 'success' || task.status === 'error'
            ? task
            : { ...task, progress, status: 'uploading' },
        ),
      };
    }
    case 'start':
      return {
        tasks: limitTasks(
          [
            ...state.tasks.filter((task) => task.id !== action.id),
            {
              error: null,
              id: action.id,
              name: action.name,
              progress: 0,
              size: action.size ?? null,
              status: action.status ?? 'uploading',
              url: null,
            },
          ],
          limit,
        ),
      };
  }
}
