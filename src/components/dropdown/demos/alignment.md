```tsx
<div className="d-flex flex-wrap gap-2">
  <DropdownButton align="end" id="dropdown-align-end-demo" title="右对齐菜单" variant="secondary">
    <DropdownItem>操作</DropdownItem>
    <DropdownItem>另一个操作</DropdownItem>
  </DropdownButton>
  <DropdownButton
    align={{ lg: 'end' }}
    id="dropdown-align-responsive-demo"
    title="响应式对齐（lg 以上右对齐）"
    variant="secondary"
  >
    <DropdownItem>操作</DropdownItem>
    <DropdownItem>另一个操作</DropdownItem>
  </DropdownButton>
</div>
```
