```tsx
<Navbar bg="dark" data-bs-theme="dark" expand="lg">
  <div className="container-fluid">
    <NavbarBrand href="#navbar-responsive-demo">响应式导航栏</NavbarBrand>
    <NavbarToggle aria-controls="navbar-responsive-demo" />
    <NavbarCollapse id="navbar-responsive-demo">
      <Nav className="me-auto">
        <NavItem>
          <NavLink active href="#navbar-responsive-demo">
            首页
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink href="#navbar-responsive-demo">功能</NavLink>
        </NavItem>
        <NavItem>
          <NavLink href="#navbar-responsive-demo">价格</NavLink>
        </NavItem>
      </Nav>
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
    </NavbarCollapse>
  </div>
</Navbar>

<Navbar bg="dark" className="mb-3" collapseOnSelect data-bs-theme="dark" expand="lg">
  <div className="container-fluid">
    <NavbarBrand href="#navbar-responsive-demo">collapseOnSelect</NavbarBrand>
    <NavbarToggle aria-controls="navbar-collapse-on-select-demo" />
    <NavbarCollapse id="navbar-collapse-on-select-demo">
      <Nav className="me-auto">
        <NavItem>
          <NavLink active eventKey="home">
            首页
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink eventKey="features">功能</NavLink>
        </NavItem>
        <NavItem>
          <NavLink eventKey="pricing">价格</NavLink>
        </NavItem>
      </Nav>
    </NavbarCollapse>
  </div>
</Navbar>
```
