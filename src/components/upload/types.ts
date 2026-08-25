import type { ElementType, HTMLAttributes, ReactNode } from 'react';

export type UploadBeforeUpload = (file: File, files: UploadFile[]) => boolean | Promise<boolean>;

export interface UploadContextValue {
  accept?: string;
  beforeUpload?: UploadBeforeUpload;
  disabled: boolean;
  files: UploadFile[];
  handleRemove: (file: UploadFile) => void;
  maxCount?: number;
  maxSize?: number;
  multiple: boolean;
  openFileDialog: () => void;
}

export interface UploadFile {
  error?: string;
  name: string;
  percent?: number;
  raw?: File;
  size?: number;
  status?: UploadStatus;
  uid: string;
  url?: string;
}

export interface UploadItemProps extends HTMLAttributes<HTMLElement> {
  as?: ElementType;
  children?: ReactNode;
  className?: string;
  file: UploadFile;
  onRemove?: (file: UploadFile) => void;
}

export interface UploadListProps extends HTMLAttributes<HTMLElement> {
  as?: ElementType;
  children?: ReactNode;
  className?: string;
}

export interface UploadProps extends Omit<HTMLAttributes<HTMLElement>, 'onChange'> {
  accept?: string;
  as?: ElementType;
  beforeUpload?: UploadBeforeUpload;
  capture?: 'environment' | 'user' | boolean;
  children?: ReactNode;
  className?: string;
  defaultFiles?: UploadFile[];
  disabled?: boolean;
  dropzone?: boolean;
  files?: UploadFile[];
  itemProps?: Omit<UploadItemProps, 'file'>;
  listProps?: Omit<UploadListProps, 'children'>;
  maxCount?: number;
  maxSize?: number;
  multiple?: boolean;
  name?: string;
  onFilesChange?: (files: UploadFile[]) => void;
  showUploadList?: boolean;
}

export type UploadStatus = 'error' | 'ready' | 'success' | 'uploading';
