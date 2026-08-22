import type { ExportTableCsvOptions } from './types';

const escapeCsvCell = (value: string): string => {
  if (/[",\r\n]/.test(value)) {
    return `"${value.replaceAll('"', '""')}"`;
  }
  return value;
};

export const exportTableCsv = <Row>({
  columns,
  filename = 'table.csv',
  rows,
}: ExportTableCsvOptions<Row>): void => {
  if (typeof document === 'undefined') {
    return;
  }
  const header = columns.map((column) => escapeCsvCell(column.label ?? column.key)).join(',');
  const body = rows.map((row) =>
    columns
      .map((column) => {
        const value = column.value
          ? column.value(row)
          : ((row as Record<string, unknown>)[column.key] as number | string | undefined);
        return escapeCsvCell(String(value ?? ''));
      })
      .join(','),
  );
  const content = [header, ...body].join('\n');
  const blob = new Blob([`\uFEFF${content}`], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.download = filename;
  link.href = url;
  document.body.append(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 0);
};

export default exportTableCsv;
