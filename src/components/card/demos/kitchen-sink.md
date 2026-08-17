```tsx
<Card style={{ width: '18rem' }}>
  <CardImg alt="顶部图片占位图" src="/card-placeholder-top.svg" variant="top" />
  <CardBody>
    <CardTitle>组合示例</CardTitle>
    <CardText>将图片、正文、列表组、链接与页脚组合为一张完整卡片。</CardText>
  </CardBody>
  <ul className="list-group list-group-flush">
    <li className="list-group-item">列表项 1</li>
    <li className="list-group-item">列表项 2</li>
    <li className="list-group-item">列表项 3</li>
  </ul>
  <CardBody>
    <CardLink href="#">卡片链接</CardLink>
    <CardLink href="#">另一个链接</CardLink>
  </CardBody>
  <CardFooter className="text-body-secondary">2 天前</CardFooter>
</Card>
```
