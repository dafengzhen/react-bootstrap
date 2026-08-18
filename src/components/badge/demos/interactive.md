```tsx
<div className="d-flex align-items-center gap-3">
  <Button onClick={handleIncrement} variant="primary">
    消息
    <Badge bg="danger" className="ms-1">
      {count}
    </Badge>
  </Button>
  <Button onClick={handleReset} size="sm" variant="outline-secondary">
    重置
  </Button>
  <span className="text-muted small">点击「消息」按钮，徽章计数会增加</span>
</div>
```
