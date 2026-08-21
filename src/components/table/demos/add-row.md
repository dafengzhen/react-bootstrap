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

const AddRowDemo = () => {
  const { addRow, rows } = useTable<User, number>({
    getRowKey: (user) => user.id,
    initialRows: USERS,
  });
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

  return (
    <>
      <div className="d-flex flex-wrap gap-2 align-items-end mb-3">
        <FormControl
          onChange={(event) => setDraft((value) => ({ ...value, firstName: event.target.value }))}
          placeholder="姓氏"
          style={{ maxWidth: '8rem' }}
          value={draft.firstName}
        />
        <FormControl
          onChange={(event) => setDraft((value) => ({ ...value, lastName: event.target.value }))}
          placeholder="名字"
          style={{ maxWidth: '8rem' }}
          value={draft.lastName}
        />
        <FormControl
          onChange={(event) => setDraft((value) => ({ ...value, username: event.target.value }))}
          placeholder="用户名"
          style={{ maxWidth: '12rem' }}
          value={draft.username}
        />
        <Button disabled={!canAdd} onClick={handleAdd} variant="primary">
          新增
        </Button>
      </div>
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
          {rows.map((user) => (
            <TableRow key={user.id}>
              <TableCell as="th" scope="row">
                {user.id}
              </TableCell>
              <TableCell>{user.firstName}</TableCell>
              <TableCell>{user.lastName}</TableCell>
              <TableCell>{user.username}</TableCell>
            </TableRow>
          ))}
          {rows.length === 0 && <TableEmpty colSpan={4}>暂无数据，请使用上方表单新增</TableEmpty>}
        </TableBody>
      </Table>
    </>
  );
};
```
