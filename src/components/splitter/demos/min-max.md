```tsx
<Splitter style={{ height: 280 }}>
  <SplitterPanel defaultSize="40%" max="60%" min="20%">
    <div className="h-100 d-flex align-items-center justify-content-center bg-light border rounded-3">
      范围 20% ~ 60%
    </div>
  </SplitterPanel>
  <SplitterPanel min="25%">
    <div className="h-100 d-flex align-items-center justify-content-center bg-body border rounded-3">
      最小 25%
    </div>
  </SplitterPanel>
</Splitter>
```
