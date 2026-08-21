```tsx
const ViewToggleDemo = () => {
  const [view, setView] = useState<'card' | 'table'>('table');

  return (
    <>
      <ButtonGroup aria-label="视图切换" className="mb-3">
        <Button
          active={view === 'table'}
          onClick={() => setView('table')}
          variant={view === 'table' ? 'primary' : 'outline-primary'}
        >
          表格视图
        </Button>
        <Button
          active={view === 'card'}
          onClick={() => setView('card')}
          variant={view === 'card' ? 'primary' : 'outline-primary'}
        >
          卡片视图
        </Button>
      </ButtonGroup>
      {view === 'table' ? (
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
            {USERS.map((user) => (
              <TableRow key={user.id}>
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
      ) : (
        <div className="row g-3">
          {USERS.map((user) => (
            <div className="col-sm-6 col-lg-4" key={user.id}>
              <div className="card h-100">
                <div className="card-body">
                  <h5 className="card-title">
                    {user.lastName}
                    {user.firstName}
                  </h5>
                  <h6 className="card-subtitle mb-2 text-body-secondary">{user.username}</h6>
                  <p className="card-text mb-0">
                    编号 {user.id} · 状态 {user.status}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
};
```
