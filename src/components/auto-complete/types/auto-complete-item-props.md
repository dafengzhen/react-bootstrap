```typescript
export interface AutoCompleteItemProps extends Omit<
  HTMLAttributes<HTMLElement>,
  'children' | 'onSelect'
> {
  active?: boolean;
  as?: ElementType;
  children?: ReactNode;
  className?: string;
  disabled?: boolean;
  href?: string;
  labelKey?: AutoCompleteLabelKey<AutoCompleteOption>;
  onSelect?: (option: AutoCompleteOption, event: MouseEvent<HTMLElement>) => void;
  option: AutoCompleteOption;
  position: number;
}
```
