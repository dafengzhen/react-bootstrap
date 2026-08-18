```tsx
<>
  <div className="d-flex flex-wrap gap-2">
    <Button onClick={() => openSize('sm')} variant="outline-primary">
      小尺寸
    </Button>
    <Button onClick={() => openSize('lg')} variant="outline-primary">
      大尺寸
    </Button>
    <Button onClick={() => openSize('xl')} variant="outline-primary">
      超大尺寸
    </Button>
  </div>

  <Modal isOpen={sizeOpen} onOpenChange={setSizeOpen} size={size}>
    <ModalHeader closeButton>
      <ModalTitle>尺寸 {size}</ModalTitle>
    </ModalHeader>
    <ModalBody>通过 size 属性在 sm、lg 与 xl 三档尺寸间切换。</ModalBody>
    <ModalFooter>
      <Button onClick={() => setSizeOpen(false)} variant="primary">
        知道了
      </Button>
    </ModalFooter>
  </Modal>
</>
```
