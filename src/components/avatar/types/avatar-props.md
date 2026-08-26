```typescript
export interface AvatarProps extends HTMLAttributes<HTMLElement> {
  alt?: string;
  as?: ElementType;
  bg?: AvatarBg;
  border?: boolean;
  children?: ReactNode;
  className?: string;
  name?: string;
  shape?: AvatarShape;
  size?: AvatarSize | number;
  src?: string;
}
```
