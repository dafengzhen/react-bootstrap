```tsx
<Nav className="mb-3" variant="pills">
  <NavItem>
    <NavLink active>按钮激活</NavLink>
  </NavItem>
  <NavItem>
    <NavLink>普通按钮</NavLink>
  </NavItem>
  <NavItem>
    <NavLink disabled>禁用按钮</NavLink>
  </NavItem>
</Nav>

<Nav className="mb-0" variant="tabs" as="div">
  <NavItem as="div">
    <NavLink as="span" active href="#tabs-buttons-demo">
      自定义标签
    </NavLink>
  </NavItem>
  <NavItem as="div">
    <NavLink as="span" href="#tabs-buttons-demo">
      另一个自定义标签
    </NavLink>
  </NavItem>
</Nav>
```
