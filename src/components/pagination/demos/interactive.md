```tsx
const pages = [1, 2, 3, 4, 5];

<Pagination label="分页交互示例">
  <PaginationItem disabled={currentPage === 1}>
    <PaginationLink
      href="#"
      onClick={(e) => {
        e.preventDefault();
        setCurrentPage((p) => Math.max(1, p - 1));
      }}
    >
      上一页
    </PaginationLink>
  </PaginationItem>
  {pages.map((page) => (
    <PaginationItem active={currentPage === page} key={page}>
      <PaginationLink
        href="#"
        onClick={(e) => {
          e.preventDefault();
          setCurrentPage(page);
        }}
      >
        {page}
      </PaginationLink>
    </PaginationItem>
  ))}
  <PaginationItem disabled={currentPage === pages.length}>
    <PaginationLink
      href="#"
      onClick={(e) => {
        e.preventDefault();
        setCurrentPage((p) => Math.min(pages.length, p + 1));
      }}
    >
      下一页
    </PaginationLink>
  </PaginationItem>
</Pagination>;
```
