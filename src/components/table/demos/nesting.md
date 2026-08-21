```tsx
<Table bordered striped>
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
    <TableRow>
      <TableCell as="th" scope="row">
        1
      </TableCell>
      <TableCell colSpan={3}>
        嵌套表格：
        <Table size="sm">
          <TableHead>
            <TableRow>
              <TableCell as="th" scope="col">
                标签
              </TableCell>
              <TableCell as="th" scope="col">
                值
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              <TableCell>角色</TableCell>
              <TableCell>管理员</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>状态</TableCell>
              <TableCell>在线</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableCell>
    </TableRow>
  </TableBody>
</Table>
```
