```tsx
<Timeline>
  <TimelineItem description="创建发布计划" time="10:00" title="发布公告">
    <Card className="mb-0 mt-1">
      <CardBody>
        <CardTitle>v1.2.0 版本发布说明</CardTitle>
        <CardText>新增 Timeline 时间轴组件，支持三种布局与自定义节点。</CardText>
      </CardBody>
    </Card>
  </TimelineItem>
  <TimelineItem description="完成回归测试" time="14:00" title="全量测试" />
  <TimelineItem description="同步至所有生产节点" time="16:30" title="灰度发布" />
</Timeline>
```
