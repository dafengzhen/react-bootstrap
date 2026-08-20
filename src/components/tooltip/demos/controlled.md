```tsx
const [controlledShow, setControlledShow] = useState(false);

return (
  <div className="d-flex align-items-center gap-2">
    <TooltipTrigger
      onToggle={setControlledShow}
      placement="top"
      show={controlledShow}
      title="受控的提示"
      trigger="manual"
    >
      <Button variant="success">受控触发</Button>
    </TooltipTrigger>
    <Button onClick={() => setControlledShow((prev) => !prev)} variant="outline-secondary">
      切换（当前 {String(controlledShow)}）
    </Button>
  </div>
);
```
