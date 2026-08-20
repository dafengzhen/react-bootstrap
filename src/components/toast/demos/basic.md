```tsx
<>
  <Button onClick={() => setBasicShow(true)} variant="primary">
    显示 Toast
  </Button>

  <Toast className="mt-3" onClose={() => setBasicShow(false)} show={basicShow}>
    <ToastHeader>
      <div className="bg-primary rounded me-2" style={{ height: 20, width: 20 }} />
      <strong className="me-auto">React Bootstrap</strong>
      <small>11 分钟前</small>
    </ToastHeader>
    <ToastBody>你好，世界！这是一条 Toast 消息。</ToastBody>
  </Toast>
</>
```
