import type {
  ChangeEvent,
  ElementType,
  HTMLAttributes,
  InputHTMLAttributes,
  MouseEvent,
  ReactNode,
  SelectHTMLAttributes,
  TextareaHTMLAttributes,
} from 'react';

export interface ExportTableCsvOptions<Row> {
  columns: readonly TableCsvColumn<Row>[];
  filename?: string;
  rows: readonly Row[];
}

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

export interface TableColumnPreference {
  key: string;
  label: string;
  visible: boolean;
  width?: number;
}

export interface TableCsvColumn<Row> {
  key: string;
  label?: string;
  value?: (row: Row) => number | string | undefined;
}

export interface TableDetailRowProps extends HTMLAttributes<HTMLTableRowElement> {
  cellClassName?: string;
  children?: ReactNode;
  className?: string;
  colSpan?: number;
}

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

export interface TableExpandCellProps extends Omit<HTMLAttributes<HTMLElement>, 'onToggle'> {
  active?: boolean;
  align?: TableAlign;
  as?: ElementType;
  className?: string;
  collapseLabel?: string;
  disabled?: boolean;
  expanded?: boolean;
  expandLabel?: string;
  onToggle?: (expanded: boolean, event: MouseEvent<HTMLButtonElement>) => void;
  variant?: TableVariant;
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

export type TableSortDirection = 'ascending' | 'descending';

export type TableSortValue = number | string | undefined;

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

export interface UseTableColumnsOptions {
  initialColumns: readonly TableColumnPreference[];
  storageKey?: string;
}

export interface UseTableColumnsResult {
  columns: readonly TableColumnPreference[];
  getColumn: (key: string) => TableColumnPreference | undefined;
  reset: () => void;
  setColumns: (columns: readonly TableColumnPreference[]) => void;
  setColumnVisible: (key: string, visible: boolean) => void;
  setColumnWidth: (key: string, width: number) => void;
  toggleColumn: (key: string) => void;
  visibleColumns: readonly TableColumnPreference[];
  visibleCount: number;
}

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

export interface UseTableExpansionOptions<Key> {
  initialExpandedKeys?: Iterable<Key>;
}

export interface UseTableExpansionResult<Key> {
  collapse: (key: Key) => void;
  collapseAll: () => void;
  expand: (key: Key) => void;
  expandAll: (keys: Iterable<Key>) => void;
  expandedCount: number;
  expandedKeys: ReadonlySet<Key>;
  isExpanded: (key: Key) => boolean;
  setExpandedKeys: (keys: Iterable<Key>) => void;
  toggle: (key: Key) => void;
  toggleAll: (keys: Iterable<Key>) => void;
}

export interface UseTableFilterOptions<Row> {
  initialFilters?: Readonly<Record<string, unknown>>;
  predicate?: (row: Row, filters: Readonly<Record<string, unknown>>) => boolean;
}

export interface UseTableFilterResult<Row> {
  clearFilters: () => void;
  filterCount: number;
  filterRows: (rows: readonly Row[]) => readonly Row[];
  filters: Readonly<Record<string, unknown>>;
  hasFilter: (key: string) => boolean;
  hasFilters: boolean;
  removeFilter: (key: string) => void;
  setFilter: (key: string, value: unknown) => void;
  setFilters: (filters: Readonly<Record<string, unknown>>) => void;
}

export interface UseTableOptions<Row, Key> {
  getRowKey: (row: Row) => Key;
  initialRows?: readonly Row[];
}

export interface UseTablePaginationOptions {
  initialPage?: number;
  initialPageSize?: number;
  pageSizeOptions?: readonly number[];
  totalCount?: number;
}

export interface UseTablePaginationResult {
  endIndex: number;
  firstPage: () => void;
  getPageRows: <Row>(rows: readonly Row[]) => readonly Row[];
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  lastPage: () => void;
  nextPage: () => void;
  page: number;
  pageSize: number;
  pageSizeOptions: readonly number[];
  previousPage: () => void;
  setPage: (page: number) => void;
  setPageSize: (pageSize: number) => void;
  startIndex: number;
  totalPages: number;
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

export interface UseTableSearchOptions<Row> {
  fields?: readonly string[];
  initialQuery?: string;
  match?: (row: Row, query: string) => boolean;
}

export interface UseTableSearchResult<Row> {
  clear: () => void;
  hasQuery: boolean;
  matches: (row: Row) => boolean;
  query: string;
  searchRows: (rows: readonly Row[]) => readonly Row[];
  setQuery: (query: string) => void;
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

export interface UseTableSortingOptions {
  initialDirection?: TableSortDirection;
  initialSortKey?: string;
}

export interface UseTableSortingResult {
  clearSort: () => void;
  direction: TableSortDirection;
  isActive: (key: string) => boolean;
  setSort: (key: string, direction?: TableSortDirection) => void;
  sortKey: string | undefined;
  sortRows: <Row>(
    rows: readonly Row[],
    getValue?: (row: Row, key: string) => TableSortValue,
  ) => readonly Row[];
  toggleSort: (key: string) => void;
}
