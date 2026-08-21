```tsx
<>
  <div className="d-flex flex-wrap gap-2">
    <Button onClick={() => handleOpenPlacement('start')} variant="outline-primary">
      左侧
    </Button>
    <Button onClick={() => handleOpenPlacement('end')} variant="outline-primary">
      右侧
    </Button>
    <Button onClick={() => handleOpenPlacement('top')} variant="outline-primary">
      顶部
    </Button>
    <Button onClick={() => handleOpenPlacement('bottom')} variant="outline-primary">
      底部
    </Button>
  </div>

  <Offcanvas isOpen={placementOpen} onOpenChange={setPlacementOpen} placement={placement}>
    <OffcanvasHeader closeButton>
      <OffcanvasTitle>位置演示</OffcanvasTitle>
    </OffcanvasHeader>
    <OffcanvasBody>当前抽屉位置：{placement}</OffcanvasBody>
  </Offcanvas>
</>
```
