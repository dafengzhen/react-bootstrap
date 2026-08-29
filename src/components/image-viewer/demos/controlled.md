```tsx
<>
  <div className="d-flex align-items-center gap-2">
    <Button onClick={() => setControlledOpen(true)} variant="primary">
      打开查看器
    </Button>
    <span className="text-muted small">
      当前索引：{controlledIndex + 1} / {VIEWER_IMAGES.length}
    </span>
  </div>

  <ImageViewer
    images={VIEWER_IMAGES}
    index={controlledIndex}
    onIndexChange={setControlledIndex}
    onOpenChange={setControlledOpen}
    open={controlledOpen}
  />
</>
```
