```tsx
const [sizes, setSizes] = useState(['25%', '75%']);

<Splitter onChange={setSizes} sizes={sizes} style={{ height: 280 }}>
  <SplitterPanel min="15%">
    <div className="h-100 d-flex align-items-center justify-content-center bg-light border rounded-3">
      左侧面板
    </div>
  </SplitterPanel>
  <SplitterPanel>
    <div className="h-100 d-flex align-items-center justify-content-center bg-body border rounded-3">
      右侧面板
    </div>
  </SplitterPanel>
</Splitter>;

<div className="d-flex align-items-center gap-2 mt-3">
  <Button onClick={() => setSizes(['50%', '50%'])} variant="outline-secondary">
    平均分配
  </Button>
  <Button onClick={() => setSizes(['70%', '30%'])} variant="outline-secondary">
    7:3
  </Button>
  <code className="ms-auto">{sizes.join(' / ')}</code>
</div>;
```
