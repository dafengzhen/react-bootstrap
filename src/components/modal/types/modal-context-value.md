```typescript
export interface ModalContextValue {
  backdrop: ModalBackdrop;
  close: () => void;
  contentRef: RefObject<HTMLDivElement | null>;
  descriptionId: string;
  direction?: ModalDirection;
  handleContentTransitionEnd: (event: TransitionEvent<HTMLDivElement>) => void;
  placement?: ModalPlacement;
  sizingStyle: CSSProperties;
  status: ModalAnimationStatus;
  titleId: string;
}
```
