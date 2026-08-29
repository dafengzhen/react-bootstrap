import clsx from 'clsx';
import {
  forwardRef,
  type KeyboardEvent,
  type SyntheticEvent,
  useCallback,
  useMemo,
  useState,
} from 'react';

import type { EventKey, MenuContextValue, MenuProps } from './types';

import { MenuContext } from './menu-context';
import { normalizeActiveKeys, renderMenuChildren, toggleActiveKeys } from './menu-utils';
import styles from './menu.module.css';

const DEFAULT_COLLAPSED_WIDTH = 56;

const DEFAULT_INLINE_INDENT = 24;

const ENTRY_SELECTOR = '[data-menu-entry]:not([aria-disabled="true"])';

const getSiblingEntries = (entry: HTMLElement): HTMLElement[] => {
  const parent = entry.parentElement;
  if (parent === null) {
    return [];
  }
  return Array.from(parent.querySelectorAll<HTMLElement>(`:scope > li${ENTRY_SELECTOR}`));
};

const focusFirstEntryOf = (submenu: HTMLElement | null): void => {
  const list = submenu?.querySelector<HTMLElement>(':scope > [role="menu"]');
  list?.querySelector<HTMLElement>(ENTRY_SELECTOR)?.focus();
};

export const Menu = forwardRef<HTMLElement, MenuProps>(
  (
    {
      activeKey,
      as: Component = 'ul',
      children,
      className,
      collapsedWidth = DEFAULT_COLLAPSED_WIDTH,
      defaultActiveKey,
      defaultOpenKeys,
      inlineCollapsed = false,
      inlineIndent = DEFAULT_INLINE_INDENT,
      mode = 'vertical',
      multiple = false,
      onKeyDown,
      onOpenChange,
      onSelect,
      openKeys: openKeysProp,
      selectable = true,
      style,
      theme = 'light',
      trigger,
      ...rest
    },
    ref,
  ) => {
    const [internalActiveKeys, setInternalActiveKeys] = useState<EventKey[]>(() =>
      normalizeActiveKeys(defaultActiveKey),
    );
    const [internalOpenKeys, setInternalOpenKeys] = useState<EventKey[]>(defaultOpenKeys ?? []);

    const activeKeys =
      activeKey === undefined ? internalActiveKeys : normalizeActiveKeys(activeKey);
    const openKeys = openKeysProp ?? internalOpenKeys;
    const resolvedStyle = inlineCollapsed ? { ...style, width: collapsedWidth } : style;
    const resolvedTrigger = trigger ?? (mode === 'horizontal' ? 'hover' : 'click');

    const handleItemSelect = useCallback(
      (eventKey: EventKey, event: SyntheticEvent) => {
        if (!selectable) {
          return;
        }
        onSelect?.(eventKey, event);
        if (event.defaultPrevented) {
          return;
        }
        if (activeKey === undefined) {
          setInternalActiveKeys((prev) =>
            multiple ? toggleActiveKeys(prev, eventKey) : [eventKey],
          );
        }
      },
      [activeKey, multiple, onSelect, selectable],
    );

    const handleOpenChange = useCallback(
      (nextOpenKeys: EventKey[]) => {
        onOpenChange?.(nextOpenKeys);
        if (openKeysProp === undefined) {
          setInternalOpenKeys(nextOpenKeys);
        }
      },
      [onOpenChange, openKeysProp],
    );

    const contextValue = useMemo<MenuContextValue>(
      () => ({
        activeKeys,
        inlineCollapsed,
        inlineIndent,
        level: 0,
        mode,
        multiple,
        onItemSelect: handleItemSelect,
        onOpenChange: handleOpenChange,
        openKeys,
        popup: false,
        selectable,
        theme,
        trigger: resolvedTrigger,
      }),
      [
        activeKeys,
        handleItemSelect,
        handleOpenChange,
        inlineCollapsed,
        inlineIndent,
        mode,
        multiple,
        openKeys,
        resolvedTrigger,
        selectable,
        theme,
      ],
    );

    const handleKeyDown = (event: KeyboardEvent<HTMLElement>) => {
      onKeyDown?.(event);
      if (event.defaultPrevented) {
        return;
      }
      const activeElement = document.activeElement;
      const entry =
        activeElement instanceof HTMLElement
          ? activeElement.closest<HTMLElement>('[data-menu-entry]')
          : null;
      if (entry === null || !event.currentTarget.contains(entry)) {
        return;
      }

      const isTitle = entry.dataset.menuEntry === 'submenu';
      const inPopup = entry.parentElement?.closest('[data-popup="true"]') !== null;
      const horizontal = mode === 'horizontal' && !inPopup;
      const siblings = getSiblingEntries(entry);
      const index = siblings.indexOf(entry);

      const move = (delta: number) => {
        if (siblings.length > 0) {
          siblings[(index + delta + siblings.length) % siblings.length]?.focus();
        }
      };

      const openAndFocus = () => {
        entry.click();
        requestAnimationFrame(() => {
          if (entry.getAttribute('aria-expanded') === 'true') {
            focusFirstEntryOf(entry.parentElement);
          }
        });
      };

      const activate = () => {
        event.preventDefault();
        if (isTitle) {
          openAndFocus();
        } else {
          entry.click();
        }
      };

      switch (event.key) {
        case ' ':
          activate();
          break;
        case 'ArrowDown':
          if (horizontal) {
            if (isTitle) {
              event.preventDefault();
              openAndFocus();
            }
          } else {
            event.preventDefault();
            move(1);
          }
          break;
        case 'ArrowLeft':
          if (horizontal) {
            event.preventDefault();
            move(-1);
          } else if (isTitle && entry.getAttribute('aria-expanded') === 'true') {
            event.preventDefault();
            entry.click();
          } else {
            const parentSubmenu = entry.parentElement?.closest<HTMLElement>('[data-menu-submenu]');
            if (parentSubmenu !== null && parentSubmenu !== undefined) {
              event.preventDefault();
              const parentTitle = parentSubmenu.querySelector<HTMLElement>(
                ':scope > [data-menu-entry]',
              );
              if (parentTitle !== null && parentTitle.getAttribute('aria-expanded') === 'true') {
                parentTitle.click();
              }
              parentTitle?.focus();
            }
          }
          break;
        case 'ArrowRight':
          if (horizontal) {
            event.preventDefault();
            move(1);
          } else if (isTitle) {
            event.preventDefault();
            openAndFocus();
          }
          break;
        case 'ArrowUp':
          if (!horizontal) {
            event.preventDefault();
            move(-1);
          }
          break;
        case 'End':
          event.preventDefault();
          siblings[siblings.length - 1]?.focus();
          break;
        case 'Enter':
          activate();
          break;
        case 'Escape': {
          const submenu = entry.closest<HTMLElement>(
            '[data-menu-submenu="popup"][data-popup-open="true"]',
          );
          if (submenu !== null) {
            event.preventDefault();
            const title = submenu.querySelector<HTMLElement>(':scope > [data-menu-entry]');
            title?.click();
            title?.focus();
          }
          break;
        }
        case 'Home':
          event.preventDefault();
          siblings[0]?.focus();
          break;
        default:
          break;
      }
    };

    return (
      <MenuContext.Provider value={contextValue}>
        <Component
          aria-orientation={mode === 'horizontal' ? 'horizontal' : 'vertical'}
          className={clsx(
            styles.menu,
            mode === 'horizontal' && styles.horizontal,
            theme === 'dark' && styles.menuDark,
            inlineCollapsed && styles.collapsed,
            className,
          )}
          onKeyDown={handleKeyDown}
          ref={ref}
          role="menu"
          style={resolvedStyle}
          {...rest}
        >
          {renderMenuChildren(children, 0)}
        </Component>
      </MenuContext.Provider>
    );
  },
);

Menu.displayName = 'Menu';

export default Menu;
