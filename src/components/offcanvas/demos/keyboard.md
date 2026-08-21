```tsx
<>
  <Button onClick={() => setKeyboardOpen(true)} variant="outline-secondary">
    禁用 Esc 关闭
  </Button>

  <Offcanvas isOpen={keyboardOpen} keyboard={false} onOpenChange={setKeyboardOpen}>
    <OffcanvasHeader closeButton>
      <OffcanvasTitle>禁用 Esc</OffcanvasTitle>
    </OffcanvasHeader>
    <OffcanvasBody>
      keyboard 为 false 时按 Esc 键不会关闭抽屉，但仍可通过遮罩点击或关闭按钮退出。
    </OffcanvasBody>
  </Offcanvas>
</>
```
