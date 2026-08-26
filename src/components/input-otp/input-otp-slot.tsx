import clsx from 'clsx';
import { forwardRef } from 'react';

import type { InputOtpSlotProps } from './types';

import { useInputOtp } from './input-otp-context';
import styles from './input-otp.module.css';

export const InputOtpSlot = forwardRef<HTMLInputElement, InputOtpSlotProps>(
  ({ 'aria-label': ariaLabel, className, index, ...rest }, ref) => {
    const context = useInputOtp();

    if (context === null) {
      return <input className={clsx('form-control', styles.slot, className)} ref={ref} {...rest} />;
    }

    const {
      autoComplete,
      disabled,
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
      slots,
    } = context;

    const setRefs = (element: HTMLInputElement | null) => {
      registerSlot(index)(element);
      if (typeof ref === 'function') {
        ref(element);
      } else if (ref) {
        ref.current = element;
      }
    };

    return (
      <input
        aria-label={ariaLabel ?? `Character ${index + 1} of ${length}`}
        autoComplete={index === 0 ? autoComplete : 'off'}
        className={clsx(
          'form-control',
          styles.slot,
          size === 'sm' && styles.sm,
          size === 'lg' && styles.lg,
          isValid && 'is-valid',
          isInvalid && 'is-invalid',
          className,
        )}
        disabled={disabled}
        inputMode={inputMode}
        maxLength={1}
        onChange={(event) => handleChange(index, event)}
        onFocus={(event) => event.currentTarget.select()}
        onKeyDown={(event) => handleKeyDown(index, event)}
        onPaste={(event) => handlePaste(index, event)}
        placeholder={placeholder}
        readOnly={readOnly}
        ref={setRefs}
        type={password ? 'password' : 'text'}
        value={slots[index] ?? ''}
        {...rest}
      />
    );
  },
);

InputOtpSlot.displayName = 'InputOtpSlot';

export default InputOtpSlot;
