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

const DeleteRowDemo = () => {
  const { removeRow, rows } = useTable<User, number>({
    getRowKey: (user) => user.id,
    initialRows: USERS,
  });
  const [deleteId, setDeleteId] = useState<number>();

  const deleteUser = rows.find((user) => user.id === deleteId);

  const handleConfirmDelete = () => {
    if (deleteId !== undefined) {
      removeRow(deleteId);
    }
    setDeleteId(undefined);
  };

  return (
    <>
      <Table>
        <TableHead>
          <TableRow>
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
            <TableRow key={user.id}>
              <TableCell as="th" scope="row">
                {user.id}
              </TableCell>
              <TableCell>{user.firstName}</TableCell>
              <TableCell>{user.lastName}</TableCell>
              <TableCell>{user.username}</TableCell>
              <TableCell>
                <Button onClick={() => setDeleteId(user.id)} size="sm" variant="outline-danger">
                  删除
                </Button>
              </TableCell>
            </TableRow>
          ))}
          {rows.length === 0 && <TableEmpty colSpan={5}>暂无数据</TableEmpty>}
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
