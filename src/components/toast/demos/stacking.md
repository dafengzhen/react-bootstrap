```tsx
<ToastContainer className="mt-3" position="static">
  <Toast autohide={false}>
    <ToastHeader>
      <div className="bg-primary rounded me-2" style={{ height: 20, width: 20 }} />
      <strong className="me-auto">React Bootstrap</strong>
      <small>刚刚</small>
    </ToastHeader>
    <ToastBody>看到我了吗？这是一条 Toast 消息。</ToastBody>
  </Toast>
  <Toast autohide={false} className="mt-2">
    <ToastHeader>
      <div className="bg-primary rounded me-2" style={{ height: 20, width: 20 }} />
      <strong className="me-auto">React Bootstrap</strong>
      <small>2 秒前</small>
    </ToastHeader>
    <ToastBody>第二条消息堆叠在下方。</ToastBody>
  </Toast>
</ToastContainer>
```
