```tsx
const [show, setShow] = useState(false);

<div className="d-flex align-items-center gap-2">
  <Dropdown show={show} onToggle={(nextShow) => setShow(nextShow)}>
    <DropdownToggle id="dropdown-controlled-toggle" variant="success">
      受控下拉
    </DropdownToggle>
    <DropdownMenu>
      <DropdownItem>操作</DropdownItem>
      <DropdownItem>另一个操作</DropdownItem>
    </DropdownMenu>
  </Dropdown>
  <Button onClick={() => setShow((prev) => !prev)} variant="outline-secondary">
    外部切换
  </Button>
</div>;
```
