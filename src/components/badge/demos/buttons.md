```tsx
<div className="d-flex flex-wrap gap-3 align-items-center">
  <Button variant="primary">
    通知 <Badge bg="secondary">4</Badge>
  </Button>
  <Button className="position-relative" variant="primary">
    收件箱
    <Badge bg="danger" className="position-absolute top-0 start-100 translate-middle" pill>
      99+
    </Badge>
  </Button>
</div>
```
