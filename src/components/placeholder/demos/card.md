```tsx
const cardImage = `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(
  '<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="180" role="img" aria-label="占位图片" preserveAspectRatio="xMidYMid slice" viewBox="0 0 318 180"><rect width="100%" height="100%" fill="#868e96"/><text x="50%" y="50%" dy=".3em" fill="#dee2e6" style="font-size:1.125rem;text-anchor:middle">图片</text></svg>',
)}`;

<>
  <Card style={{ width: '18rem' }}>
    <CardImg src={cardImage} />
    <CardBody>
      <CardTitle>卡片标题</CardTitle>
      <CardText>一些用于构建卡片标题并构成卡片主体内容的快速示例文本。</CardText>
      <Button variant="primary">前往某处</Button>
    </CardBody>
  </Card>

  <Card aria-hidden="true" style={{ width: '18rem' }}>
    <Placeholder as="div" className="card-img-top" style={{ height: 180 }} />
    <CardBody>
      <CardTitle className="placeholder-glow">
        <Placeholder xs={6} />
      </CardTitle>
      <CardText className="placeholder-glow">
        <Placeholder xs={7} />
        <Placeholder xs={4} />
        <Placeholder xs={4} />
        <Placeholder xs={6} />
        <Placeholder xs={8} />
      </CardText>
      <PlaceholderButton xs={6} />
    </CardBody>
  </Card>
</>;
```
