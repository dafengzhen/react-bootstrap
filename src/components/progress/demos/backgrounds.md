```tsx
<div className="d-flex flex-column gap-3">
  <Progress label="成功示例" now={25} variant="success" />
  <Progress label="信息示例" now={50} variant="info" />
  <Progress label="警告示例" now={75} variant="warning" />
  <Progress label="危险示例" now={100} variant="danger" />
</div>

<div className="d-flex flex-column gap-3 mt-3">
  <Progress label="带标签的警告示例" now={75} textBg variant="warning">
    75%
  </Progress>
  <Progress label="带标签的信息示例" now={50} textBg variant="info">
    50%
  </Progress>
</div>
```
