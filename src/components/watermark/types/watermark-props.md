```typescript
export interface WatermarkProps extends Omit<HTMLAttributes<HTMLDivElement>, 'content'> {
  children?: ReactNode;
  className?: string;
  content?: string | string[];
  font?: WatermarkFontOptions;
  fullscreen?: boolean;
  gap?: [number, number];
  height?: number;
  image?: string;
  offset?: [number, number];
  opacity?: number;
  rotate?: number;
  width?: number;
  zIndex?: number;
}
```
