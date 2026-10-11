/** Frames may navigate only to HTTP(S) resources, never executable/data documents. */
export function frameUrl(value: unknown): null | string {
  if (typeof value !== 'string' || !value.trim()) {
    return null;
  }
  try {
    const source = value.trim();
    const url = new URL(source.startsWith('//') ? `https:${source}` : source);
    return (url.protocol === 'https:' || url.protocol === 'http:') && !url.username && !url.password
      ? url.href
      : null;
  } catch {
    return null;
  }
}

/** Convert recognized video providers into their player URLs; custom sources are already players. */
export function videoFrameUrl(provider: unknown, id: unknown, source: unknown): null | string {
  if (provider === 'native') {
    return null;
  }
  const identifier = typeof id === 'string' ? id : '';
  if (provider === 'youtube') {
    return /^[\w-]+$/.test(identifier)
      ? `https://www.youtube-nocookie.com/embed/${identifier}`
      : null;
  }
  if (provider === 'vimeo') {
    return /^\d+$/.test(identifier) ? `https://player.vimeo.com/video/${identifier}` : null;
  }
  if (provider === 'bilibili') {
    if (/^BV[\w]+$/.test(identifier)) {
      return `https://player.bilibili.com/player.html?bvid=${encodeURIComponent(identifier)}`;
    }
    if (/^av\d+$/.test(identifier)) {
      return `https://player.bilibili.com/player.html?aid=${identifier.slice(2)}`;
    }
    const url = frameUrl(source);
    return url && new URL(url).hostname === 'player.bilibili.com' ? url : null;
  }
  return frameUrl(source);
}

export const FRAME_SANDBOX = 'allow-scripts allow-presentation';

/** Only known HTTPS player origins may access their own cookies/storage. */
export function frameSandbox(source: unknown): string {
  const safe = frameUrl(source);
  if (!safe) {
    return FRAME_SANDBOX;
  }
  const url = new URL(safe);
  const playerOrigins = [
    'https://player.bilibili.com',
    'https://player.vimeo.com',
    'https://www.youtube.com',
    'https://www.youtube-nocookie.com',
  ];
  return playerOrigins.includes(url.origin) ? `${FRAME_SANDBOX} allow-same-origin` : FRAME_SANDBOX;
}

// Fullscreen is declared once, via allowfullscreen, to avoid conflicting permissions.
export const FRAME_ALLOW = 'autoplay; encrypted-media; picture-in-picture';

/** YouTube requires a Referer identifying the embedding site (player error 153). */
export function frameReferrerPolicy(
  source: unknown,
): 'no-referrer' | 'strict-origin-when-cross-origin' {
  const safe = frameUrl(source);
  const origin = safe ? new URL(safe).origin : null;
  return origin === 'https://www.youtube.com' || origin === 'https://www.youtube-nocookie.com'
    ? 'strict-origin-when-cross-origin'
    : 'no-referrer';
}
