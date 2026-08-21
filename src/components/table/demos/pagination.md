```tsx
const PaginationDemo = () => {
  const pagination = useTablePagination({
    initialPageSize: 5,
    pageSizeOptions: [5, 10, 20],
    totalCount: USERS.length,
  });
  const pageRows = pagination.getPageRows(USERS);

  return (
    <>
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
          {pageRows.map((user) => (
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
      <div className="d-flex flex-wrap align-items-center justify-content-between gap-2 mt-2">
        <div className="d-flex align-items-center gap-2">
          <span className="text-body-secondary">每页</span>
          <FormSelect
            onChange={(event) => pagination.setPageSize(Number(event.target.value))}
            style={{ maxWidth: '8rem' }}
            value={pagination.pageSize}
          >
            {pagination.pageSizeOptions.map((size) => (
              <option key={size} value={size}>
                {size} 条
              </option>
            ))}
          </FormSelect>
          <span className="text-body-secondary">
            共 {USERS.length} 条，第 {pagination.page} / {pagination.totalPages} 页
          </span>
        </div>
        <Pagination size="sm">
          <PaginationItem disabled={!pagination.hasPreviousPage}>
            <PaginationLink onClick={pagination.previousPage}>上一页</PaginationLink>
          </PaginationItem>
          {Array.from({ length: pagination.totalPages }, (_, index) => index + 1).map((page) => (
            <PaginationItem active={page === pagination.page} key={page}>
              <PaginationLink onClick={() => pagination.setPage(page)}>{page}</PaginationLink>
            </PaginationItem>
          ))}
          <PaginationItem disabled={!pagination.hasNextPage}>
            <PaginationLink onClick={pagination.nextPage}>下一页</PaginationLink>
          </PaginationItem>
        </Pagination>
      </div>
    </>
  );
};
```
