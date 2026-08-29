```tsx
const [activeKey, setActiveKey] = useState('home');

<div className="d-flex flex-wrap gap-4">
  <Menu defaultActiveKey="home" style={{ width: 200 }}>
    <MenuItem eventKey="home">首页</MenuItem>
    <MenuItem eventKey="settings">设置</MenuItem>
    <MenuItem eventKey="docs">文档</MenuItem>
  </Menu>
  <div className="d-flex flex-column gap-2">
    <Menu
      activeKey={activeKey}
      onSelect={(key) => {
        if (key != null) {
          setActiveKey(String(key));
        }
      }}
      style={{ width: 200 }}
    >
      <MenuItem eventKey="home">首页</MenuItem>
      <MenuItem eventKey="settings">设置</MenuItem>
      <MenuItem eventKey="docs">文档</MenuItem>
    </Menu>
    <p className="mb-0 text-muted small">当前选中：{activeKey}</p>
  </div>
</div>;
```
