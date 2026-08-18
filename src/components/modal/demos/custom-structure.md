```tsx
<>
  <Button onClick={() => setCustomOpen(true)} variant="primary">
    打开自定义结构模态框
  </Button>

  <Modal isOpen={customOpen} onOpenChange={setCustomOpen}>
    <ModalDialog scrollable size="lg">
      <ModalContent>
        <ModalHeader closeButton>
          <ModalTitle>自定义结构</ModalTitle>
        </ModalHeader>
        <ModalBody>
          通过 ModalDialog 与 ModalContent 自行组合模态框结构，动画状态会自动传递给 ModalContent。
        </ModalBody>
        <ModalFooter>
          <Button onClick={() => setCustomOpen(false)} variant="primary">
            知道了
          </Button>
        </ModalFooter>
      </ModalContent>
    </ModalDialog>
  </Modal>
</>
```
