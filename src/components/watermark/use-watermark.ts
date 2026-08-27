import { useEffect, useRef, useState } from 'react';

import type { UseWatermarkOptions, UseWatermarkResult } from './types';

import { EMPTY_WATERMARK_PATTERN, generateWatermarkPattern } from './watermark-utils';

export const useWatermark = (options: UseWatermarkOptions = {}): UseWatermarkResult => {
  const { content, font, gap, height, image, opacity, rotate, width } = options;

  const [pattern, setPattern] = useState<UseWatermarkResult>(EMPTY_WATERMARK_PATTERN);

  const optionsRef = useRef<UseWatermarkOptions>(options);
  useEffect(() => {
    optionsRef.current = options;
  });

  const contentKey = typeof content === 'string' ? content : (content?.join('\n') ?? '');
  const fontKey = JSON.stringify(font ?? null);
  const gapKey = JSON.stringify(gap ?? null);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      try {
        const result = await generateWatermarkPattern(optionsRef.current);
        if (!cancelled) {
          setPattern(result);
        }
      } catch {
        if (!cancelled) {
          setPattern(EMPTY_WATERMARK_PATTERN);
        }
      }
    };

    void load();

    return () => {
      cancelled = true;
    };
  }, [contentKey, fontKey, gapKey, height, image, opacity, rotate, width]);

  return pattern;
};
