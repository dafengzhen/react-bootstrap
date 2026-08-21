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

const SelectionDemo = () => {
  const selection = useTableSelection<number>();
  const userIds = USERS.map((user) => user.id);

  return (
    <>
      <div className="d-flex align-items-center gap-2 mb-2">
        <span className="text-body-secondary">已选 {selection.selectedCount} 行</span>
        {selection.selectedCount > 0 && (
          <Button onClick={selection.clear} size="sm" variant="outline-secondary">
            清除选择
          </Button>
        )}
      </div>
      <Table hover>
        <TableHead>
          <TableRow>
            <TableSelectCell
              as="th"
              checked={selection.isAllSelected(userIds)}
              indeterminate={selection.isIndeterminate(userIds)}
              label="全选"
              onChange={() => selection.toggleAll(userIds)}
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
          </TableRow>
        </TableHead>
        <TableBody>
          {USERS.map((user) => (
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
              <TableCell>{user.username}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  );
};
```
