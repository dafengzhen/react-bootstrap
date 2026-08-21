import type {
  ChangeEvent,
  ElementType,
  HTMLAttributes,
  InputHTMLAttributes,
  ReactNode,
  SelectHTMLAttributes,
  TextareaHTMLAttributes,
} from 'react';

export type TableAlign = 'bottom' | 'middle' | 'top';

export type TableBreakpoint = 'lg' | 'md' | 'sm' | 'xl' | 'xxl';

export interface TableCaptionProps extends HTMLAttributes<HTMLElement> {
  as?: ElementType;
  captionTop?: boolean;
  children?: ReactNode;
  className?: string;
}

export interface TableCellProps extends HTMLAttributes<HTMLElement> {
  active?: boolean;
  align?: TableAlign;
  as?: ElementType;
  children?: ReactNode;
  className?: string;
  colSpan?: number;
  rowSpan?: number;
  scope?: TableCellScope;
  variant?: TableVariant;
}

export type TableCellScope = 'col' | 'colgroup' | 'row' | 'rowgroup';

export interface TableEditCellProps extends HTMLAttributes<HTMLElement> {
  active?: boolean;
  align?: TableAlign;
  as?: ElementType;
  cancelLabel?: string;
  children?: ReactNode;
  className?: string;
  defaultEditing?: boolean;
  defaultValue?: TableEditValue;
  disabled?: boolean;
  editing?: boolean;
  inputProps?: Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'type' | 'value'>;
  onCancel?: () => void;
  onEditingChange?: (editing: boolean) => void;
  onSave?: (value: TableEditValue) => void;
  options?: readonly TableEditOption[];
  placeholder?: string;
  saveLabel?: string;
  selectProps?: Omit<SelectHTMLAttributes<HTMLSelectElement>, 'onChange' | 'value'>;
  textareaProps?: Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, 'onChange' | 'value'>;
  type?: TableEditType;
  validator?: (value: TableEditValue) => string | undefined;
  value?: TableEditValue;
}

export interface TableEditOption {
  disabled?: boolean;
  label: string;
  value: string;
}

export type TableEditType = 'number' | 'select' | 'text' | 'textarea';

export type TableEditValue = number | string;

export interface TableEmptyProps extends HTMLAttributes<HTMLTableRowElement> {
  cellClassName?: string;
  children?: ReactNode;
  className?: string;
  colSpan?: number;
}

export interface TableLoadingProps extends HTMLAttributes<HTMLTableRowElement> {
  cellClassName?: string;
  children?: ReactNode;
  className?: string;
  colSpan?: number;
}

export interface TableProps extends HTMLAttributes<HTMLTableElement> {
  align?: TableAlign;
  as?: ElementType;
  bordered?: boolean;
  borderless?: boolean;
  children?: ReactNode;
  className?: string;
  hover?: boolean;
  responsive?: boolean | TableBreakpoint;
  size?: TableSize;
  striped?: TableStriped;
  variant?: TableVariant;
}

export interface TableResponsiveProps extends HTMLAttributes<HTMLDivElement> {
  as?: ElementType;
  breakpoint?: boolean | TableBreakpoint;
  children?: ReactNode;
  className?: string;
}

export interface TableRowProps extends HTMLAttributes<HTMLTableRowElement> {
  active?: boolean;
  as?: ElementType;
  children?: ReactNode;
  className?: string;
  variant?: TableVariant;
}

export interface TableSectionProps extends HTMLAttributes<HTMLElement> {
  as?: ElementType;
  children?: ReactNode;
  className?: string;
  variant?: TableVariant;
}

export interface TableSelectCellProps extends Omit<HTMLAttributes<HTMLElement>, 'onChange'> {
  active?: boolean;
  align?: TableAlign;
  as?: ElementType;
  checked?: boolean;
  className?: string;
  disabled?: boolean;
  indeterminate?: boolean;
  label?: string;
  name?: string;
  onChange?: (checked: boolean, event: ChangeEvent<HTMLInputElement>) => void;
  value?: string;
  variant?: TableVariant;
}

export type TableSize = 'sm';

export type TableStriped = 'columns' | boolean;

export type TableVariant =
  | 'danger'
  | 'dark'
  | 'info'
  | 'light'
  | 'primary'
  | 'secondary'
  | 'success'
  | 'warning';

export interface UseTableEditingOptions<Key> {
  defaultEditingKey?: Key | null;
  editingKey?: Key | null;
  onEditingKeyChange?: (key: Key | null) => void;
}

export interface UseTableEditingResult<Key> {
  cancelEdit: () => void;
  editingKey: Key | null;
  isEditing: (key: Key) => boolean;
  startEdit: (key: Key) => void;
}

export interface UseTableOptions<Row, Key> {
  getRowKey: (row: Row) => Key;
  initialRows?: readonly Row[];
}

export interface UseTableResult<Row, Key> {
  addRow: (row: Row, index?: number) => void;
  clear: () => void;
  getRowKey: (row: Row) => Key;
  keys: readonly Key[];
  removeRow: (key: Key) => void;
  removeRows: (keys: Iterable<Key>) => void;
  rows: readonly Row[];
  setRows: (rows: readonly Row[]) => void;
  updateRow: (key: Key, updater: (row: Row) => Row) => void;
}

export interface UseTableSelectionOptions<Key> {
  initialSelectedKeys?: Iterable<Key>;
}

export interface UseTableSelectionResult<Key> {
  clear: () => void;
  deselect: (key: Key) => void;
  isAllSelected: (keys: Iterable<Key>) => boolean;
  isIndeterminate: (keys: Iterable<Key>) => boolean;
  isSelected: (key: Key) => boolean;
  select: (key: Key) => void;
  selectAll: (keys: Iterable<Key>) => void;
  selectedCount: number;
  selectedKeys: ReadonlySet<Key>;
  setSelectedKeys: (keys: Iterable<Key>) => void;
  toggle: (key: Key) => void;
  toggleAll: (keys: Iterable<Key>) => void;
}
