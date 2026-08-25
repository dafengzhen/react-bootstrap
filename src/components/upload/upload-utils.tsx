import type { ReactNode } from 'react';

import type { UploadFile, UploadStatus } from './types';

const BYTE_UNITS = ['B', 'KB', 'MB', 'GB', 'TB'] as const;

let uidCounter = 0;

export const createUploadFile = (file: File, maxSize?: number): UploadFile => {
  const isTooLarge = maxSize !== undefined && file.size > maxSize;

  return {
    error: isTooLarge ? 'File size exceeds the maximum allowed size.' : undefined,
    name: file.name,
    raw: file,
    size: file.size,
    status: isTooLarge ? 'error' : 'ready',
    uid: createUploadUid(),
  };
};

export const createUploadUid = (): string =>
  `upload-${Date.now().toString(36)}-${(uidCounter++).toString(36)}`;

export const formatUploadSize = (size?: number): string => {
  if (size === undefined || size < 0) {
    return '-';
  }
  if (size < 1024) {
    return `${size} B`;
  }

  let unitIndex = 1;
  let value = size / 1024;
  while (unitIndex < BYTE_UNITS.length - 1 && value >= 1024) {
    value /= 1024;
    unitIndex += 1;
  }

  const digits = value >= 100 ? 0 : value >= 10 ? 1 : 2;
  return `${value.toFixed(digits)} ${BYTE_UNITS[unitIndex]}`;
};

export const isDuplicateUploadFile = (file: File, files: UploadFile[]): boolean =>
  files.some((item) => item.name === file.name && item.size === file.size);

export const renderUploadStatusIcon = (status: UploadStatus): ReactNode => {
  if (status === 'error') {
    return (
      <svg aria-hidden="true" fill="currentColor" viewBox="0 0 16 16">
        <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM8 4a.905.905 0 0 0-.9.995l.35 3.507a.552.552 0 0 0 1.1 0l.35-3.507A.905.905 0 0 0 8 4zm.002 6a1 1 0 1 0 0 2 1 1 0 0 0 0-2z" />
      </svg>
    );
  }
  if (status === 'success') {
    return (
      <svg aria-hidden="true" fill="currentColor" viewBox="0 0 16 16">
        <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z" />
      </svg>
    );
  }
  return (
    <svg aria-hidden="true" fill="currentColor" viewBox="0 0 16 16">
      <path d="M14 4.5V14a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V2a2 2 0 0 1 2-2h5.5L14 4.5zm-3 0A1.5 1.5 0 0 1 9.5 3V1H4a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V4.5h-2z" />
    </svg>
  );
};
