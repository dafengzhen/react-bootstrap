```typescript
export interface ImageProps extends ImgHTMLAttributes<HTMLImageElement> {
  alt?: string;
  fluid?: boolean;
  preview?: boolean;
  previewSrc?: string;
  rounded?: boolean;
  roundedCircle?: boolean;
  showPreviewMask?: boolean;
  thumbnail?: boolean;
  viewerProps?: ImageViewerGroupViewerProps;
}
```
