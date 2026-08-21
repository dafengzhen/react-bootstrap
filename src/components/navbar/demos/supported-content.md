```tsx
<Navbar bg="dark" data-bs-theme="dark">
  <div className="container-fluid">
    <NavbarBrand href="#navbar-supported-demo">Navbar</NavbarBrand>
    <Nav className="me-auto">
      <NavItem>
        <NavLink active href="#navbar-supported-demo">
          首页
        </NavLink>
      </NavItem>
      <NavItem>
        <NavLink href="#navbar-supported-demo">功能</NavLink>
      </NavItem>
      <NavItem>
        <NavLink href="#navbar-supported-demo">价格</NavLink>
      </NavItem>
      <NavItem>
        <NavLink disabled href="#navbar-supported-demo">
          禁用
        </NavLink>
      </NavItem>
    </Nav>
    <form className="d-flex" role="search">
      <input aria-label="搜索" className="form-control me-2" placeholder="搜索" type="search" />
      <Button className="text-nowrap" type="submit" variant="outline-success">
        搜索
      </Button>
    </form>
  </div>
</Navbar>
```
