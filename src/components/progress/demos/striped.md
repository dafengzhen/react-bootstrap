```tsx
<div className="d-flex flex-column gap-3">
  <Progress label="默认条纹示例" now={10} striped />
  <Progress label="成功条纹示例" now={25} striped variant="success" />
  <Progress label="信息条纹示例" now={50} striped variant="info" />
  <Progress label="警告条纹示例" now={75} striped variant="warning" />
  <Progress label="危险条纹示例" now={100} striped variant="danger" />
</div>
```
