```tsx
<>
  <Button onClick={() => setScrollOpen(true)} variant="primary">
    打开允许背景滚动的抽屉
  </Button>

  <Offcanvas isOpen={scrollOpen} onOpenChange={setScrollOpen} scroll>
    <OffcanvasHeader closeButton>
      <OffcanvasTitle>背景滚动</OffcanvasTitle>
    </OffcanvasHeader>
    <OffcanvasBody>
      scroll 为 true 时抽屉打开期间背景仍可滚动；默认为 false，打开时锁定背景滚动。
      {Array.from({ length: 8 }, (_, index) => (
        <p key={index}>
          第 {index + 1}{' '}
          段内容。这是用于演示抽屉内部滚动行为的占位文本，内容足够长时正文区域会出现滚动条。
        </p>
      ))}
    </OffcanvasBody>
  </Offcanvas>
</>
```
