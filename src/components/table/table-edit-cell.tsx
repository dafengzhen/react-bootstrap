import clsx from 'clsx';
import {
  type ChangeEvent,
  forwardRef,
  type KeyboardEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';

import type { TableEditCellProps, TableEditOption, TableEditType, TableEditValue } from './types';

interface EditContentProps {
  cancelLabel: string;
  disabled: boolean;
  initialValue: TableEditValue;
  inputProps: TableEditCellProps['inputProps'];
  onCancel: () => void;
  onSave: (value: TableEditValue) => void;
  options: readonly TableEditOption[] | undefined;
  placeholder: string | undefined;
  saveLabel: string;
  selectProps: TableEditCellProps['selectProps'];
  textareaProps: TableEditCellProps['textareaProps'];
  type: TableEditType;
  validator: ((value: TableEditValue) => string | undefined) | undefined;
}

const EditContent = ({
  cancelLabel,
  disabled,
  initialValue,
  inputProps,
  onCancel,
  onSave,
  options,
  placeholder,
  saveLabel,
  selectProps,
  textareaProps,
  type,
  validator,
}: EditContentProps) => {
  const [draft, setDraft] = useState<TableEditValue>(initialValue);
  const [error, setError] = useState<string>();
  const inputRef = useRef<HTMLInputElement>(null);
  const selectRef = useRef<HTMLSelectElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
    selectRef.current?.focus();
    textareaRef.current?.focus();
  }, []);

  const handleDraftChange = useCallback((next: TableEditValue) => {
    setDraft(next);
    setError(undefined);
  }, []);

  const handleCancel = useCallback(() => {
    onCancel();
  }, [onCancel]);

  const handleSave = useCallback(() => {
    const message = validator?.(draft);
    if (message) {
      setError(message);
      return;
    }
    onSave(draft);
  }, [draft, onSave, validator]);

  const handleKeyDown = useCallback(
    (event: KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      if (event.key === 'Enter' && type !== 'textarea' && !event.nativeEvent.isComposing) {
        event.preventDefault();
        handleSave();
      } else if (event.key === 'Escape') {
        event.preventDefault();
        handleCancel();
      }
    },
    [handleCancel, handleSave, type],
  );

  const editor =
    type === 'select' ? (
      <select
        {...selectProps}
        className={clsx(
          'form-select form-select-sm',
          error !== undefined && 'is-invalid',
          selectProps?.className,
        )}
        disabled={disabled}
        onChange={(event: ChangeEvent<HTMLSelectElement>) => handleDraftChange(event.target.value)}
        ref={selectRef}
        value={String(draft)}
      >
        {options?.map((option) => (
          <option disabled={option.disabled} key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    ) : type === 'textarea' ? (
      <textarea
        {...textareaProps}
        className={clsx(
          'form-control form-control-sm',
          error !== undefined && 'is-invalid',
          textareaProps?.className,
        )}
        disabled={disabled}
        onChange={(event) => handleDraftChange(event.target.value)}
        onKeyDown={(event) => {
          handleKeyDown(event);
          textareaProps?.onKeyDown?.(event);
        }}
        placeholder={placeholder}
        ref={textareaRef}
        rows={1}
        value={String(draft)}
      />
    ) : (
      <input
        {...inputProps}
        className={clsx(
          'form-control form-control-sm',
          error !== undefined && 'is-invalid',
          inputProps?.className,
        )}
        disabled={disabled}
        onChange={(event) => handleDraftChange(event.target.value)}
        onKeyDown={(event) => {
          handleKeyDown(event);
          inputProps?.onKeyDown?.(event);
        }}
        placeholder={placeholder}
        ref={inputRef}
        type={type === 'number' ? 'number' : 'text'}
        value={String(draft)}
      />
    );

  return (
    <div className="d-flex flex-column gap-1">
      <div className="d-flex align-items-start gap-1">
        {editor}
        <button
          aria-label={saveLabel}
          className="btn btn-primary btn-sm"
          onClick={handleSave}
          type="button"
        >
          ✓
        </button>
        <button
          aria-label={cancelLabel}
          className="btn btn-light btn-sm border"
          onClick={handleCancel}
          type="button"
        >
          ✕
        </button>
      </div>
      {error !== undefined && <div className="d-block invalid-feedback">{error}</div>}
    </div>
  );
};

export const TableEditCell = forwardRef<HTMLTableCellElement, TableEditCellProps>(
  (
    {
      active = false,
      align,
      as: Component = 'td',
      cancelLabel = 'Cancel',
      children,
      className,
      defaultEditing = false,
      defaultValue = '',
      disabled = false,
      editing,
      inputProps,
      onCancel,
      onEditingChange,
      onSave,
      options,
      placeholder,
      saveLabel = 'Save',
      selectProps,
      textareaProps,
      type = 'text',
      validator,
      value,
      ...rest
    },
    ref,
  ) => {
    const [internalEditing, setInternalEditing] = useState(defaultEditing);

    const isEditing = editing ?? internalEditing;

    const handleStartEdit = useCallback(() => {
      onEditingChange?.(true);
      if (editing === undefined) {
        setInternalEditing(true);
      }
    }, [editing, onEditingChange]);

    const handleEditingChange = useCallback(
      (next: boolean) => {
        onEditingChange?.(next);
        if (editing === undefined) {
          setInternalEditing(next);
        }
      },
      [editing, onEditingChange],
    );

    const handleSave = useCallback(
      (next: TableEditValue) => {
        onSave?.(next);
        handleEditingChange(false);
      },
      [handleEditingChange, onSave],
    );

    const handleCancel = useCallback(() => {
      onCancel?.();
      handleEditingChange(false);
    }, [handleEditingChange, onCancel]);

    const cellClassName =
      clsx('table-edit-cell', active && 'table-active', align && `align-${align}`, className) ||
      undefined;

    if (!isEditing) {
      return (
        <Component
          className={cellClassName}
          onDoubleClick={disabled ? undefined : handleStartEdit}
          ref={ref}
          {...rest}
        >
          {children ?? String(value ?? defaultValue)}
        </Component>
      );
    }

    return (
      <Component className={cellClassName} ref={ref} {...rest}>
        <EditContent
          cancelLabel={cancelLabel}
          disabled={disabled}
          initialValue={value ?? defaultValue}
          inputProps={inputProps}
          onCancel={handleCancel}
          onSave={handleSave}
          options={options}
          placeholder={placeholder}
          saveLabel={saveLabel}
          selectProps={selectProps}
          textareaProps={textareaProps}
          type={type}
          validator={validator}
        />
      </Component>
    );
  },
);

TableEditCell.displayName = 'TableEditCell';

export default TableEditCell;
