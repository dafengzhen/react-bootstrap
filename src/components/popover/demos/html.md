```tsx
<PopoverTrigger
  content={
    <>
      <em>弹窗</em> <u>正文</u> <strong>支持 HTML</strong>，还可以嵌套链接与按钮
    </>
  }
  placement="right"
  title={
    <>
      弹窗标题 <small className="text-muted">副标题</small>
    </>
  }
>
  <Button variant="secondary">HTML 内容</Button>
</PopoverTrigger>
```
