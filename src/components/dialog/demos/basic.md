```tsx
<>
  <Button onClick={() => setOpen(true)} variant="primary">
    打开对话框
  </Button>

  <Dialog isOpen={open} onOpenChange={setOpen}>
    <DialogHeader>
      <div>
        <DialogTitle>对话框标题</DialogTitle>
        <DialogDescription>支持标题、描述、正文与页脚的自由组合</DialogDescription>
      </div>
      <DialogClose />
    </DialogHeader>
    <DialogBody>
      对话框打开后会自动锁定背景滚动、将焦点移入对话框，并可通过 Esc 键、遮罩点击或关闭按钮退出。
    </DialogBody>
    <DialogFooter>
      <Button onClick={() => setOpen(false)} variant="secondary">
        取消
      </Button>
      <Button onClick={() => setOpen(false)} variant="primary">
        确定
      </Button>
    </DialogFooter>
  </Dialog>
</>
```
