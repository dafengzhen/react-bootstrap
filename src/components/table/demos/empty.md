```tsx
const EmptyDemo = () => {
  const { addRow, rows } = useTable({
    getRowKey: (user) => user.id,
    initialRows: [],
  });
  const [nextId, setNextId] = useState(1);

  const handleAdd = () => {
    addRow({ firstName: '张', id: nextId, lastName: '伟', username: `@user${nextId}` });
    setNextId((id) => id + 1);
  };

  return (
    <>
      <Button className="mb-2" onClick={handleAdd} size="sm" variant="primary">
        新增一行
      </Button>
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
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.length === 0 ? (
            <TableEmpty colSpan={4}>
              暂无数据，
              <Button onClick={handleAdd} size="sm" variant="link">
                立即新增
              </Button>
            </TableEmpty>
          ) : (
            rows.map((user) => (
              <TableRow key={user.id}>
                <TableCell as="th" scope="row">
                  {user.id}
                </TableCell>
                <TableCell>{user.firstName}</TableCell>
                <TableCell>{user.lastName}</TableCell>
                <TableCell>{user.username}</TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </>
  );
};
```
