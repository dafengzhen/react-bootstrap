/**
 * Turning a pasted media URL into the attributes the editor's media commands need.
 *
 * The toolbar owns a small URL box for video, audio and files, so it asks this module what a pasted
 * string *is* before it calls a command: {@link parseVideoUrl} answers with the provider and the id
 * the `video` node stores, {@link parseAudioUrl} with the source and media type of an audio player,
 * and {@link isSafeMediaUrl} with whether the editor's URL policy will accept the value at all — a
 * `javascript:` URL makes `insertVideo` report `false` and change nothing, and a toolbar that warns
 * before calling it does better than one that fails silently.
 *
 * The module is pure: it touches `URL` and `Intl` and nothing else, no DOM, no imports, and every
 * function is a total function from a string to a value.
 */

/** Providers the video node understands, mirroring the engine's `VideoProvider`. */
export type RichTextEditorVideoProvider = 'bilibili' | 'custom' | 'native' | 'vimeo' | 'youtube';

/** A video URL understood by the editor: which provider it belongs to and its provider id, when it has one. */
export interface VideoSource {
  /** Provider id extracted from the URL, or null when the provider does not use one. */
  id: null | string;
  /**
   * Poster image URL, when the host supplied one.
   *
   * Resolving a pasted URL reaches no network, so a provider that can be asked for a thumbnail
   * (bilibili and Vimeo both have an endpoint) is a host decision rather than one this module
   * makes: the field is `null` here and a caller fills it in before the command runs.
   */
  poster: null | string;
  provider: RichTextEditorVideoProvider;
  /** Normalized URL to store on the node. */
  url: string;
}

/** Media type of an audio file, by its extension; anything else is `null`. */
const AUDIO_MIME_TYPES: Readonly<Record<string, string>> = {
  '.aac': 'audio/aac',
  '.flac': 'audio/flac',
  '.m4a': 'audio/mp4',
  '.mp3': 'audio/mpeg',
  '.oga': 'audio/ogg',
  '.ogg': 'audio/ogg',
  '.wav': 'audio/wav',
  '.weba': 'audio/webm',
};

/** Hosts that serve bilibili: the site itself and its short link domain. */
const BILIBILI_HOSTS: readonly string[] = ['b23.tv', 'bilibili.com'];

/** Schemes a media URL may use. `blob:` is a file the page itself created. */
const MEDIA_PROTOCOLS: readonly string[] = ['blob:', 'http:', 'https:'];

/** Extensions a native video source may end in, the containers a `<video>` element plays. */
const NATIVE_VIDEO_EXTENSIONS: readonly string[] = [
  '.m3u8',
  '.mov',
  '.mp4',
  '.mpd',
  '.ogg',
  '.ogv',
  '.webm',
];

/** Hosts that serve YouTube, including the music and mobile front ends. */
const YOUTUBE_HOSTS: readonly string[] = [
  'm.youtube.com',
  'music.youtube.com',
  'youtube.com',
  'youtu.be',
];

/**
 * Formats a date in one of the picker's patterns, on the locale the page runs in.
 *
 * The keys the toolbar offers are handled here: `'date'` and `'time'` are the ISO spellings a
 * document wants, `'date-time'` joins them with a space, `'long'` and `'full'` are the localized
 * date, and `'relative'` is how long ago the date was. An unknown key has no pattern to apply, so
 * the date comes back as its ISO string rather than as a guess.
 *
 * Local wall clock is deliberate: a user who picked `14:30` in the picker expects `14:30` when the
 * toolbar reads the value back, whatever the host's time zone is. Every formatting decision is made
 * through `Intl`, with the locale left to the page.
 */
export function formatDateTime(date: Date, format: string): string {
  switch (format) {
    case 'date':
      return isoDate(date);
    case 'date-time':
      return `${isoDate(date)} ${isoTime(date)}`;
    case 'full':
      return formatWithIntl(date, undefined, { dateStyle: 'full' });
    case 'long':
      return formatWithIntl(date, undefined, { dateStyle: 'long' });
    case 'relative':
      return relativeTime(date);
    case 'time':
      return isoTime(date);
    default:
      return date.toISOString();
  }
}

/**
 * Formats a byte count for a user: `0 B`, `1.4 KB`, `12 MB`.
 *
 * The size is read as binary (1024 bytes to a kilobyte), which is what a browser reports for a
 * `File`, and a value below ten units keeps one decimal so that two files of different sizes do not
 * both read as `1 KB`. A negative, infinite or absent count formats as `0 B` rather than as
 * `NaN KB`.
 */
export function formatFileSize(bytes: number): string {
  if (!Number.isFinite(bytes) || bytes <= 0) {
    return '0 B';
  }

  const units = ['B', 'KB', 'MB', 'GB', 'TB', 'PB'];
  let value = bytes;
  let unit = 0;

  while (value >= 1024 && unit < units.length - 1) {
    value /= 1024;
    unit += 1;
  }

  // Rounding to one decimal and parsing the text back drops a trailing `.0`, so 1024 is `1 KB`.
  const rounded = unit === 0 ? String(value) : String(Number.parseFloat(value.toFixed(1)));

  return `${rounded} ${units[unit]}`;
}

/**
 * Whether the editor's URL policy keeps `url`, so the toolbar can warn before running a command.
 *
 * The answer is the policy, not a second opinion about it: `http:`, `https:` and `blob:` are media
 * sources, a relative URL resolves against the page that already runs the document, a protocol
 * relative URL inherits the page's scheme, and a `data:` URL is media only when it carries an image.
 * `javascript:` and everything else it could be spelled as — `vbscript:`, a `file:` path, a `data:`
 * URL carrying a document — is refused, and a value the URL parser cannot read at all is refused
 * with them.
 */
export function isSafeMediaUrl(url: string): boolean {
  const trimmed = url.trim();

  if (trimmed.startsWith('//')) {
    // A protocol relative URL carries no scheme of its own, so nothing is taken from the input.
    return true;
  }

  if (trimmed === '') {
    return false;
  }

  let parsed: URL;

  try {
    parsed = new URL(trimmed);
  } catch {
    // A relative URL (`media/clip.mp4`, `/docs/clip.mp4`, `#clip`) is read against the page.
    return !hasScheme(trimmed);
  }

  if (MEDIA_PROTOCOLS.includes(parsed.protocol)) {
    return true;
  }

  return parsed.protocol === 'data:' && parsed.pathname.toLowerCase().startsWith('image/');
}

/**
 * Reads an audio URL into the source and media type `insertAudio` needs.
 *
 * An audio node holds a `src` and an optional `mimeType`, and a browser only needs the source, so
 * the media type is a best effort from the file extension: a URL that names none comes back with
 * `mimeType: null` rather than with a type the file may not be. An empty string, a relative path, a
 * scheme the editor refuses and anything the URL parser cannot read are all `null`, while a bare
 * host such as `cdn.example.com/clip.mp3` is retried as `https://`, the same way
 * {@link parseVideoUrl} reads one.
 */
export function parseAudioUrl(input: string): { mimeType: null | string; src: string } | null {
  const parsed = parseAbsoluteUrl(input);

  if (!parsed) {
    return null;
  }

  return { mimeType: AUDIO_MIME_TYPES[extensionOf(parsed.url)] ?? null, src: parsed.url };
}

/**
 * Reads a video URL into a {@link VideoSource}, or null when it is empty or not a URL.
 *
 * What the URL *is* decides the provider:
 *
 * - `youtube.com/watch?v=ID`, `youtube.com/embed/ID`, `youtube.com/shorts/ID`, `youtu.be/ID` and
 *   the music front end are YouTube; the id is the video id and the URL is normalized to
 *   `https://www.youtube.com/watch?v=ID`, so the same video pasted five ways is one URL. Without an
 *   id there is nothing to embed, so the URL is not a video.
 * - `bilibili.com/video/BV…`, `bilibili.com/video/av…` and `b23.tv/…` are bilibili. The id is the
 *   `BV…` or `av…` segment when one is visible — a short link hides it behind a redirect this
 *   module does not follow — and the URL is kept with the scheme it was given.
 * - `vimeo.com/123456789` is Vimeo, with the numeric id.
 * - A path that ends in a video container (`.mp4`, `.webm`, `.ogg`, `.ogv`, `.mov`, `.m3u8`,
 *   `.mpd`) is a native source: the editor plays it in a `<video>` element.
 * - Anything else that parses as a URL is `custom` and is embedded as the provider's own player.
 *
 * A relative URL is not a video: no provider can be read from a path, and the editor has no base
 * to resolve it against.
 */
export function parseVideoUrl(input: string): null | VideoSource {
  const parsed = parseAbsoluteUrl(input);

  if (!parsed) {
    return null;
  }

  const host = hostOf(parsed.url);

  if (YOUTUBE_HOSTS.includes(host)) {
    return youtubeSource(parsed.url);
  }

  if (bilibiliHost(host)) {
    return bilibiliSource(parsed.url);
  }

  if (host === 'vimeo.com') {
    return vimeoSource(parsed.url);
  }

  const path = pathOf(parsed.url).toLowerCase();

  if (NATIVE_VIDEO_EXTENSIONS.some((extension) => path.endsWith(extension))) {
    return { id: null, poster: null, provider: 'native', url: parsed.url };
  }

  return { id: null, poster: null, provider: 'custom', url: parsed.url };
}

/** Whether `host` is bilibili or one of its subdomains, or the `b23.tv` short link domain. */
function bilibiliHost(host: string): boolean {
  return BILIBILI_HOSTS.some((known) => host === known || host.endsWith(`.${known}`));
}

/** A bilibili source: the `BV…` or `av…` id when the path shows one, the URL with its scheme. */
function bilibiliSource(url: string): VideoSource {
  const match = /(?:^|\/)((?:av|bv)[\da-z]+)/i.exec(pathOf(url));

  return {
    id: match?.[1] ?? null,
    poster: null,
    provider: 'bilibili',
    url,
  };
}

/** The extension of `text` in lower case, dot included, or `''` when it has none. */
function extensionOf(text: string): string {
  const path = pathOf(text);
  const dot = path.lastIndexOf('.');

  return dot <= 0 ? '' : path.slice(dot).toLowerCase();
}

/** `date` through `Intl.DateTimeFormat`, so the page's locale picks the wording. */
function formatWithIntl(
  date: Date,
  locale: string | undefined,
  options: Intl.DateTimeFormatOptions,
): string {
  return new Intl.DateTimeFormat(locale, options).format(date);
}

/** The video id of a YouTube URL, `null` when the URL carries none. */
function googleVideoId(url: string): null | string {
  const host = hostOf(url);
  const segments = pathSegments(url);

  if (host === 'youtu.be') {
    // A short link may carry the timestamp or the playlist as a fragment or a query.
    return videoId(segments[0]);
  }

  const query = new URL(url).searchParams.get('v');

  if (query !== null) {
    return videoId(query);
  }

  const [kind, id] = segments;

  return kind === 'embed' || kind === 'shorts' ? videoId(id) : null;
}

/**
 * Whether `value` already names a scheme.
 *
 * The test is a scheme as the URL standard spells one — a letter followed by letters, digits, `+`,
 * `-` or `.`, then a colon — so `youtu.be/clip` is a bare host to retry with `https://`, while
 * `javascript:alert(1)` names one and is left for the parser to refuse.
 */
function hasScheme(value: string): boolean {
  return /^[a-z][a-z\d+.-]*:/i.test(value);
}

/** The host of `url` without a leading `www.`, or `''` when it does not parse. */
function hostOf(url: string): string {
  const host = probe(url)?.hostname.toLowerCase() ?? '';

  return host.startsWith('www.') ? host.slice(4) : host;
}

/** `date` as `2024-05-06`, from the local wall clock. */
function isoDate(date: Date): string {
  return [
    String(date.getFullYear()).padStart(4, '0'),
    String(date.getMonth() + 1).padStart(2, '0'),
    String(date.getDate()).padStart(2, '0'),
  ].join('-');
}

/** `date` as `14:30`, from the local wall clock. */
function isoTime(date: Date): string {
  return [
    String(date.getHours()).padStart(2, '0'),
    String(date.getMinutes()).padStart(2, '0'),
  ].join(':');
}

/**
 * Whether `value` opens with something that can only be a host: `youtu.be`, `cdn.example.com`.
 *
 * A relative path is one segment that names no host (`media/clip.mp4`, `docs/guide.html`) or a
 * leading slash, and neither becomes a URL the user meant by having `https://` put in front of it.
 */
function looksLikeBareHost(value: string): boolean {
  if (value.startsWith('/')) {
    return false;
  }

  const segment = value.split('/')[0] ?? '';

  return /^[\da-z-]+(?:\.[\da-z-]+)+(?::\d+)?$/i.test(segment);
}

/**
 * Reads `input` as an absolute URL, or `null` when it is not one.
 *
 * A bare host such as `youtu.be/dQw4w9WgXcQ` is what a user pastes as often as a full URL, so a
 * value that does not parse and does not name a scheme is retried with `https://` in front of it —
 * but only when its first segment looks like a host, because a relative path such as
 * `media/clip.mp4` is a path on the page that runs the editor, and prefixing that one would invent
 * a host the user never named.
 *
 * Only a scheme that names a resource the page can actually load is read — `http:`, `https:` and
 * `blob:` — so `javascript:`, `file:` and a `data:` URL are not a video: the editor's URL policy
 * refuses every one of them, and a value it will refuse is better reported as "not a URL" by the
 * toolbar than kept as a source that makes a command report `false` and change nothing.
 */
function parseAbsoluteUrl(input: string): { url: string } | null {
  const trimmed = input.trim();

  if (trimmed === '') {
    return null;
  }

  const direct = probe(trimmed);

  if (direct) {
    return MEDIA_PROTOCOLS.includes(direct.protocol) ? { url: trimmed } : null;
  }

  if (!looksLikeBareHost(trimmed)) {
    return null;
  }

  const prefixed = probe(`https://${trimmed}`);

  return prefixed ? { url: `https://${trimmed}` } : null;
}

/** The path of `url` without its query or fragment, or `''` when it does not parse. */
function pathOf(url: string): string {
  return probe(url)?.pathname ?? '';
}

/** The path segments of `url`, empty ones dropped, as a URL's path is read. */
function pathSegments(url: string): string[] {
  return pathOf(url)
    .split('/')
    .filter((segment) => segment !== '');
}

/** `url` parsed as a URL, or `null` when the parser refuses it. */
function probe(url: string): null | URL {
  try {
    return new URL(url);
  } catch {
    return null;
  }
}

/**
 * The date as it reads to someone looking at it now: `2 hours ago`, `in 3 days`.
 *
 * The unit is the largest whose value is at least one, so a date a week old reads in days rather
 * than in hours; `numeric: 'always'` writes `1 day ago` instead of `yesterday`, which keeps the
 * wording stable as a document is edited.
 */
function relativeTime(date: Date): string {
  const elapsed = date.getTime() - Date.now();
  const units: readonly (readonly [Intl.RelativeTimeFormatUnit, number])[] = [
    ['year', 31_557_600_000],
    ['month', 2_629_800_000],
    ['week', 604_800_000],
    ['day', 86_400_000],
    ['hour', 3_600_000],
    ['minute', 60_000],
  ];
  const formatter = new Intl.RelativeTimeFormat(undefined, { numeric: 'always' });

  for (const [unit, milliseconds] of units) {
    if (Math.abs(elapsed) >= milliseconds) {
      return formatter.format(Math.trunc(elapsed / milliseconds), unit);
    }
  }

  return formatter.format(Math.trunc(elapsed / 1000), 'second');
}

/** A video id, or `null` when `value` holds none or holds something that cannot be one. */
function videoId(value: string | undefined): null | string {
  if (value === undefined || value === '') {
    return null;
  }

  // A video id is short URL safe text; the bound also refuses a page URL used as one.
  return /^[\w-]{1,32}$/.test(value) ? value : null;
}

/** A Vimeo source: the numeric id in the path, or `null` when the URL names no video. */
function vimeoSource(url: string): null | VideoSource {
  const id = videoId(pathSegments(url)[0]);

  return id === null || !/^\d+$/.test(id) ? null : { id, poster: null, provider: 'vimeo', url };
}

/** A YouTube source, or `null` when the URL names no video. */
function youtubeSource(url: string): null | VideoSource {
  const id = googleVideoId(url);

  return id === null
    ? null
    : { id, poster: null, provider: 'youtube', url: `https://www.youtube.com/watch?v=${id}` };
}
