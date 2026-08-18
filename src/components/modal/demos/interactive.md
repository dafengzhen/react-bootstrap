```tsx
<>
  <div className="d-flex align-items-center gap-2">
    <Button onClick={() => setConfirmOpen(true)} variant="danger">
      删除项目
    </Button>
    {deleted && <span className="text-success">项目已删除</span>}
  </div>

  <Modal isOpen={confirmOpen} onOpenChange={setConfirmOpen}>
    <ModalHeader closeButton>
      <ModalTitle>确认删除</ModalTitle>
    </ModalHeader>
    <ModalBody>删除后无法恢复，确定要继续吗？</ModalBody>
    <ModalFooter>
      <Button onClick={() => setConfirmOpen(false)} variant="secondary">
        取消
      </Button>
      <Button onClick={handleConfirmDelete} variant="danger">
        确认删除
      </Button>
    </ModalFooter>
  </Modal>
</>
```
