```typescript
export interface ModalContextValue {
  backdrop: ModalBackdrop;
  close: () => void;
  contentRef: RefObject<HTMLDivElement | null>;
  handleContentTransitionEnd: (event: TransitionEvent<HTMLDivElement>) => void;
  status: ModalAnimationStatus;
  titleId: string;
}
```
