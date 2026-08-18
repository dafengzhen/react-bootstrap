```tsx
<>
  <div className="d-flex flex-wrap gap-2">
    <Button onClick={() => openFullscreen(true)} variant="outline-primary">
      始终全屏
    </Button>
    <Button onClick={() => openFullscreen('sm-down')} variant="outline-primary">
      小屏全屏
    </Button>
    <Button onClick={() => openFullscreen('md-down')} variant="outline-primary">
      中屏及以下全屏
    </Button>
  </div>

  <Modal fullscreen={fullscreen} isOpen={fullscreenOpen} onOpenChange={setFullscreenOpen}>
    <ModalHeader closeButton>
      <ModalTitle>全屏模态框</ModalTitle>
    </ModalHeader>
    <ModalBody>
      通过 fullscreen 属性控制全屏行为，支持断点后缀（如 sm-down）在指定断点以下全屏显示。
    </ModalBody>
    <ModalFooter>
      <Button onClick={() => setFullscreenOpen(false)} variant="primary">
        关闭
      </Button>
    </ModalFooter>
  </Modal>
</>
```
