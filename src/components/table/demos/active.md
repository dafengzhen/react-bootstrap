```tsx
<div className="d-flex flex-wrap gap-3 align-items-start">
  <Table>
    <TableBody>
      <TableRow active>
        <TableCell as="th" scope="row">
          1
        </TableCell>
        <TableCell>激活的行</TableCell>
        <TableCell>整行高亮</TableCell>
      </TableRow>
      <TableRow>
        <TableCell as="th" scope="row">
          2
        </TableCell>
        <TableCell>普通行</TableCell>
        <TableCell>默认样式</TableCell>
      </TableRow>
    </TableBody>
  </Table>
  <Table>
    <TableBody>
      <TableRow>
        <TableCell as="th" scope="row">
          1
        </TableCell>
        <TableCell active>激活的单元格</TableCell>
        <TableCell>单个单元格高亮</TableCell>
      </TableRow>
      <TableRow>
        <TableCell as="th" scope="row">
          2
        </TableCell>
        <TableCell>普通单元格</TableCell>
        <TableCell>默认样式</TableCell>
      </TableRow>
    </TableBody>
  </Table>
</div>
```
