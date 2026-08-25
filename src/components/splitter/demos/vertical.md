```tsx
<Splitter layout="vertical" style={{ height: 320 }}>
  <SplitterPanel defaultSize="40%" min="20%">
    <div className="h-100 d-flex align-items-center justify-content-center bg-light border rounded-3">
      上方面板
    </div>
  </SplitterPanel>
  <SplitterPanel>
    <div className="h-100 d-flex align-items-center justify-content-center bg-body border rounded-3">
      下方面板
    </div>
  </SplitterPanel>
</Splitter>
```
