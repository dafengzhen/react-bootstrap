import type {
  ChangeEvent,
  FocusEvent,
  ForwardedRef,
  KeyboardEvent,
  MouseEvent,
  ReactElement,
  RefAttributes,
} from 'react';

import clsx from 'clsx';
import {
  forwardRef,
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import type {
  AutoCompleteAlign,
  AutoCompleteContextValue,
  AutoCompleteFilterContext,
  AutoCompleteInputProps,
  AutoCompleteLabelKey,
  AutoCompleteMenuProps,
  AutoCompleteOption,
  AutoCompleteProps,
  AutoCompleteRenderProps,
} from './types';

import { positionElement, resetPosition } from '../../utils';
import { AutoCompleteContext } from './auto-complete-context';
import { AutoCompleteHighlighter } from './auto-complete-highlighter';
import { AutoCompleteInputMulti, AutoCompleteInputSingle } from './auto-complete-input';
import { AutoCompleteItem } from './auto-complete-item';
import { AutoCompleteMenu } from './auto-complete-menu';
import { AutoCompleteToken } from './auto-complete-token';
import {
  addCustomOption,
  DEFAULT_EMPTY_LABEL,
  DEFAULT_LABEL_KEY,
  DEFAULT_MAX_HEIGHT,
  DEFAULT_MAX_RESULTS,
  DEFAULT_NEW_SELECTION_PREFIX,
  defaultFilterBy,
  defaultSelectHint,
  getHintText,
  getIsOnlyResult,
  getMenuItemId,
  getOptionDisabled,
  getOptionLabel,
  getStringLabelKey,
  getUpdatedActiveIndex,
  isOptionEqual,
  preventInputBlur,
} from './auto-complete-utils';
import styles from './auto-complete.module.css';

let newSelectionCount = 0;

const getMenuAlignClass = (align: AutoCompleteAlign): string =>
  align === 'justify' ? styles.menuJustify : align === 'left' ? styles.menuLeft : styles.menuRight;

const isCustomOption = (option: AutoCompleteOption): boolean =>
  typeof option !== 'string' && (option as Record<string, unknown>).customOption === true;

const isSelectedArrayEqual = <T extends AutoCompleteOption>(
  first: T[] | undefined,
  second: T[] | undefined,
): boolean => {
  if (first === undefined || second === undefined) {
    return first === second;
  }
  return (
    first.length === second.length &&
    first.every((option, index) => isOptionEqual(option, second[index] as T))
  );
};

const AutoCompleteInner = <T extends AutoCompleteOption>(
  {
    align = 'justify',
    allowNew = false,
    as: Component = 'div',
    autoFocus = false,
    caseSensitive = false,
    children,
    className,
    clearButton = false,
    defaultInputValue = '',
    defaultOpen = false,
    defaultSelected = [],
    disabled = false,
    dropup = false,
    emptyLabel = DEFAULT_EMPTY_LABEL,
    flip = false,
    highlightOnlyResult = false,
    id,
    ignoreDiacritics = true,
    inputProps,
    isInvalid = false,
    isValid = false,
    labelKey = DEFAULT_LABEL_KEY,
    maxHeight = DEFAULT_MAX_HEIGHT,
    maxResults = DEFAULT_MAX_RESULTS,
    minLength = 0,
    multiple = false,
    newSelectionPrefix = DEFAULT_NEW_SELECTION_PREFIX,
    onBlur,
    onChange,
    onFocus,
    onInputChange,
    onKeyDown,
    onMenuToggle,
    open,
    options,
    placeholder,
    renderInput,
    renderMenu,
    renderMenuItemChildren,
    renderToken,
    selected: selectedProp,
    selectHint = false,
    selectHintOnEnter = false,
    size,
    style,
    ...rest
  }: AutoCompleteProps<T>,
  ref: ForwardedRef<HTMLElement>,
) => {
  const [activeIndex, setActiveIndex] = useState(-1);
  const [inputNode, setInputNode] = useState<HTMLInputElement | null>(null);
  const [isFocused, setIsFocused] = useState(false);
  const [menuPlacement, setMenuPlacement] = useState<'bottom' | 'top'>('bottom');
  const [referenceElement, setReferenceElement] = useState<HTMLElement | null>(null);
  const [selectedState, setSelectedState] = useState<T[]>(() => {
    const initial = selectedProp !== undefined ? selectedProp : defaultSelected;
    return multiple ? [...initial] : [...initial].slice(0, 1);
  });
  const [showMenu, setShowMenu] = useState(defaultOpen);
  const [text, setText] = useState(() => {
    const initialSelected = selectedProp !== undefined ? selectedProp : defaultSelected;
    return !multiple && initialSelected.length > 0
      ? getOptionLabel(initialSelected[0], labelKey)
      : defaultInputValue;
  });

  const menuWrapperRef = useRef<HTMLDivElement | null>(null);
  const prevSelectedPropRef = useRef<T[] | undefined>(selectedProp);
  const rootRef = useRef<HTMLElement | null>(null);

  const selected = (selectedProp ?? selectedState) as T[];
  const isMenuShown = open !== undefined ? open : text.length >= minLength && showMenu;

  const filterContext = useMemo<AutoCompleteFilterContext<T>>(
    () => ({ allowNew, caseSensitive, ignoreDiacritics, labelKey, text }),
    [allowNew, caseSensitive, ignoreDiacritics, labelKey, text],
  );

  const results = useMemo<T[]>(() => {
    if (!isMenuShown) {
      return [];
    }
    const filtered = options.filter((option) =>
      defaultFilterBy(option, {
        caseSensitive,
        ignoreDiacritics,
        labelKey,
        multiple,
        selected,
        text,
      }),
    );
    const truncated = filtered.slice(0, maxResults);
    if (addCustomOption(truncated, filterContext)) {
      const customOption = { customOption: true, [getStringLabelKey(labelKey)]: text } as T;
      return [...truncated, customOption];
    }
    return truncated;
  }, [
    caseSensitive,
    filterContext,
    ignoreDiacritics,
    isMenuShown,
    labelKey,
    maxResults,
    multiple,
    options,
    selected,
    text,
  ]);

  const initialItem = results[0];
  const activeItem =
    activeIndex >= 0 && activeIndex < results.length ? results[activeIndex] : undefined;
  const isOnlyResult = getIsOnlyResult({ allowNew, highlightOnlyResult, results });
  const hintText =
    selectHint !== false
      ? getHintText({
          activeIndex,
          initialItem,
          isFocused,
          isMenuShown,
          labelKey,
          multiple,
          selected,
          text,
        })
      : '';

  const hideMenu = useCallback(() => {
    setShowMenu(false);
    setActiveIndex(-1);
  }, []);

  const selectOption = useCallback(
    (option: T) => {
      let selection = option;
      if (isCustomOption(selection)) {
        selection = {
          ...(selection as Record<string, unknown>),
          id: `new-id-${newSelectionCount++}`,
        } as T;
      }
      const nextSelected = multiple ? [...selected, selection] : [selection];
      const nextText = multiple ? '' : getOptionLabel(selection, labelKey);
      setSelectedState(nextSelected);
      setText(nextText);
      hideMenu();
      onChange?.(nextSelected);
    },
    [hideMenu, labelKey, multiple, onChange, selected],
  );

  const removeOption = useCallback(
    (option: AutoCompleteOption) => {
      const nextSelected = selected.filter(
        (selectedOption) => !isOptionEqual(selectedOption, option),
      );
      setSelectedState(nextSelected);
      hideMenu();
      inputNode?.focus();
      onChange?.(nextSelected);
    },
    [hideMenu, inputNode, onChange, selected],
  );

  const clear = useCallback(() => {
    setActiveIndex(-1);
    setSelectedState([]);
    setShowMenu(defaultOpen);
    setText('');
    onChange?.([]);
  }, [defaultOpen, onChange]);

  const toggleMenu = useCallback(() => {
    setShowMenu((previous) => !previous);
  }, []);

  const handleBlur = useCallback(
    (event: FocusEvent<HTMLInputElement>) => {
      setIsFocused(false);
      onBlur?.(event);
    },
    [onBlur],
  );

  const handleClickInput = useCallback(
    (event: MouseEvent<HTMLInputElement>) => {
      setIsFocused(true);
      setShowMenu(true);
      inputProps?.onClick?.(event);
    },
    [inputProps],
  );

  const handleFocus = useCallback(
    (event: FocusEvent<HTMLInputElement>) => {
      setIsFocused(true);
      setShowMenu(true);
      onFocus?.(event);
    },
    [onFocus],
  );

  const handleInputChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const nextText = event.currentTarget.value;
      const shouldClearSelections = selected.length > 0 && !multiple;
      setActiveIndex(-1);
      setShowMenu(true);
      setText(nextText);
      if (shouldClearSelections) {
        setSelectedState([]);
      }
      onInputChange?.(nextText, event);
      if (shouldClearSelections) {
        onChange?.([]);
      }
    },
    [multiple, onChange, onInputChange, selected],
  );

  const handleKeyDown = useCallback(
    (event: KeyboardEvent<HTMLInputElement>) => {
      if (isMenuShown) {
        switch (event.key) {
          case 'ArrowDown':
          case 'ArrowUp':
            event.preventDefault();
            setActiveIndex(getUpdatedActiveIndex(activeIndex, event.key, results));
            break;
          case 'Enter':
            event.preventDefault();
            if (activeItem) {
              selectOption(activeItem);
            }
            break;
          case 'Escape':
          case 'Tab':
            hideMenu();
            break;
          default:
            break;
        }
      } else if (event.key === 'ArrowUp' || event.key === 'ArrowDown') {
        setShowMenu(true);
      }
      onKeyDown?.(event);
      if (!initialItem || activeItem) {
        return;
      }
      const addOnlyResult = event.key === 'Enter' && isOnlyResult;
      const shouldSelectHint =
        hintText !== '' &&
        ((selectHintOnEnter && event.key === 'Enter') || defaultSelectHint(event, selectHint));
      if (addOnlyResult || shouldSelectHint) {
        selectOption(initialItem);
      }
    },
    [
      activeIndex,
      activeItem,
      hideMenu,
      hintText,
      initialItem,
      isMenuShown,
      isOnlyResult,
      onKeyDown,
      results,
      selectHint,
      selectHintOnEnter,
      selectOption,
    ],
  );

  const inputValue = useMemo(() => {
    if (activeItem) {
      return getOptionLabel(activeItem, labelKey);
    }
    if (!multiple && selected.length > 0) {
      return getOptionLabel(selected[0] as T, labelKey);
    }
    return text;
  }, [activeItem, labelKey, multiple, selected, text]);

  const getInputProps = useCallback(
    (props?: AutoCompleteInputProps): AutoCompleteInputProps => ({
      autoComplete: 'off',
      placeholder,
      type: 'text',
      ...inputProps,
      ...props,
      'aria-activedescendant': activeIndex >= 0 ? getMenuItemId(id, activeIndex) : undefined,
      'aria-autocomplete': 'both',
      'aria-expanded': isMenuShown,
      'aria-haspopup': 'listbox',
      'aria-multiselectable': multiple ? true : undefined,
      'aria-owns': isMenuShown ? String(id) : undefined,
      disabled,
      onBlur: handleBlur,
      onChange: handleInputChange,
      onClick: handleClickInput,
      onFocus: handleFocus,
      onKeyDown: handleKeyDown,
      role: 'combobox',
      value: inputValue,
    }),
    [
      activeIndex,
      disabled,
      handleBlur,
      handleClickInput,
      handleFocus,
      handleInputChange,
      handleKeyDown,
      id,
      inputProps,
      inputValue,
      isMenuShown,
      multiple,
      placeholder,
    ],
  );

  const renderProps = useMemo<AutoCompleteRenderProps<T>>(
    () => ({
      activeIndex,
      getInputProps,
      hideMenu,
      isMenuShown,
      labelKey: labelKey as AutoCompleteLabelKey<AutoCompleteOption>,
      onClear: clear,
      onRemove: removeOption,
      results,
      selected,
      text,
      toggleMenu,
    }),
    [
      activeIndex,
      clear,
      getInputProps,
      hideMenu,
      isMenuShown,
      labelKey,
      removeOption,
      results,
      selected,
      text,
      toggleMenu,
    ],
  );

  useEffect(() => {
    const previous = prevSelectedPropRef.current;
    prevSelectedPropRef.current = selectedProp;
    if (selectedProp !== undefined && !isSelectedArrayEqual(previous, selectedProp) && !multiple) {
      setText(selectedProp.length > 0 ? getOptionLabel(selectedProp[0], labelKey) : '');
    }
  }, [labelKey, multiple, selectedProp]);

  useEffect(() => {
    if (autoFocus) {
      inputNode?.focus();
    }
  }, [autoFocus, inputNode]);

  const isInitialMenuToggleRef = useRef(true);
  useEffect(() => {
    if (isInitialMenuToggleRef.current) {
      isInitialMenuToggleRef.current = false;
      return;
    }
    onMenuToggle?.(isMenuShown);
  }, [isMenuShown, onMenuToggle]);

  useEffect(() => {
    if (!isMenuShown || open !== undefined) {
      return;
    }
    const root = rootRef.current;
    if (!root) {
      return;
    }
    const handleOutside = (event: Event) => {
      if (root.contains(event.target as Node)) {
        return;
      }
      hideMenu();
    };
    document.addEventListener('mousedown', handleOutside);
    document.addEventListener('touchstart', handleOutside);
    return () => {
      document.removeEventListener('mousedown', handleOutside);
      document.removeEventListener('touchstart', handleOutside);
    };
  }, [hideMenu, isMenuShown, open]);

  useLayoutEffect(() => {
    if (!isMenuShown) {
      return;
    }
    const wrapper = menuWrapperRef.current;
    const reference = referenceElement;
    if (!wrapper || !reference) {
      return;
    }
    const applyPosition = () => {
      wrapper.style.width = `${reference.getBoundingClientRect().width}px`;
      const placement = positionElement(wrapper, reference, {
        flip,
        offset: [0, 0],
        padding: 2,
        placement: dropup ? 'top-start' : 'bottom-start',
      });
      setMenuPlacement(placement.startsWith('top') ? 'top' : 'bottom');
    };
    applyPosition();
    window.addEventListener('resize', applyPosition);
    window.addEventListener('scroll', applyPosition, true);
    const resizeObserver = new ResizeObserver(applyPosition);
    resizeObserver.observe(wrapper);
    resizeObserver.observe(reference);
    return () => {
      window.removeEventListener('resize', applyPosition);
      window.removeEventListener('scroll', applyPosition, true);
      resizeObserver.disconnect();
      resetPosition(wrapper);
    };
  }, [dropup, flip, isMenuShown, referenceElement, results.length, text]);

  const contextValue = useMemo<AutoCompleteContextValue>(
    () => ({
      activeIndex,
      hintText,
      id,
      inputNode,
      labelKey: labelKey as AutoCompleteLabelKey<AutoCompleteOption>,
      onActiveIndexChange: setActiveIndex,
      onItemClick: (option) => selectOption(option as T),
      text,
    }),
    [activeIndex, hintText, id, inputNode, labelKey, selectOption, text],
  );

  const menuId = String(id);
  const menuProps: AutoCompleteMenuProps = {
    className: getMenuAlignClass(align),
    emptyLabel,
    id: menuId,
    maxHeight,
  };

  const defaultMenu = (
    <AutoCompleteMenu {...menuProps}>
      {results.map((option, index) => {
        const isCustom = isCustomOption(option);
        const isDisabled = getOptionDisabled(option);
        const itemChildren = isCustom ? (
          <>
            {newSelectionPrefix}
            <AutoCompleteHighlighter search={text}>
              {getOptionLabel(option, labelKey)}
            </AutoCompleteHighlighter>
          </>
        ) : renderMenuItemChildren ? (
          renderMenuItemChildren(option, { isActive: index === activeIndex, isDisabled }, index)
        ) : undefined;
        return (
          <AutoCompleteItem
            active={index === activeIndex}
            className={isCustom ? styles.menuCustomOption : undefined}
            disabled={isDisabled}
            key={index}
            option={option}
            position={index}
          >
            {itemChildren}
          </AutoCompleteItem>
        );
      })}
    </AutoCompleteMenu>
  );

  const menuElement = renderMenu ? renderMenu(results, menuProps, renderProps) : defaultMenu;

  const setRootRef = (element: HTMLElement | null) => {
    rootRef.current = element;
    if (typeof ref === 'function') {
      ref(element);
    } else if (ref) {
      ref.current = element;
    }
  };

  const setInputNodeRef = useCallback((element: HTMLInputElement | null) => {
    setInputNode(element);
  }, []);

  const setReferenceElementRef = useCallback((element: HTMLElement | null) => {
    setReferenceElement(element);
  }, []);

  const inputBag = useMemo<AutoCompleteInputProps>(
    () => ({
      ...getInputProps(inputProps),
      inputRef: setInputNodeRef,
      referenceElementRef: setReferenceElementRef,
    }),
    [getInputProps, inputProps, setInputNodeRef, setReferenceElementRef],
  );

  const defaultInputElement = multiple ? (
    <AutoCompleteInputMulti
      {...inputBag}
      focused={isFocused}
      inputRef={setInputNodeRef}
      isInvalid={isInvalid}
      isValid={isValid}
      referenceElementRef={setReferenceElementRef}
      selected={selected}
      size={size}
    >
      {selected.map((option, index) =>
        renderToken ? (
          renderToken(option, { disabled, onRemove: () => removeOption(option) }, index)
        ) : (
          <AutoCompleteToken disabled={disabled} key={index} onRemove={() => removeOption(option)}>
            {getOptionLabel(option, labelKey)}
          </AutoCompleteToken>
        ),
      )}
    </AutoCompleteInputMulti>
  ) : (
    <AutoCompleteInputSingle
      {...inputBag}
      focused={isFocused}
      inputRef={setInputNodeRef}
      isInvalid={isInvalid}
      isValid={isValid}
      referenceElementRef={setReferenceElementRef}
      size={size}
    />
  );

  const inputElement = renderInput ? renderInput(inputBag, renderProps) : defaultInputElement;

  const auxContent =
    clearButton && !disabled && selected.length > 0 ? (
      <div className={clsx(styles.aux, size === 'lg' && styles.auxLg)}>
        <button
          aria-label="Clear"
          className={clsx(
            'btn-close',
            styles.auxClose,
            size === 'lg' && styles.auxCloseLg,
            size === 'sm' && styles.auxCloseSm,
          )}
          onClick={clear}
          onMouseDown={preventInputBlur}
          type="button"
        >
          <span className="visually-hidden">Clear</span>
        </button>
      </div>
    ) : null;

  return (
    <AutoCompleteContext.Provider value={contextValue}>
      <Component
        className={clsx(
          styles.rbt,
          auxContent !== null && styles.hasAux,
          isInvalid && 'is-invalid',
          isValid && 'is-valid',
          className,
        )}
        ref={setRootRef}
        style={{ outline: 'none', position: 'relative', ...style }}
        tabIndex={-1}
        {...rest}
      >
        {inputElement}
        {isMenuShown && menuElement !== null && menuElement !== undefined && (
          <div className={styles.menuWrapper} data-placement={menuPlacement} ref={menuWrapperRef}>
            {menuElement}
          </div>
        )}
        {auxContent}
        {typeof children === 'function' ? children(renderProps) : children}
      </Component>
    </AutoCompleteContext.Provider>
  );
};

const AutoCompleteBase = forwardRef(AutoCompleteInner);
AutoCompleteBase.displayName = 'AutoComplete';

export const AutoComplete = AutoCompleteBase as unknown as <T extends AutoCompleteOption>(
  props: AutoCompleteProps<T> & RefAttributes<HTMLElement>,
) => ReactElement;

export default AutoComplete;
