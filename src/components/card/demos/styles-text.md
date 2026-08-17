```tsx
<div className="row g-3">
  <div className="col-sm-6">
    <Card border="primary" style={{ maxWidth: '18rem' }} text="primary">
      <CardHeader>页眉</CardHeader>
      <CardBody>
        <CardTitle>主要文字</CardTitle>
        <CardText>
          使用 <code>text</code> 属性单独设置文字颜色，并可搭配边框。
        </CardText>
      </CardBody>
    </Card>
  </div>
  <div className="col-sm-6">
    <Card border="danger" style={{ maxWidth: '18rem' }} text="danger">
      <CardHeader>页眉</CardHeader>
      <CardBody>
        <CardTitle>危险文字</CardTitle>
        <CardText>文字颜色同样支持全部主题色以及 white、muted 等。</CardText>
      </CardBody>
    </Card>
  </div>
</div>
```
