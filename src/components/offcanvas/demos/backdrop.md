```tsx
<>
  <div className="d-flex flex-wrap gap-2">
    <Button onClick={() => setStaticOpen(true)} variant="outline-secondary">
      静态遮罩
    </Button>
    <Button onClick={() => setNoBackdropOpen(true)} variant="outline-secondary">
      无遮罩
    </Button>
  </div>

  <Offcanvas backdrop="static" isOpen={staticOpen} onOpenChange={setStaticOpen}>
    <OffcanvasHeader closeButton>
      <OffcanvasTitle>静态遮罩</OffcanvasTitle>
    </OffcanvasHeader>
    <OffcanvasBody>backdrop 为 static 时点击遮罩不会关闭，只能通过按钮或 Esc 退出。</OffcanvasBody>
  </Offcanvas>

  <Offcanvas backdrop={false} isOpen={noBackdropOpen} onOpenChange={setNoBackdropOpen}>
    <OffcanvasHeader closeButton>
      <OffcanvasTitle>无遮罩</OffcanvasTitle>
    </OffcanvasHeader>
    <OffcanvasBody>
      backdrop 为 false 时不渲染背景遮罩，抽屉自动添加 shadow-lg 阴影，点击抽屉以外的区域仍可关闭。
    </OffcanvasBody>
  </Offcanvas>
</>
```
