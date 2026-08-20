```tsx
<ProgressStacked>
  <Progress label="第一段" now={15} />
  <Progress label="第二段" now={30} variant="success" />
  <Progress label="第三段" now={20} variant="info" />
</ProgressStacked>

<ProgressStacked className="mt-3" height={8}>
  <Progress label="已完成" now={40} variant="success" />
  <Progress label="进行中" now={25} striped variant="warning" />
  <Progress label="失败" now={10} variant="danger" />
</ProgressStacked>
```
