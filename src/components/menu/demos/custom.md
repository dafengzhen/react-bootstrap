```tsx
<Menu mode="inline" selectable={false} style={{ width: 240 }}>
  <MenuItem eventKey="link" icon={<House size={16} />}>
    <a className="text-decoration-none" href="#menu-custom-demo">
      链接内容
    </a>
  </MenuItem>
  <MenuItem eventKey="messages">
    <span className="d-flex align-items-center justify-content-between w-100">
      消息
      <span className="badge rounded-pill text-bg-primary">3</span>
    </span>
  </MenuItem>
  <MenuItem className="fw-bold" eventKey="bold">
    加粗条目
  </MenuItem>
  <MenuItem eventKey="long" title="这是一段很长的菜单内容，超出宽度后会被截断并显示省略号">
    这是一段很长的菜单内容，超出宽度后会被截断并显示省略号
  </MenuItem>
</Menu>
```
