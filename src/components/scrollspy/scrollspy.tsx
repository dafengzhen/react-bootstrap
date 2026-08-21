import { type FC, useCallback, useEffect, useMemo, useRef, useState } from 'react';

import type { ScrollSpyContextValue, ScrollSpyProps } from './types';

import { ScrollSpyContext } from './context';
import {
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

interface ProgrammaticScrollState {
  startedAt: number;
  targetId: string;
  targetTop: number;
}

type ScrollFinishReason = 'settled' | 'user';

const SCROLL_END_TOLERANCE = 2;

const MAX_PROGRAMMATIC_SCROLL_DURATION = 2000;

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

  const programmaticScrollRef = useRef<null | ProgrammaticScrollState>(null);

  const scrollAnimationFrameRef = useRef<null | number>(null);

  const scrollEndCleanupRef = useRef<(() => void) | null>(null);

  const recomputeRef = useRef<
    ((navigation: null | ProgrammaticScrollState, reason: ScrollFinishReason) => void) | null
  >(null);

  const pinnedTargetRef = useRef<{ scrollTop: number; targetId: string } | null>(null);

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

    activeIdRef.current = nextId;

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

  const cancelProgrammaticScrollWatcher = useCallback(() => {
    if (scrollAnimationFrameRef.current !== null) {
      cancelAnimationFrame(scrollAnimationFrameRef.current);

      scrollAnimationFrameRef.current = null;
    }

    scrollEndCleanupRef.current?.();
    scrollEndCleanupRef.current = null;
  }, []);

  const clearProgrammaticScroll = useCallback(() => {
    programmaticScrollRef.current = null;

    cancelProgrammaticScrollWatcher();
  }, [cancelProgrammaticScrollWatcher]);

  const startProgrammaticScroll = useCallback(
    (targetId: string, targetTop: number, behavior: 'auto' | 'none' | 'smooth') => {
      const container = containerElementRef.current;

      if (!container) {
        return;
      }

      const rootIsWindow = getComputedStyle(container).overflowY === 'visible';

      const scrollRoot: HTMLElement | Window = rootIsWindow ? window : container;

      pinnedTargetRef.current = null;

      clearProgrammaticScroll();

      handleActivate(targetId, null);

      programmaticScrollRef.current = {
        startedAt: performance.now(),
        targetId,
        targetTop,
      };

      const getScrollTop = (): number => (rootIsWindow ? window.scrollY : container.scrollTop);

      const finish = (reason: ScrollFinishReason) => {
        if (programmaticScrollRef.current?.targetId !== targetId) {
          return;
        }

        const navigation = programmaticScrollRef.current;

        clearProgrammaticScroll();

        recomputeRef.current?.(navigation, reason);
      };

      const removers: Array<() => void> = [];

      if ('onscrollend' in window) {
        const handleScrollEnd = () => {
          finish('settled');
        };

        scrollRoot.addEventListener('scrollend', handleScrollEnd as EventListener, { once: false });

        removers.push(() => {
          scrollRoot.removeEventListener('scrollend', handleScrollEnd as EventListener);
        });
      }

      const releaseOnUserInput = () => {
        finish('user');
      };

      for (const type of ['wheel', 'touchstart', 'keydown'] as const) {
        scrollRoot.addEventListener(type, releaseOnUserInput as EventListener, { passive: true });

        removers.push(() => {
          scrollRoot.removeEventListener(type, releaseOnUserInput as EventListener);
        });
      }

      scrollEndCleanupRef.current = () => {
        for (const remove of removers) {
          remove();
        }
      };

      let lastTop = getScrollTop();
      let hasMoved = false;
      let stallFrames = 0;
      let idleFrames = 0;

      const check = () => {
        const navigation = programmaticScrollRef.current;

        if (!navigation || navigation.targetId !== targetId) {
          return;
        }

        const currentTop = getScrollTop();

        const reached = Math.abs(currentTop - navigation.targetTop) <= SCROLL_END_TOLERANCE;

        const timedOut =
          performance.now() - navigation.startedAt >= MAX_PROGRAMMATIC_SCROLL_DURATION;

        if (reached || timedOut) {
          finish('settled');
          return;
        }

        if (Math.abs(currentTop - lastTop) > 0.5) {
          hasMoved = true;
          stallFrames = 0;
          idleFrames = 0;
        } else {
          idleFrames += 1;

          if (hasMoved) {
            stallFrames += 1;

            if (stallFrames >= 2) {
              finish('settled');
              return;
            }
          } else if (idleFrames >= 4) {
            finish('settled');
            return;
          }
        }

        lastTop = currentTop;

        scrollAnimationFrameRef.current = requestAnimationFrame(check);
      };

      if (behavior !== 'none') {
        scrollRoot.scrollTo({
          behavior,
          top: targetTop,
        });
      }

      scrollAnimationFrameRef.current = requestAnimationFrame(check);
    },
    [clearProgrammaticScroll, handleActivate],
  );

  const requestScroll = useCallback(
    (targetId: string, smooth: boolean) => {
      const container = containerElementRef.current;

      if (!container) {
        return;
      }

      const section = container.querySelector<HTMLElement>(`[id="${CSS.escape(targetId)}"]`);

      if (!section) {
        return;
      }

      const rootIsWindow = getComputedStyle(container).overflowY === 'visible';

      const containerRect = container.getBoundingClientRect();

      const sectionRect = section.getBoundingClientRect();

      const rawTargetTop = rootIsWindow
        ? sectionRect.top + window.scrollY
        : sectionRect.top - containerRect.top + container.scrollTop;

      const targetTop = Math.ceil(rawTargetTop);

      startProgrammaticScroll(targetId, targetTop, smooth ? 'smooth' : 'auto');
    },
    [startProgrammaticScroll],
  );

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

    const { bottom: bottomMargin } = parseRootMargin(rootMargin);

    const rootIsWindow = getComputedStyle(container).overflowY === 'visible';

    const scrollRoot: HTMLElement | Window = rootIsWindow ? window : container;

    const resolveMargin = (margin: RootMarginValue, size: number): number =>
      margin.unit === '%' ? (margin.value / 100) * size : margin.value;

    const getRootHeight = (): number =>
      rootIsWindow ? window.innerHeight : container.clientHeight;

    const getScrollTop = (): number => (rootIsWindow ? window.scrollY : container.scrollTop);

    const isAtTop = (): boolean => getScrollTop() <= 0;

    const isAtBottom = (): boolean => {
      const scrollTop = getScrollTop();

      const viewportHeight = getRootHeight();

      const scrollHeight = rootIsWindow
        ? document.documentElement.scrollHeight
        : container.scrollHeight;

      const maxScroll = Math.max(0, scrollHeight - viewportHeight);

      return maxScroll - scrollTop <= 0.5;
    };

    const handleTargetNavClick = (event: Event) => {
      const mouseEvent = event as MouseEvent;

      if (
        mouseEvent.defaultPrevented ||
        mouseEvent.button !== 0 ||
        mouseEvent.metaKey ||
        mouseEvent.ctrlKey ||
        mouseEvent.shiftKey ||
        mouseEvent.altKey
      ) {
        return;
      }

      const anchor = (mouseEvent.target as Element | null)?.closest<HTMLElement>('[href]');

      if (!anchor || !targetElement?.contains(anchor)) {
        return;
      }

      const targetId = getHashTargetId(anchor.getAttribute('href') ?? '');

      if (!targetId || isDisabled(anchor)) {
        return;
      }

      const section = sections.get(targetId);

      if (!section) {
        return;
      }

      const sectionTop = rootIsWindow
        ? section.getBoundingClientRect().top + getScrollTop()
        : section.getBoundingClientRect().top -
          container.getBoundingClientRect().top +
          getScrollTop();

      startProgrammaticScroll(targetId, Math.ceil(sectionTop), 'none');
    };

    interface SectionState {
      height: number;
      measured: boolean;
      offsetTop: number;
    }

    const states = new Map<string, SectionState>();

    for (const id of sections.keys()) {
      states.set(id, {
        height: 0,
        measured: false,
        offsetTop: 0,
      });
    }

    const measureSection = (state: SectionState, section: HTMLElement): void => {
      const scrollTop = getScrollTop();

      const containerTop = rootIsWindow ? 0 : container.getBoundingClientRect().top;

      const rect = section.getBoundingClientRect();

      state.height = rect.height;

      state.offsetTop = rect.top - containerTop + scrollTop;

      state.measured = true;
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

    const getSectionRects = (): ScrollSpySectionRect[] => {
      const rects: ScrollSpySectionRect[] = [];

      for (const [id, state] of states) {
        if (!state.measured) {
          const section = sections.get(id);

          if (!section) {
            continue;
          }

          measureSection(state, section);
        }

        rects.push({
          height: state.height,
          id,
          top: state.offsetTop,
        });
      }

      rects.sort((a, b) => a.top - b.top);

      return rects;
    };

    const getActiveId = (): null | string => {
      const scrollTop = getScrollTop();

      const sectionRects = getSectionRects();

      if (sectionRects.length === 0) {
        return null;
      }

      const rootHeight = getRootHeight();

      const bandBottom = scrollTop + rootHeight + resolveMargin(bottomMargin, rootHeight);

      const pinned = pinnedTargetRef.current;

      if (pinned) {
        const pinnedState = states.get(pinned.targetId);

        if (
          Math.abs(scrollTop - pinned.scrollTop) <= 2 &&
          pinnedState !== undefined &&
          pinnedState.offsetTop < bandBottom &&
          pinnedState.offsetTop + pinnedState.height > scrollTop
        ) {
          return pinned.targetId;
        }

        pinnedTargetRef.current = null;
      }

      if (isAtBottom()) {
        return sectionRects.at(-1)?.id ?? null;
      }

      return computeActiveId(sectionRects, {
        atTop: isAtTop(),

        bandBottom,

        bandTop: scrollTop,

        enterThreshold,
      });
    };

    const applyActive = (nextId: null | string) => {
      if (nextId === activeTargetId) {
        return;
      }

      activeTargetId = nextId;

      if (nextId === null) {
        clearDomActive();

        handleActivate(null, null);

        return;
      }

      clearDomActive();

      const links = domLinks.get(nextId) ?? [];

      for (const link of links) {
        link.classList.add('active');
      }

      handleActivate(nextId, links[0] ?? null);
    };

    const handlePositionChange = () => {
      const navigation = programmaticScrollRef.current;

      if (navigation) {
        return;
      }

      applyActive(getActiveId());
    };

    recomputeRef.current = (navigation, reason) => {
      const activeByPosition = getActiveId();

      if (reason === 'user') {
        pinnedTargetRef.current = null;
        applyActive(activeByPosition);
        return;
      }

      if (navigation === null || activeByPosition === navigation.targetId) {
        applyActive(activeByPosition);
        return;
      }

      const state = states.get(navigation.targetId);

      const scrollTop = getScrollTop();

      const bandBottom = scrollTop + getRootHeight() + resolveMargin(bottomMargin, getRootHeight());

      const headingVisibleInBand =
        state !== undefined &&
        state.offsetTop < bandBottom &&
        state.offsetTop + state.height > scrollTop;

      const clampedAtBottom = isAtBottom() && navigation.targetTop > scrollTop;

      if (clampedAtBottom && headingVisibleInBand) {
        pinnedTargetRef.current = {
          scrollTop,
          targetId: navigation.targetId,
        };

        applyActive(navigation.targetId);
        return;
      }

      applyActive(activeByPosition);
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
      {
        root: rootIsWindow ? null : container,
        rootMargin,
        threshold: 0,
      },
    );

    scrollRoot.addEventListener('scroll', handlePositionChange, {
      passive: true,
    });

    targetElement?.addEventListener('click', handleTargetNavClick);

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

      targetElement?.removeEventListener('click', handleTargetNavClick);

      window.removeEventListener('resize', handlePositionChange);

      recomputeRef.current = null;
    };
  }, [
    containerElement,
    enterThreshold,
    handleActivate,
    linksVersion,
    rootMargin,
    startProgrammaticScroll,
    target,
  ]);

  useEffect(() => {
    return () => {
      if (scrollAnimationFrameRef.current !== null) {
        cancelAnimationFrame(scrollAnimationFrameRef.current);
      }

      scrollEndCleanupRef.current?.();

      scrollAnimationFrameRef.current = null;

      scrollEndCleanupRef.current = null;

      programmaticScrollRef.current = null;
    };
  }, []);

  return <ScrollSpyContext.Provider value={contextValue}>{children}</ScrollSpyContext.Provider>;
};

ScrollSpy.displayName = 'ScrollSpy';

export default ScrollSpy;
