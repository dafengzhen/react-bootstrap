```tsx
<>
  <Button onClick={() => setSizesOpen(true)} variant="primary">
    打开自定义尺寸对话框
  </Button>

  <Dialog height={320} isOpen={sizesOpen} maxWidth="90vw" onOpenChange={setSizesOpen} width={560}>
    <DialogHeader>
      <DialogTitle>自定义尺寸</DialogTitle>
      <DialogClose />
    </DialogHeader>
    <DialogBody>
      通过 width、height 与 maxWidth
      控制对话框尺寸，数字会自动转换为像素。内容超出高度时正文区域会出现滚动条。
    </DialogBody>
    <DialogFooter>
      <Button onClick={() => setSizesOpen(false)} variant="primary">
        知道了
      </Button>
    </DialogFooter>
  </Dialog>
</>
```
