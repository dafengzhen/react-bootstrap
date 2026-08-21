```tsx
interface User {
  firstName: string;
  id: number;
  lastName: string;
  username: string;
}

const USERS: User[] = [
  { firstName: '张', id: 1, lastName: '伟', username: '@zhangwei' },
  { firstName: '李', id: 2, lastName: '磊', username: '@lilei' },
  { firstName: '王', id: 3, lastName: '芳', username: '@wangfang' },
];

const CrudDemo = () => {
  const { addRow, removeRow, removeRows, rows, updateRow } = useTable<User, number>({
    getRowKey: (user) => user.id,
    initialRows: USERS,
  });
  const editing = useTableEditing<number>();
  const selection = useTableSelection<number>();
  const [deleteId, setDeleteId] = useState<number>();
  const [draft, setDraft] = useState({ firstName: '', lastName: '', username: '' });
  const [nextId, setNextId] = useState(USERS.length + 1);

  const canAdd =
    draft.firstName.trim() !== '' && draft.lastName.trim() !== '' && draft.username.trim() !== '';

  const handleAdd = () => {
    if (!canAdd) {
      return;
    }
    addRow({
      firstName: draft.firstName.trim(),
      id: nextId,
      lastName: draft.lastName.trim(),
      username: draft.username.trim(),
    });
    setNextId((id) => id + 1);
    setDraft({ firstName: '', lastName: '', username: '' });
  };

  const handleBatchDelete = () => {
    removeRows(selection.selectedKeys);
    selection.clear();
  };

  const handleConfirmDelete = () => {
    if (deleteId !== undefined) {
      removeRow(deleteId);
    }
    setDeleteId(undefined);
  };

  const deleteUser = rows.find((user) => user.id === deleteId);

  const cellProps = (user: User) => ({
    editing: editing.isEditing(user.id),
    onEditingChange: (next: boolean) => (next ? editing.startEdit(user.id) : editing.cancelEdit()),
  });

  return (
    <>
      <div className="d-flex flex-wrap gap-2 align-items-end mb-3">
        <FormControl
          onChange={(event) => setDraft((value) => ({ ...value, firstName: event.target.value }))}
          placeholder="姓氏"
          style={{ maxWidth: '7rem' }}
          value={draft.firstName}
        />
        <FormControl
          onChange={(event) => setDraft((value) => ({ ...value, lastName: event.target.value }))}
          placeholder="名字"
          style={{ maxWidth: '7rem' }}
          value={draft.lastName}
        />
        <FormControl
          onChange={(event) => setDraft((value) => ({ ...value, username: event.target.value }))}
          placeholder="用户名"
          style={{ maxWidth: '10rem' }}
          value={draft.username}
        />
        <Button disabled={!canAdd} onClick={handleAdd} variant="primary">
          新增
        </Button>
        {selection.selectedCount > 0 && (
          <Button onClick={handleBatchDelete} variant="outline-danger">
            删除选中（{selection.selectedCount}）
          </Button>
        )}
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
              用户名
            </TableCell>
            <TableCell as="th" scope="col">
              操作
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
              <TableEditCell
                {...cellProps(user)}
                onSave={(value) =>
                  updateRow(user.id, (row) => ({ ...row, firstName: String(value) }))
                }
                value={user.firstName}
              />
              <TableEditCell
                {...cellProps(user)}
                onSave={(value) =>
                  updateRow(user.id, (row) => ({ ...row, lastName: String(value) }))
                }
                value={user.lastName}
              />
              <TableEditCell
                {...cellProps(user)}
                onSave={(value) =>
                  updateRow(user.id, (row) => ({ ...row, username: String(value) }))
                }
                value={user.username}
              />
              <TableCell>
                <div className="d-flex gap-1">
                  <Button
                    onClick={() => editing.startEdit(user.id)}
                    size="sm"
                    variant="outline-primary"
                  >
                    编辑
                  </Button>
                  <Button onClick={() => setDeleteId(user.id)} size="sm" variant="outline-danger">
                    删除
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
          {rows.length === 0 && <TableEmpty colSpan={6}>暂无数据，请使用上方表单新增</TableEmpty>}
        </TableBody>
      </Table>
      <Modal
        isOpen={deleteId !== undefined}
        onOpenChange={(open) => {
          if (!open) {
            setDeleteId(undefined);
          }
        }}
      >
        <ModalHeader closeButton>
          <ModalTitle>确认删除</ModalTitle>
        </ModalHeader>
        <ModalBody>确定要删除「{deleteUser?.username ?? ''}」吗？删除后无法恢复。</ModalBody>
        <ModalFooter>
          <Button onClick={() => setDeleteId(undefined)} variant="secondary">
            取消
          </Button>
          <Button onClick={handleConfirmDelete} variant="danger">
            删除
          </Button>
        </ModalFooter>
      </Modal>
    </>
  );
};
```
