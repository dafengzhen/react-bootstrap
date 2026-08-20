```tsx
<>
  <Button onClick={() => setCustomShow(true)} variant="primary">
    显示自定义内容
  </Button>

  <Toast autohide={false} className="mt-3" onClose={() => setCustomShow(false)} show={customShow}>
    <ToastHeader>
      <strong className="me-auto">自定义内容</strong>
      <small>刚刚</small>
    </ToastHeader>
    <ToastBody>
      Toast 正文支持任意内容，例如按钮或链接。
      <div className="border-top mt-2 pt-2">
        <Button size="sm" variant="primary">
          采取行动
        </Button>{' '}
        <Button size="sm" variant="secondary">
          稍后处理
        </Button>
      </div>
    </ToastBody>
  </Toast>
</>
```
