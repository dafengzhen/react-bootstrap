import { FOCUSABLE_SELECTOR } from './constants';

export const getFocusableElements = (container: HTMLElement) =>
  container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR);

let bodyLockCount = 0;
let originalBodyOverflow = '';

export const lockBodyScroll = () => {
  if (typeof document === 'undefined') {
    return;
  }
  if (bodyLockCount === 0) {
    originalBodyOverflow = document.body.style.overflow || '';
    document.body.style.overflow = 'hidden';
  }
  bodyLockCount++;
};

export const unlockBodyScroll = () => {
  if (typeof document === 'undefined') {
    return;
  }
  bodyLockCount = Math.max(0, bodyLockCount - 1);
  if (bodyLockCount === 0) {
    document.body.style.overflow = originalBodyOverflow;
  }
};
