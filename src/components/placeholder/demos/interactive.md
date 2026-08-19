```tsx
<Button className="mb-3" onClick={() => setLoading(!loading)} variant="secondary">
  {loading ? '加载完成' : '开始加载'}
</Button>;

{
  loading ? (
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
  ) : (
    <Card style={{ width: '18rem' }}>
      <CardImg src={cardImage} />
      <CardBody>
        <CardTitle>卡片标题</CardTitle>
        <CardText>加载完成后的真实内容。</CardText>
        <Button variant="primary">前往某处</Button>
      </CardBody>
    </Card>
  );
}
```
