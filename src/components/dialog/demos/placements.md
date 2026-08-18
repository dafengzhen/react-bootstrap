```tsx
<>
  <div className="d-flex flex-wrap gap-2">
    <Button onClick={() => handleOpenPlacement('center')} variant="outline-primary">
      居中
    </Button>
    <Button onClick={() => handleOpenPlacement('top')} variant="outline-primary">
      顶部
    </Button>
    <Button onClick={() => handleOpenPlacement('bottom')} variant="outline-primary">
      底部
    </Button>
    <Button onClick={() => handleOpenPlacement('left')} variant="outline-primary">
      左侧
    </Button>
    <Button onClick={() => handleOpenPlacement('right')} variant="outline-primary">
      右侧
    </Button>
  </div>

  <Dialog isOpen={placementOpen} onOpenChange={setPlacementOpen} placement={placement}>
    <DialogHeader>
      <DialogTitle>位置演示</DialogTitle>
      <DialogClose />
    </DialogHeader>
    <DialogBody>当前弹出位置：{placement}</DialogBody>
  </Dialog>
</>
```
