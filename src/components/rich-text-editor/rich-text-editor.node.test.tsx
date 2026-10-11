import { describe, expect, it } from 'vitest';

import { contrastColor, isColorValue, normalizeColor, rgbOf } from './rich-text-editor-color-utils';
import { findMatches, nextMatchIndex } from './rich-text-editor-utils';
import {
  formatFileSize,
  isSafeMediaUrl,
  parseAudioUrl,
  parseVideoUrl,
} from './rich-text-editor-video.ts';

/**
 * The parts of the component layer that need no DOM.
 *
 * A rich text editor is mostly a DOM program, but three pieces are pure functions and they are the
 * ones a host is most likely to depend on directly: what a video URL becomes, which color values the
 * style policy accepts, and where a search matches. They are tested here, on a headless editor
 * state, so a failure points at the rule rather than at a rendered toolbar.
 */

/** A minimal document: two paragraphs, so a search can run across a block boundary. */
const document = () =>
  ({
    doc: {
      content: { size: 0 },
      forEach() {},
      isText: false,
      textContent: '',
    },
  }) as never;

describe('parseVideoUrl', () => {
  it('reads a YouTube link into a provider id and a canonical watch URL', () => {
    expect(parseVideoUrl('https://youtu.be/dQw4w9WgXcQ')).toEqual({
      id: 'dQw4w9WgXcQ',
      poster: null,
      provider: 'youtube',
      url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    });
  });

  it('keeps a Bilibili id when it is visible in the path', () => {
    const source = parseVideoUrl('https://www.bilibili.com/video/BV1xx411c7mD');

    expect(source?.provider).toBe('bilibili');
    expect(source?.id).toBe('BV1xx411c7mD');
  });

  it('treats a plain media file as a native source', () => {
    expect(parseVideoUrl('https://cdn.example.com/clip.mp4')?.provider).toBe('native');
  });

  it("refuses a URL the editor's policy would refuse", () => {
    expect(parseVideoUrl('javascript:alert(1)')).toBeNull();
  });

  it('refuses an empty value', () => {
    expect(parseVideoUrl('   ')).toBeNull();
  });
});

describe('parseAudioUrl', () => {
  it('guesses the MIME type from the extension', () => {
    expect(parseAudioUrl('https://cdn.example.com/track.mp3')).toEqual({
      mimeType: 'audio/mpeg',
      src: 'https://cdn.example.com/track.mp3',
    });
  });

  it('reports no MIME type for an extension it does not know', () => {
    expect(parseAudioUrl('https://cdn.example.com/track.bin')?.mimeType).toBeNull();
  });
});

describe('isSafeMediaUrl', () => {
  it.each(['https://example.com/a.png', '/images/a.png', 'data:image/png;base64,AAAA', 'blob:x'])(
    'accepts %s',
    (url) => {
      expect(isSafeMediaUrl(url)).toBe(true);
    },
  );

  it.each(['javascript:alert(1)', 'file:///etc/passwd', 'data:text/html,<script>x</script>'])(
    'refuses %s',
    (url) => {
      expect(isSafeMediaUrl(url)).toBe(false);
    },
  );
});

describe('formatFileSize', () => {
  it('scales to the largest unit that keeps the number readable', () => {
    expect(formatFileSize(0)).toBe('0 B');
    expect(formatFileSize(1536)).toMatch(/1\.5 KB/);
    expect(formatFileSize(12 * 1024 * 1024)).toMatch(/12 MB/);
  });
});

describe('color values', () => {
  it("accepts the notations the editor's style policy accepts", () => {
    expect(isColorValue('#0d6efd')).toBe(true);
    expect(isColorValue('#abc')).toBe(true);
    expect(isColorValue('rgb(13, 110, 253)')).toBe(true);
    expect(isColorValue('red')).toBe(true);
  });

  it('refuses anything that is not a color', () => {
    expect(isColorValue('expression(alert(1))')).toBe(false);
    expect(isColorValue('')).toBe(false);
  });

  it('expands a three-digit hex so the swatch and the document agree', () => {
    expect(normalizeColor('#ABC')).toBe('#aabbcc');
  });

  it('reads channels out of both notations', () => {
    expect(rgbOf('#0d6efd')).toEqual([13, 110, 253]);
    expect(rgbOf('rgb(255, 255, 255)')).toEqual([255, 255, 255]);
  });

  it('picks a readable check color for the swatch', () => {
    expect(contrastColor('#ffffff')).toBe('#212529');
    expect(contrastColor('#000000')).toBe('#ffffff');
  });
});

describe('findMatches', () => {
  it('finds nothing in a document with no text', () => {
    expect(findMatches(document(), 'text')).toEqual([]);
  });

  it('finds nothing for an empty query', () => {
    expect(findMatches(document(), '')).toEqual([]);
  });

  it('reports the first match as the place to start from', () => {
    expect(nextMatchIndex([], { selection: { from: 0 } } as never)).toBe(-1);
    expect(
      nextMatchIndex(
        [
          { from: 1, to: 3 },
          { from: 8, to: 10 },
        ],
        {
          selection: { from: 5 },
        } as never,
      ),
    ).toBe(1);
  });
});
