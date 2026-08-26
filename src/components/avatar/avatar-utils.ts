const CJK_CHARACTER_PATTERN = /[\u3040-\u30ff\u3400-\u4dbf\u4e00-\u9fff\uf900-\ufaff\uac00-\ud7af]/;

export const getAvatarInitials = (name: string): string => {
  const words = name.trim().split(/\s+/).filter(Boolean);
  if (words.length === 0) {
    return '?';
  }

  const firstWord = words[0];

  if (CJK_CHARACTER_PATTERN.test(firstWord.charAt(0))) {
    return firstWord.charAt(0);
  }

  if (words.length === 1) {
    return firstWord.slice(0, 2).toUpperCase();
  }

  return `${words[0].charAt(0)}${words[1].charAt(0)}`.toUpperCase();
};
