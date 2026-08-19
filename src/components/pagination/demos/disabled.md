```tsx
<Pagination>
  <PaginationItem disabled>
    <PaginationLink>上一页</PaginationLink>
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

<Pagination className="mb-0" label="链接禁用示例">
  <PaginationItem>
    <PaginationLink disabled href="#">
      上一页
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
    <PaginationLink href="#">下一页</PaginationLink>
  </PaginationItem>
</Pagination>
```
