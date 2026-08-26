```typescript
export interface AvatarGroupProps extends HTMLAttributes<HTMLElement> {
  as?: ElementType;
  bg?: AvatarBg;
  border?: boolean;
  children?: ReactNode;
  className?: string;
  max?: number;
  overlap?: number | string;
  shape?: AvatarShape;
  size?: AvatarSize | number;
}
```
