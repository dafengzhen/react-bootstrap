```tsx
<>
  <Button onClick={() => setCustomSizeOpen(true)} variant="primary">
    打开自定义尺寸模态框
  </Button>

  <Modal
    height={320}
    isOpen={customSizeOpen}
    maxWidth="90vw"
    onOpenChange={setCustomSizeOpen}
    placement="center"
    width={560}
  >
    <ModalHeader closeButton>
      <ModalTitle>自定义尺寸</ModalTitle>
    </ModalHeader>
    <ModalBody>
      通过 width、height 与 maxWidth
      控制模态框尺寸，数字会自动转换为像素。内容超出高度时正文区域会出现滚动条。
    </ModalBody>
    <ModalFooter>
      <Button onClick={() => setCustomSizeOpen(false)} variant="primary">
        知道了
      </Button>
    </ModalFooter>
  </Modal>
</>
```
