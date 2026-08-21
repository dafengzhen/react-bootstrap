```tsx
const PREFERENCES_COLUMNS = [
  { key: 'id', label: '#', visible: true, width: 60 },
  { key: 'firstName', label: '姓氏', visible: true, width: 100 },
  { key: 'lastName', label: '名字', visible: true, width: 100 },
  { key: 'username', label: '用户名', visible: true, width: 140 },
  { key: 'status', label: '状态', visible: true, width: 90 },
  { key: 'note', label: '备注', visible: false, width: 160 },
];

const PreferencesDemo = () => {
  const columns = useTableColumns({
    initialColumns: PREFERENCES_COLUMNS,
    storageKey: 'table-demo-columns',
  });

  return (
    <>
      <div className="d-flex flex-wrap align-items-center gap-3 mb-2">
        {columns.columns.map((column) => (
          <FormCheck inline key={column.key}>
            <FormCheckInput
              checked={column.visible}
              id={`pref-column-${column.key}`}
              onChange={() => columns.toggleColumn(column.key)}
            />
            <FormCheckLabel htmlFor={`pref-column-${column.key}`}>{column.label}</FormCheckLabel>
          </FormCheck>
        ))}
        <Button onClick={columns.reset} size="sm" variant="outline-secondary">
          重置偏好
        </Button>
      </div>
      <Table>
        <TableHead>
          <TableRow>
            {columns.visibleColumns.map((column) => (
              <TableCell as="th" key={column.key} scope="col" style={{ width: column.width }}>
                {column.label}
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
        当前显示 {columns.visibleCount} / {columns.columns.length} 列，偏好已保存到 localStorage
      </p>
    </>
  );
};
```
