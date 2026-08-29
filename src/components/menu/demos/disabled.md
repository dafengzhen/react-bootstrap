```tsx
<Menu defaultActiveKey="home" mode="inline" style={{ width: 220 }}>
  <MenuItem eventKey="home" icon={<House size={16} />}>
    首页
  </MenuItem>
  <MenuItem disabled eventKey="locked" icon={<Lock size={16} />}>
    锁定项
  </MenuItem>
  <MenuSubMenu disabled eventKey="archived" title="禁用的子菜单">
    <MenuItem eventKey="hidden">不可达</MenuItem>
  </MenuSubMenu>
  <MenuItem danger eventKey="delete" icon={<Trash2 size={16} />}>
    删除账户
  </MenuItem>
</Menu>
```
