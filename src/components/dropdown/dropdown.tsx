import clsx from 'clsx';
import { forwardRef, type SyntheticEvent, useCallback, useEffect, useMemo, useState } from 'react';

import type {
  DropdownContextValue,
  DropdownProps,
  DropdownToggleSource,
  EventKey,
  ToggleCallback,
} from './types';

import { DropdownContext } from './dropdown-context';
import { DROP_CLASSES } from './dropdown-utils';

export const Dropdown = forwardRef<HTMLElement, DropdownProps>(
  (
    {
      align,
      as: Component = 'div',
      autoClose = true,
      children,
      className,
      defaultShow = false,
      drop = 'down',
      flip = true,
      focusFirstItemOnShow = false,
      onSelect,
      onToggle,
      popperConfig,
      renderMenuOnMount = false,
      show: showProp,
      ...rest
    },
    ref,
  ) => {
    const [showState, setShowState] = useState(defaultShow);
    const [menuElement, setMenuElement] = useState<HTMLElement | null>(null);
    const [toggleElement, setToggleElement] = useState<HTMLElement | null>(null);
    const [toggleId, setToggleId] = useState<string | undefined>();
    const [source, setSource] = useState<DropdownToggleSource>();

    const show = showProp ?? showState;

    const handleToggle = useCallback<ToggleCallback>(
      (nextShow, event, nextSource) => {
        onToggle?.(nextShow, event, nextSource);
        setSource(nextSource);
        if (showProp === undefined) {
          setShowState(nextShow);
        }
      },
      [onToggle, showProp],
    );

    const handleSelect = useCallback(
      (eventKey: EventKey | null, event: SyntheticEvent) => {
        onSelect?.(eventKey, event);
        if (event.defaultPrevented) {
          return;
        }
        if (autoClose === true || autoClose === 'inside') {
          handleToggle(false, event, 'select');
        }
      },
      [autoClose, handleToggle, onSelect],
    );

    const setMenu = useCallback((element: HTMLElement | null) => {
      setMenuElement(element);
    }, []);

    const setToggle = useCallback((element: HTMLElement | null, id?: string) => {
      setToggleElement(element);
      setToggleId(id);
    }, []);

    useEffect(() => {
      if (!show || autoClose === false || autoClose === 'inside') {
        return;
      }
      const handleOutside = (event: Event) => {
        const target = event.target as Node;
        if (menuElement?.contains(target) || toggleElement?.contains(target)) {
          return;
        }
        handleToggle(false, event, 'rootClose');
      };
      document.addEventListener('mousedown', handleOutside);
      document.addEventListener('touchstart', handleOutside);
      return () => {
        document.removeEventListener('mousedown', handleOutside);
        document.removeEventListener('touchstart', handleOutside);
      };
    }, [autoClose, handleToggle, menuElement, show, toggleElement]);

    useEffect(() => {
      if (!show) {
        return;
      }
      const handleKeyDown = (event: KeyboardEvent) => {
        if (event.key === 'Escape') {
          handleToggle(false, event, 'keydown');
        }
      };
      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }, [handleToggle, show]);

    const contextValue = useMemo<DropdownContextValue>(
      () => ({
        align,
        autoClose,
        drop,
        flip,
        focusFirstItemOnShow,
        menuElement,
        onSelect: handleSelect,
        popperConfig,
        renderMenuOnMount,
        setMenu,
        setToggle,
        show,
        source,
        toggle: handleToggle,
        toggleElement,
        toggleId,
      }),
      [
        align,
        autoClose,
        drop,
        flip,
        focusFirstItemOnShow,
        handleSelect,
        handleToggle,
        menuElement,
        popperConfig,
        renderMenuOnMount,
        setMenu,
        setToggle,
        show,
        source,
        toggleElement,
        toggleId,
      ],
    );

    return (
      <DropdownContext.Provider value={contextValue}>
        <Component
          className={clsx(DROP_CLASSES[drop], show && 'show', className)}
          ref={ref}
          {...rest}
        >
          {children}
        </Component>
      </DropdownContext.Provider>
    );
  },
);

Dropdown.displayName = 'Dropdown';

export default Dropdown;
