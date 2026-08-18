```tsx
<>
  <Button onClick={() => setConfirmOpen(true)} variant="danger">
    删除项目
  </Button>
  {deleted && <span className="ms-2 text-success">项目已删除</span>}

  <Dialog isOpen={confirmOpen} onOpenChange={setConfirmOpen}>
    <DialogHeader>
      <DialogTitle>确认删除</DialogTitle>
      <DialogClose />
    </DialogHeader>
    <DialogBody>删除后无法恢复，确定要继续吗？</DialogBody>
    <DialogFooter>
      <Button onClick={() => setConfirmOpen(false)} variant="secondary">
        取消
      </Button>
      <Button onClick={handleConfirmDelete} variant="danger">
        确认删除
      </Button>
    </DialogFooter>
  </Dialog>
</>
```
