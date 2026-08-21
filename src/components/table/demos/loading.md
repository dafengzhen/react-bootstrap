```tsx
const LoadingDemo = () => {
  const [loading, setLoading] = useState(true);

  return (
    <>
      <Button
        className="mb-2"
        onClick={() => setLoading((value) => !value)}
        size="sm"
        variant="outline-primary"
      >
        {loading ? '模拟加载完成' : '模拟加载中'}
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
          {loading ? (
            <TableLoading colSpan={4}>加载中…</TableLoading>
          ) : (
            USERS.map((user) => (
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
