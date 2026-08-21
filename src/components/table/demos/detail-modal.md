```tsx
const DetailModalDemo = () => {
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
      <Modal
        isOpen={detailId !== undefined}
        onOpenChange={(open) => {
          if (!open) {
            setDetailId(undefined);
          }
        }}
      >
        <ModalHeader closeButton>
          <ModalTitle>用户详情</ModalTitle>
        </ModalHeader>
        <ModalBody>
          {detail && (
            <Table bordered size="sm">
              <TableBody>
                <TableRow>
                  <TableCell as="th" scope="row">
                    编号
                  </TableCell>
                  <TableCell>{detail.id}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell as="th" scope="row">
                    姓名
                  </TableCell>
                  <TableCell>
                    {detail.lastName}
                    {detail.firstName}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell as="th" scope="row">
                    用户名
                  </TableCell>
                  <TableCell>{detail.username}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell as="th" scope="row">
                    状态
                  </TableCell>
                  <TableCell>{detail.status}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell as="th" scope="row">
                    备注
                  </TableCell>
                  <TableCell>{detail.note || '无'}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          )}
        </ModalBody>
        <ModalFooter>
          <Button onClick={() => setDetailId(undefined)} variant="secondary">
            关闭
          </Button>
        </ModalFooter>
      </Modal>
    </>
  );
};
```
