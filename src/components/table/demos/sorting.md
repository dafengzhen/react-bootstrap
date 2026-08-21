```tsx
const SortDemo = () => {
  const sorting = useTableSorting({ initialSortKey: 'no' });
  const sortedOrders = sorting.sortRows(ORDERS);

  const ariaSort = (key: string) =>
    sorting.isActive(key)
      ? sorting.direction === 'ascending'
        ? 'ascending'
        : 'descending'
      : 'none';

  return (
    <Table hover>
      <TableHead>
        <TableRow>
          <TableCell aria-sort={ariaSort('no')} as="th" scope="col">
            <Button onClick={() => sorting.toggleSort('no')} size="sm" variant="link">
              订单号 {sorting.isActive('no') && (sorting.direction === 'ascending' ? '▲' : '▼')}
            </Button>
          </TableCell>
          <TableCell as="th" scope="col">
            客户
          </TableCell>
          <TableCell aria-sort={ariaSort('amount')} as="th" scope="col">
            <Button onClick={() => sorting.toggleSort('amount')} size="sm" variant="link">
              金额 {sorting.isActive('amount') && (sorting.direction === 'ascending' ? '▲' : '▼')}
            </Button>
          </TableCell>
          <TableCell as="th" scope="col">
            状态
          </TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {sortedOrders.map((order) => (
          <TableRow key={order.id}>
            <TableCell as="th" scope="row">
              {order.no}
            </TableCell>
            <TableCell>{order.customer}</TableCell>
            <TableCell>¥{order.amount}</TableCell>
            <TableCell>{order.status}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};
```
