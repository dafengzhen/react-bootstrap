```tsx
<>
  <Button onClick={() => setDescriptionOpen(true)} variant="primary">
    打开带描述的模态框
  </Button>

  <Modal isOpen={descriptionOpen} onOpenChange={setDescriptionOpen}>
    <ModalHeader>
      <div>
        <ModalTitle>模态框标题</ModalTitle>
        <ModalDescription>支持标题、描述、正文与页脚的自由组合</ModalDescription>
      </div>
      <ModalClose />
    </ModalHeader>
    <ModalBody>通过 ModalDescription 为模态框补充说明文字，自动与根元素建立无障碍关联。</ModalBody>
    <ModalFooter>
      <Button onClick={() => setDescriptionOpen(false)} variant="secondary">
        取消
      </Button>
      <Button onClick={() => setDescriptionOpen(false)} variant="primary">
        确定
      </Button>
    </ModalFooter>
  </Modal>
</>
```
