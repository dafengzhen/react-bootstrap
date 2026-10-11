import clsx from 'clsx';
import { type ButtonHTMLAttributes, forwardRef, type PointerEvent, type ReactNode } from 'react';

import styles from './rich-text-editor.module.css';

/**
 * One control of the toolbar.
 *
 * Beyond rendering a button this component has a single job: keeping the editor's selection alive.
 * A press on a toolbar moves the focus, and the browser collapses the caret in the editable area
 * when it loses focus, so every control that acts on the selection cancels the default of its
 * `pointerdown`. A control that only opens something passes `keepFocus={false}` and behaves like a
 * plain button.
 *
 * ```tsx
 * <ToolbarButton active={isActive('bold')} title="Bold">
 *   <Bold aria-hidden="true" />
 * </ToolbarButton>
 * ```
 */
export const ToolbarButton = forwardRef<HTMLButtonElement, ToolbarButtonProps>(
  (
    {
      active = false,
      'aria-label': ariaLabel,
      children,
      className,
      disabled = false,
      keepFocus = true,
      onPointerDown,
      shortcut,
      title,
      type = 'button',
      ...rest
    },
    ref,
  ) => (
    <button
      aria-label={ariaLabel ?? title}
      aria-pressed={active || undefined}
      className={clsx(
        'btn',
        'btn-sm',
        'btn-light',
        'rbs-rte-tool',
        styles.tool,
        active && 'active',
        className,
      )}
      disabled={disabled}
      onPointerDown={keepFocus ? preventSelectionLoss(onPointerDown) : onPointerDown}
      ref={ref}
      title={shortcut ? `${title ?? ariaLabel ?? ''} (${shortcut})` : title}
      type={type}
      {...rest}
    >
      {children}
    </button>
  ),
);

ToolbarButton.displayName = 'ToolbarButton';

/** Props of {@link ToolbarButton}. */
export interface ToolbarButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** Whether the control reads as "on"; a mark that applies, a block that is active. */
  active?: boolean;
  /** Icon inside the button. */
  children?: ReactNode;
  /**
   * Whether the press must leave the caret alone.
   *
   * Defaults to `true`, which is what a command button needs; a control that opens a panel keeps the
   * same default, because the panel writes into the document when a value is picked and the caret has
   * to still be where the user left it.
   */
  keepFocus?: boolean;
  /** Shortcut hint appended to the tooltip. */
  shortcut?: string;
}

/** A group of related controls. */
export function ToolbarGroup({
  children,
  className,
  label,
}: {
  children?: ReactNode;
  className?: string;
  label: string;
}) {
  return (
    <div aria-label={label} className={clsx('rbs-rte-tool-group', styles.toolGroup, className)}>
      {children}
    </div>
  );
}

/** A thin rule between two groups of controls. */
export function ToolbarSeparator({ className }: { className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={clsx('rbs-rte-tool-separator', styles.toolSeparator, className)}
      role="presentation"
    />
  );
}

/**
 * Cancels a pointer-down so the editor keeps its selection.
 *
 * Keyboard activation is untouched: a `keydown` on a focused button does not run through here, and
 * the button is still reachable with Tab, which matters for a toolbar used without a mouse.
 */
function preventSelectionLoss(
  handler: ((event: PointerEvent<HTMLButtonElement>) => void) | undefined,
) {
  return (event: PointerEvent<HTMLButtonElement>): void => {
    event.preventDefault();
    handler?.(event);
  };
}
