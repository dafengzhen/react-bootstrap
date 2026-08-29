import type { CSSProperties } from 'react';

import clsx from 'clsx';
import { forwardRef, useEffect, useLayoutEffect, useRef } from 'react';

import type { AutoCompleteHintProps } from './types';

import { useAutoComplete } from './auto-complete-context';
import styles from './auto-complete.module.css';

const interpolateStyle = (
  inputStyle: CSSStyleDeclaration,
  attribute: string,
  subAttribute = '',
): string => {
  const sub = subAttribute ? subAttribute.charAt(0).toUpperCase() + subAttribute.slice(1) : '';
  return ['Top', 'Right', 'Bottom', 'Left']
    .map(
      (direction) =>
        inputStyle[`${attribute}${direction}${sub}` as keyof CSSStyleDeclaration] ?? '',
    )
    .join(' ');
};

export const AutoCompleteHint = forwardRef<HTMLDivElement, AutoCompleteHintProps>(
  ({ children, className, style, ...rest }, ref) => {
    const { hintText, inputNode } = useAutoComplete();
    const hintRef = useRef<HTMLInputElement | null>(null);
    const wrapperRef = useRef<HTMLDivElement | null>(null);

    const setWrapperRef = (element: HTMLDivElement | null) => {
      wrapperRef.current = element;
      if (typeof ref === 'function') {
        ref(element);
      } else if (ref) {
        ref.current = element;
      }
    };

    const getMainInput = (): HTMLInputElement | null =>
      inputNode ??
      wrapperRef.current?.querySelector<HTMLInputElement>('input:not([aria-hidden="true"])') ??
      null;

    useEffect(() => {
      const hint = hintRef.current;
      const input = getMainInput();
      if (!hint || !input) {
        return;
      }
      const handleScroll = () => {
        hint.scrollLeft = input.scrollLeft;
      };
      input.addEventListener('scroll', handleScroll);
      return () => input.removeEventListener('scroll', handleScroll);
      // eslint-disable-next-line react-hooks/exhaustive-deps -- resync on every render
    });

    useLayoutEffect(() => {
      const hint = hintRef.current;
      const input = getMainInput();
      if (!hint || !input) {
        return;
      }
      const inputStyle = getComputedStyle(input);
      hint.style.borderStyle = interpolateStyle(inputStyle, 'border', 'style');
      hint.style.borderWidth = interpolateStyle(inputStyle, 'border', 'width');
      hint.style.fontSize = inputStyle.fontSize;
      hint.style.fontWeight = inputStyle.fontWeight;
      hint.style.height = inputStyle.height;
      hint.style.lineHeight = inputStyle.lineHeight;
      hint.style.margin = interpolateStyle(inputStyle, 'margin');
      hint.style.padding = interpolateStyle(inputStyle, 'padding');
      // eslint-disable-next-line react-hooks/exhaustive-deps -- resync on every render
    });

    const wrapperStyle: CSSProperties = {
      display: 'flex',
      flex: 1,
      height: '100%',
      position: 'relative',
      ...style,
    };

    return (
      <div
        className={clsx(styles.rbtInputHintContainer, className)}
        ref={setWrapperRef}
        style={wrapperStyle}
        {...rest}
      >
        {children}
        <input
          aria-hidden="true"
          className={clsx('rbt-input-hint', styles.rbtInputHint)}
          readOnly
          ref={hintRef}
          tabIndex={-1}
          value={hintText}
        />
      </div>
    );
  },
);

AutoCompleteHint.displayName = 'AutoCompleteHint';

export default AutoCompleteHint;
