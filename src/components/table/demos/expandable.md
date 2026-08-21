```tsx
interface Order {
  address: string;
  amount: number;
  createdAt: string;
  customer: string;
  id: number;
  items: { name: string; price: number; quantity: number }[];
  no: string;
  note: string;
  status: string;
}

const ORDERS: Order[] = [
  {
    address: '北京市朝阳区望京街道 88 号',
    amount: 129.0,
    createdAt: '2025-01-12 10:24',
    customer: '张伟',
    id: 1,
    items: [
      { name: '机械键盘', price: 99, quantity: 1 },
      { name: '鼠标垫', price: 30, quantity: 1 },
    ],
    no: '202501120001',
    note: '请放前台代收',
    status: '已发货',
  },
  {
    address: '上海市浦东新区世纪大道 100 号',
    amount: 59.9,
    createdAt: '2025-01-12 14:08',
    customer: '李磊',
    id: 2,
    items: [{ name: '笔记本支架', price: 59.9, quantity: 1 }],
    no: '202501120002',
    note: '',
    status: '待发货',
  },
];

const ExpandableDemo = () => {
  const expansion = useTableExpansion<number>();
  const orderIds = ORDERS.map((order) => order.id);

  return (
    <>
      <div className="d-flex gap-2 mb-2">
        <Button onClick={() => expansion.expandAll(orderIds)} size="sm" variant="outline-primary">
          全部展开
        </Button>
        <Button onClick={expansion.collapseAll} size="sm" variant="outline-secondary">
          全部收起
        </Button>
      </div>
      <Table hover>
        <TableHead>
          <TableRow>
            <TableCell as="th" scope="col" />
            <TableCell as="th" scope="col">
              订单号
            </TableCell>
            <TableCell as="th" scope="col">
              客户
            </TableCell>
            <TableCell as="th" scope="col">
              金额
            </TableCell>
            <TableCell as="th" scope="col">
              状态
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {ORDERS.map((order) => (
            <Fragment key={order.id}>
              <TableRow>
                <TableExpandCell
                  collapseLabel={`收起订单 ${order.no}`}
                  expandLabel={`展开订单 ${order.no}`}
                  expanded={expansion.isExpanded(order.id)}
                  onToggle={() => expansion.toggle(order.id)}
                />
                <TableCell as="th" scope="row">
                  {order.no}
                </TableCell>
                <TableCell>{order.customer}</TableCell>
                <TableCell>¥{order.amount}</TableCell>
                <TableCell>{order.status}</TableCell>
              </TableRow>
              {expansion.isExpanded(order.id) && (
                <TableDetailRow colSpan={5}>
                  <div className="mb-2 row g-2">
                    <div className="col-md-6">
                      <strong>收货地址：</strong>
                      {order.address}
                    </div>
                    <div className="col-md-6">
                      <strong>下单时间：</strong>
                      {order.createdAt}
                    </div>
                    <div className="col-12">
                      <strong>备注：</strong>
                      {order.note || '无'}
                    </div>
                  </div>
                  <Table bordered size="sm">
                    <TableHead>
                      <TableRow>
                        <TableCell as="th" scope="col">
                          条目
                        </TableCell>
                        <TableCell as="th" scope="col">
                          数量
                        </TableCell>
                        <TableCell as="th" scope="col">
                          单价
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {order.items.map((item) => (
                        <TableRow key={item.name}>
                          <TableCell>{item.name}</TableCell>
                          <TableCell>{item.quantity}</TableCell>
                          <TableCell>¥{item.price}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableDetailRow>
              )}
            </Fragment>
          ))}
        </TableBody>
      </Table>
    </>
  );
};
```
