```typescript
export type TypographyEditable = boolean | TypographyEditableConfig;

export interface TypographyEditableConfig {
  autoSize?: boolean | TypographyAutoSize;
  maxLength?: number;
  onChange?: (value: string) => void;
  onEnd?: () => void;
  onStart?: () => void;
  text?: string;
  tooltip?: string;
}
```
