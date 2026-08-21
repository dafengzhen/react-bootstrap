```tsx
const DetailDrawerDemo = () => {
  const [detailId, setDetailId] = useState<number>();
  const detail = USERS.find((user) => user.id === detailId);

  return (
    <>
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
            <TableCell as="th" scope="col">
              操作
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {USERS.map((user) => (
            <TableRow key={user.id}>
              <TableCell as="th" scope="row">
                {user.id}
              </TableCell>
              <TableCell>{user.firstName}</TableCell>
              <TableCell>{user.lastName}</TableCell>
              <TableCell>{user.username}</TableCell>
              <TableCell>
                <Button onClick={() => setDetailId(user.id)} size="sm" variant="outline-primary">
                  查看
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Offcanvas
        isOpen={detailId !== undefined}
        onOpenChange={(open) => {
          if (!open) {
            setDetailId(undefined);
          }
        }}
        placement="end"
      >
        <OffcanvasHeader closeButton>
          <OffcanvasTitle>用户详情</OffcanvasTitle>
        </OffcanvasHeader>
        <OffcanvasBody>
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
        </OffcanvasBody>
      </Offcanvas>
    </>
  );
};
```
