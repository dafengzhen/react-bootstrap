```tsx
<div className="row row-cols-1 row-cols-md-3 g-4">
  {['主要', '次要', '成功'].map((title) => (
    <div className="col" key={title}>
      <Card className="h-100">
        <CardBody>
          <CardTitle>{title}卡片</CardTitle>
          <CardText>使用网格系统让卡片等宽排列，并为多张卡片提供统一间距。</CardText>
        </CardBody>
      </Card>
    </div>
  ))}
</div>
```
