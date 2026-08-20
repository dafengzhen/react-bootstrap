```tsx
<>
  <div className="d-flex flex-wrap gap-2">
    <Button onClick={() => handlePlacement('top-start')} variant="outline-primary">
      左上
    </Button>
    <Button onClick={() => handlePlacement('top-end')} variant="outline-primary">
      右上
    </Button>
    <Button onClick={() => handlePlacement('bottom-start')} variant="outline-primary">
      左下
    </Button>
    <Button onClick={() => handlePlacement('bottom-end')} variant="outline-primary">
      右下
    </Button>
    <Button onClick={handleShowFixed} variant="outline-primary">
      固定到视口
    </Button>
  </div>

  <div className="border position-relative rounded mt-3" style={{ height: 200 }}>
    <span className="position-absolute start-50 text-muted top-50 translate-middle">演示区域</span>
    <ToastContainer placement={placement}>
      <Toast onClose={() => setPlacementShow(false)} show={placementShow}>
        <ToastHeader>
          <strong className="me-auto">位置演示</strong>
          <small>当前：{placement}</small>
        </ToastHeader>
        <ToastBody>Toast 会出现在演示区域对应的角落。</ToastBody>
      </Toast>
    </ToastContainer>
  </div>

  <ToastContainer placement="top-end" position="fixed">
    <Toast onClose={() => setFixedShow(false)} show={fixedShow}>
      <ToastHeader>
        <strong className="me-auto">固定定位</strong>
        <small>刚刚</small>
      </ToastHeader>
      <ToastBody>position 为 fixed 时，Toast 固定在视口右上角。</ToastBody>
    </Toast>
  </ToastContainer>
</>
```
