import type { ReactNode } from 'react';

import { CircleAlert, CircleCheck, File } from 'lucide-react';

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
    return <CircleAlert aria-hidden="true" />;
  }
  if (status === 'success') {
    return <CircleCheck aria-hidden="true" />;
  }
  return <File aria-hidden="true" />;
};
