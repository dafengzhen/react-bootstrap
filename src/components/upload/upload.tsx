import clsx from 'clsx';
import { CloudUpload, Upload as UploadTriggerIcon } from 'lucide-react';
import {
  type ChangeEvent,
  type DragEvent,
  forwardRef,
  type KeyboardEvent,
  useCallback,
  useMemo,
  useRef,
  useState,
} from 'react';

import type { UploadContextValue, UploadFile, UploadProps } from './types';

import { UploadContext } from './upload-context';
import { UploadItem } from './upload-item';
import { UploadList } from './upload-list';
import { createUploadFile, isDuplicateUploadFile } from './upload-utils';
import styles from './upload.module.css';

export const Upload = forwardRef<HTMLElement, UploadProps>(
  (
    {
      accept,
      as: Component = 'div',
      beforeUpload,
      capture,
      children,
      className,
      defaultFiles = [],
      disabled = false,
      dropzone = false,
      files,
      itemProps,
      listProps,
      maxCount,
      maxSize,
      multiple = false,
      name,
      onFilesChange,
      showUploadList = true,
      ...rest
    },
    ref,
  ) => {
    const [dragging, setDragging] = useState(false);
    const [internalFiles, setInternalFiles] = useState<UploadFile[]>(defaultFiles);
    const inputRef = useRef<HTMLInputElement>(null);

    const currentFiles = files ?? internalFiles;
    const hasReachedMaxCount = maxCount !== undefined && currentFiles.length >= maxCount;

    const updateFiles = useCallback(
      (nextFiles: UploadFile[]) => {
        onFilesChange?.(nextFiles);
        if (files === undefined) {
          setInternalFiles(nextFiles);
        }
      },
      [files, onFilesChange],
    );

    const openFileDialog = useCallback(() => {
      if (disabled || hasReachedMaxCount) {
        return;
      }
      inputRef.current?.click();
    }, [disabled, hasReachedMaxCount]);

    const handleRemove = useCallback(
      (file: UploadFile) => {
        updateFiles(currentFiles.filter((item) => item.uid !== file.uid));
      },
      [currentFiles, updateFiles],
    );

    const handleFiles = useCallback(
      async (incoming: File[] | FileList) => {
        if (disabled) {
          return;
        }
        const candidates = Array.from(incoming).filter(
          (file) => !isDuplicateUploadFile(file, currentFiles),
        );
        if (candidates.length === 0) {
          return;
        }

        const slots = maxCount === undefined ? candidates.length : maxCount - currentFiles.length;
        if (slots <= 0) {
          return;
        }

        const accepted: UploadFile[] = [];
        for (const file of candidates.slice(0, slots)) {
          if (beforeUpload !== undefined && !(await beforeUpload(file, currentFiles))) {
            continue;
          }
          accepted.push(createUploadFile(file, maxSize));
        }
        if (accepted.length > 0) {
          updateFiles([...currentFiles, ...accepted]);
        }
      },
      [beforeUpload, currentFiles, disabled, maxCount, maxSize, updateFiles],
    );

    const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
      const { files: selectedFiles } = event.target;
      if (selectedFiles !== null) {
        void handleFiles(selectedFiles);
      }
      event.target.value = '';
    };

    const handleDragEnter = (event: DragEvent<HTMLElement>) => {
      event.preventDefault();
      if (!disabled) {
        setDragging(true);
      }
    };

    const handleDragLeave = (event: DragEvent<HTMLElement>) => {
      if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
        setDragging(false);
      }
    };

    const handleDragOver = (event: DragEvent<HTMLElement>) => {
      event.preventDefault();
    };

    const handleDrop = (event: DragEvent<HTMLElement>) => {
      event.preventDefault();
      setDragging(false);
      void handleFiles(event.dataTransfer.files);
    };

    const handleKeyDown = (event: KeyboardEvent<HTMLElement>) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        openFileDialog();
      }
    };

    const contextValue = useMemo<UploadContextValue>(
      () => ({
        accept,
        beforeUpload,
        disabled,
        files: currentFiles,
        handleRemove,
        maxCount,
        maxSize,
        multiple,
        openFileDialog,
      }),
      [
        accept,
        beforeUpload,
        currentFiles,
        disabled,
        handleRemove,
        maxCount,
        maxSize,
        multiple,
        openFileDialog,
      ],
    );

    const dropzoneHandlers = dropzone
      ? {
          onDragEnter: handleDragEnter,
          onDragLeave: handleDragLeave,
          onDragOver: handleDragOver,
          onDrop: handleDrop,
        }
      : undefined;

    const triggerContent = children ?? (
      <span
        className={clsx(
          styles.triggerContent,
          dropzone ? styles.dropzoneContent : styles.triggerButton,
        )}
      >
        {dropzone ? (
          <CloudUpload aria-hidden="true" className={styles.triggerIcon} />
        ) : (
          <UploadTriggerIcon aria-hidden="true" className={styles.triggerIcon} />
        )}
        <span>{dropzone ? 'Click or drag files here to upload' : 'Upload files'}</span>
      </span>
    );

    return (
      <UploadContext.Provider value={contextValue}>
        <Component
          className={clsx(styles.upload, disabled && styles.disabled, className)}
          ref={ref}
          {...rest}
        >
          <input
            accept={accept}
            capture={capture}
            className={styles.input}
            disabled={disabled}
            hidden
            multiple={multiple}
            name={name}
            onChange={handleInputChange}
            ref={inputRef}
            type="file"
          />
          {/* oxlint-disable jsx-a11y/prefer-tag-over-role */}
          <div
            aria-disabled={disabled || hasReachedMaxCount || undefined}
            className={clsx(
              styles.trigger,
              dropzone && styles.dropzone,
              dragging && styles.dragging,
            )}
            onClick={openFileDialog}
            onKeyDown={handleKeyDown}
            role="button"
            tabIndex={disabled ? -1 : 0}
            {...dropzoneHandlers}
          >
            {triggerContent}
          </div>
          {/* oxlint-enable jsx-a11y/prefer-tag-over-role */}
          {showUploadList && currentFiles.length > 0 && (
            <UploadList {...listProps}>
              {currentFiles.map((file) => (
                <UploadItem file={file} key={file.uid} {...itemProps} />
              ))}
            </UploadList>
          )}
        </Component>
      </UploadContext.Provider>
    );
  },
);

Upload.displayName = 'Upload';

export default Upload;
