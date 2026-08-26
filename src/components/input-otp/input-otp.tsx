import type { ChangeEvent, ClipboardEvent, KeyboardEvent } from 'react';

import clsx from 'clsx';
import { forwardRef, Fragment, useCallback, useEffect, useMemo, useRef, useState } from 'react';

import type { InputOtpContextValue, InputOtpProps } from './types';

import { InputOtpContext } from './input-otp-context';
import { InputOtpSlot } from './input-otp-slot';
import styles from './input-otp.module.css';

const clampIndex = (index: number, length: number): number =>
  Math.max(0, Math.min(index, length - 1));

export const InputOtp = forwardRef<HTMLElement, InputOtpProps>(
  (
    {
      as: Component = 'div',
      autoComplete = 'one-time-code',
      autoFocus = false,
      children,
      className,
      defaultValue = '',
      disabled = false,
      inputMode = 'text',
      isInvalid = false,
      isValid = false,
      length = 6,
      name,
      onChange,
      onComplete,
      password = false,
      pattern,
      placeholder = '',
      readOnly = false,
      required = false,
      separator,
      size,
      value,
      ...rest
    },
    ref,
  ) => {
    const hiddenInputRef = useRef<HTMLInputElement | null>(null);
    const [internalValue, setInternalValue] = useState<string>(defaultValue);
    const slotRefs = useRef<(HTMLInputElement | null)[]>([]);

    const currentValue = value ?? internalValue;

    const patternRegExp = useMemo(
      () => (pattern === undefined ? null : new RegExp(`^(?:${pattern})$`, 'u')),
      [pattern],
    );

    const isCharAllowed = useCallback(
      (char: string) => patternRegExp === null || patternRegExp.test(char),
      [patternRegExp],
    );

    const commit = useCallback(
      (nextValue: string) => {
        onChange?.(nextValue);
        if (value === undefined) {
          setInternalValue(nextValue);
        }
        if (
          onComplete !== undefined &&
          currentValue.length < length &&
          nextValue.length === length
        ) {
          onComplete(nextValue);
        }
      },
      [currentValue, length, onChange, onComplete, value],
    );

    const setCharAt = useCallback(
      (index: number, char: string) => {
        const chars = Array.from({ length }, (_, position) => currentValue[position] ?? '');
        chars[clampIndex(index, length)] = char;
        commit(chars.join(''));
      },
      [commit, currentValue, length],
    );

    const setCharsAt = useCallback(
      (startIndex: number, chars: string[]) => {
        const next = Array.from({ length }, (_, position) => currentValue[position] ?? '');
        for (const [offset, char] of chars.entries()) {
          const position = startIndex + offset;
          if (position >= length) {
            break;
          }
          next[position] = char;
        }
        commit(next.join(''));
      },
      [commit, currentValue, length],
    );

    const focusSlot = useCallback(
      (index: number) => {
        slotRefs.current[clampIndex(index, length)]?.focus();
      },
      [length],
    );

    const registerSlot = useCallback((index: number) => {
      return (element: HTMLInputElement | null) => {
        slotRefs.current[index] = element;
      };
    }, []);

    const handleChange = useCallback(
      (index: number, event: ChangeEvent<HTMLInputElement>) => {
        const char = event.target.value.at(-1) ?? '';
        if (char !== '' && !isCharAllowed(char)) {
          event.target.value = currentValue[index] ?? '';
          return;
        }
        setCharAt(index, char);
        if (char !== '') {
          focusSlot(index + 1);
        }
      },
      [currentValue, focusSlot, isCharAllowed, setCharAt],
    );

    const handleKeyDown = useCallback(
      (index: number, event: KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'ArrowLeft') {
          event.preventDefault();
          focusSlot(index - 1);
        } else if (event.key === 'ArrowRight') {
          event.preventDefault();
          focusSlot(index + 1);
        } else if (event.key === 'Home') {
          event.preventDefault();
          focusSlot(0);
        } else if (event.key === 'End') {
          event.preventDefault();
          focusSlot(length - 1);
        } else if (event.key === 'Backspace' && (currentValue[index] ?? '') === '') {
          event.preventDefault();
          setCharAt(index - 1, '');
          focusSlot(index - 1);
        }
      },
      [currentValue, focusSlot, length, setCharAt],
    );

    const handlePaste = useCallback(
      (index: number, event: ClipboardEvent<HTMLInputElement>) => {
        const text = event.clipboardData.getData('text');
        if (text === '') {
          return;
        }
        event.preventDefault();
        const chars = text
          .split('')
          .filter(isCharAllowed)
          .slice(0, length - index);
        if (chars.length === 0) {
          return;
        }
        setCharsAt(index, chars);
        focusSlot(index + chars.length);
      },
      [focusSlot, isCharAllowed, length, setCharsAt],
    );

    useEffect(() => {
      if (hiddenInputRef.current !== null) {
        hiddenInputRef.current.value = currentValue;
      }
    }, [currentValue]);

    useEffect(() => {
      if (autoFocus) {
        focusSlot(0);
      }
    }, [autoFocus, focusSlot]);

    const contextValue = useMemo<InputOtpContextValue>(
      () => ({
        autoComplete,
        disabled,
        focusSlot,
        handleChange,
        handleKeyDown,
        handlePaste,
        inputMode,
        isInvalid,
        isValid,
        length,
        password,
        placeholder,
        readOnly,
        registerSlot,
        size,
        slots: Array.from({ length }, (_, index) => currentValue[index] ?? ''),
      }),
      [
        autoComplete,
        currentValue,
        disabled,
        focusSlot,
        handleChange,
        handleKeyDown,
        handlePaste,
        inputMode,
        isInvalid,
        isValid,
        length,
        password,
        placeholder,
        readOnly,
        registerSlot,
        size,
      ],
    );

    return (
      <InputOtpContext.Provider value={contextValue}>
        <Component className={clsx(styles.otp, className)} ref={ref} {...rest}>
          {name !== undefined && (
            <input
              aria-hidden="true"
              disabled={disabled}
              name={name}
              ref={hiddenInputRef}
              required={required}
              tabIndex={-1}
              type="hidden"
            />
          )}
          {children ??
            Array.from({ length }, (_, index) => (
              <Fragment key={index}>
                {index > 0 && separator}
                <InputOtpSlot index={index} />
              </Fragment>
            ))}
        </Component>
      </InputOtpContext.Provider>
    );
  },
);

InputOtp.displayName = 'InputOtp';

export default InputOtp;
