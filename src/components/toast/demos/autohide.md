```tsx
<>
  <div className="d-flex flex-wrap gap-2">
    <Button onClick={() => setDefaultDelayShow(true)} variant="outline-primary">
      默认 5 秒
    </Button>
    <Button onClick={handleShowFast} variant="outline-primary">
      1 秒后隐藏
    </Button>
    <Button onClick={() => setStayShow(true)} variant="outline-primary">
      不自动隐藏
    </Button>
  </div>

  <ToastContainer className="mt-3" position="static">
    <Toast onClose={() => setDefaultDelayShow(false)} show={defaultDelayShow}>
      <ToastHeader>
        <strong className="me-auto">自动隐藏</strong>
        <small>5 秒</small>
      </ToastHeader>
      <ToastBody>delay 默认 5000 毫秒，悬停时会暂停计时。</ToastBody>
    </Toast>
    <Toast delay={autoDelay} onClose={() => setAutoShow(false)} show={autoShow}>
      <ToastHeader>
        <strong className="me-auto">自动隐藏</strong>
        <small>{autoDelay / 1000} 秒</small>
      </ToastHeader>
      <ToastBody>通过 delay 自定义自动隐藏时间。</ToastBody>
    </Toast>
    <Toast autohide={false} onClose={() => setStayShow(false)} show={stayShow}>
      <ToastHeader>
        <strong className="me-auto">不自动隐藏</strong>
        <small>常驻</small>
      </ToastHeader>
      <ToastBody>autohide 为 false 时不会自动隐藏，需要手动关闭。</ToastBody>
    </Toast>
  </ToastContainer>
</>
```
