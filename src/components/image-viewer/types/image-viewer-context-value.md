```typescript
export interface ImageViewerContextValue {
  close: () => void;
  currentImage: ImageViewerImage;
  currentIndex: number;
  download: () => void;
  imageCount: number;
  isFullscreen: boolean;
  next: () => void;
  previous: () => void;
  reset: () => void;
  rotateLeft: () => void;
  rotateRight: () => void;
  rotation: ImageViewerRotation;
  scale: number;
  setIndex: (index: number) => void;
  toggleFullscreen: () => void;
  zoomIn: () => void;
  zoomOut: () => void;
}
```
