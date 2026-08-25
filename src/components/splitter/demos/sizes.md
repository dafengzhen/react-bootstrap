```tsx
<Splitter style={{ height: 280 }}>
  <SplitterPanel defaultSize={200}>
    <div className="h-100 d-flex align-items-center justify-content-center bg-light border rounded-3">
      固定像素 200px
    </div>
  </SplitterPanel>
  <SplitterPanel defaultSize="30%">
    <div className="h-100 d-flex align-items-center justify-content-center bg-body border rounded-3">
      百分比 30%
    </div>
  </SplitterPanel>
  <SplitterPanel>
    <div className="h-100 d-flex align-items-center justify-content-center bg-light-subtle border rounded-3">
      auto 自适应剩余空间
    </div>
  </SplitterPanel>
</Splitter>
```
