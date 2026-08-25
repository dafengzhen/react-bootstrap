```tsx
<Splitter layout="vertical" style={{ height: 480 }}>
  <SplitterPanel defaultSize="30%" min="20%">
    <div className="h-100 d-flex align-items-center justify-content-center bg-light border rounded-3">
      顶部工具栏
    </div>
  </SplitterPanel>
  <SplitterPanel>
    <Splitter className="h-100" defaultSizes={['25%', '75%']}>
      <SplitterPanel min="15%">
        <div className="h-100 d-flex align-items-center justify-content-center bg-body border rounded-3">
          资源管理器
        </div>
      </SplitterPanel>
      <SplitterPanel>
        <div className="h-100 d-flex align-items-center justify-content-center bg-light-subtle border rounded-3">
          编辑器
        </div>
      </SplitterPanel>
    </Splitter>
  </SplitterPanel>
</Splitter>
```
