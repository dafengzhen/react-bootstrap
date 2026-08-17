const FENCED_CODE_BLOCK_PATTERN = /```[^\n]*\n([\s\S]*?)```/;

export const extractFencedCode = (markdown: string): string => {
  const match = FENCED_CODE_BLOCK_PATTERN.exec(markdown);
  return (match?.[1] ?? markdown).trim();
};
