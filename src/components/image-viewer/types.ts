import type {
  DialogHTMLAttributes,
  ElementType,
  HTMLAttributes,
  ImgHTMLAttributes,
  ReactNode,
  SyntheticEvent,
} from 'react';

export interface ImageGroupContextValue {
  openAt: (id: string) => void;
  register: (id: string, image: ImageViewerImage) => void;
  unregister: (id: string) => void;
}

export interface ImageGroupProps extends HTMLAttributes<HTMLElement> {
  as?: ElementType;
  children?: ReactNode;
  className?: string;
  viewerProps?: ImageViewerGroupViewerProps;
}

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

export type ImageViewerGroupViewerProps = Omit<
  ImageViewerProps,
  'images' | 'index' | 'onIndexChange' | 'onOpenChange' | 'open'
>;

export interface ImageViewerImage {
  alt?: string;
  caption?: ReactNode;
  name?: string;
  src: string;
}

export interface ImageViewerProps extends Omit<
  DialogHTMLAttributes<HTMLDialogElement>,
  'children'
> {
  backdrop?: 'static' | boolean;
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

export type ImageViewerRotation = 0 | 180 | 270 | 90;

export type ImageViewerSource = ImageViewerImage | string;

export type ImageViewerToolbarKey =
  | 'close'
  | 'download'
  | 'fullscreen'
  | 'reset'
  | 'rotateLeft'
  | 'rotateRight'
  | 'zoomIn'
  | 'zoomOut';
