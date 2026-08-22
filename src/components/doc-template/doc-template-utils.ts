import { useId, useMemo } from 'react';

export const sanitizeUseId = (id: string): string => id.replaceAll(/[«»:]/g, '');

export const slugify = (value: string): string =>
  value
    .normalize('NFKD')
    .toLowerCase()
    .trim()
    .replaceAll(/[^a-z0-9]+/g, '-')
    .replaceAll(/^-+|-+$/g, '');

export const useIdPrefix = (scope: string): string => {
  const rawId = useId();
  return useMemo(() => `${slugify(scope) || 'section'}-${sanitizeUseId(rawId)}`, [rawId, scope]);
};

export const scrollToSection = (id: string): void => {
  const target = document.getElementById(id);
  if (!target) {
    return;
  }
  target.scrollIntoView({ behavior: 'smooth', block: 'start' });
};

export const updateHash = (id: string): void => {
  try {
    window.history.replaceState(window.history.state, '', `#${id}`);
  } catch {}
};
