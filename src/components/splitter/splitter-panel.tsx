import clsx from 'clsx';
import { type CSSProperties, forwardRef } from 'react';

import type { SplitterPanelProps } from './types';

import { useSplitter } from './splitter-context';
import { isAutoSplitterSize, splitterSizeToCss } from './splitter-utils';
import styles from './splitter.module.css';

export const SplitterPanel = forwardRef<HTMLElement, SplitterPanelProps>(
  (
    {
      as: Component = 'div',
      children,
      className,
      collapsed,
      collapsedSize = 0,
      collapsible: _collapsible,
      defaultCollapsed,
      defaultSize: _defaultSize,
      index = -1,
      max,
      min,
      onCollapse: _onCollapse,
      resizable: _resizable,
      style,
      ...rest
    },
    ref,
  ) => {
    const context = useSplitter();
    const inSplitter = context !== null && index >= 0;
    const resolvedCollapsed = inSplitter
      ? (context.collapsed[index] ?? false)
      : (collapsed ?? defaultCollapsed);
    const size = inSplitter ? context.sizes[index] : undefined;

    let panelStyle: CSSProperties | undefined = style;
    if (context !== null && index >= 0) {
      const flex = resolvedCollapsed
        ? `0 0 ${splitterSizeToCss(collapsedSize)}`
        : isAutoSplitterSize(size)
          ? '1 1 0%'
          : `0 1 ${splitterSizeToCss(size)}`;
      const axis =
        context.layout === 'vertical'
          ? {
              maxHeight: resolvedCollapsed ? undefined : max,
              minHeight: resolvedCollapsed ? 0 : min,
            }
          : {
              maxWidth: resolvedCollapsed ? undefined : max,
              minWidth: resolvedCollapsed ? 0 : min,
            };
      panelStyle = { flex, ...axis, ...style };
    }

    return (
      <Component
        className={clsx(styles.panel, className)}
        data-collapsed={resolvedCollapsed || undefined}
        ref={ref}
        style={panelStyle}
        {...rest}
      >
        {children}
      </Component>
    );
  },
);

SplitterPanel.displayName = 'SplitterPanel';

export default SplitterPanel;
