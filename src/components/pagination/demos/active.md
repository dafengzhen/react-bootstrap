```tsx
<Pagination>
  <PaginationItem>
    <PaginationLink href="#">上一页</PaginationLink>
  </PaginationItem>
  <PaginationItem>
    <PaginationLink href="#">1</PaginationLink>
  </PaginationItem>
  <PaginationItem active>
    <PaginationLink>2</PaginationLink>
  </PaginationItem>
  <PaginationItem>
    <PaginationLink href="#">3</PaginationLink>
  </PaginationItem>
  <PaginationItem>
    <PaginationLink href="#">下一页</PaginationLink>
  </PaginationItem>
</Pagination>

<Pagination className="mb-0" label="图标激活示例">
  <PaginationItem active>
    <PaginationLink active>
      <span aria-hidden="true">&laquo;</span>
    </PaginationLink>
  </PaginationItem>
  <PaginationItem>
    <PaginationLink href="#">1</PaginationLink>
  </PaginationItem>
  <PaginationItem>
    <PaginationLink href="#">2</PaginationLink>
  </PaginationItem>
  <PaginationItem>
    <PaginationLink href="#">3</PaginationLink>
  </PaginationItem>
  <PaginationItem>
    <PaginationLink aria-label="下一页" href="#">
      <span aria-hidden="true">&raquo;</span>
    </PaginationLink>
  </PaginationItem>
</Pagination>
```
