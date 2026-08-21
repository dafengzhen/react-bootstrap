```tsx
interface User {
  firstName: string;
  id: number;
  lastName: string;
  note: string;
  status: string;
  username: string;
}

const USERS: User[] = [
  {
    firstName: '张',
    id: 1,
    lastName: '伟',
    note: '核心成员',
    status: '在线',
    username: '@zhangwei',
  },
  { firstName: '李', id: 2, lastName: '磊', note: '新加入', status: '离线', username: '@lilei' },
  { firstName: '王', id: 3, lastName: '芳', note: '管理员', status: '忙碌', username: '@wangfang' },
];

const STATUS_OPTIONS = [
  { label: '在线', value: '在线' },
  { label: '离线', value: '离线' },
  { label: '忙碌', value: '忙碌' },
];

const requiredValidator = (value: TableEditValue) =>
  String(value).trim() === '' ? '不能为空' : undefined;

const InlineEditDemo = () => {
  const { rows, updateRow } = useTable<User, number>({
    getRowKey: (user) => user.id,
    initialRows: USERS,
  });
  const editing = useTableEditing<number>();

  const cellProps = (user: User) => ({
    editing: editing.isEditing(user.id),
    onEditingChange: (next: boolean) => (next ? editing.startEdit(user.id) : editing.cancelEdit()),
  });

  return (
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
            状态
          </TableCell>
          <TableCell as="th" scope="col">
            备注
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
            <TableEditCell
              {...cellProps(user)}
              onSave={(value) =>
                updateRow(user.id, (row) => ({ ...row, firstName: String(value) }))
              }
              validator={requiredValidator}
              value={user.firstName}
            />
            <TableEditCell
              {...cellProps(user)}
              onSave={(value) => updateRow(user.id, (row) => ({ ...row, lastName: String(value) }))}
              validator={requiredValidator}
              value={user.lastName}
            />
            <TableEditCell
              {...cellProps(user)}
              onSave={(value) => updateRow(user.id, (row) => ({ ...row, username: String(value) }))}
              validator={requiredValidator}
              value={user.username}
            />
            <TableEditCell
              {...cellProps(user)}
              onSave={(value) => updateRow(user.id, (row) => ({ ...row, status: String(value) }))}
              options={STATUS_OPTIONS}
              type="select"
              value={user.status}
            />
            <TableEditCell
              {...cellProps(user)}
              onSave={(value) => updateRow(user.id, (row) => ({ ...row, note: String(value) }))}
              type="textarea"
              value={user.note}
            />
            <TableCell>
              <Button
                onClick={() => editing.startEdit(user.id)}
                size="sm"
                variant="outline-primary"
              >
                编辑
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};
```
