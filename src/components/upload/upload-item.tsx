import clsx from 'clsx';
import { forwardRef } from 'react';

import type { UploadItemProps, UploadStatus } from './types';

import { useUpload } from './upload-context';
import { formatUploadSize, renderUploadStatusIcon } from './upload-utils';
import styles from './upload.module.css';

const clampPercent = (percent: number): number => Math.max(0, Math.min(100, percent));

export const UploadItem = forwardRef<HTMLElement, UploadItemProps>(
  ({ as: Component = 'li', children, className, file, onRemove, ...rest }, ref) => {
    const context = useUpload();
    const handleRemove = onRemove ?? context?.handleRemove;
    const status: UploadStatus = file.status ?? 'ready';
    const percent = clampPercent(file.percent ?? 0);

    return (
      <Component className={clsx(styles.item, className)} data-status={status} ref={ref} {...rest}>
        <span aria-hidden="true" className={styles.icon}>
          {status === 'uploading' ? (
            <span className={styles.spinner} />
          ) : (
            renderUploadStatusIcon(status)
          )}
        </span>
        <span className={styles.info}>
          <span className={styles.name}>
            {file.url === undefined ? (
              file.name
            ) : (
              <a className={styles.link} href={file.url} rel="noreferrer" target="_blank">
                {file.name}
              </a>
            )}
          </span>
          {file.size !== undefined && (
            <span className={styles.meta}>{formatUploadSize(file.size)}</span>
          )}
          {status === 'uploading' && (
            <span className={styles.progress}>
              <span className={styles.progressTrack}>
                <span className={styles.progressBar} style={{ width: `${percent}%` }} />
              </span>
              <span className={styles.percent}>{percent}%</span>
            </span>
          )}
          {status === 'error' && file.error !== undefined && (
            <span className={styles.error}>{file.error}</span>
          )}
          {children}
        </span>
        {handleRemove !== undefined && (
          <button
            aria-label="Remove file"
            className={clsx('btn-close', styles.remove)}
            disabled={context?.disabled ?? false}
            onClick={() => handleRemove(file)}
            type="button"
          />
        )}
      </Component>
    );
  },
);

UploadItem.displayName = 'UploadItem';

export default UploadItem;
