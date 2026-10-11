export {
  insertAttachment,
  insertAudio,
  insertImage,
  insertVideo,
  mediaCommands,
  mediaRuntimeFor,
  registerMediaRuntime,
  uploadAndInsert,
} from './command/media-commands.ts';
export type { MediaRuntime, UploadInsertOptions } from './command/media-commands.ts';

/**
 * `@dafengzhen/editor` — a framework agnostic rich text editor.
 *
 * The core is headless and works anywhere; the view adds the DOM, and importing this entry point
 * registers it so `element` works straight away.
 *
 * ```ts
 * import { Editor, StarterKit } from '@dafengzhen/editor';
 *
 * const editor = new Editor({ element: '#editor', extensions: [StarterKit] });
 * editor.commands.insertText({ text: 'Hello' });
 * editor.commands.toggleBold();
 * editor.getJSON();
 * ```
 */
export * from './core.ts';
// Media is not part of the starter kit (design §79): it is added on demand, and the extension
// carries the DOM rules and the image node view with it, so this entry point is where it belongs.
export {
  attachment,
  audio,
  image,
  mediaExtension,
  MediaKit,
  mediaNodes,
  video,
} from './extensions/media.ts';
export {
  applyUploadAction,
  failUpload,
  finishUpload,
  startUpload,
  updateUpload,
  upload,
  UPLOAD_META,
  uploadKey,
  uploadsOf,
} from './plugins/upload.ts';
export type {
  UploadAction,
  UploadOptions,
  UploadStart,
  UploadState,
  UploadTask,
} from './plugins/upload.ts';
export * from './view';
export { imageNodeView, mediaDOMRules } from './view/media-rules.ts';
