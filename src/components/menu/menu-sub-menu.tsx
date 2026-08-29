import clsx from 'clsx';
import {
  forwardRef,
  type MouseEvent,
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import type { MenuContextValue, MenuSubMenuProps } from './types';

import { positionElement, resetPosition } from '../../utils';
import { MenuContext, useMenu } from './menu-context';
import { isSameKey, renderMenuChildren } from './menu-utils';
import styles from './menu.module.css';

const ENTER_DELAY = 100;

const LEAVE_DELAY = 150;

const ArrowIcon = () => (
  <svg
    aria-hidden="true"
    fill="none"
    height="12"
    viewBox="0 0 12 12"
    width="12"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M4.5 2.5 8 6l-3.5 3.5"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.5"
    />
  </svg>
);

export const MenuSubMenu = forwardRef<HTMLElement, MenuSubMenuProps>(
  (
    { as: Component = 'li', children, className, disabled = false, eventKey, icon, title, ...rest },
    ref,
  ) => {
    const menu = useMenu();
    const key = eventKey ?? null;
    const popupMode =
      menu !== null && !menu.popup && (menu.inlineCollapsed || menu.mode !== 'inline');
    const inlineOpen =
      menu !== null && key !== null && menu.openKeys.some((openKey) => isSameKey(openKey, key));

    const [popupOpen, setPopupOpen] = useState(false);
    const [listElement, setListElement] = useState<HTMLElement | null>(null);
    const [titleElement, setTitleElement] = useState<HTMLElement | null>(null);
    const enterTimerRef = useRef<number | undefined>(undefined);
    const leaveTimerRef = useRef<number | undefined>(undefined);
    const pinnedRef = useRef(false);

    const open = popupMode ? popupOpen : inlineOpen;
    const collapsed = menu?.inlineCollapsed === true && menu.popup === false;
    const hoverTrigger = menu?.trigger === 'hover' || menu?.inlineCollapsed === true;

    const clearTimers = useCallback(() => {
      if (enterTimerRef.current !== undefined) {
        clearTimeout(enterTimerRef.current);
        enterTimerRef.current = undefined;
      }
      if (leaveTimerRef.current !== undefined) {
        clearTimeout(leaveTimerRef.current);
        leaveTimerRef.current = undefined;
      }
    }, []);

    useEffect(() => clearTimers, [clearTimers]);

    const handleTitleClick = (event: MouseEvent<HTMLElement>) => {
      if (disabled) {
        event.preventDefault();
        return;
      }
      if (popupMode) {
        clearTimers();
        setPopupOpen((prev) => {
          pinnedRef.current = !prev;
          return !prev;
        });
      } else if (menu !== null && key !== null) {
        const next = inlineOpen
          ? menu.openKeys.filter((openKey) => !isSameKey(openKey, key))
          : [...menu.openKeys, key];
        menu.onOpenChange(next);
      }
    };

    const handleTitleEnter = () => {
      if (disabled || !popupMode || !hoverTrigger || pinnedRef.current) {
        return;
      }
      clearTimers();
      enterTimerRef.current = window.setTimeout(() => {
        setPopupOpen(true);
      }, ENTER_DELAY);
    };

    const handleTitleLeave = () => {
      if (!popupMode || !hoverTrigger || pinnedRef.current) {
        return;
      }
      clearTimers();
      leaveTimerRef.current = window.setTimeout(() => {
        setPopupOpen(false);
      }, LEAVE_DELAY);
    };

    const handleListEnter = () => {
      clearTimers();
    };

    const handleListLeave = () => {
      if (!hoverTrigger || pinnedRef.current) {
        return;
      }
      clearTimers();
      leaveTimerRef.current = window.setTimeout(() => {
        setPopupOpen(false);
      }, LEAVE_DELAY);
    };

    const handleListClick = (event: MouseEvent<HTMLElement>) => {
      if (!popupMode) {
        return;
      }
      const target = event.target as HTMLElement;
      if (target.closest('[data-menu-entry="item"]') !== null) {
        pinnedRef.current = false;
        setPopupOpen(false);
      }
    };

    useLayoutEffect(() => {
      if (!popupMode || !popupOpen) {
        return;
      }
      const list = listElement;
      const titleElementRef = titleElement;
      if (list === null || titleElementRef === null) {
        return;
      }

      const placement = menu?.mode === 'horizontal' ? 'bottom-start' : 'right-start';
      const offset: readonly [number, number] = menu?.mode === 'horizontal' ? [0, 4] : [8, 0];

      const applyPosition = () => {
        positionElement(list, titleElementRef, {
          flip: true,
          offset,
          padding: 4,
          placement,
        });
      };

      applyPosition();

      window.addEventListener('resize', applyPosition);
      window.addEventListener('scroll', applyPosition, true);
      const resizeObserver = new ResizeObserver(applyPosition);
      resizeObserver.observe(list);
      resizeObserver.observe(titleElementRef);

      return () => {
        window.removeEventListener('resize', applyPosition);
        window.removeEventListener('scroll', applyPosition, true);
        resizeObserver.disconnect();
        resetPosition(list);
      };
    }, [listElement, menu?.mode, popupMode, popupOpen, titleElement]);

    useEffect(() => {
      if (!popupMode || !popupOpen) {
        return;
      }
      const handleOutside = (event: Event) => {
        const target = event.target as Node;
        if (listElement?.contains(target) || titleElement?.contains(target)) {
          return;
        }
        pinnedRef.current = false;
        setPopupOpen(false);
      };
      document.addEventListener('mousedown', handleOutside);
      document.addEventListener('touchstart', handleOutside);
      return () => {
        document.removeEventListener('mousedown', handleOutside);
        document.removeEventListener('touchstart', handleOutside);
      };
    }, [listElement, popupMode, popupOpen, titleElement]);

    const childContext = useMemo<MenuContextValue | null>(() => {
      if (menu === null) {
        return null;
      }
      return {
        ...menu,
        level: menu.level + 1,
        popup: popupMode ? true : menu.popup,
      };
    }, [menu, popupMode]);

    const childrenContext =
      childContext === null ? null : (
        <MenuContext.Provider value={childContext}>
          {renderMenuChildren(children, (menu?.level ?? 0) + 1)}
        </MenuContext.Provider>
      );

    return (
      <Component
        className={clsx(styles.submenu, open && styles.submenuOpen, className)}
        data-menu-submenu={popupMode ? 'popup' : 'inline'}
        data-popup-open={popupMode && popupOpen ? 'true' : undefined}
        ref={ref}
        role="none"
        {...rest}
      >
        {/* oxlint-disable-next-line jsx-a11y/click-events-have-key-events -- keyboard events are delegated to the root menu handler */}
        <div
          aria-disabled={disabled ? true : undefined}
          aria-expanded={open}
          aria-haspopup="menu"
          className={clsx(
            styles.submenuTitle,
            open && styles.submenuTitleOpen,
            disabled && styles.submenuTitleDisabled,
            collapsed && styles.submenuTitleCollapsed,
          )}
          data-menu-entry="submenu"
          onClick={handleTitleClick}
          onMouseEnter={handleTitleEnter}
          onMouseLeave={handleTitleLeave}
          ref={setTitleElement}
          role="menuitem"
          tabIndex={-1}
          title={collapsed && typeof title === 'string' ? title : undefined}
        >
          {icon !== undefined && icon !== null && <span className={styles.itemIcon}>{icon}</span>}
          <span className={styles.itemLabel}>{title}</span>
          <span
            aria-hidden="true"
            className={clsx(styles.submenuArrow, open && styles.submenuArrowOpen)}
          >
            <ArrowIcon />
          </span>
        </div>
        {popupMode ? (
          popupOpen && (
            /* oxlint-disable-next-line jsx-a11y/click-events-have-key-events -- keyboard events are delegated to the root menu handler */
            <ul
              className={clsx(styles.popup, menu?.theme === 'dark' && styles.menuDark)}
              data-popup="true"
              onClick={handleListClick}
              onMouseEnter={handleListEnter}
              onMouseLeave={handleListLeave}
              ref={setListElement}
              role="menu"
            >
              {childrenContext}
            </ul>
          )
        ) : (
          <ul
            className={styles.submenuList}
            hidden={!inlineOpen}
            role="menu"
            style={{ paddingInlineStart: menu?.inlineIndent }}
          >
            {childrenContext}
          </ul>
        )}
      </Component>
    );
  },
);

MenuSubMenu.displayName = 'MenuSubMenu';

export default MenuSubMenu;
