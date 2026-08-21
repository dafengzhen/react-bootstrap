```tsx
const isEmpty = value.length === 0;

<div>
  <InputGroup className="mb-3">
    <FormControl
      aria-label="搜索输入框"
      onChange={handleChange}
      placeholder="输入关键词搜索..."
      type="text"
      value={value}
    />
    <Button disabled={isEmpty} variant="primary">
      搜索
    </Button>
  </InputGroup>
  <FormText muted>{isEmpty ? '请输入关键词后再搜索' : `正在搜索：${value}`}</FormText>
</div>;
```
