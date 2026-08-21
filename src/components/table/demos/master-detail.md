```tsx
const MasterDetailDemo = () => {
  const [detailId, setDetailId] = useState<number>(1);
  const detail = USERS.find((user) => user.id === detailId);

  return (
    <div className="row g-3">
      <div className="col-md-7">
        <Table hover>
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
            {USERS.map((user) => (
              <TableRow
                active={detailId === user.id}
                key={user.id}
                onClick={() => setDetailId(user.id)}
              >
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
      </div>
      <div className="col-md-5">
        <div className="card">
          <div className="card-header">用户详情</div>
          <div className="card-body">
            {detail && (
              <dl className="mb-0 row">
                <dt className="col-4">编号</dt>
                <dd className="col-8">{detail.id}</dd>
                <dt className="col-4">姓名</dt>
                <dd className="col-8">
                  {detail.lastName}
                  {detail.firstName}
                </dd>
                <dt className="col-4">用户名</dt>
                <dd className="col-8">{detail.username}</dd>
                <dt className="col-4">状态</dt>
                <dd className="col-8">{detail.status}</dd>
                <dt className="col-4">备注</dt>
                <dd className="col-8">{detail.note || '无'}</dd>
              </dl>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
```
