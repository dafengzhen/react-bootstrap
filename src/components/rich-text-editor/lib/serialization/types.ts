import type { Node as DocNode } from '../model/node.ts';

/**
 * Uploads a file and reports where it ended up.
 *
 * The core never talks to a storage provider: S3, OSS, COS, R2, MinIO or an in-house endpoint
 * is supplied by the application as an adapter.
 *
 * ```ts
 * const upload: FileUploader = {
 *   upload: async (file, options) => ({ url: await myApi.put(file, options?.signal) }),
 * };
 * ```
 */
export interface FileUploader {
  /**
   * Uploads `file` and resolves with its URL and metadata.
   *
   * `options.signal` aborts the upload: the editor aborts the ones still running when it is
   * destroyed, and a caller can abort one by keeping the signal it was handed. An adapter that
   * cannot abort should ignore the signal rather than reject on it — the editor treats a
   * rejection after an abort as the cancellation it asked for.
   */
  upload: (file: File, options?: UploadRequestOptions) => Promise<UploadResult>;
}

/** What an editor passes to a {@link FileUploader} besides the file. */
export interface UploadRequestOptions {
  /** Id of the upload task, which is also the id the upload plugin records. */
  id: string;
  /** Aborts the upload; already aborted when the editor was destroyed first. */
  signal: AbortSignal;
}

/** Upload result, as returned by a `FileUploader`. */
export interface UploadResult {
  /** Height in pixels, when the uploader knows it. */
  height?: number;
  /** MIME type of the uploaded file. */
  mimeType?: string;
  /** Public URL of the uploaded file. */
  url: string;
  /** Width in pixels, when the uploader knows it. */
  width?: number;
}

/** Runtime state of an upload; never part of the persisted document. */
export type UploadStatus = 'error' | 'pending' | 'success' | 'uploading';

/** Placeholder text used for leaves that have no textual representation. */
export const LEAF_PLACEHOLDER = '\ufffc';

/** Converts a document to plain text with the given block separator. */
export function toPlainText(doc: DocNode, blockSeparator = '\n\n'): string {
  return doc.textBetween(0, doc.content.size, blockSeparator, () => LEAF_PLACEHOLDER);
}
