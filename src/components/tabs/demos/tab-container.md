```tsx
<TabContainer defaultActiveKey="first" id="tab-container-demo" transition>
  <Nav variant="pills">
    <NavItem>
      <NavLink eventKey="first">第一个</NavLink>
    </NavItem>
    <NavItem>
      <NavLink eventKey="second">第二个</NavLink>
    </NavItem>
    <NavItem>
      <NavLink disabled eventKey="third">
        禁用
      </NavLink>
    </NavItem>
  </Nav>
  <TabContent>
    <TabPane eventKey="first">第一个面板的内容。</TabPane>
    <TabPane eventKey="second">第二个面板的内容。</TabPane>
    <TabPane eventKey="third">禁用面板的内容，永远不会显示。</TabPane>
  </TabContent>
</TabContainer>
```
