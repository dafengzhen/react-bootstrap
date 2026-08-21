```tsx
const SearchDemo = () => {
  const search = useTableSearch<DocUser>({
    fields: ['firstName', 'lastName', 'username', 'note'],
  });
  const matchedRows = search.searchRows(USERS);

  return (
    <>
      <div className="mb-2" style={{ maxWidth: '20rem' }}>
        <FormControl
          onChange={(event) => search.setQuery(event.target.value)}
          placeholder="搜索姓名、用户名或备注…"
          type="search"
          value={search.query}
        />
      </div>
      <p className="text-body-secondary">
        共 {matchedRows.length} 条记录
        {search.hasQuery && `，关键词「${search.query}」`}
      </p>
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
          {matchedRows.map((user) => (
            <TableRow key={user.id}>
              <TableCell as="th" scope="row">
                {user.id}
              </TableCell>
              <TableCell>{user.firstName}</TableCell>
              <TableCell>{user.lastName}</TableCell>
              <TableCell>{user.username}</TableCell>
            </TableRow>
          ))}
          {matchedRows.length === 0 && <TableEmpty colSpan={4}>未找到匹配的记录</TableEmpty>}
        </TableBody>
      </Table>
    </>
  );
};
```
