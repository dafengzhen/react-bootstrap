```tsx
<Table responsive>
  <TableHead>
    <TableRow>
      <TableCell as="th" scope="col">#</TableCell>
      <TableCell as="th" scope="col">姓氏</TableCell>
      <TableCell as="th" scope="col">名字</TableCell>
      <TableCell as="th" scope="col">用户名</TableCell>
    </TableRow>
  </TableHead>
  <TableBody>
    <TableRow>
      <TableCell as="th" scope="row">1</TableCell>
      <TableCell>张</TableCell>
      <TableCell>伟</TableCell>
      <TableCell>@zhangwei</TableCell>
    </TableRow>
    <TableRow>
      <TableCell as="th" scope="row">2</TableCell>
      <TableCell>李</TableCell>
      <TableCell>磊</TableCell>
      <TableCell>@lilei</TableCell>
    </TableRow>
    <TableRow>
      <TableCell as="th" scope="row">3</TableCell>
      <TableCell>王</TableCell>
      <TableCell>芳</TableCell>
      <TableCell>@wangfang</TableCell>
    </TableRow>
  </TableBody>
</Table>

<Table responsive="md">
  <TableHead>
    <TableRow>
      <TableCell as="th" scope="col">#</TableCell>
      <TableCell as="th" scope="col">姓氏</TableCell>
      <TableCell as="th" scope="col">名字</TableCell>
      <TableCell as="th" scope="col">用户名</TableCell>
    </TableRow>
  </TableHead>
  <TableBody>
    <TableRow>
      <TableCell as="th" scope="row">1</TableCell>
      <TableCell>张</TableCell>
      <TableCell>伟</TableCell>
      <TableCell>@zhangwei</TableCell>
    </TableRow>
    <TableRow>
      <TableCell as="th" scope="row">2</TableCell>
      <TableCell>李</TableCell>
      <TableCell>磊</TableCell>
      <TableCell>@lilei</TableCell>
    </TableRow>
    <TableRow>
      <TableCell as="th" scope="row">3</TableCell>
      <TableCell>王</TableCell>
      <TableCell>芳</TableCell>
      <TableCell>@wangfang</TableCell>
    </TableRow>
  </TableBody>
</Table>

<TableResponsive breakpoint="lg">
  <Table>
    <TableHead>
      <TableRow>
        <TableCell as="th" scope="col">#</TableCell>
        <TableCell as="th" scope="col">姓氏</TableCell>
        <TableCell as="th" scope="col">名字</TableCell>
        <TableCell as="th" scope="col">用户名</TableCell>
      </TableRow>
    </TableHead>
    <TableBody>
      <TableRow>
        <TableCell as="th" scope="row">1</TableCell>
        <TableCell>张</TableCell>
        <TableCell>伟</TableCell>
        <TableCell>@zhangwei</TableCell>
      </TableRow>
      <TableRow>
        <TableCell as="th" scope="row">2</TableCell>
        <TableCell>李</TableCell>
        <TableCell>磊</TableCell>
        <TableCell>@lilei</TableCell>
      </TableRow>
      <TableRow>
        <TableCell as="th" scope="row">3</TableCell>
        <TableCell>王</TableCell>
        <TableCell>芳</TableCell>
        <TableCell>@wangfang</TableCell>
      </TableRow>
    </TableBody>
  </Table>
</TableResponsive>
```
