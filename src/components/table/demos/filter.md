```tsx
const STATUS_VALUES = ['在线', '离线', '忙碌'];

const FilterDemo = () => {
  const filter = useTableFilter<DocUser>();
  const filteredRows = filter.filterRows(USERS);

  const statuses = (filter.filters.status ?? []) as string[];

  const handleToggleStatus = (status: string) => {
    const next = statuses.includes(status)
      ? statuses.filter((item) => item !== status)
      : [...statuses, status];
    filter.setFilter('status', next);
  };

  return (
    <>
      <div className="d-flex flex-wrap align-items-center gap-3 mb-2">
        {STATUS_VALUES.map((status) => (
          <FormCheck inline key={status}>
            <FormCheckInput
              checked={statuses.includes(status)}
              id={`filter-status-${status}`}
              onChange={() => handleToggleStatus(status)}
            />
            <FormCheckLabel htmlFor={`filter-status-${status}`}>{status}</FormCheckLabel>
          </FormCheck>
        ))}
        {filter.hasFilters && (
          <Button onClick={filter.clearFilters} size="sm" variant="outline-secondary">
            清除筛选
          </Button>
        )}
      </div>
      <p className="text-body-secondary">
        共 {filteredRows.length} 条记录
        {filter.filterCount > 0 && `，已应用 ${filter.filterCount} 个筛选条件`}
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
              状态
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {filteredRows.map((user) => (
            <TableRow key={user.id}>
              <TableCell as="th" scope="row">
                {user.id}
              </TableCell>
              <TableCell>{user.firstName}</TableCell>
              <TableCell>{user.lastName}</TableCell>
              <TableCell>{user.status}</TableCell>
            </TableRow>
          ))}
          {filteredRows.length === 0 && <TableEmpty colSpan={4}>没有符合条件的记录</TableEmpty>}
        </TableBody>
      </Table>
    </>
  );
};
```
