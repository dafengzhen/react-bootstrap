```tsx
<Navbar bg="dark" data-bs-theme="dark" expand="lg">
  <div className="container-fluid">
    <NavbarBrand href="#navbar-offcanvas-demo">Offcanvas 导航栏</NavbarBrand>
    <NavbarToggle aria-controls="navbar-offcanvas-demo" />
    <NavbarOffcanvas
      aria-labelledby="navbar-offcanvas-demo-label"
      id="navbar-offcanvas-demo"
      placement="end"
    >
      <div className="offcanvas-header">
        <h5 className="offcanvas-title" id="navbar-offcanvas-demo-label">
          Offcanvas
        </h5>
        <OffcanvasDemoCloseButton />
      </div>
      <div className="offcanvas-body">
        <Nav className="justify-content-end flex-grow-1 pe-3">
          <NavItem>
            <NavLink active href="#navbar-offcanvas-demo">
              首页
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink href="#navbar-offcanvas-demo">功能</NavLink>
          </NavItem>
          <NavItem>
            <NavLink href="#navbar-offcanvas-demo">价格</NavLink>
          </NavItem>
          <NavItem>
            <NavLink disabled href="#navbar-offcanvas-demo">
              禁用
            </NavLink>
          </NavItem>
        </Nav>
        <form className="d-flex mt-3 mt-lg-0" role="search">
          <input aria-label="搜索" className="form-control me-2" placeholder="搜索" type="search" />
          <Button className="text-nowrap" type="submit" variant="outline-success">
            搜索
          </Button>
        </form>
      </div>
    </NavbarOffcanvas>
  </div>
</Navbar>
```
