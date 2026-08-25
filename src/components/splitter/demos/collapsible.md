```tsx
const [collapsed, setCollapsed] = useState(true);

<Splitter style={{ height: 260 }}>
  <SplitterPanel collapsible defaultSize="30%" min="15%">
    <div className="h-100 d-flex align-items-center justify-content-center bg-light border rounded-3">
      双击分隔条折叠
    </div>
  </SplitterPanel>
  <SplitterPanel>
    <div className="h-100 d-flex align-items-center justify-content-center bg-body border rounded-3">
      内容区域
    </div>
  </SplitterPanel>
</Splitter>;

<Splitter className="mt-4" style={{ height: 260 }}>
  <SplitterPanel
    collapsed={collapsed}
    collapsible
    defaultSize="30%"
    min="15%"
    onCollapse={setCollapsed}
  >
    <div className="h-100 d-flex align-items-center justify-content-center bg-light border rounded-3">
      受控折叠
    </div>
  </SplitterPanel>
  <SplitterPanel>
    <div className="h-100 d-flex align-items-center justify-content-center bg-body border rounded-3">
      内容区域
    </div>
  </SplitterPanel>
</Splitter>;

<Button className="mt-3" onClick={() => setCollapsed((prev) => !prev)} variant="outline-primary">
  {collapsed ? '展开' : '折叠'}侧边栏
</Button>;
```
