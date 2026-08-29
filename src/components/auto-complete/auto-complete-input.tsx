import type { FocusEvent, KeyboardEvent, MouseEvent, ReactNode } from 'react';

import clsx from 'clsx';
import { useRef } from 'react';

import type { AutoCompleteInputProps, AutoCompleteSize } from './types';

import { AutoCompleteHint } from './auto-complete-hint';
import { isSelectableInput } from './auto-complete-utils';
import styles from './auto-complete.module.css';

export interface AutoCompleteInputElementProps extends Omit<AutoCompleteInputProps, 'size'> {
  focused: boolean;
  inputRef: (element: HTMLInputElement | null) => void;
  isInvalid: boolean;
  isValid: boolean;
  referenceElementRef: (element: HTMLElement | null) => void;
  size?: AutoCompleteSize;
}

const getFormControlClasses = (
  className: string | undefined,
  focused: boolean,
  isInvalid: boolean,
  isValid: boolean,
  size: AutoCompleteSize | undefined,
) =>
  clsx(
    'form-control',
    'rbt-input',
    styles.rbtInput,
    size === 'lg' && 'form-control-lg',
    size === 'sm' && 'form-control-sm',
    isValid && 'is-valid',
    isInvalid && 'is-invalid',
    focused && 'focus',
    className,
  );

export const AutoCompleteInputSingle = ({
  className,
  focused,
  inputRef,
  isInvalid,
  isValid,
  referenceElementRef,
  size,
  ...rest
}: AutoCompleteInputElementProps) => {
  const setRef = (element: HTMLInputElement | null) => {
    inputRef(element);
    referenceElementRef(element);
  };

  return (
    <AutoCompleteHint>
      <input
        className={clsx(
          styles.rbtInputMain,
          getFormControlClasses(className, focused, isInvalid, isValid, size),
        )}
        ref={setRef}
        {...rest}
      />
    </AutoCompleteHint>
  );
};

export interface AutoCompleteInputMultiProps extends AutoCompleteInputElementProps {
  children?: ReactNode;
  selected: unknown[];
}

export const AutoCompleteInputMulti = ({
  children,
  className,
  disabled,
  focused,
  inputRef,
  isInvalid,
  isValid,
  onKeyDown,
  placeholder,
  referenceElementRef,
  selected,
  size,
  value,
  ...rest
}: AutoCompleteInputMultiProps) => {
  const inputElementRef = useRef<HTMLInputElement | null>(null);
  const wrapperRef = useRef<HTMLDivElement | null>(null);

  const setContainerRef = (element: HTMLDivElement | null) => {
    referenceElementRef(element);
  };

  const setInputRef = (element: HTMLInputElement | null) => {
    inputElementRef.current = element;
    inputRef(element);
  };

  const handleContainerClickOrFocus = (
    event: FocusEvent<HTMLDivElement> | MouseEvent<HTMLDivElement>,
  ) => {
    if (disabled) {
      event.currentTarget.blur();
      return;
    }
    const input = inputElementRef.current;
    if (
      !input ||
      (event.currentTarget.contains(event.target as Node) && event.currentTarget !== event.target)
    ) {
      return;
    }
    if (isSelectableInput(input)) {
      input.selectionStart = input.value.length;
    }
    input.focus();
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Backspace' && selected.length > 0 && !value) {
      event.preventDefault();
      const tokens = wrapperRef.current?.querySelectorAll<HTMLElement>(
        '[data-auto-complete-token]',
      );
      const lastToken = tokens?.[tokens.length - 1];
      lastToken?.focus();
    }
    onKeyDown?.(event);
  };

  return (
    // eslint-disable-next-line jsx-a11y/no-static-element-interactions, jsx-a11y/click-events-have-key-events -- container forwards clicks/focus to the inner input
    <div
      className={clsx(
        styles.rbtInputMulti,
        getFormControlClasses(undefined, focused, isInvalid, isValid, size),
        disabled && styles.disabled,
      )}
      onClick={handleContainerClickOrFocus}
      onFocus={handleContainerClickOrFocus}
      ref={setContainerRef}
      tabIndex={-1}
    >
      <div className={styles.rbtInputWrapper} ref={wrapperRef}>
        {children}
        <AutoCompleteHint className={styles.rbtInputHintContainer}>
          <input
            className={clsx('rbt-input', styles.rbtInput, styles.rbtInputMain, className)}
            disabled={disabled}
            onKeyDown={handleKeyDown}
            placeholder={selected.length > 0 ? '' : placeholder}
            ref={setInputRef}
            value={value}
            {...rest}
          />
        </AutoCompleteHint>
      </div>
    </div>
  );
};
