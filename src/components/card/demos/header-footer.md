```tsx
<Card className="text-center" style={{ width: '18rem' }}>
  <CardHeader>特色</CardHeader>
  <CardBody>
    <CardTitle>特殊标题处理</CardTitle>
    <CardText>使用页眉与页脚扩展卡片内容，页脚常用于展示次要信息。</CardText>
    <Button variant="primary">前往某处</Button>
  </CardBody>
  <CardFooter className="text-body-secondary">2 天前</CardFooter>
</Card>

<Card className="text-center" style={{ width: '18rem' }}>
  <CardHeader>
    <h5 className="mb-0">引用</h5>
  </CardHeader>
  <CardBody>
    <blockquote className="blockquote mb-0">
      <p>一个被版面分散注意力的读者，将无法专注于排版本身。</p>
      <footer className="blockquote-footer">
        出自 <cite title="来源标题">某位名人</cite>
      </footer>
    </blockquote>
  </CardBody>
</Card>
```
