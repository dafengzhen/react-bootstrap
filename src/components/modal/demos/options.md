```tsx
<>
  <div className="d-flex flex-wrap gap-2">
    <Button onClick={() => setStaticOpen(true)} variant="outline-secondary">
      静态遮罩
    </Button>
    <Button onClick={() => setNoBackdropOpen(true)} variant="outline-secondary">
      无遮罩
    </Button>
    <Button onClick={() => setNoKeyboardOpen(true)} variant="outline-secondary">
      禁用 Esc
    </Button>
  </div>

  <Modal backdrop="static" isOpen={staticOpen} onOpenChange={setStaticOpen}>
    <ModalHeader closeButton>
      <ModalTitle>静态遮罩</ModalTitle>
    </ModalHeader>
    <ModalBody>backdrop 为 static 时点击遮罩不会关闭，只能通过按钮或 Esc 退出。</ModalBody>
  </Modal>

  <Modal backdrop={false} isOpen={noBackdropOpen} onOpenChange={setNoBackdropOpen}>
    <ModalHeader closeButton>
      <ModalTitle>无遮罩</ModalTitle>
    </ModalHeader>
    <ModalBody>
      backdrop 为 false 时不渲染背景遮罩，内容区自动添加 shadow-lg 阴影，点击内容以外区域仍可关闭。
    </ModalBody>
  </Modal>

  <Modal isOpen={noKeyboardOpen} keyboard={false} onOpenChange={setNoKeyboardOpen}>
    <ModalHeader closeButton>
      <ModalTitle>禁用 Esc</ModalTitle>
    </ModalHeader>
    <ModalBody>keyboard 为 false 时按 Esc 键不会关闭模态框。</ModalBody>
  </Modal>
</>
```
