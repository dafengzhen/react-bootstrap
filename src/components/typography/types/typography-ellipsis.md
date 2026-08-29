```typescript
export type TypographyEllipsis = boolean | TypographyEllipsisConfig;

export interface TypographyEllipsisConfig {
  expandable?: boolean;
  onExpand?: (expanded: boolean) => void;
  rows?: number;
  symbol?: ReactNode | ((expanded: boolean) => ReactNode);
  tooltip?: boolean | string;
}
```
