```tsx
<Timeline>
  <TimelineItem color="success" description="所有用例均已通过" title="构建成功" />
  <TimelineItem color="info" description="等待人工审核" title="提交审核" />
  <TimelineItem color="warning" description="缺少负责人信息，请补充" title="信息不完整" />
  <TimelineItem color="danger" description="部署失败，已自动回滚" title="发布失败" />
</Timeline>

<Timeline className="mt-4" color="secondary">
  <TimelineItem description="继承 Timeline 上设置的节点颜色" title="默认节点颜色" />
  <TimelineItem description="同样继承 Timeline 上设置的节点颜色" title="默认节点颜色" />
</Timeline>
```
