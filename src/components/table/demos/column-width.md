```tsx
const USERS = [
  { firstName: '张', id: 1, lastName: '伟', note: '核心成员', username: '@zhangwei' },
  { firstName: '李', id: 2, lastName: '磊', note: '新加入', username: '@lilei' },
  { firstName: '王', id: 3, lastName: '芳', note: '管理员', username: '@wangfang' },
];

const WIDTH_OPTIONS = [
  { label: '紧凑 (80px)', value: '80' },
  { label: '默认 (120px)', value: '120' },
  { label: '较宽 (160px)', value: '160' },
  { label: '宽松 (240px)', value: '240' },
];

const COLUMN_WIDTH_COLUMNS = [
  { key: 'id', label: '#', visible: true, width: 80 },
  { key: 'firstName', label: '姓氏', visible: true, width: 120 },
  { key: 'lastName', label: '名字', visible: true, width: 120 },
  { key: 'username', label: '用户名', visible: true, width: 160 },
  { key: 'note', label: '备注', visible: true, width: 240 },
];

const ColumnWidthDemo = () => {
  const columns = useTableColumns({
    initialColumns: COLUMN_WIDTH_COLUMNS,
    storageKey: 'table-demo-column-widths',
  });

  return (
    <>
      <div className="mb-2">
        <Button onClick={columns.reset} size="sm" variant="outline-secondary">
          重置列宽
        </Button>
      </div>
      <Table>
        <TableHead>
          <TableRow>
            {columns.visibleColumns.map((column) => (
              <TableCell
                as="th"
                key={column.key}
                scope="col"
                style={{ minWidth: column.width, width: column.width }}
              >
                <div className="align-items-start d-flex flex-column gap-1">
                  {column.label}
                  <FormSelect
                    aria-label={`${column.label} 列宽`}
                    onChange={(event) =>
                      columns.setColumnWidth(column.key, Number(event.target.value))
                    }
                    size="sm"
                    style={{ fontWeight: 400, maxWidth: '10rem' }}
                    value={column.width}
                  >
                    {WIDTH_OPTIONS.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </FormSelect>
                </div>
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {USERS.map((user) => (
            <TableRow key={user.id}>
              {columns.visibleColumns.map((column) => (
                <TableCell key={column.key}>{String(user[column.key] ?? '无')}</TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <p className="mb-0 text-body-secondary">
        通过表头下拉选择每列宽度，设置已保存到 localStorage
      </p>
    </>
  );
};
```
