```tsx
<div className="d-flex flex-wrap gap-3 align-items-end">
  <Image
    alt="默认图片"
    src="https://picsum.photos/seed/rbs-viewer-plain/480/320"
    style={{ width: 200 }}
  />
  <Image
    alt="流式圆角图片"
    fluid
    rounded
    src="https://picsum.photos/seed/rbs-viewer-rounded/480/320"
    style={{ width: 200 }}
  />
  <Image
    alt="圆形图片"
    roundedCircle
    src="https://picsum.photos/seed/rbs-viewer-circle/200/200"
    style={{ width: 96 }}
  />
  <Image
    alt="缩略图样式"
    thumbnail
    src="https://picsum.photos/seed/rbs-viewer-thumbnail/480/320"
    style={{ width: 200 }}
  />
  <Image
    alt="禁用预览的图片"
    fluid
    preview={false}
    src="https://picsum.photos/seed/rbs-viewer-no-preview/480/320"
    style={{ width: 200 }}
  />
</div>
```
