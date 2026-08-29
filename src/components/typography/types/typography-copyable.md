```typescript
export type TypographyCopyable = boolean | TypographyCopyableConfig;

export interface TypographyCopyableConfig {
  onCopy?: (text: string) => void;
  text?: string;
  tooltips?: [string, string];
}
```
