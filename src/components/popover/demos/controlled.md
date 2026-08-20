```tsx
const [controlledShow, setControlledShow] = useState(false);

return (
  <div className="d-flex align-items-center gap-2">
    <PopoverTrigger
      content="受控的弹窗内容"
      onToggle={setControlledShow}
      show={controlledShow}
      title="受控模式"
      trigger="manual"
    >
      <Button variant="success">受控触发</Button>
    </PopoverTrigger>
    <Button onClick={() => setControlledShow((prev) => !prev)} variant="outline-secondary">
      切换（当前 {String(controlledShow)}）
    </Button>
  </div>
);
```
