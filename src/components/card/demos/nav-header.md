```tsx
<Card className="text-center" style={{ width: '18rem' }}>
  <CardHeader>
    <ul className="nav nav-tabs card-header-tabs">
      <li className="nav-item">
        <a aria-current="page" className="nav-link active" href="#card-tabs-demo">
          激活
        </a>
      </li>
      <li className="nav-item">
        <a className="nav-link" href="#card-tabs-demo">
          链接
        </a>
      </li>
      <li className="nav-item">
        <a aria-disabled="true" className="nav-link disabled" href="#card-tabs-demo">
          禁用
        </a>
      </li>
    </ul>
  </CardHeader>
  <CardBody>
    <CardTitle>页眉中的标签导航</CardTitle>
    <CardText>通过 card-header-tabs 类让导航与页眉无缝衔接。</CardText>
  </CardBody>
</Card>

<Card className="text-center" style={{ width: '18rem' }}>
  <CardHeader>
    <ul className="nav nav-pills card-header-pills">
      <li className="nav-item">
        <a aria-current="page" className="nav-link active" href="#card-pills-demo">
          激活
        </a>
      </li>
      <li className="nav-item">
        <a className="nav-link" href="#card-pills-demo">
          链接
        </a>
      </li>
      <li className="nav-item">
        <a aria-disabled="true" className="nav-link disabled" href="#card-pills-demo">
          禁用
        </a>
      </li>
    </ul>
  </CardHeader>
  <CardBody>
    <CardTitle>页眉中的胶囊导航</CardTitle>
    <CardText>使用 card-header-pills 类将胶囊导航嵌入页眉。</CardText>
  </CardBody>
</Card>
```
