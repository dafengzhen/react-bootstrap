```tsx
<Table align="middle">
  <TableHead>
    <TableRow>
      <TableCell as="th" scope="col">#</TableCell>
      <TableCell as="th" scope="col">对齐方式</TableCell>
      <TableCell as="th" scope="col">内容</TableCell>
    </TableRow>
  </TableHead>
  <TableBody>
    <TableRow>
      <TableCell as="th" scope="row">1</TableCell>
      <TableCell>继承表格的垂直对齐</TableCell>
      <TableCell>
        这里是一段很长的内容，用于把整行撑高，
        <br />
        以便观察单元格的垂直对齐效果，
        <br />
        表格设置了对齐方式为 middle。
      </TableCell>
    </TableRow>
  </TableBody>
</Table>

<Table align="middle">
  <TableBody>
    <TableRow>
      <TableCell align="top" as="th" scope="row">
        顶部对齐
      </TableCell>
      <TableCell align="middle">垂直居中</TableCell>
      <TableCell align="bottom">底部对齐</TableCell>
    </TableRow>
  </TableBody>
</Table>
```
