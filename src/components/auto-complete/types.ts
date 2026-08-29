import type {
  ChangeEvent,
  ElementType,
  FocusEvent,
  HTMLAttributes,
  InputHTMLAttributes,
  KeyboardEvent,
  MouseEvent,
  ReactNode,
} from 'react';

export type AutoCompleteAlign = 'justify' | 'left' | 'right';

export type AutoCompleteAllowNew<T extends AutoCompleteOption> =
  | ((results: T[], context: AutoCompleteFilterContext<T>) => boolean)
  | boolean;

export interface AutoCompleteContextValue {
  activeIndex: number;
  hintText: string;
  id: number | string;
  inputNode: HTMLInputElement | null;
  labelKey: AutoCompleteLabelKey<AutoCompleteOption>;
  onActiveIndexChange: (index: number) => void;
  onItemClick: (option: AutoCompleteOption) => void;
  text: string;
}

export interface AutoCompleteFilterContext<T extends AutoCompleteOption> {
  allowNew: AutoCompleteAllowNew<T>;
  caseSensitive: boolean;
  ignoreDiacritics: boolean;
  labelKey: AutoCompleteLabelKey<T>;
  text: string;
}

export interface AutoCompleteHighlighterProps {
  children: string;
  className?: string;
  search: string;
}

export interface AutoCompleteHintProps extends HTMLAttributes<HTMLDivElement> {
  children?: ReactNode;
  className?: string;
}

export interface AutoCompleteInputProps extends InputHTMLAttributes<HTMLInputElement> {
  inputRef?: (element: HTMLInputElement | null) => void;
  referenceElementRef?: (element: HTMLElement | null) => void;
}

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

export type AutoCompleteLabelKey<T> = ((option: T) => string) | string;

export interface AutoCompleteMenuItemRenderProps {
  isActive: boolean;
  isDisabled: boolean;
}

export interface AutoCompleteMenuProps extends HTMLAttributes<HTMLElement> {
  as?: ElementType;
  children?: ReactNode;
  className?: string;
  emptyLabel?: ReactNode;
  id?: string;
  maxHeight?: string;
}

export type AutoCompleteOption = object | string;

export interface AutoCompleteProps<T extends AutoCompleteOption> extends Omit<
  HTMLAttributes<HTMLElement>,
  'children' | 'id' | 'onBlur' | 'onChange' | 'onFocus' | 'onKeyDown'
> {
  align?: AutoCompleteAlign;
  allowNew?: AutoCompleteAllowNew<T>;
  as?: ElementType;
  autoFocus?: boolean;
  caseSensitive?: boolean;
  children?: ((props: AutoCompleteRenderProps<T>) => ReactNode) | ReactNode;
  className?: string;
  clearButton?: boolean;
  defaultInputValue?: string;
  defaultOpen?: boolean;
  defaultSelected?: T[];
  disabled?: boolean;
  dropup?: boolean;
  emptyLabel?: ReactNode;
  flip?: boolean;
  highlightOnlyResult?: boolean;
  id: number | string;
  ignoreDiacritics?: boolean;
  inputProps?: AutoCompleteInputProps;
  isInvalid?: boolean;
  isValid?: boolean;
  labelKey?: AutoCompleteLabelKey<T>;
  maxHeight?: string;
  maxResults?: number;
  minLength?: number;
  multiple?: boolean;
  newSelectionPrefix?: ReactNode;
  onBlur?: (event: FocusEvent<HTMLInputElement>) => void;
  onChange?: (selected: T[]) => void;
  onFocus?: (event: FocusEvent<HTMLInputElement>) => void;
  onInputChange?: (text: string, event: ChangeEvent<HTMLInputElement>) => void;
  onKeyDown?: (event: KeyboardEvent<HTMLInputElement>) => void;
  onMenuToggle?: (show: boolean) => void;
  open?: boolean;
  options: readonly T[];
  placeholder?: string;
  renderInput?: (
    inputProps: AutoCompleteInputProps,
    state: AutoCompleteRenderProps<T>,
  ) => ReactNode;
  renderMenu?: (
    results: T[],
    menuProps: AutoCompleteMenuProps,
    state: AutoCompleteRenderProps<T>,
  ) => ReactNode;
  renderMenuItemChildren?: (
    option: T,
    props: AutoCompleteMenuItemRenderProps,
    index: number,
  ) => ReactNode;
  renderToken?: (option: T, props: AutoCompleteTokenProps, index: number) => ReactNode;
  selected?: T[];
  selectHint?: AutoCompleteSelectHint;
  selectHintOnEnter?: boolean;
  size?: AutoCompleteSize;
}

export interface AutoCompleteRenderProps<T extends AutoCompleteOption = AutoCompleteOption> {
  activeIndex: number;
  getInputProps: (props?: AutoCompleteInputProps) => AutoCompleteInputProps;
  hideMenu: () => void;
  isMenuShown: boolean;
  labelKey: AutoCompleteLabelKey<AutoCompleteOption>;
  onClear: () => void;
  onRemove: (option: AutoCompleteOption) => void;
  results: T[];
  selected: T[];
  text: string;
  toggleMenu: () => void;
}

export type AutoCompleteSelectHint =
  | ((shouldSelect: boolean, event: KeyboardEvent<HTMLInputElement>) => boolean)
  | boolean;

export type AutoCompleteSize = 'lg' | 'sm';

export interface AutoCompleteTokenProps extends HTMLAttributes<HTMLElement> {
  children?: ReactNode;
  className?: string;
  disabled?: boolean;
  onRemove?: () => void;
  tabIndex?: number;
}
