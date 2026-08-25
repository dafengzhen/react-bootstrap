```tsx
<Splitter
  barSize={16}
  renderBar={(props) => (
    <div {...props}>
      <span
        style={{
          background: 'var(--bs-primary)',
          borderRadius: 999,
          display: 'block',
          height: 32,
          width: 4,
        }}
      />
    </div>
  )}
  style={{ height: 280 }}
>
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
```
