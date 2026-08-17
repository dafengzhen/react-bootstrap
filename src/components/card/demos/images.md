```tsx
<Card style={{ width: '18rem' }}>
  <CardImg alt="顶部图片占位图" src="/card-placeholder-top.svg" variant="top" />
  <CardBody>
    <CardTitle>顶部图片</CardTitle>
    <CardText>
      使用 <code>variant="top"</code> 将图片置于卡片顶部，并自动匹配卡片圆角。
    </CardText>
  </CardBody>
</Card>

<Card style={{ width: '18rem' }}>
  <CardBody>
    <CardTitle>底部图片</CardTitle>
    <CardText>
      使用 <code>variant="bottom"</code> 将图片置于卡片底部。
    </CardText>
  </CardBody>
  <CardImg alt="底部图片占位图" src="/card-placeholder-top.svg" variant="bottom" />
</Card>
```
