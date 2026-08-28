```tsx
<Row className="g-3">
  <Col md={4} sm={6}>
    <Ratio aspectRatio={9 / 16} className="bg-body-tertiary rounded">
      <div className="d-flex align-items-center justify-content-center h-100 text-muted">
        9 / 16
      </div>
    </Ratio>
  </Col>
  <Col md={4} sm={6}>
    <Ratio aspectRatio={0.75} className="bg-body-tertiary rounded">
      <div className="d-flex align-items-center justify-content-center h-100 text-muted">0.75</div>
    </Ratio>
  </Col>
  <Col md={4} sm={6}>
    <Ratio aspectRatio={2} className="bg-body-tertiary rounded">
      <div className="d-flex align-items-center justify-content-center h-100 text-muted">
        2（竖屏）
      </div>
    </Ratio>
  </Col>
</Row>
```
