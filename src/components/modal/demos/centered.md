```tsx
<>
  <Button onClick={() => setCenteredOpen(true)} variant="primary">
    打开垂直居中模态框
  </Button>

  <Modal centered isOpen={centeredOpen} onOpenChange={setCenteredOpen}>
    <ModalHeader closeButton>
      <ModalTitle>垂直居中</ModalTitle>
    </ModalHeader>
    <ModalBody>centered 为 true 时，模态框在视口中垂直居中显示。</ModalBody>
    <ModalFooter>
      <Button onClick={() => setCenteredOpen(false)} variant="primary">
        知道了
      </Button>
    </ModalFooter>
  </Modal>
</>
```
