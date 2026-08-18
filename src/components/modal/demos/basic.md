```tsx
<>
  <Button onClick={() => setOpen(true)} variant="primary">
    打开模态框
  </Button>

  <Modal isOpen={open} onOpenChange={setOpen}>
    <ModalHeader closeButton>
      <ModalTitle>模态框标题</ModalTitle>
    </ModalHeader>
    <ModalBody>
      模态框打开后会自动锁定背景滚动、将焦点移入模态框，并可通过 Esc 键、遮罩点击或关闭按钮退出。
    </ModalBody>
    <ModalFooter>
      <Button onClick={() => setOpen(false)} variant="secondary">
        关闭
      </Button>
      <Button onClick={() => setOpen(false)} variant="primary">
        保存更改
      </Button>
    </ModalFooter>
  </Modal>
</>
```
