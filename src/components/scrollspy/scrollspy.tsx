import { type FC, useCallback, useEffect, useMemo, useRef, useState } from 'react';

import type { ScrollSpyContextValue, ScrollSpyProps } from './types';

import { ScrollSpyContext } from './context';
import {
  clamp,
  computeActiveId,
  getHashTargetId,
  isDisabled,
  isVisible,
  parseRootMargin,
  type RootMarginValue,
  type ScrollSpySectionRect,
} from './utils';

const DEFAULT_ROOT_MARGIN = '0px 0px -25%';
const DEFAULT_THRESHOLD: number[] = [0.1, 0.5, 1];

export const ScrollSpy: FC<ScrollSpyProps> = ({
  activeId,
  children,
  defaultActiveId,
  onActivate,
  rootMargin = DEFAULT_ROOT_MARGIN,
  smoothScroll = false,
  target,
  threshold = DEFAULT_THRESHOLD,
}) => {
  const isControlled = activeId !== undefined;
  const [containerElement, setContainerElement] = useState<HTMLElement | null>(null);
  const [internalActiveId, setInternalActiveId] = useState<null | string>(defaultActiveId ?? null);
  const [linksVersion, setLinksVersion] = useState(0);

  const activeIdRef = useRef<null | string>(null);
  const containerElementRef = useRef<HTMLElement | null>(null);
  const isControlledRef = useRef(isControlled);
  const linkCountsRef = useRef(new Map<string, number>());
  const onActivateRef = useRef(onActivate);

  const currentActiveId = isControlled ? activeId : internalActiveId;

  const thresholds = Array.isArray(threshold) ? threshold : [threshold];
  const enterThreshold = thresholds.length > 0 ? Math.min(...thresholds) : 0;

  useEffect(() => {
    activeIdRef.current = currentActiveId;
    isControlledRef.current = isControlled;
    onActivateRef.current = onActivate;
  });

  const handleActivate = useCallback((nextId: null | string, link: HTMLElement | null) => {
    if (!isControlledRef.current) {
      setInternalActiveId(nextId);
    }
    onActivateRef.current?.(nextId, link);
  }, []);

  const registerContainer = useCallback((element: HTMLElement | null) => {
    if (containerElementRef.current === element) {
      return;
    }
    containerElementRef.current = element;
    setContainerElement(element);
  }, []);

  const registerLink = useCallback((targetId: string) => {
    const counts = linkCountsRef.current;
    const current = counts.get(targetId) ?? 0;
    counts.set(targetId, current + 1);
    if (current === 0) {
      setLinksVersion((version) => version + 1);
    }
    return () => {
      const next = (counts.get(targetId) ?? 1) - 1;
      if (next > 0) {
        counts.set(targetId, next);
        return;
      }
      counts.delete(targetId);
      setLinksVersion((version) => version + 1);
    };
  }, []);

  const requestScroll = useCallback((targetId: string, smooth: boolean) => {
    const container = containerElementRef.current;
    if (!container) {
      return;
    }
    const section = container.querySelector(`[id="${CSS.escape(targetId)}"]`);
    if (!section) {
      return;
    }
    const rootIsWindow = getComputedStyle(container).overflowY === 'visible';
    const scrollRoot: HTMLElement | Window = rootIsWindow ? window : container;
    const containerRect = container.getBoundingClientRect();
    const sectionRect = section.getBoundingClientRect();
    const top = rootIsWindow
      ? sectionRect.top + window.scrollY
      : sectionRect.top - containerRect.top + container.scrollTop;
    scrollRoot.scrollTo({ behavior: smooth ? 'smooth' : 'auto', top });
  }, []);

  const contextValue = useMemo<ScrollSpyContextValue>(
    () => ({
      activeId: currentActiveId,
      registerContainer,
      registerLink,
      requestScroll,
      smoothScroll,
    }),
    [currentActiveId, registerContainer, registerLink, requestScroll, smoothScroll],
  );

  useEffect(() => {
    const container = containerElement;
    if (!container) {
      return;
    }

    const targetElement = target ? document.querySelector<HTMLElement>(target) : null;

    const sections = new Map<string, HTMLElement>();
    const domLinks = new Map<string, HTMLElement[]>();

    const addSection = (targetId: string): boolean => {
      if (sections.has(targetId)) {
        return true;
      }
      const section = container.querySelector<HTMLElement>(`[id="${CSS.escape(targetId)}"]`);
      if (!section || !isVisible(section)) {
        return false;
      }
      sections.set(targetId, section);
      return true;
    };

    for (const targetId of linkCountsRef.current.keys()) {
      addSection(targetId);
    }

    if (targetElement) {
      for (const anchor of targetElement.querySelectorAll<HTMLElement>('[href]')) {
        const href = anchor.getAttribute('href');
        if (!href) {
          continue;
        }
        const targetId = getHashTargetId(href);
        if (!targetId || isDisabled(anchor) || !addSection(targetId)) {
          continue;
        }
        const entries = domLinks.get(targetId) ?? [];
        entries.push(anchor);
        domLinks.set(targetId, entries);
      }
    }

    if (sections.size === 0) {
      return;
    }

    const { bottom: bottomMargin, top: topMargin } = parseRootMargin(rootMargin);

    const rootIsWindow = getComputedStyle(container).overflowY === 'visible';
    const scrollRoot: HTMLElement | Window = rootIsWindow ? window : container;

    const resolveMargin = (margin: RootMarginValue, size: number): number =>
      margin.unit === '%' ? (margin.value / 100) * size : margin.value;

    const getRootHeight = (): number =>
      rootIsWindow ? window.innerHeight : container.clientHeight;

    const getScrollTop = (): number => (rootIsWindow ? window.scrollY : container.scrollTop);

    const getMaxScroll = (): number =>
      Math.max(
        0,
        rootIsWindow
          ? document.documentElement.scrollHeight - window.innerHeight
          : container.scrollHeight - container.clientHeight,
      );

    const isAtTop = (): boolean => getScrollTop() === 0;

    const isAtBottom = (): boolean =>
      getScrollTop() + getRootHeight() >=
      (rootIsWindow ? document.documentElement.scrollHeight : container.scrollHeight) - 1;

    const lastId: null | string = Array.from(sections.keys()).at(-1) ?? null;

    interface SectionState {
      height: number;
      measured: boolean;
      offsetTop: number;
    }

    const states = new Map<string, SectionState>();
    for (const id of sections.keys()) {
      states.set(id, { height: 0, measured: false, offsetTop: 0 });
    }

    const measureSection = (state: SectionState, section: HTMLElement): void => {
      const scrollTop = getScrollTop();
      const containerTop = rootIsWindow ? 0 : container.getBoundingClientRect().top;
      const rect = section.getBoundingClientRect();
      state.height = rect.height;
      state.offsetTop = rect.top - containerTop + scrollTop;
      state.measured = true;
    };

    const getLine = (offsets: number[], scrollTop: number): number => {
      const rootHeight = getRootHeight();
      const base = resolveMargin(topMargin, rootHeight);
      const maxScroll = getMaxScroll();
      if (maxScroll <= 1 || offsets.length === 0) {
        return scrollTop + base;
      }
      let sweepStart = 0;
      for (const offset of offsets) {
        if (offset < maxScroll) {
          sweepStart = offset;
        } else {
          break;
        }
      }
      const lastOffset = offsets.at(-1) ?? 0;
      const target = Math.max(base, lastOffset - maxScroll);
      if (target <= base || maxScroll <= sweepStart) {
        return scrollTop + base;
      }
      const progress = clamp((scrollTop - sweepStart) / (maxScroll - sweepStart), 0, 1);
      return scrollTop + base + progress * (target - base);
    };

    const clearDomActive = () => {
      if (!targetElement) {
        return;
      }
      targetElement.classList.remove('active');
      for (const link of targetElement.querySelectorAll<HTMLElement>('[href].active')) {
        link.classList.remove('active');
      }
    };

    let activeTargetId = activeIdRef.current;

    const getActiveId = (): null | string => {
      if (isAtBottom() && lastId !== null) {
        return lastId;
      }
      const scrollTop = getScrollTop();
      const sectionRects: ScrollSpySectionRect[] = [];
      for (const [id, state] of states) {
        if (!state.measured) {
          measureSection(state, sections.get(id) as HTMLElement);
        }
        sectionRects.push({ height: state.height, id, top: state.offsetTop });
      }
      const rootHeight = getRootHeight();
      return computeActiveId(sectionRects, {
        atTop: isAtTop(),
        bandBottom: scrollTop + rootHeight + resolveMargin(bottomMargin, rootHeight),
        bandTop: scrollTop,
        enterThreshold,
        line: getLine(
          sectionRects.map((rect) => rect.top),
          scrollTop,
        ),
      });
    };

    const handlePositionChange = () => {
      const nextId = getActiveId();
      if (nextId === activeTargetId) {
        return;
      }
      if (nextId === null) {
        activeTargetId = null;
        clearDomActive();
        handleActivate(null, null);
        return;
      }
      activeTargetId = nextId;
      clearDomActive();
      for (const link of domLinks.get(nextId) ?? []) {
        link.classList.add('active');
      }
      handleActivate(nextId, domLinks.get(nextId)?.[0] ?? null);
    };

    const invalidateMeasurements = () => {
      for (const state of states.values()) {
        state.measured = false;
      }
    };

    const observer = new IntersectionObserver(
      (entries) => {
        const scrollTop = getScrollTop();
        for (const entry of entries) {
          const state = states.get(entry.target.id);
          if (!state) {
            continue;
          }
          const viewportTop = rootIsWindow
            ? 0
            : (entry.rootBounds?.top ?? container.getBoundingClientRect().top);
          state.height = entry.boundingClientRect.height;
          state.offsetTop = entry.boundingClientRect.top - viewportTop + scrollTop;
          state.measured = true;
        }
        handlePositionChange();
      },
      { root: rootIsWindow ? null : container, rootMargin, threshold: 0 },
    );

    scrollRoot.addEventListener('scroll', handlePositionChange, { passive: true });
    window.addEventListener('resize', handlePositionChange);
    const resizeObserver = new ResizeObserver(() => {
      invalidateMeasurements();
      handlePositionChange();
    });
    resizeObserver.observe(container);
    for (const section of sections.values()) {
      observer.observe(section);
      resizeObserver.observe(section);
    }
    handlePositionChange();

    return () => {
      observer.disconnect();
      resizeObserver.disconnect();
      scrollRoot.removeEventListener('scroll', handlePositionChange);
      window.removeEventListener('resize', handlePositionChange);
    };
  }, [containerElement, enterThreshold, handleActivate, linksVersion, rootMargin, target]);

  return <ScrollSpyContext.Provider value={contextValue}>{children}</ScrollSpyContext.Provider>;
};

ScrollSpy.displayName = 'ScrollSpy';

export default ScrollSpy;
