```tsx
<div className="row g-3">
  <div className="col-sm-6">
    <Card border="primary">
      <CardHeader>页眉</CardHeader>
      <CardBody>
        <CardTitle>主要边框</CardTitle>
        <CardText>
          使用 <code>border</code> 属性为卡片设置主题色边框。
        </CardText>
      </CardBody>
    </Card>
  </div>
  <div className="col-sm-6">
    <Card border="success">
      <CardHeader>页眉</CardHeader>
      <CardBody>
        <CardTitle>成功边框</CardTitle>
        <CardText>边框颜色独立于背景色，可以自由组合。</CardText>
      </CardBody>
    </Card>
  </div>
  <div className="col-sm-6">
    <Card border="danger">
      <CardHeader>页眉</CardHeader>
      <CardBody>
        <CardTitle>危险边框</CardTitle>
        <CardText>边框仅改变描边颜色，不影响卡片内部样式。</CardText>
      </CardBody>
    </Card>
  </div>
  <div className="col-sm-6">
    <Card border="warning">
      <CardHeader>页眉</CardHeader>
      <CardBody>
        <CardTitle>警告边框</CardTitle>
        <CardText>支持 Bootstrap 的全部主题色。</CardText>
      </CardBody>
    </Card>
  </div>
</div>
```
