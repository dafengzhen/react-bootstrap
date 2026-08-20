import clsx from 'clsx';
import {
  forwardRef,
  type KeyboardEvent,
  useCallback,
  useEffect,
  useLayoutEffect,
  useState,
} from 'react';

import type { DropdownMenuProps } from './types';

import { positionElement, resetPosition } from '../../utils';
import { useDropdown } from './context';
import { getAlignClassNames, getBaseAlign, getDropdownPlacement } from './utils';

const DEFAULT_OFFSET: readonly [number, number] = [0, 2];

const DEFAULT_PADDING = 2;

const ITEM_SELECTOR = '[role="menuitem"]:not([aria-disabled="true"])';

export const DropdownMenu = forwardRef<HTMLElement, DropdownMenuProps>(
  (
    {
      align: alignProp,
      as: Component = 'div',
      children,
      className,
      flip: flipProp,
      popperConfig: popperConfigProp,
      renderOnMount = false,
      show: showProp,
      variant,
      ...rest
    },
    ref,
  ) => {
    const dropdown = useDropdown();
    const [menuElement, setMenuElement] = useState<HTMLElement | null>(null);

    const show = dropdown ? dropdown.show : (showProp ?? false);
    const align = alignProp ?? dropdown?.align;
    const popperConfig = popperConfigProp ?? dropdown?.popperConfig;
    const renderMenuOnMount = dropdown
      ? dropdown.renderMenuOnMount || renderOnMount
      : renderOnMount;

    const baseAlign = getBaseAlign(align);
    const placement = getDropdownPlacement(dropdown?.drop ?? 'down', baseAlign);

    const setRefs = useCallback(
      (element: HTMLElement | null) => {
        setMenuElement(element);
        dropdown?.setMenu(element);
        if (typeof ref === 'function') {
          ref(element);
        } else if (ref) {
          ref.current = element;
        }
      },
      [dropdown, ref],
    );

    useLayoutEffect(() => {
      if (!show) {
        return;
      }
      const toggle = dropdown?.toggleElement;
      const menu = menuElement;
      if (!toggle || !menu) {
        return;
      }

      const offset = popperConfig?.offset ?? DEFAULT_OFFSET;
      const padding = popperConfig?.padding ?? DEFAULT_PADDING;
      const shouldFlip = flipProp ?? popperConfig?.flip ?? dropdown?.flip ?? true;

      const applyPosition = () => {
        positionElement(menu, toggle, {
          flip: shouldFlip,
          offset,
          padding,
          placement,
        });
      };

      applyPosition();

      window.addEventListener('resize', applyPosition);
      window.addEventListener('scroll', applyPosition, true);
      const resizeObserver = new ResizeObserver(applyPosition);
      resizeObserver.observe(menu);
      resizeObserver.observe(toggle);

      return () => {
        window.removeEventListener('resize', applyPosition);
        window.removeEventListener('scroll', applyPosition, true);
        resizeObserver.disconnect();
        resetPosition(menu);
      };
    }, [
      dropdown?.flip,
      dropdown?.toggleElement,
      flipProp,
      menuElement,
      placement,
      popperConfig,
      show,
    ]);

    useEffect(() => {
      if (!show || !menuElement) {
        return;
      }
      const focusFirst = dropdown?.focusFirstItemOnShow ?? false;
      if (focusFirst !== true && !(focusFirst === 'keyboard' && dropdown?.source === 'keydown')) {
        return;
      }
      const first = menuElement.querySelector<HTMLElement>(ITEM_SELECTOR);
      (first ?? menuElement).focus();
    }, [dropdown?.focusFirstItemOnShow, dropdown?.source, menuElement, show]);

    const handleKeyDown = (event: KeyboardEvent<HTMLElement>) => {
      const menu = menuElement;
      if (!menu) {
        return;
      }
      const items = Array.from(menu.querySelectorAll<HTMLElement>(ITEM_SELECTOR));
      if (items.length === 0) {
        return;
      }
      const currentIndex = items.indexOf(document.activeElement as HTMLElement);
      switch (event.key) {
        case 'ArrowDown':
          event.preventDefault();
          items[currentIndex === -1 ? 0 : (currentIndex + 1) % items.length].focus();
          break;
        case 'ArrowUp':
          event.preventDefault();
          items[
            currentIndex === -1
              ? items.length - 1
              : (currentIndex - 1 + items.length) % items.length
          ].focus();
          break;
        case 'End':
          event.preventDefault();
          items[items.length - 1].focus();
          break;
        case 'Home':
          event.preventDefault();
          items[0].focus();
          break;
        case 'Tab':
          dropdown?.toggle(false, event, 'keydown');
          break;
        default:
          break;
      }
    };

    if (!show && !renderMenuOnMount) {
      return null;
    }

    return (
      <Component
        aria-labelledby={dropdown?.toggleId}
        className={clsx(
          'dropdown-menu',
          show && 'show',
          ...getAlignClassNames(align),
          variant && `dropdown-menu-${variant}`,
          className,
        )}
        data-bs-popper={dropdown ? 'static' : undefined}
        onKeyDown={handleKeyDown}
        ref={setRefs}
        role="menu"
        {...rest}
      >
        {children}
      </Component>
    );
  },
);

DropdownMenu.displayName = 'DropdownMenu';

export default DropdownMenu;
