```tsx
<Navbar className="bg-body-tertiary mb-3">
  <div className="container-fluid">
    <form className="d-flex" role="search">
      <input
        aria-label="搜索"
        className="form-control me-2"
        placeholder="搜索"
        type="search"
      />
      <Button className="text-nowrap" type="submit" variant="outline-success">
        搜索
      </Button>
    </form>
  </div>
</Navbar>

<Navbar className="bg-body-tertiary">
  <div className="container-fluid justify-content-start">
    <Dropdown>
      <DropdownToggle id="navbar-dropdown-demo" variant="success">
        下拉菜单
      </DropdownToggle>
      <DropdownMenu>
        <DropdownItem href="#navbar-forms-demo">操作一</DropdownItem>
        <DropdownItem href="#navbar-forms-demo">操作二</DropdownItem>
        <DropdownDivider />
        <DropdownItem href="#navbar-forms-demo">另一个操作</DropdownItem>
      </DropdownMenu>
    </Dropdown>
  </div>
</Navbar>
```
