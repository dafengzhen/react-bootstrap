```tsx
<>
  <Button onClick={() => setOpen(true)} variant="primary">
    打开侧边抽屉
  </Button>

  <Offcanvas isOpen={open} onOpenChange={setOpen}>
    <OffcanvasHeader closeButton>
      <OffcanvasTitle>抽屉标题</OffcanvasTitle>
    </OffcanvasHeader>
    <OffcanvasBody>
      抽屉打开后会自动锁定背景滚动、将焦点移入抽屉，并可通过 Esc 键、遮罩点击或关闭按钮退出。
    </OffcanvasBody>
  </Offcanvas>
</>
```
