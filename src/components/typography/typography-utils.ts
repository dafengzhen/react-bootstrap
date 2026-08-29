import { isValidElement, type ReactNode } from 'react';

export async function copyText(text: string): Promise<boolean> {
  try {
    if (navigator.clipboard !== undefined && navigator.clipboard.writeText !== undefined) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch {
    // 回退到 execCommand 方案
  }
  try {
    const textarea = document.createElement('textarea');
    textarea.setAttribute('readonly', '');
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    textarea.value = text;
    document.body.append(textarea);
    textarea.select();
    const success = document.execCommand('copy');
    textarea.remove();
    return success;
  } catch {
    return false;
  }
}

export function getTypographyText(node: ReactNode): string {
  if (node === null || node === undefined || typeof node === 'boolean') {
    return '';
  }
  if (typeof node === 'string' || typeof node === 'number' || typeof node === 'bigint') {
    return String(node);
  }
  if (Array.isArray(node)) {
    return node.map(getTypographyText).join('');
  }
  if (isValidElement(node)) {
    return getTypographyText((node.props as { children?: ReactNode }).children);
  }
  return '';
}
