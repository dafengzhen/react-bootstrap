```tsx
<div className="row g-3">
  <div className="col-md-4">
    <Card bg="primary" text="white">
      <CardHeader>页眉</CardHeader>
      <CardBody>
        <CardTitle>主要样式</CardTitle>
        <CardText>
          使用 <code>bg</code> 与 <code>text</code> 属性快速设置卡片配色。
        </CardText>
      </CardBody>
    </Card>
  </div>
  <div className="col-md-4">
    <Card bg="success" text="white">
      <CardHeader>页眉</CardHeader>
      <CardBody>
        <CardTitle>成功样式</CardTitle>
        <CardText>背景色与文字颜色均可通过属性单独控制。</CardText>
      </CardBody>
    </Card>
  </div>
  <div className="col-md-4">
    <Card bg="danger" text="white">
      <CardHeader>页眉</CardHeader>
      <CardBody>
        <CardTitle>危险样式</CardTitle>
        <CardText>
          也可以直接传入 <code>className="text-bg-danger"</code> 等工具类。
        </CardText>
      </CardBody>
    </Card>
  </div>
</div>
```
