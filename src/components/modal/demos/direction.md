```tsx
<>
  <div className="d-flex flex-wrap gap-2">
    <Button onClick={() => handleOpenDirection('center')} variant="outline-primary">
      居中缩放
    </Button>
    <Button onClick={() => handleOpenDirection('top')} variant="outline-primary">
      顶部滑入
    </Button>
    <Button onClick={() => handleOpenDirection('bottom')} variant="outline-primary">
      底部滑入
    </Button>
    <Button onClick={() => handleOpenDirection('left')} variant="outline-primary">
      左侧滑入
    </Button>
    <Button onClick={() => handleOpenDirection('right')} variant="outline-primary">
      右侧滑入
    </Button>
  </div>

  <Modal direction={direction} isOpen={directionOpen} onOpenChange={setDirectionOpen}>
    <ModalHeader closeButton>
      <ModalTitle>入场方向</ModalTitle>
    </ModalHeader>
    <ModalBody>当前入场方向：{direction}，内容始终在视口中部展示，仅动画滑入方向不同。</ModalBody>
  </Modal>
</>
```
