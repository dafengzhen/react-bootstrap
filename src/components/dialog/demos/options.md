```tsx
<>
  <div className="d-flex flex-wrap gap-2">
    <Button onClick={() => setTransparentOpen(true)} variant="outline-secondary">
      无背景遮罩
    </Button>
    <Button onClick={() => setNoMaskCloseOpen(true)} variant="outline-secondary">
      禁止点击遮罩关闭
    </Button>
  </div>

  <Dialog isOpen={transparentOpen} onOpenChange={setTransparentOpen} showBackdrop={false}>
    <DialogHeader>
      <DialogTitle>透明遮罩</DialogTitle>
      <DialogClose />
    </DialogHeader>
    <DialogBody>showBackdrop 为 false 时遮罩背景完全透明，仍可通过 Esc 或关闭按钮退出。</DialogBody>
  </Dialog>

  <Dialog closeOnBackdropClick={false} isOpen={noMaskCloseOpen} onOpenChange={setNoMaskCloseOpen}>
    <DialogHeader>
      <DialogTitle>禁止遮罩关闭</DialogTitle>
      <DialogClose />
    </DialogHeader>
    <DialogBody>点击遮罩不会关闭对话框，只能通过关闭按钮或 Esc 退出。</DialogBody>
  </Dialog>
</>
```
