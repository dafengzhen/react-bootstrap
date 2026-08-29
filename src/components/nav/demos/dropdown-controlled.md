```tsx
const [show, setShow] = useState(false);

<div className="d-flex align-items-center gap-3">
  <Nav className="gap-1 mb-0" variant="pills">
    <NavDropdown
      id="nav-dropdown-controlled-demo"
      onToggle={(nextShow) => setShow(nextShow)}
      show={show}
      title="受控下拉"
    >
      <DropdownItem className="my-1" eventKey="controlled-1">操作一</DropdownItem>
      <DropdownItem className="my-1" eventKey="controlled-2">操作二</DropdownItem>
    </NavDropdown>
  </Nav>
  <Button onClick={() => setShow((prev) => !prev)} variant="outline-secondary">
    外部切换
  </Button>
</div>;
```
