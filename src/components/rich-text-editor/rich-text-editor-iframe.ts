import { frameUrl } from './lib/serialization/media-frame';

/** Extract only safe frame data; never insert the supplied HTML, handlers, permissions or srcdoc. */
export function parseIframeInput(
  input: string,
  document: Document,
): {
  height: null | number;
  title: null | string;
  url: string;
  width: null | number;
} | null {
  const value = input.trim();
  if (!value.startsWith('<')) {
    const url = frameUrl(value);
    return url ? { height: null, title: null, url, width: null } : null;
  }
  const template = document.createElement('template');
  template.innerHTML = value;
  const frames = template.content.querySelectorAll('iframe');
  const frame = frames[0];
  if (frames.length !== 1 || !frame || frame.hasAttribute('srcdoc')) {
    return null;
  }
  const url = frameUrl(frame.getAttribute('src'));
  if (!url) {
    return null;
  }
  const dimension = (name: string) => {
    const value = Number(frame.getAttribute(name));
    return Number.isFinite(value) && value > 0 ? value : null;
  };
  return {
    height: dimension('height'),
    title: frame.getAttribute('title'),
    url,
    width: dimension('width'),
  };
}
