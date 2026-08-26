```tsx
<Empty
  description="image 插槽支持任意 React 节点，如动画图标、自定义 SVG 或彩色徽标"
  image={
    <div
      className="bg-info-subtle rounded-circle d-flex align-items-center justify-content-center"
      style={{ height: 96, width: 96 }}
    >
      <Spinner variant="info" />
    </div>
  }
  title="自定义插图"
>
  <Button variant="outline-secondary">返回首页</Button>
</Empty>
```
