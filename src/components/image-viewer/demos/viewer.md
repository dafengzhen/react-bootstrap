```tsx
<>
  <Button onClick={() => setViewerOpen(true)} variant="primary">
    打开图片查看器
  </Button>

  <ImageViewer images={VIEWER_IMAGES} loop onOpenChange={setViewerOpen} open={viewerOpen} />
</>
```
