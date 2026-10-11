import clsx from 'clsx';
import {
  type ButtonHTMLAttributes,
  createContext,
  type CSSProperties,
  type ReactNode,
  useCallback,
  useContext,
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';
import { createPortal } from 'react-dom';

import { computePosition, type PositionRect } from '../../utils';
import { ToolbarButton } from './rich-text-editor-toolbar-button';
import styles from './rich-text-editor.module.css';

/**
 * How a row of a panel asks the panel to close.
 *
 * A row cannot reach the dropdown that renders it — the panel is portalled out of the trigger's tree —
 * so the dropdown provides the dismissal through context and a row calls it after its own handler.
 * Outside a dropdown the default does nothing, which is what a row rendered by a host gets.
 */
const ToolbarPanelContext = createContext<() => void>(() => {});

/** Props of {@link ToolbarDropdown}. */
export interface ToolbarDropdownProps {
  /** Panel content, rendered into the document body while the panel is open. */
  children?: ReactNode;
  /** Extra classes for the trigger. */
  className?: string;
  /** Whether the trigger cannot be used. */
  disabled?: boolean;
  /** Content of the trigger; an icon is expected, the label becomes its accessible name. */
  icon?: ReactNode;
  /** Accessible name of the trigger and of the panel. */
  label: string;
  /** Whether the panel is open; the component is controlled. */
  onOpenChange: (open: boolean) => void;
  open: boolean;
  /** Extra classes for the panel. */
  panelClassName?: string;
  /** Where the panel prefers to appear. */
  placement?: 'bottom-end' | 'bottom-start' | 'top-start';
  /** Shortcut hint appended to the tooltip. */
  shortcut?: string;
  /** Width of the panel as a CSS value. */
  width?: number | string;
}

/** Props of {@link ToolbarMenuItem}. */
export interface ToolbarMenuItemProps extends Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  'title'
> {
  /** Whether the row is the current value. */
  active?: boolean;
  /** Extra classes for the row. */
  className?: string;
  /** Whether the row cannot be used. */
  disabled?: boolean;
  /** Short text on the trailing edge, a shortcut or a value. */
  hint?: ReactNode;
  /** Leading icon. */
  icon?: ReactNode;
  /** Label of the row. */
  label: ReactNode;
  /** Called when the row is chosen. */
  onSelect: () => void;
}

/**
 * A toolbar control that reveals a panel.
 *
 * The panel is rendered into `document.body` rather than next to its trigger, because the toolbar
 * scrolls horizontally and the edit area clips its overflow: a panel inside it would be cut off or
 * would drag the toolbar's scroll position along. Positioning is the library's own
 * {@link computePosition}, so flip and clamping behave like the tooltip and dropdown panels.
 *
 * The trigger cancels its pointer-down, so the editor keeps the caret while the panel opens; the
 * panel's own controls do the same, which is what lets a value picked in a panel be written into
 * the document at the selection the user left behind.
 */
export function ToolbarDropdown({
  children,
  className,
  disabled = false,
  icon,
  label,
  onOpenChange,
  open,
  panelClassName,
  placement = 'bottom-start',
  shortcut,
  width,
}: ToolbarDropdownProps) {
  const [position, setPosition] = useState<null | PositionRect>(null);
  const close = useCallback(() => onOpenChange(false), [onOpenChange]);
  const panelRef = useRef<HTMLDivElement>(null);
  const panelId = useId();
  const triggerRef = useRef<HTMLButtonElement>(null);

  useLayoutEffect(() => {
    if (!open) {
      return;
    }

    const place = () => {
      const trigger = triggerRef.current;
      const panel = panelRef.current;

      if (!trigger || !panel) {
        return;
      }

      const rect = trigger.getBoundingClientRect();
      const result = computePosition({
        flip: true,
        floatingHeight: panel.offsetHeight,
        floatingWidth: panel.offsetWidth,
        isRtl: getComputedStyle(panel).direction === 'rtl',
        offset: [0, 4],
        padding: 8,
        placement,
        reference: { height: rect.height, width: rect.width, x: rect.left, y: rect.top },
      });

      setPosition({
        height: panel.offsetHeight,
        width: panel.offsetWidth,
        x: result.x,
        y: result.y,
      });
    };

    // The first measurement happens in a frame callback rather than during the commit: a layout
    // effect that sets state on mount is a second render before paint, and the panel does not need
    // to be positioned until the browser is about to draw it.
    const frame = window.requestAnimationFrame(place);
    const panel = panelRef.current;
    const observer =
      typeof ResizeObserver === 'undefined' || !panel ? null : new ResizeObserver(() => place());

    if (panel && observer) {
      observer.observe(panel);
    }

    window.addEventListener('resize', place);
    window.addEventListener('scroll', place, true);

    return () => {
      window.cancelAnimationFrame(frame);
      observer?.disconnect();
      window.removeEventListener('resize', place);
      window.removeEventListener('scroll', place, true);
    };
  }, [open, placement]);

  useEffect(() => {
    if (!open) {
      return;
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.stopPropagation();
        close();
      }
    };

    const onPointerDown = (event: Event) => {
      const target = event.target as Node | null;

      if (target && !panelRef.current?.contains(target) && !triggerRef.current?.contains(target)) {
        close();
      }
    };

    document.addEventListener('keydown', onKeyDown, true);
    document.addEventListener('pointerdown', onPointerDown, true);

    return () => {
      document.removeEventListener('keydown', onKeyDown, true);
      document.removeEventListener('pointerdown', onPointerDown, true);
    };
  }, [close, open]);

  const style: CSSProperties | undefined =
    position === null
      ? undefined
      : { left: `${position.x}px`, top: `${position.y}px`, width: width };
  const hidden = position === null;

  return (
    <>
      <ToolbarButton
        active={open}
        aria-controls={open ? panelId : undefined}
        aria-expanded={open}
        aria-haspopup="dialog"
        className={clsx('rbs-rte-tool-caret', className)}
        disabled={disabled}
        onClick={() => onOpenChange(!open)}
        ref={triggerRef}
        shortcut={shortcut}
        title={label}
      >
        {icon}
      </ToolbarButton>
      {open
        ? createPortal(
            <div
              aria-label={label}
              className={clsx('rbs-rte-panel', styles.panel, panelClassName)}
              id={panelId}
              ref={panelRef}
              style={{ ...style, visibility: hidden ? 'hidden' : undefined }}
            >
              <ToolbarPanelContext.Provider value={close}>{children}</ToolbarPanelContext.Provider>
            </div>,
            document.body,
          )
        : null}
    </>
  );
}

/**
 * One selectable row of a panel.
 *
 * Choosing a row dismisses the panel it is in: a choice is applied at once and there is nothing left
 * to decide, and leaving it open means the trigger that opened it would only *close* it on the next
 * press — the user would have to press twice to pick a second value.
 */
export function ToolbarMenuItem({
  active = false,
  className,
  disabled = false,
  hint,
  icon,
  label,
  onSelect,
}: ToolbarMenuItemProps) {
  const dismiss = useContext(ToolbarPanelContext);

  const choose = () => {
    onSelect();
    dismiss();
  };

  return (
    <button
      aria-pressed={active || undefined}
      className={clsx(
        'dropdown-item',
        'rbs-rte-panel-item',
        styles.panelItem,
        active && 'active',
        className,
      )}
      data-panel-item=""
      disabled={disabled}
      onClick={choose}
      onPointerDown={(event) => event.preventDefault()}
      type="button"
    >
      {icon ? <span className={styles.panelItemIcon}>{icon}</span> : null}
      <span className={styles.panelItemLabel}>{label}</span>
      {hint ? <span className={styles.panelItemHint}>{hint}</span> : null}
    </button>
  );
}
