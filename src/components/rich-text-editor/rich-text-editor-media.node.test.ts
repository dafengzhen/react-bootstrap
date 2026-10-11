import { describe, expect, it } from 'vitest';

import {
  FRAME_SANDBOX,
  frameReferrerPolicy,
  frameSandbox,
  frameUrl,
  videoFrameUrl,
} from './lib/serialization/media-frame';
import { extendedKit } from './rich-text-editor-extensions';
import { Editor, MediaKit, StarterKit } from './rich-text-editor-lib';
import { parseVideoUrl } from './rich-text-editor-video';

describe('Media frames', () => {
  it('identifies YouTube embeds without disclosing referrers to unrelated sources', () => {
    const source = parseVideoUrl('https://youtu.be/zpOULjyy-n8?si=eRWkH0K8V4PrDRA8')!;
    expect(source.id).toBe('zpOULjyy-n8');
    const player = videoFrameUrl(source.provider, source.id, source.url)!;
    expect(player).toBe('https://www.youtube-nocookie.com/embed/zpOULjyy-n8');
    expect(frameReferrerPolicy(player)).toBe('strict-origin-when-cross-origin');
    expect(frameReferrerPolicy('https://www.youtube.com/embed/zpOULjyy-n8')).toBe(
      'strict-origin-when-cross-origin',
    );
    for (const url of [
      'https://example.com/player',
      'https://www.youtube.com.evil.test/embed/abc',
      'javascript:alert(1)',
    ]) {
      expect(frameReferrerPolicy(url)).toBe('no-referrer');
    }
    const editor = new Editor({ extensions: [StarterKit, MediaKit, extendedKit()] });
    editor.runNamedCommand('insertVideo', { ...source });
    expect(editor.getHTML()).toContain('referrerpolicy="strict-origin-when-cross-origin"');
    editor.runNamedCommand('insertEmbed', { provider: 'iframe', url: player });
    expect(
      editor.getHTML().match(/referrerpolicy="strict-origin-when-cross-origin"/g),
    ).toHaveLength(2);
    editor.destroy();
  });
  it('allows cookie access only for known HTTPS player origins', () => {
    for (const source of [
      '//player.bilibili.com/player.html',
      'https://player.vimeo.com/video/123',
      'https://www.youtube-nocookie.com/embed/abc',
      'https://www.youtube.com/embed/abc',
    ]) {
      expect(frameSandbox(source)).toBe(`${FRAME_SANDBOX} allow-same-origin`);
    }
    for (const source of [
      'http://player.bilibili.com/player.html',
      'https://player.bilibili.com:8443/player.html',
      'https://player.bilibili.com.evil.test/player.html',
      'https://example.com/player',
      'javascript:alert(1)',
    ]) {
      expect(frameSandbox(source)).toBe(FRAME_SANDBOX);
    }
  });
  it('accepts protocol-relative frames and provider ids without a watch URL', () => {
    expect(frameUrl('//example.com/player')).toBe('https://example.com/player');
    expect(videoFrameUrl('youtube', 'abc123', null)).toBe(
      'https://www.youtube-nocookie.com/embed/abc123',
    );
  });
  it.each([
    ['https://youtu.be/abc123', 'https://www.youtube-nocookie.com/embed/abc123'],
    ['https://vimeo.com/123456', 'https://player.vimeo.com/video/123456'],
    [
      'https://www.bilibili.com/video/BV123abc',
      'https://player.bilibili.com/player.html?bvid=BV123abc',
    ],
    [
      'https://www.bilibili.com/video/av123456',
      'https://player.bilibili.com/player.html?aid=123456',
    ],
    ['https://example.com/player', 'https://example.com/player'],
  ])('uses an iframe player for %s', (url, expected) => {
    const source = parseVideoUrl(url)!;
    expect(videoFrameUrl(source.provider, source.id, source.url)).toBe(expected);
    const editor = new Editor({ extensions: [StarterKit, MediaKit] });
    expect(editor.runNamedCommand('insertVideo', { ...source })).toBe(true);
    expect(editor.getHTML()).toContain(`<iframe src="${expected}"`);
    expect(editor.getHTML()).not.toContain('<video');
    editor.destroy();
  });

  it('retains native playback for video files', () => {
    const source = parseVideoUrl('https://example.com/clip.mp4')!;
    expect(videoFrameUrl(source.provider, source.id, source.url)).toBeNull();
    const editor = new Editor({ extensions: [StarterKit, MediaKit] });
    editor.runNamedCommand('insertVideo', { ...source });
    expect(editor.getHTML()).toContain('<video');
    expect(editor.getHTML()).toContain('src="https://example.com/clip.mp4"');
    expect(editor.getHTML()).not.toContain('<iframe');
    editor.destroy();
  });

  it.each([
    'javascript:alert(1)',
    'data:text/html,unsafe',
    'data:image/png;base64,test',
    'blob:https://example.com/id',
    'https://user:secret@example.com/player',
  ])('rejects executable or credential-bearing frame URLs %s', (url) => {
    expect(frameUrl(url)).toBeNull();
    const editor = new Editor({ extensions: [StarterKit, MediaKit, extendedKit()] });
    expect(editor.runNamedCommand('insertEmbed', { url })).toBe(false);
    editor.destroy();
  });
});
