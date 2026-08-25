```tsx
<Splitter disabled style={{ height: 260 }}>
  <SplitterPanel defaultSize="40%">
    <div className="h-100 d-flex align-items-center justify-content-center bg-light border rounded-3">
      左侧面板
    </div>
  </SplitterPanel>
  <SplitterPanel>
    <div className="h-100 d-flex align-items-center justify-content-center bg-body border rounded-3">
      右侧面板
    </div>
  </SplitterPanel>
</Splitter>

<Splitter className="mt-4" style={{ height: 260 }}>
  <SplitterPanel defaultSize="40%" resizable={false}>
    <div className="h-100 d-flex align-items-center justify-content-center bg-light border rounded-3">
      固定面板（不可调整）
    </div>
  </SplitterPanel>
  <SplitterPanel>
    <div className="h-100 d-flex align-items-center justify-content-center bg-body border rounded-3">
      可调整面板
    </div>
  </SplitterPanel>
</Splitter>
```
