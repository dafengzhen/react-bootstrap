```tsx
const [expanded, setExpanded] = useState(false);

<>
  <Button className="mb-3" onClick={() => setExpanded((value) => !value)} variant="outline-dark">
    外部按钮切换导航栏
  </Button>
  <Navbar bg="dark" data-bs-theme="dark" expand="lg" expanded={expanded} onToggle={setExpanded}>
    <div className="container-fluid">
      <NavbarBrand href="#navbar-external-demo">受控导航栏</NavbarBrand>
      <NavbarToggle aria-controls="navbar-external-demo" />
      <NavbarCollapse id="navbar-external-demo">
        <Nav className="me-auto">
          <NavItem>
            <NavLink active href="#navbar-external-demo">
              首页
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink href="#navbar-external-demo">功能</NavLink>
          </NavItem>
          <NavItem>
            <NavLink href="#navbar-external-demo">价格</NavLink>
          </NavItem>
        </Nav>
      </NavbarCollapse>
    </div>
  </Navbar>
</>;
```
