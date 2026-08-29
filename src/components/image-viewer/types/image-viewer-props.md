```typescript
export interface ImageViewerProps extends Omit<
  DialogHTMLAttributes<HTMLDialogElement>,
  'children'
> {
  backdrop?: boolean | 'static';
  children?: ReactNode;
  className?: string;
  defaultIndex?: number;
  defaultOpen?: boolean;
  duration?: number;
  images: ImageViewerSource[];
  index?: number;
  keyboard?: boolean;
  loop?: boolean;
  maxZoom?: number;
  minZoom?: number;
  onImageError?: (
    image: ImageViewerImage,
    index: number,
    event: SyntheticEvent<HTMLImageElement>,
  ) => void;
  onIndexChange?: (index: number) => void;
  onOpenChange?: (open: boolean) => void;
  open?: boolean;
  showCounter?: boolean;
  showNav?: boolean;
  showThumbnails?: boolean;
  toolbar?: boolean | ImageViewerToolbarKey[];
  zoomable?: boolean;
  zoomStep?: number;
}
```
