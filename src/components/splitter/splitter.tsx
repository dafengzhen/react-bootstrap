import clsx from 'clsx';
import {
  Children,
  cloneElement,
  type CSSProperties,
  forwardRef,
  Fragment,
  isValidElement,
  type ReactElement,
  type KeyboardEvent as ReactKeyboardEvent,
  type MouseEvent as ReactMouseEvent,
  type ReactNode,
  type PointerEvent as ReactPointerEvent,
  useCallback,
  useId,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import type {
  SplitterBarRenderProps,
  SplitterContextValue,
  SplitterPanelProps,
  SplitterProps,
  SplitterSize,
} from './types';

import { SplitterContext } from './splitter-context';
import { SplitterPanel } from './splitter-panel';
import {
  clampValue,
  computeSplitterPanelPx,
  normalizeSplitterSizes,
  parseSplitterSize,
  pxToSplitterSize,
  splitterSizeToPx,
} from './splitter-utils';
import styles from './splitter.module.css';

const DEFAULT_BAR_SIZE = 8;
const KEYBOARD_FINE_STEP_PERCENT = 1;
const KEYBOARD_STEP_PERCENT = 10;

interface BarTarget {
  bar: HTMLElement;
  index: number;
}

interface DragInfo {
  index: number;
  leftPx: number;
  maxDelta: number;
  minDelta: number;
  pointerId: number;
  rafId: null | number;
  rightPx: number;
  startedCollapsedLeft: boolean;
  startedCollapsedRight: boolean;
  startLeftPx: number;
  startPointer: number;
  startRightPx: number;
  total: number;
  unitLeft: SplitterSize;
  unitRight: SplitterSize;
}

interface ResolvedPanel {
  collapsed: boolean;
  collapsedSize?: number | string;
  collapsible: boolean;
  controlledCollapsed: boolean;
  defaultCollapsed?: boolean;
  defaultSize?: number | string;
  max?: number | string;
  min?: number | string;
  onCollapse?: (collapsed: boolean) => void;
  resizable: boolean;
}

export const Splitter = forwardRef<HTMLElement, SplitterProps>(
  (
    {
      as: Component = 'div',
      barSize = DEFAULT_BAR_SIZE,
      children,
      className,
      defaultSizes,
      disabled = false,
      layout = 'horizontal',
      onChange,
      onDoubleClick,
      onKeyDown,
      onPointerCancel,
      onPointerDown,
      onPointerMove,
      onPointerUp,
      onResizeEnd,
      onResizeStart,
      renderBar,
      sizes,
      style,
      ...rest
    },
    ref,
  ) => {
    const panelIdBase = useId();
    const containerRef = useRef<HTMLElement | null>(null);
    const dragRef = useRef<DragInfo | null>(null);
    const preCollapseRef = useRef<Array<SplitterSize | undefined>>([]);
    const sizesRef = useRef<SplitterSize[]>([]);
    const [dragSizes, setDragSizes] = useState<null | SplitterSize[]>(null);
    const [resizingIndex, setResizingIndex] = useState<null | number>(null);

    const panelChildren = useMemo(
      () =>
        Children.toArray(children).filter(
          (child): child is ReactElement<SplitterPanelProps> =>
            isValidElement<SplitterPanelProps>(child) && child.type === SplitterPanel,
        ),
      [children],
    );

    const panels = useMemo<ResolvedPanel[]>(
      () =>
        panelChildren.map((child) => ({
          collapsed: child.props.collapsed ?? false,
          collapsedSize: child.props.collapsedSize,
          collapsible: child.props.collapsible ?? false,
          controlledCollapsed: child.props.collapsed !== undefined,
          defaultCollapsed: child.props.defaultCollapsed,
          defaultSize: child.props.defaultSize,
          max: child.props.max,
          min: child.props.min,
          onCollapse: child.props.onCollapse,
          resizable: child.props.resizable ?? true,
        })),
      [panelChildren],
    );

    const [internalSizes, setInternalSizes] = useState<SplitterSize[]>(() =>
      Array.from(
        { length: panels.length },
        (_, index) => defaultSizes?.[index] ?? panels[index]?.defaultSize ?? 'auto',
      ),
    );

    const [internalCollapsed, setInternalCollapsed] = useState<boolean[]>(() =>
      panels.map((panel) => panel.defaultCollapsed ?? false),
    );

    const collapsedValues = useMemo(
      () =>
        panels.map((panel, index) =>
          panel.controlledCollapsed ? panel.collapsed : (internalCollapsed[index] ?? false),
        ),
      [internalCollapsed, panels],
    );

    const normalizedControlled = useMemo(
      () => (sizes === undefined ? null : normalizeSplitterSizes(sizes, panels.length)),
      [panels.length, sizes],
    );

    const displaySizes = dragSizes ?? normalizedControlled ?? internalSizes;

    useLayoutEffect(() => {
      sizesRef.current = displaySizes;
    });

    const getContainerMetrics = useCallback((): { offset: number; total: number } => {
      const element = containerRef.current;
      if (element === null) {
        return { offset: 0, total: 0 };
      }
      const rect = element.getBoundingClientRect();
      const computed = window.getComputedStyle(element);
      const horizontal = layout === 'horizontal';
      const borderEnd = parseFloat(
        horizontal ? computed.borderRightWidth : computed.borderBottomWidth,
      );
      const borderStart = parseFloat(
        horizontal ? computed.borderLeftWidth : computed.borderTopWidth,
      );
      const paddingEnd = parseFloat(horizontal ? computed.paddingRight : computed.paddingBottom);
      const paddingStart = parseFloat(horizontal ? computed.paddingLeft : computed.paddingTop);
      return {
        offset: (horizontal ? rect.left : rect.top) + borderStart + paddingStart,
        total:
          (horizontal ? rect.width : rect.height) -
          borderEnd -
          borderStart -
          paddingEnd -
          paddingStart,
      };
    }, [layout]);

    const getContainerSize = useCallback(() => getContainerMetrics().total, [getContainerMetrics]);

    const [containerTotal, setContainerTotal] = useState(0);

    useLayoutEffect(() => {
      const element = containerRef.current;
      if (element === null) {
        return;
      }
      const update = () => {
        setContainerTotal(getContainerMetrics().total);
      };
      update();
      if (typeof ResizeObserver === 'undefined') {
        return;
      }
      const observer = new ResizeObserver(update);
      observer.observe(element);
      return () => {
        observer.disconnect();
      };
    }, [getContainerMetrics]);

    const commitSizes = useCallback(
      (next: SplitterSize[], duringDrag: boolean) => {
        sizesRef.current = next;
        onChange?.(next);
        if (sizes === undefined) {
          setInternalSizes(next);
        } else if (duringDrag) {
          setDragSizes(next);
        }
      },
      [onChange, sizes],
    );

    const prevCollapsedRef = useRef<boolean[]>([]);

    useLayoutEffect(() => {
      const prev = prevCollapsedRef.current;
      collapsedValues.forEach((collapsed, index) => {
        const wasCollapsed = prev[index] ?? false;
        if (wasCollapsed && !collapsed) {
          const panel = panels[index];
          const size = sizesRef.current[index];
          if (panel !== undefined && size === (panel.collapsedSize ?? 0)) {
            const next = [...sizesRef.current];
            next[index] = preCollapseRef.current[index] ?? panel.defaultSize ?? 'auto';
            commitSizes(next, false);
          }
        }
        prev[index] = collapsed;
      });
    }, [collapsedValues, commitSizes, panels]);

    const setCollapsedValue = (index: number, value: boolean) => {
      const panel = panels[index];
      if (panel === undefined) {
        return;
      }
      panel.onCollapse?.(value);
      if (panel.controlledCollapsed) {
        return;
      }
      setInternalCollapsed((prev) => {
        if (prev[index] === value) {
          return prev;
        }
        const next = [...prev];
        next[index] = value;
        return next;
      });
    };

    const collapsePanel = (index: number) => {
      const panel = panels[index];
      if (panel === undefined || !panel.collapsible || (collapsedValues[index] ?? false)) {
        return;
      }
      const next = [...sizesRef.current];
      preCollapseRef.current[index] = next[index];
      next[index] = panel.collapsedSize ?? 0;
      setCollapsedValue(index, true);
      commitSizes(next, false);
    };

    const expandPanel = (index: number) => {
      const panel = panels[index];
      if (panel === undefined || !(collapsedValues[index] ?? false)) {
        return;
      }
      const next = [...sizesRef.current];
      next[index] = preCollapseRef.current[index] ?? panel.defaultSize ?? 'auto';
      setCollapsedValue(index, false);
      commitSizes(next, false);
    };

    const toggleBarCollapse = (index: number) => {
      const leftCollapsed = collapsedValues[index] ?? false;
      const rightCollapsed = collapsedValues[index + 1] ?? false;
      if (leftCollapsed) {
        expandPanel(index);
        return;
      }
      if (panels[index]?.collapsible) {
        collapsePanel(index);
        return;
      }
      if (rightCollapsed) {
        expandPanel(index + 1);
        return;
      }
      if (panels[index + 1]?.collapsible) {
        collapsePanel(index + 1);
      }
    };

    const isBarDisabled = (index: number): boolean => {
      const left = panels[index];
      const right = panels[index + 1];
      return (
        disabled || left === undefined || right === undefined || !left.resizable || !right.resizable
      );
    };

    const getBarTarget = (event: { target: EventTarget | null }): BarTarget | null => {
      const target = event.target;
      if (!(target instanceof Element)) {
        return null;
      }
      const bar = target.closest<HTMLElement>('[data-splitter-bar]');
      if (bar === null || bar.parentElement !== containerRef.current) {
        return null;
      }
      const index = Number(bar.getAttribute('data-splitter-bar'));
      return Number.isInteger(index) ? { bar, index } : null;
    };

    const resolvePanelBounds = (index: number, total: number, panelsTotal: number) => {
      const left = panels[index];
      const right = panels[index + 1];
      if (left === undefined || right === undefined) {
        return { leftMax: 0, leftMin: 0, rightMax: 0, rightMin: 0 };
      }
      const leftCollapsed = collapsedValues[index] ?? false;
      const rightCollapsed = collapsedValues[index + 1] ?? false;
      const leftMin = leftCollapsed
        ? 0
        : left.min === undefined
          ? 0
          : splitterSizeToPx(left.min, total);
      const leftMax = leftCollapsed
        ? panelsTotal
        : left.max === undefined
          ? panelsTotal
          : splitterSizeToPx(left.max, total);
      const rightMin = rightCollapsed
        ? 0
        : right.min === undefined
          ? 0
          : splitterSizeToPx(right.min, total);
      const rightMax = rightCollapsed
        ? panelsTotal
        : right.max === undefined
          ? panelsTotal
          : splitterSizeToPx(right.max, total);
      return { leftMax, leftMin, rightMax, rightMin };
    };

    const computeBoundaryPx = (index: number, sizesList: SplitterSize[], total: number): number =>
      computeSplitterPanelPx(sizesList, total, barSize)
        .slice(0, index)
        .reduce((sum, value) => sum + value, 0) +
      index * barSize;

    const measureBarPosition = (bar: HTMLElement): number => {
      const rect = bar.getBoundingClientRect();
      const { offset } = getContainerMetrics();
      return layout === 'horizontal' ? rect.left - offset : rect.top - offset;
    };

    const measurePanels = (
      bar: HTMLElement,
      index: number,
      panelsTotal: number,
    ): { left: number; right: number } => {
      const boundary = measureBarPosition(bar) - index * barSize;
      const container = containerRef.current;
      const prevBar =
        index > 0 && container !== null
          ? container.querySelector<HTMLElement>(`:scope > [data-splitter-bar="${index - 1}"]`)
          : null;
      const nextBar =
        container === null
          ? null
          : container.querySelector<HTMLElement>(`:scope > [data-splitter-bar="${index + 1}"]`);
      const prevBoundary =
        prevBar === null ? 0 : measureBarPosition(prevBar) - (index - 1) * barSize;
      const nextBoundary =
        nextBar === null ? panelsTotal : measureBarPosition(nextBar) - (index + 1) * barSize;
      return {
        left: clampValue(boundary - prevBoundary, 0, panelsTotal),
        right: clampValue(nextBoundary - boundary, 0, panelsTotal),
      };
    };

    const resolveDeltaBounds = (
      index: number,
      left: number,
      right: number,
      total: number,
      panelsTotal: number,
    ): { max: number; min: number } => {
      const bounds = resolvePanelBounds(index, total, panelsTotal);
      return {
        max: Math.min(bounds.leftMax - left, right - bounds.rightMin),
        min: Math.max(bounds.leftMin - left, right - bounds.rightMax),
      };
    };

    const resizeTo = (
      index: number,
      leftPx: number,
      rightPx: number,
      total: number,
      duringDrag: boolean,
    ): SplitterSize[] => {
      const sizesList = sizesRef.current;
      const next = [...sizesList];
      next[index] = pxToSplitterSize(leftPx, sizesList[index], total);
      next[index + 1] = pxToSplitterSize(rightPx, sizesList[index + 1], total);
      if ((collapsedValues[index] ?? false) && leftPx > 0.5) {
        setCollapsedValue(index, false);
      }
      if ((collapsedValues[index + 1] ?? false) && rightPx > 0.5) {
        setCollapsedValue(index + 1, false);
      }
      commitSizes(next, duringDrag);
      return next;
    };

    const handleDoubleClick = (event: ReactMouseEvent<HTMLElement>) => {
      onDoubleClick?.(event);
      if (event.defaultPrevented || disabled) {
        return;
      }
      const target = getBarTarget(event);
      if (target === null || isBarDisabled(target.index)) {
        return;
      }
      toggleBarCollapse(target.index);
    };

    const handleKeyDown = (event: ReactKeyboardEvent<HTMLElement>) => {
      onKeyDown?.(event);
      if (event.defaultPrevented || disabled) {
        return;
      }
      const target = getBarTarget(event);
      if (target === null || isBarDisabled(target.index)) {
        return;
      }
      const { key } = event;
      const isHomeEnd = key === 'Home' || key === 'End';
      const horizontalKeys =
        layout === 'horizontal' ? ['ArrowLeft', 'ArrowRight'] : ['ArrowUp', 'ArrowDown'];
      if (!horizontalKeys.includes(key) && !isHomeEnd) {
        return;
      }
      event.preventDefault();
      const total = getContainerSize();
      if (total <= 0) {
        return;
      }
      const panelsTotal = Math.max(total - barSize * (panels.length - 1), 0);
      if (panelsTotal <= 0) {
        return;
      }
      const { left, right } = measurePanels(target.bar, target.index, panelsTotal);
      const bounds = resolveDeltaBounds(target.index, left, right, total, panelsTotal);
      let delta = 0;
      if (key === 'Home') {
        delta = bounds.min;
      } else if (key === 'End') {
        delta = bounds.max;
      } else {
        const decrease = key === 'ArrowLeft' || key === 'ArrowUp';
        const step =
          (total * (event.shiftKey ? KEYBOARD_FINE_STEP_PERCENT : KEYBOARD_STEP_PERCENT)) / 100;
        delta = clampValue(decrease ? -step : step, bounds.min, bounds.max);
      }
      resizeTo(target.index, left + delta, right - delta, total, false);
    };

    const handlePointerDown = (event: ReactPointerEvent<HTMLElement>) => {
      onPointerDown?.(event);
      if (event.defaultPrevented || disabled || dragRef.current !== null || event.button !== 0) {
        return;
      }
      const target = getBarTarget(event);
      if (target === null || isBarDisabled(target.index)) {
        return;
      }
      const total = getContainerSize();
      if (total <= 0) {
        return;
      }
      const panelsTotal = Math.max(total - barSize * (panels.length - 1), 0);
      if (panelsTotal <= 0) {
        return;
      }
      const { left, right } = measurePanels(target.bar, target.index, panelsTotal);
      const bounds = resolveDeltaBounds(target.index, left, right, total, panelsTotal);
      dragRef.current = {
        index: target.index,
        leftPx: left,
        maxDelta: bounds.max,
        minDelta: bounds.min,
        pointerId: event.pointerId,
        rafId: null,
        rightPx: right,
        startedCollapsedLeft: collapsedValues[target.index] ?? false,
        startedCollapsedRight: collapsedValues[target.index + 1] ?? false,
        startLeftPx: left,
        startPointer: layout === 'horizontal' ? event.clientX : event.clientY,
        startRightPx: right,
        total,
        unitLeft: sizesRef.current[target.index] ?? 'auto',
        unitRight: sizesRef.current[target.index + 1] ?? 'auto',
      };
      target.bar.setPointerCapture(event.pointerId);
      setResizingIndex(target.index);
      onResizeStart?.(sizesRef.current);
    };

    const handlePointerMove = (event: ReactPointerEvent<HTMLElement>) => {
      onPointerMove?.(event);
      const info = dragRef.current;
      if (info === null || info.pointerId !== event.pointerId) {
        return;
      }
      const pointer = layout === 'horizontal' ? event.clientX : event.clientY;
      const delta = clampValue(pointer - info.startPointer, info.minDelta, info.maxDelta);
      const nextLeft = info.startLeftPx + delta;
      if (Math.abs(nextLeft - info.leftPx) < 0.5) {
        return;
      }
      info.leftPx = nextLeft;
      info.rightPx = info.startRightPx - delta;
      if (info.rafId === null) {
        info.rafId = requestAnimationFrame(() => {
          info.rafId = null;
          resizeTo(info.index, info.leftPx, info.rightPx, info.total, true);
        });
      }
    };

    const endDrag = () => {
      const info = dragRef.current;
      if (info === null) {
        return;
      }
      dragRef.current = null;
      if (info.rafId !== null) {
        cancelAnimationFrame(info.rafId);
        info.rafId = null;
      }
      const next = resizeTo(info.index, info.leftPx, info.rightPx, info.total, false);
      if (info.startedCollapsedLeft && info.leftPx <= 0.5) {
        setCollapsedValue(info.index, true);
      }
      if (info.startedCollapsedRight && info.rightPx <= 0.5) {
        setCollapsedValue(info.index + 1, true);
      }
      onResizeEnd?.(next);
      if (sizes !== undefined) {
        setDragSizes(null);
      }
      setResizingIndex(null);
    };

    const handlePointerUp = (event: ReactPointerEvent<HTMLElement>) => {
      onPointerUp?.(event);
      endDrag();
    };

    const handlePointerCancel = (event: ReactPointerEvent<HTMLElement>) => {
      onPointerCancel?.(event);
      endDrag();
    };

    const resolvePanelPercent = (index: number, total: number): number => {
      if (total <= 0) {
        return 0;
      }
      const size = displaySizes[index];
      const parts = parseSplitterSize(size);
      if (parts?.unit === 'percent') {
        return clampValue(parts.value, 0, 100);
      }
      if (parts?.unit === 'px') {
        return clampValue((parts.value / total) * 100, 0, 100);
      }
      return clampValue((computeBoundaryPx(index, displaySizes, total) / total) * 100, 0, 100);
    };

    const renderBarElement = (index: number, total: number): ReactNode => {
      const horizontal = layout === 'horizontal';
      const barProps: SplitterBarRenderProps = {
        'aria-controls': `${panelIdBase}-panel-${index} ${panelIdBase}-panel-${index + 1}`,
        'aria-disabled': isBarDisabled(index) || undefined,
        'aria-orientation': horizontal ? 'vertical' : 'horizontal',
        'aria-valuemax': 100,
        'aria-valuemin': 0,
        'aria-valuenow': Math.round(resolvePanelPercent(index, total)),
        className: clsx(
          styles.bar,
          horizontal ? styles.barHorizontal : styles.barVertical,
          resizingIndex === index && styles.dragging,
          isBarDisabled(index) && styles.barDisabled,
        ),
        'data-splitter-bar': index,
        role: 'separator',
        tabIndex: isBarDisabled(index) ? -1 : 0,
      };
      if (renderBar !== undefined) {
        return renderBar(barProps, index);
      }
      return (
        <div {...barProps}>
          <div className={styles.grip} />
        </div>
      );
    };

    const setRootRef = (element: HTMLElement | null) => {
      containerRef.current = element;
      if (typeof ref === 'function') {
        ref(element);
      } else if (ref !== null) {
        ref.current = element;
      }
    };

    const contextValue = useMemo<SplitterContextValue>(
      () => ({
        barSize,
        collapsed: collapsedValues,
        disabled,
        layout,
        panelCount: panels.length,
        resizingIndex,
        sizes: displaySizes,
      }),
      [barSize, collapsedValues, disabled, displaySizes, layout, panels.length, resizingIndex],
    );

    const content = panelChildren.map((child, index) => (
      <Fragment key={child.key ?? `splitter-panel-${index}`}>
        {cloneElement(child, {
          id: child.props.id ?? `${panelIdBase}-panel-${index}`,
          index,
        })}
        {index < panels.length - 1 ? renderBarElement(index, containerTotal) : null}
      </Fragment>
    ));

    return (
      <SplitterContext.Provider value={contextValue}>
        <Component
          className={clsx(
            styles.splitter,
            styles[layout],
            resizingIndex !== null && styles.resizing,
            className,
          )}
          onDoubleClick={handleDoubleClick}
          onKeyDown={handleKeyDown}
          onPointerCancel={handlePointerCancel}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          ref={setRootRef}
          style={{ '--rbs-splitter-bar-size': `${barSize}px`, ...style } as CSSProperties}
          {...rest}
        >
          {content}
        </Component>
      </SplitterContext.Provider>
    );
  },
);

Splitter.displayName = 'Splitter';

export default Splitter;
