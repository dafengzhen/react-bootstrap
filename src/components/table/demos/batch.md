```tsx
const CSV_COLUMNS = [
  { key: 'id', label: '编号' },
  { key: 'firstName', label: '姓氏' },
  { key: 'lastName', label: '名字' },
  { key: 'username', label: '用户名' },
  { key: 'status', label: '状态' },
];

const BatchDemo = () => {
  const { rows, removeRows, updateRow } = useTable<User, number>({
    getRowKey: (user) => user.id,
    initialRows: USERS,
  });
  const selection = useTableSelection<number>();
  const [confirmDelete, setConfirmDelete] = useState(false);

  const selectedCount = selection.selectedCount;

  const handleExport = () => {
    const selected = rows.filter((user) => selection.isSelected(user.id));
    exportTableCsv({
      columns: CSV_COLUMNS,
      filename: `users-${Date.now()}.csv`,
      rows: selectedCount > 0 ? selected : rows,
    });
  };

  const handleMarkOnline = () => {
    for (const id of selection.selectedKeys) {
      updateRow(id, (user) => ({ ...user, status: '在线' }));
    }
  };

  const handleBatchDelete = () => {
    removeRows(selection.selectedKeys);
    selection.clear();
    setConfirmDelete(false);
  };

  return (
    <>
      <div className="d-flex flex-wrap align-items-center gap-2 mb-2">
        <span className="text-body-secondary">已选 {selectedCount} 行</span>
        <Button
          disabled={selectedCount === 0}
          onClick={handleMarkOnline}
          size="sm"
          variant="outline-primary"
        >
          批量标记在线
        </Button>
        <Button
          disabled={selectedCount === 0}
          onClick={() => setConfirmDelete(true)}
          size="sm"
          variant="outline-danger"
        >
          批量删除
        </Button>
        <Button onClick={handleExport} size="sm" variant="outline-secondary">
          导出 CSV
        </Button>
      </div>
      <Table hover>
        <TableHead>
          <TableRow>
            <TableSelectCell
              as="th"
              checked={selection.isAllSelected(rows.map((user) => user.id))}
              indeterminate={selection.isIndeterminate(rows.map((user) => user.id))}
              label="全选"
              onChange={() => selection.toggleAll(rows.map((user) => user.id))}
            />
            <TableCell as="th" scope="col">
              #
            </TableCell>
            <TableCell as="th" scope="col">
              姓氏
            </TableCell>
            <TableCell as="th" scope="col">
              名字
            </TableCell>
            <TableCell as="th" scope="col">
              状态
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((user) => (
            <TableRow active={selection.isSelected(user.id)} key={user.id}>
              <TableSelectCell
                checked={selection.isSelected(user.id)}
                label={`选择 ${user.username}`}
                onChange={() => selection.toggle(user.id)}
                value={String(user.id)}
              />
              <TableCell as="th" scope="row">
                {user.id}
              </TableCell>
              <TableCell>{user.firstName}</TableCell>
              <TableCell>{user.lastName}</TableCell>
              <TableCell>{user.status}</TableCell>
            </TableRow>
          ))}
          {rows.length === 0 && <TableEmpty colSpan={5}>暂无数据</TableEmpty>}
        </TableBody>
      </Table>
      <Modal
        isOpen={confirmDelete}
        onOpenChange={(open) => {
          if (!open) {
            setConfirmDelete(false);
          }
        }}
      >
        <ModalHeader closeButton>
          <ModalTitle>确认批量删除</ModalTitle>
        </ModalHeader>
        <ModalBody>确定要删除选中的 {selectedCount} 行吗？删除后无法恢复。</ModalBody>
        <ModalFooter>
          <Button onClick={() => setConfirmDelete(false)} variant="secondary">
            取消
          </Button>
          <Button onClick={handleBatchDelete} variant="danger">
            删除
          </Button>
        </ModalFooter>
      </Modal>
    </>
  );
};
```
