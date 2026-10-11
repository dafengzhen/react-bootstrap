import type { ReactNode } from 'react';

import clsx from 'clsx';

import type { RichTextEditorContextValue, RichTextEditorPanel } from './types';

import { ToolbarDropdown } from './rich-text-editor-toolbar-dropdown';

/** What a panel trigger can pass as its content: a node, or a function of the editor context. */
export type RichTextEditorPanelBody = (context: RichTextEditorContextValue) => ReactNode;

/** Props of {@link ToolbarPanelTrigger}. */
export interface ToolbarPanelTriggerProps {
  /** Whether the trigger reads as "on" for a reason other than the panel being open. */
  active?: boolean;
  /** Panel content, or a function that builds it from the editor context. */
  children: ReactNode | RichTextEditorPanelBody;
  /**
   * The editor context, for a panel body passed as a function.
   *
   * A panel that renders its own controls reads the context from `useRichTextEditor` instead, which
   * is what the default toolbar's panels do; the prop exists for a host that builds a body outside
   * the provider.
   */
  context?: RichTextEditorContextValue;
  /** Whether the trigger cannot be used. */
  disabled?: boolean;
  /** Trigger content. */
  icon?: ReactNode;
  /** Accessible name of the trigger. */
  label: string;
  /** Called with the panel that should be open; `null` closes everything. */
  onOpenChange: (panel: RichTextEditorPanel) => void;
  /** Whether this trigger's panel is the open one. */
  open: boolean;
  /** Identity of the panel this trigger opens. */
  panel: Exclude<RichTextEditorPanel, null>;
  /** Where the panel prefers to appear. */
  placement?: 'bottom-end' | 'bottom-start' | 'top-start';
  /** Shortcut hint appended to the tooltip. */
  shortcut?: string;
  /** Width of the panel as a CSS value. */
  width?: number | string;
}

/**
 * One dropdown of the toolbar, wired to the single open panel.
 *
 * The toolbar keeps "which panel is open" in one place rather than in every control, because two
 * open panels would overlap and because a command that changes the selection has to close the panel
 * that was open — the selection it would apply to is gone at that point.
 */
export function ToolbarPanelTrigger({
  active = false,
  children,
  context,
  disabled,
  icon,
  label,
  onOpenChange,
  open,
  panel,
  placement,
  shortcut,
  width,
}: ToolbarPanelTriggerProps) {
  return (
    <ToolbarDropdown
      className={clsx(active && 'active')}
      disabled={disabled}
      icon={icon}
      label={label}
      onOpenChange={(next) => onOpenChange(next ? panel : null)}
      open={open}
      placement={placement}
      shortcut={shortcut}
      width={width}
    >
      {typeof children === 'function' ? (context ? children(context) : null) : children}
    </ToolbarDropdown>
  );
}
