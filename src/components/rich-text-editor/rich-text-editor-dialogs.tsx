import clsx from 'clsx';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import type { Editor, EditorView } from './rich-text-editor-lib.ts';
import type { RichTextEditorDialog } from './rich-text-editor-toolbar';
import type { RichTextEditorGalleryGroup } from './types';

import { Button } from '../button';
import { Modal, ModalBody, ModalFooter, ModalHeader, ModalTitle } from '../modal';
import { forEachTextNode } from './lib/command/mark-commands.ts';
import { useRichTextEditor } from './rich-text-editor-context';
import { parseIframeInput } from './rich-text-editor-iframe';
import { TextSelection } from './rich-text-editor-lib.ts';
import {
  findMatches,
  nextMatchIndex,
  replaceAll,
  replaceMatch,
  selectMatch,
} from './rich-text-editor-utils';
import { isSafeMediaUrl, parseVideoUrl } from './rich-text-editor-video.ts';
import styles from './rich-text-editor.module.css';

/**
 * The dialogs the toolbar opens.
 *
 * Every dialog follows the same three rules, and they are the reason the dialogs live in one file:
 *
 * - **The selection is captured when the dialog opens and restored when it closes.** A modal takes
 *   the focus, so the editable area loses the caret; a command run afterwards would apply to a
 *   collapsed selection at the start of the document.
 * - **A dialog never writes to the document while it is open.** It collects values and applies them
 *   once, on confirm, which keeps one user action one undo step.
 * - **A value the editor would refuse is reported, not swallowed.** An unsafe URL, a table size out
 *   of range or an empty query disables the confirm button instead of running a command that
 *   silently reports `false`.
 */

/** Everything the dialog layer needs from the component around it. */
export interface RichTextEditorDialogsProps {
  /** Gallery offered by the image dialog. */
  gallery: RichTextEditorGalleryGroup[];
  /** Closes the open dialog. */
  onClose: () => void;
  /** Dialog that is showing, or `null`. */
  open: null | RichTextEditorDialog;
  /** Uploads one file as an attachment. */
  uploadFile: (file: File) => void;
  /** Uploads one file as an image, through the editor's adapters. */
  uploadImage: (file: File) => void;
}

/** The DOM view behind the editor, which the core interface deliberately does not describe. */
type ViewWithSelection = EditorView;

/** The dialog layer. */
export function RichTextEditorDialogs({
  gallery,
  onClose,
  open,
  uploadFile,
  uploadImage,
}: RichTextEditorDialogsProps) {
  return (
    <>
      <LinkDialog onClose={onClose} open={open === 'link'} />
      <ImageDialog
        gallery={gallery}
        onClose={onClose}
        open={open === 'image'}
        uploadImage={uploadImage}
      />
      <MediaDialog onClose={onClose} open={open === 'media'} uploadFile={uploadFile} />
      <TableDialog onClose={onClose} open={open === 'table'} />
      <FindReplaceDialog onClose={onClose} open={open === 'find'} />
    </>
  );
}

/** Find and replace dialog. */
function FindReplaceDialog({ onClose, open }: { onClose: () => void; open: boolean }) {
  const { editor, state } = useRichTextEditor();
  const [query, setQuery] = useState('');
  const [replacement, setReplacement] = useState('');
  const [caseSensitive, setCaseSensitive] = useState(false);
  const [status, setStatus] = useState('');

  const mode = caseSensitive ? 'case-sensitive' : 'insensitive';
  const matches = useMemo(() => findMatches(state, query, mode), [mode, query, state]);
  const current = matches.length === 0 ? -1 : nextMatchIndex(matches, state);

  useResetOnOpen(open, () => {
    setStatus('');
  });

  const findNext = () => {
    if (matches.length === 0) {
      setStatus('No matches');

      return;
    }

    const index = current < 0 ? 0 : current;
    const match = matches[index];

    if (match) {
      selectMatch(editor, match);
      setStatus(`${index + 1} of ${matches.length}`);
    }
  };

  const replaceCurrent = () => {
    const match = matches[current < 0 ? 0 : current];

    if (!match) {
      setStatus('No matches');

      return;
    }

    replaceMatch(editor, match, replacement);
    setStatus('Replaced one match');
  };

  const replaceEvery = () => {
    const result = replaceAll(editor, query, replacement, mode);

    setStatus(`Replaced ${result.count} match${result.count === 1 ? '' : 'es'}`);
  };

  return (
    <Modal isOpen={open} onOpenChange={(next) => !next && onClose()} size="sm">
      <ModalHeader closeButton>
        <ModalTitle>Find and replace</ModalTitle>
      </ModalHeader>
      <ModalBody>
        <div className="mb-3">
          <label className="form-label" htmlFor="rbs-rte-find-query">
            Find
          </label>
          <input
            className="form-control"
            id="rbs-rte-find-query"
            onChange={(event) => setQuery(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === 'Enter') {
                event.preventDefault();
                findNext();
              }
            }}
            type="search"
            value={query}
          />
          <div className="form-text">
            {query === ''
              ? 'Type to search the document.'
              : `${matches.length} match${matches.length === 1 ? '' : 'es'} in the document`}
          </div>
        </div>
        <div className="mb-3">
          <label className="form-label" htmlFor="rbs-rte-find-replacement">
            Replace with
          </label>
          <input
            className="form-control"
            id="rbs-rte-find-replacement"
            onChange={(event) => setReplacement(event.target.value)}
            type="text"
            value={replacement}
          />
        </div>
        <div className="form-check">
          <input
            checked={caseSensitive}
            className="form-check-input"
            id="rbs-rte-find-case"
            onChange={(event) => setCaseSensitive(event.target.checked)}
            type="checkbox"
          />
          <label className="form-check-label" htmlFor="rbs-rte-find-case">
            Match case
          </label>
        </div>
        {status ? <p className="form-text mb-0 mt-3">{status}</p> : null}
      </ModalBody>
      <ModalFooter className="flex-wrap gap-2">
        <Button onClick={onClose} variant="light">
          Close
        </Button>
        <Button disabled={query === ''} onClick={findNext} variant="outline-secondary">
          Find next
        </Button>
        <Button disabled={query === ''} onClick={replaceCurrent} variant="outline-secondary">
          Replace
        </Button>
        <Button disabled={query === ''} onClick={replaceEvery} variant="danger">
          Replace all
        </Button>
      </ModalFooter>
    </Modal>
  );
}

/** Image dialog: a URL, a local file or an image from the host's gallery. */
function ImageDialog({
  gallery,
  onClose,
  open,
  uploadImage,
}: {
  gallery: RichTextEditorGalleryGroup[];
  onClose: () => void;
  open: boolean;
  uploadImage: (file: File) => void;
}) {
  const { editor, run } = useRichTextEditor();
  const capturedSelection = useCapturedSelection(open);
  const [tab, setTab] = useState<'gallery' | 'upload' | 'url'>('url');
  const [alt, setAlt] = useState('');
  const [height, setHeight] = useState('');
  const [src, setSrc] = useState('');
  const [width, setWidth] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);

  useResetOnOpen(open, () => {
    setAlt('');
    setHeight('');
    setSrc('');
    setWidth('');
  });

  const insert = (image: { alt?: string; height?: number; src: string; width?: number }) => {
    withRestoredSelection(editor, capturedSelection(), () => {
      run('insertImage', {
        alt: image.alt ?? (alt === '' ? undefined : alt),
        height: image.height ?? (height === '' ? undefined : Number(height)),
        src: image.src,
        width: image.width ?? (width === '' ? undefined : Number(width)),
      });
    });
    onClose();
  };

  const urlIsUsable = src.trim() !== '' && isSafeMediaUrl(src);

  return (
    <Modal isOpen={open} onOpenChange={(next) => !next && onClose()} size="lg">
      <ModalHeader closeButton>
        <ModalTitle>Insert image</ModalTitle>
      </ModalHeader>
      <ModalBody>
        <ul className="nav nav-tabs mb-3">
          {(['url', 'upload', 'gallery'] as const).map((entry) => (
            <li className="nav-item" key={entry}>
              <button
                className={clsx('nav-link', tab === entry && 'active')}
                onClick={() => setTab(entry)}
                type="button"
              >
                {entry === 'url' ? 'From URL' : entry === 'upload' ? 'Upload' : 'Gallery'}
              </button>
            </li>
          ))}
        </ul>

        {tab === 'url' ? (
          <>
            <div className="mb-3">
              <label className="form-label" htmlFor="rbs-rte-image-src">
                Image URL
              </label>
              <input
                className="form-control"
                id="rbs-rte-image-src"
                onChange={(event) => setSrc(event.target.value)}
                placeholder="https://example.com/photo.png"
                type="url"
                value={src}
              />
              {src.trim() !== '' && !isSafeMediaUrl(src) ? (
                <div className="invalid-feedback d-block">
                  This URL is not accepted: use an `http`, `https`, `blob` or `data:image` URL.
                </div>
              ) : null}
            </div>
            <div className="row g-3">
              <div className="col-12 col-sm-6">
                <label className="form-label" htmlFor="rbs-rte-image-alt">
                  Alternative text
                </label>
                <input
                  className="form-control"
                  id="rbs-rte-image-alt"
                  onChange={(event) => setAlt(event.target.value)}
                  type="text"
                  value={alt}
                />
              </div>
              <div className="col-6 col-sm-3">
                <label className="form-label" htmlFor="rbs-rte-image-width">
                  Width
                </label>
                <input
                  className="form-control"
                  id="rbs-rte-image-width"
                  min={1}
                  onChange={(event) => setWidth(event.target.value)}
                  placeholder="auto"
                  type="number"
                  value={width}
                />
              </div>
              <div className="col-6 col-sm-3">
                <label className="form-label" htmlFor="rbs-rte-image-height">
                  Height
                </label>
                <input
                  className="form-control"
                  id="rbs-rte-image-height"
                  min={1}
                  onChange={(event) => setHeight(event.target.value)}
                  placeholder="auto"
                  type="number"
                  value={height}
                />
              </div>
            </div>
          </>
        ) : null}

        {tab === 'upload' ? (
          <div className={styles.dropzone}>
            <input
              accept="image/*"
              className="d-none"
              multiple
              onChange={(event) => {
                for (const file of Array.from(event.target.files ?? [])) {
                  withRestoredSelection(editor, capturedSelection(), () => uploadImage(file));
                }
                event.target.value = '';
                onClose();
              }}
              ref={fileRef}
              type="file"
            />
            <p className="mb-3">
              Choose an image from this device; it is inserted once the upload finishes.
            </p>
            <Button onClick={() => fileRef.current?.click()} variant="outline-secondary">
              Choose an image
            </Button>
          </div>
        ) : null}

        {tab === 'gallery' ? (
          gallery.length === 0 ? (
            <p className="text-body-secondary mb-0">
              Pass a `gallery` prop to offer images from the host application.
            </p>
          ) : (
            gallery.map((group) => (
              <div className="mb-3" key={group.label}>
                <div className={styles.panelHeading}>{group.label}</div>
                <div className={styles.gallery}>
                  {group.images.map((image) => (
                    <button
                      className={styles.galleryItem}
                      key={image.id}
                      onClick={() => insert(image)}
                      title={image.title ?? image.alt ?? image.id}
                      type="button"
                    >
                      <img alt={image.alt ?? ''} src={image.src} />
                      {image.title ? <span>{image.title}</span> : null}
                    </button>
                  ))}
                </div>
              </div>
            ))
          )
        ) : null}
      </ModalBody>
      <ModalFooter>
        <Button onClick={onClose} variant="light">
          Cancel
        </Button>
        <Button disabled={tab !== 'url' || !urlIsUsable} onClick={() => insert({ src })}>
          Insert image
        </Button>
      </ModalFooter>
    </Modal>
  );
}

/** Link dialog: the text, the destination and where the link opens. */
function LinkDialog({ onClose, open }: { onClose: () => void; open: boolean }) {
  const { editor, isActive, run } = useRichTextEditor();
  const capturedSelection = useCapturedSelection(open);
  const linkSelection = useRef<null | TextSelection>(null);
  const initialText = useRef('');
  const existing = isActive('link') ? editor.getAttributes('link') : {};
  const [href, setHref] = useState('');
  const [text, setText] = useState('');
  const [target, setTarget] = useState<'_blank' | '_self'>('_blank');
  const [title, setTitle] = useState('');

  const reset = useCallback(() => {
    setHref(String(existing.href ?? ''));
    const selection = (capturedSelection() ?? editor.state.selection) as TextSelection;
    linkSelection.current =
      selection.empty && existing.href
        ? selectionOfLink(editor, selection, String(existing.href))
        : selection;
    initialText.current = editor.state.doc.textBetween(
      linkSelection.current.from,
      linkSelection.current.to,
      '\n',
    );
    setText(initialText.current);
    setTarget((existing.target as '_blank' | '_self') ?? '_blank');
    setTitle(String(existing.title ?? ''));
  }, [editor, existing.href, existing.target, existing.title, capturedSelection]);

  useResetOnOpen(open, reset);

  const confirm = () => {
    withRestoredSelection(editor, linkSelection.current ?? capturedSelection(), () => {
      run('insertLink', {
        href,
        target,
        text: text === initialText.current || text === '' ? undefined : text,
        title: title === '' ? undefined : title,
      });
    });
    onClose();
  };

  return (
    <Modal isOpen={open} onOpenChange={(next) => !next && onClose()} size="sm">
      <ModalHeader closeButton>
        <ModalTitle>{isActive('link') ? 'Edit link' : 'Insert link'}</ModalTitle>
      </ModalHeader>
      <ModalBody>
        <div className="mb-3">
          <label className="form-label" htmlFor="rbs-rte-link-text">
            Link text
          </label>
          <input
            className="form-control"
            id="rbs-rte-link-text"
            onChange={(event) => setText(event.target.value)}
            placeholder="Selected text is used when this is empty"
            type="text"
            value={text}
          />
        </div>
        <div className="mb-3">
          <label className="form-label" htmlFor="rbs-rte-link-href">
            Destination
          </label>
          <input
            className="form-control"
            id="rbs-rte-link-href"
            onChange={(event) => setHref(event.target.value)}
            placeholder="https://example.com"
            type="url"
            value={href}
          />
          <div className="form-text">
            Relative, `http`, `https`, `mailto` and `tel` URLs are accepted.
          </div>
        </div>
        <div className="mb-3">
          <label className="form-label" htmlFor="rbs-rte-link-target">
            Opens in
          </label>
          <select
            className="form-select"
            id="rbs-rte-link-target"
            onChange={(event) => setTarget(event.target.value === '_self' ? '_self' : '_blank')}
            value={target}
          >
            <option value="_blank">A new tab</option>
            <option value="_self">The current tab</option>
          </select>
        </div>
        <div>
          <label className="form-label" htmlFor="rbs-rte-link-title">
            Title
          </label>
          <input
            className="form-control"
            id="rbs-rte-link-title"
            onChange={(event) => setTitle(event.target.value)}
            placeholder="Shown as a tooltip"
            type="text"
            value={title}
          />
        </div>
      </ModalBody>
      <ModalFooter>
        {isActive('link') ? (
          <Button
            className="me-auto"

            onClick={() => {
              withRestoredSelection(editor, linkSelection.current ?? capturedSelection(), () =>
                run('unsetLink'),
              );
              onClose();
            }}
            variant="outline-secondary"
          >
            Remove link
          </Button>
        ) : null}
        <Button onClick={onClose} variant="light">
          Cancel
        </Button>
        <Button disabled={href.trim() === ''} onClick={confirm}>
          {isActive('link') ? 'Update' : 'Insert'}
        </Button>
      </ModalFooter>
    </Modal>
  );
}

/** Media dialog: video, audio, attachment, embed and custom card. */
function MediaDialog({
  onClose,
  open,
  uploadFile,
}: {
  onClose: () => void;
  open: boolean;
  uploadFile: (file: File) => void;
}) {
  const { editor, run } = useRichTextEditor();
  const capturedSelection = useCapturedSelection(open);
  const [tab, setTab] = useState<'attachment' | 'audio' | 'card' | 'embed' | 'iframe' | 'video'>(
    'video',
  );
  const [url, setUrl] = useState('');
  const [title, setTitle] = useState('');
  const [name, setName] = useState('');
  const [poster, setPoster] = useState('');
  const [html, setHtml] = useState('');
  const [kind, setKind] = useState('custom');
  const fileRef = useRef<HTMLInputElement>(null);

  useResetOnOpen(open, () => {
    setHtml('');
    setName('');
    setPoster('');
    setTitle('');
    setUrl('');
  });

  const apply = () => {
    withRestoredSelection(editor, capturedSelection(), () => {
      if (tab === 'video') {
        const source = parseVideoUrl(url);

        run('insertVideo', {
          id: source?.id ?? undefined,
          poster: poster === '' ? undefined : poster,
          provider: source?.provider ?? 'custom',
          url: source?.url ?? url,
        });

        return;
      }

      if (tab === 'iframe') {
        const source = parseIframeInput(url, document);
        if (source) {
          run('insertEmbed', { ...source, provider: 'iframe' });
        }
        return;
      }

      if (tab === 'audio') {
        run('insertAudio', { src: url, title: title === '' ? undefined : title });

        return;
      }

      if (tab === 'attachment') {
        run('insertAttachment', { name: name === '' ? url : name, url });

        return;
      }

      if (tab === 'embed') {
        if (html.trim().toLowerCase().startsWith('<iframe')) {
          const source = parseIframeInput(html, document);
          if (source) {
            run('insertEmbed', { ...source, provider: 'iframe' });
          }
          return;
        }
        if (html.trim() !== '') {
          run('insertEmbedBlock', { html, title: title === '' ? undefined : title });
        } else {
          run('insertEmbed', { title: title === '' ? undefined : title, url });
        }

        return;
      }

      run('insertCustomBlock', { html, kind, title: title === '' ? undefined : title });
    });
    onClose();
  };

  const confirmDisabled =
    (tab === 'video' && parseVideoUrl(url) === null) ||
    (tab === 'iframe' && parseIframeInput(url, document) === null) ||
    (tab === 'audio' && !isSafeMediaUrl(url)) ||
    (tab === 'attachment' && !isSafeMediaUrl(url)) ||
    (tab === 'embed' && html.trim() === '' && !isSafeMediaUrl(url)) ||
    (tab === 'embed' &&
      html.trim().toLowerCase().startsWith('<iframe') &&
      parseIframeInput(html, document) === null) ||
    (tab === 'card' && html.trim() === '');

  return (
    <Modal isOpen={open} onOpenChange={(next) => !next && onClose()} size="lg">
      <ModalHeader closeButton>
        <ModalTitle>Insert media</ModalTitle>
      </ModalHeader>
      <ModalBody>
        <ul className="nav nav-tabs mb-3">
          {(
            [
              ['video', 'Video'],
              ['iframe', 'Iframe'],
              ['audio', 'Audio'],
              ['attachment', 'Attachment'],
              ['embed', 'Embed'],
              ['card', 'Custom card'],
            ] as const
          ).map(([value, label]) => (
            <li className="nav-item" key={value}>
              <button
                className={clsx('nav-link', tab === value && 'active')}
                onClick={() => setTab(value)}
                type="button"
              >
                {label}
              </button>
            </li>
          ))}
        </ul>

        {tab === 'video' ? (
          <>
            <div className="mb-3">
              <label className="form-label" htmlFor="rbs-rte-video-url">
                Video URL
              </label>
              <input
                className="form-control"
                id="rbs-rte-video-url"
                onChange={(event) => setUrl(event.target.value)}
                placeholder="https://www.youtube.com/watch?v=… or a .mp4 URL"
                type="url"
                value={url}
              />
              <div className="form-text">
                YouTube, Bilibili and Vimeo links use iframe players. Video files use a native video
                player; other HTTP(S) addresses are embedded in an iframe.
              </div>
            </div>
            <div>
              <label className="form-label" htmlFor="rbs-rte-video-poster">
                Poster image
              </label>
              <input
                className="form-control"
                id="rbs-rte-video-poster"
                onChange={(event) => setPoster(event.target.value)}
                placeholder="Optional"
                type="url"
                value={poster}
              />
            </div>
          </>
        ) : null}

        {tab === 'audio' ? (
          <>
            <div className="mb-3">
              <label className="form-label" htmlFor="rbs-rte-audio-src">
                Audio URL
              </label>
              <input
                className="form-control"
                id="rbs-rte-audio-src"
                onChange={(event) => setUrl(event.target.value)}
                placeholder="https://example.com/track.mp3"
                type="url"
                value={url}
              />
            </div>
            <div>
              <label className="form-label" htmlFor="rbs-rte-audio-title">
                Title
              </label>
              <input
                className="form-control"
                id="rbs-rte-audio-title"
                onChange={(event) => setTitle(event.target.value)}
                type="text"
                value={title}
              />
            </div>
          </>
        ) : null}

        {tab === 'iframe' ? (
          <div className="mb-3">
            <label className="form-label" htmlFor="rbs-rte-iframe-source">
              Iframe URL or embed code
            </label>
            <textarea
              className="form-control font-monospace"
              id="rbs-rte-iframe-source"
              onChange={(event) => setUrl(event.target.value)}
              placeholder={
                'https://example.com/player or <iframe src="https://example.com/player"></iframe>'
              }
              rows={4}
              value={url}
            />
            <div className="form-text">
              Only HTTP(S) sources are allowed. Supplied scripts, srcdoc and iframe permissions are
              not used.
            </div>
          </div>
        ) : null}

        {tab === 'attachment' ? (
          <>
            <div className="mb-3">
              <label className="form-label" htmlFor="rbs-rte-file-url">
                File URL
              </label>
              <input
                className="form-control"
                id="rbs-rte-file-url"
                onChange={(event) => setUrl(event.target.value)}
                placeholder="https://example.com/report.pdf"
                type="url"
                value={url}
              />
            </div>
            <div className="mb-3">
              <label className="form-label" htmlFor="rbs-rte-file-name">
                File name
              </label>
              <input
                className="form-control"
                id="rbs-rte-file-name"
                onChange={(event) => setName(event.target.value)}
                placeholder="Defaults to the URL"
                type="text"
                value={name}
              />
            </div>
            <input
              className="d-none"
              onChange={(event) => {
                const file = event.target.files?.[0];

                if (file) {
                  uploadFile(file);
                  onClose();
                }

                event.target.value = '';
              }}
              ref={fileRef}
              type="file"
            />
            <Button onClick={() => fileRef.current?.click()} size="sm" variant="outline-secondary">
              Upload a file instead
            </Button>
          </>
        ) : null}

        {tab === 'embed' ? (
          <>
            <div className="mb-3">
              <label className="form-label" htmlFor="rbs-rte-embed-url">
                Resource URL
              </label>
              <input
                className="form-control"
                id="rbs-rte-embed-url"
                onChange={(event) => setUrl(event.target.value)}
                placeholder="https://www.figma.com/embed?…"
                type="url"
                value={url}
              />
            </div>
            <div className="mb-3">
              <label className="form-label" htmlFor="rbs-rte-embed-html">
                Raw embed markup
              </label>
              <textarea
                className="form-control font-monospace"
                id="rbs-rte-embed-html"
                onChange={(event) => setHtml(event.target.value)}
                placeholder='<blockquote class="twitter-tweet">…</blockquote>'
                rows={4}
                value={html}
              />
              <div className="form-text">
                Markup is stored as data on the node and framed by the host, never executed inside
                the editor.
              </div>
            </div>
            <div>
              <label className="form-label" htmlFor="rbs-rte-embed-title">
                Title
              </label>
              <input
                className="form-control"
                id="rbs-rte-embed-title"
                onChange={(event) => setTitle(event.target.value)}
                placeholder="Accessible name of the frame"
                type="text"
                value={title}
              />
            </div>
          </>
        ) : null}

        {tab === 'card' ? (
          <>
            <div className="row g-3">
              <div className="col-12 col-sm-4">
                <label className="form-label" htmlFor="rbs-rte-card-kind">
                  Card type
                </label>
                <input
                  className="form-control"
                  id="rbs-rte-card-kind"
                  onChange={(event) => setKind(event.target.value)}
                  type="text"
                  value={kind}
                />
              </div>
              <div className="col-12 col-sm-8">
                <label className="form-label" htmlFor="rbs-rte-card-title">
                  Card title
                </label>
                <input
                  className="form-control"
                  id="rbs-rte-card-title"
                  onChange={(event) => setTitle(event.target.value)}
                  type="text"
                  value={title}
                />
              </div>
            </div>
            <div className="mt-3">
              <label className="form-label" htmlFor="rbs-rte-card-html">
                Card markup
              </label>
              <textarea
                className="form-control font-monospace"
                id="rbs-rte-card-html"
                onChange={(event) => setHtml(event.target.value)}
                placeholder='<div class="poll">…</div>'
                rows={5}
                value={html}
              />
              <div className="form-text">
                The card keeps its type, title and markup as node attributes, so a host component
                can render it inside the document.
              </div>
            </div>
          </>
        ) : null}
      </ModalBody>
      <ModalFooter>
        <Button onClick={onClose} variant="light">
          Cancel
        </Button>
        <Button disabled={confirmDisabled} onClick={apply}>
          Insert
        </Button>
      </ModalFooter>
    </Modal>
  );
}

/**
 * Reads the browser's own selection into the editor, and reports it.
 *
 * The view owns the bridge between a DOM position and a document position, so this asks the view
 * rather than reading `window.getSelection` and guessing. A selection the bridge cannot map — a range
 * in another element, a node the document does not hold — is reported as `null` and the caller keeps
 * the engine's own answer.
 */
function readBrowserSelection(editor: Editor): null | TextSelection {
  const view = editor.view as null | ViewWithSelection;

  if (!view || typeof view.readSelection !== 'function') {
    return null;
  }

  const selection = view.readSelection();

  if (!selection) {
    return null;
  }

  editor.runCommand((state, dispatch) => {
    if (!dispatch) {
      return true;
    }

    dispatch(state.tr.setSelection(selection));

    return true;
  });

  return selection as TextSelection;
}

/** A caret inside an existing link edits its full contiguous text, including other text marks. */
function selectionOfLink(editor: Editor, selection: TextSelection, href: string): TextSelection {
  const ranges: { from: number; to: number }[] = [];
  forEachTextNode(editor.state.doc, 0, editor.state.doc.content.size, (node, start) => {
    if (!node.markSet.some((mark) => mark.type.name === 'link' && mark.attrs.href === href)) {
      return;
    }
    const previous = ranges.at(-1);
    if (previous?.to === start) {
      previous.to = start + node.nodeSize;
    } else {
      ranges.push({ from: start, to: start + node.nodeSize });
    }
  });
  const range = ranges.find(({ from, to }) => from <= selection.from && selection.from <= to);
  return range ? TextSelection.create(editor.state.doc, range.from, range.to) : selection;
}

/** Table dialog: the size of the table to insert. */
function TableDialog({ onClose, open }: { onClose: () => void; open: boolean }) {
  const { editor, run } = useRichTextEditor();
  const capturedSelection = useCapturedSelection(open);
  const [columns, setColumns] = useState('3');
  const [rows, setRows] = useState('3');

  useResetOnOpen(open, () => {
    setColumns('3');
    setRows('3');
  });

  const count = (value: string) => {
    const parsed = Number.parseInt(value, 10);

    return Number.isInteger(parsed) && parsed >= 1 && parsed <= 100 ? parsed : null;
  };

  const rowCount = count(rows);
  const columnCount = count(columns);

  return (
    <Modal isOpen={open} onOpenChange={(next) => !next && onClose()} size="sm">
      <ModalHeader closeButton>
        <ModalTitle>Insert table</ModalTitle>
      </ModalHeader>
      <ModalBody>
        <div className="row g-3">
          <div className="col-6">
            <label className="form-label" htmlFor="rbs-rte-table-rows">
              Rows
            </label>
            <input
              className="form-control"
              id="rbs-rte-table-rows"
              max={100}
              min={1}
              onChange={(event) => setRows(event.target.value)}
              type="number"
              value={rows}
            />
          </div>
          <div className="col-6">
            <label className="form-label" htmlFor="rbs-rte-table-columns">
              Columns
            </label>
            <input
              className="form-control"
              id="rbs-rte-table-columns"
              max={100}
              min={1}
              onChange={(event) => setColumns(event.target.value)}
              type="number"
              value={columns}
            />
          </div>
        </div>
        <p className="form-text mb-0 mt-3">
          Rows and columns are added or merged afterwards from the table controls, and a merged cell
          keeps its span in the document.
        </p>
      </ModalBody>
      <ModalFooter>
        <Button onClick={onClose} variant="light">
          Cancel
        </Button>
        <Button
          disabled={rowCount === null || columnCount === null}
          onClick={() => {
            withRestoredSelection(editor, capturedSelection(), () => {
              run('insertTable', { columns: columnCount, rows: rowCount });
            });
            onClose();
          }}
        >
          Insert table
        </Button>
      </ModalFooter>
    </Modal>
  );
}

/**
 * Remembers the selection a dialog was opened with.
 *
 * A modal moves the focus, and the browser collapses the selection in a contenteditable element when
 * it loses focus; without this the command a dialog runs would apply to a caret at the start of the
 * document instead of the range the user had selected. The capture runs in the effect the `open` flag
 * schedules, which is still before the dialog takes the focus, so the range is the one on screen when
 * the control was pressed.
 */
function useCapturedSelection(open: boolean): () => null | TextSelection {
  const { editor } = useRichTextEditor();
  const captured = useRef<null | TextSelection>(null);
  const wasOpen = useRef(false);

  useEffect(() => {
    if (!open) {
      wasOpen.current = false;
      captured.current = null;

      return;
    }

    if (wasOpen.current) {
      return;
    }

    wasOpen.current = true;
    captured.current = (readBrowserSelection(editor) ?? editor.state.selection) as TextSelection;
  }, [editor, open]);

  /*
   * The range is read through a function rather than returned from the hook, because the value has to
   * be the *current* one when the user confirms. A dialog is rendered by a component that does not
   * re-render when the editor state changes — the editor is not React state — so a captured *value*
   * read into a closure would be the one from the render that opened the dialog, and the range it
   * describes is older than the one the engine is holding.
   */
  return () => captured.current;
}

/** Runs `reset` during the commit that turns `open` true. */
function useResetOnOpen(open: boolean, reset: () => void): void {
  const wasOpen = useRef(false);
  const latest = useRef(reset);

  // The ref holds the latest callback so the effect below can depend on `open` alone; writing it
  // during render is the documented pattern for "latest value" refs and it changes nothing the
  // component renders.
  // oxlint-disable-next-line react/refs
  latest.current = reset;

  useEffect(() => {
    if (open && !wasOpen.current) {
      wasOpen.current = true;
      latest.current();
    } else if (!open && wasOpen.current) {
      wasOpen.current = false;
    }
  }, [open]);
}

/**
 * Runs `action` against the selection a dialog captured.
 *
 * The order of the three steps is the whole point. A dialog moves the focus into itself, and a
 * command acts on the editor the keyboard is talking to, so the editor is focused first — but
 * focusing a view also writes the *current* range back into the browser, which is the collapsed caret
 * the dialog left behind. The range is therefore restored after the focus, and the browser is brought
 * back in step, so the engine and the DOM agree on the range the command is about to change.
 */
function withRestoredSelection(
  editor: Editor,
  selection: null | TextSelection,
  action: () => void,
) {
  console.log('RTE restore', {
    before: JSON.stringify(editor.state.selection.toJSON()),
    hasSelection: Boolean(selection),
    saved: selection ? JSON.stringify(selection.toJSON()) : null,
  });

  editor.focus();

  if (selection) {
    editor.runCommand((state, dispatch) => {
      if (!dispatch) {
        return true;
      }

      dispatch(state.tr.setSelection(selection));

      return true;
    });
    writeBrowserSelection(editor);
  }

  console.log('RTE restore after', JSON.stringify(editor.state.selection.toJSON()));
  action();
}

/**
 * Puts the browser's own selection back where the editor's selection is.
 *
 * `focus()` writes the range it finds, which is the collapsed one a modal left behind; this writes the
 * range the editor holds *now*. The positions come from the view's bridge in both directions, so a
 * document position becomes the DOM position of the character it stands for.
 */
function writeBrowserSelection(editor: Editor): void {
  const view = editor.view as null | ViewWithSelection;
  const dom = view?.dom as HTMLElement | undefined;
  const document = dom?.ownerDocument;

  if (!view || !document || typeof view.domAtPos !== 'function') {
    return;
  }

  const { from, to } = editor.state.selection;
  const anchor = view.domAtPos(from);
  const head = view.domAtPos(to);

  if (!anchor || !head) {
    return;
  }

  const range = document.createRange();

  try {
    range.setStart(anchor.node as Node, anchor.offset);
    range.setEnd(head.node as Node, head.offset);
  } catch {
    return;
  }

  const browserSelection = document.getSelection();

  browserSelection?.removeAllRanges();
  browserSelection?.addRange(range);
}

/**
 * Reads the browser's own selection into the editor, and reports it.
 *
 * The view owns the bridge between a DOM position and a document position, so this asks the view
 * rather than reading `window.getSelection` and guessing. A selection the bridge cannot map — a range
 * in another element, a node the document does not hold — is reported as `null` and the caller keeps
 * the engine's own answer.
 */
