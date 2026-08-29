import clsx from 'clsx';
import {
  ChevronLeft,
  ChevronRight,
  Download,
  type LucideIcon,
  Maximize,
  Minimize,
  Ratio,
  RotateCcw,
  RotateCw,
  X,
  ZoomIn,
  ZoomOut,
} from 'lucide-react';
import {
  type CSSProperties,
  forwardRef,
  type MouseEvent as ReactMouseEvent,
  type PointerEvent as ReactPointerEvent,
  type SyntheticEvent,
  useCallback,
  useEffect,
  useMemo,
  useReducer,
  useRef,
  useState,
} from 'react';
import { createPortal } from 'react-dom';

import type {
  ImageViewerContextValue,
  ImageViewerImage,
  ImageViewerProps,
  ImageViewerRotation,
  ImageViewerToolbarKey,
} from './types';

import { useReducedMotion } from '../../hooks';
import { transitionReducer } from '../../stores';
import { getFocusableElements, lockBodyScroll, unlockBodyScroll } from '../../utils';
import { Spinner } from '../spinner';
import { ImageViewerContext } from './image-viewer-context';
import styles from './image-viewer.module.css';

const DEFAULT_DURATION = 200;
const TRANSITION_END_BUFFER = 50;
const DEFAULT_MIN_ZOOM = 0.5;
const DEFAULT_MAX_ZOOM = 10;
const DEFAULT_ZOOM_STEP = 0.25;
const CLICK_DRAG_THRESHOLD = 5;
const EMPTY_IMAGE: ImageViewerImage = { src: '' };

// oxlint-disable-next-line perf/sort-arrays
const DEFAULT_TOOLBAR: ImageViewerToolbarKey[] = [
  'zoomIn',
  'zoomOut',
  'rotateLeft',
  'rotateRight',
  'reset',
  'download',
  'fullscreen',
  'close',
];

interface ToolbarItem {
  action: () => void;
  disabled: boolean;
  label: string;
}

interface ViewerState {
  rotation: ImageViewerRotation;
  scale: number;
  x: number;
  y: number;
}

const ICONS: Record<
  'chevronLeft' | 'chevronRight' | 'fullscreenExit' | ImageViewerToolbarKey,
  LucideIcon
> = {
  chevronLeft: ChevronLeft,
  chevronRight: ChevronRight,
  close: X,
  download: Download,
  fullscreen: Maximize,
  fullscreenExit: Minimize,
  reset: Ratio,
  rotateLeft: RotateCcw,
  rotateRight: RotateCw,
  zoomIn: ZoomIn,
  zoomOut: ZoomOut,
};

const clamp = (value: number, min: number, max: number): number =>
  Math.min(max, Math.max(min, value));

export const ImageViewer = forwardRef<HTMLDialogElement, ImageViewerProps>(
  (
    {
      'aria-label': ariaLabel = 'Image viewer',
      backdrop = true,
      children,
      className,
      defaultIndex = 0,
      defaultOpen = false,
      duration = DEFAULT_DURATION,
      images,
      index,
      keyboard = true,
      loop = false,
      maxZoom = DEFAULT_MAX_ZOOM,
      minZoom = DEFAULT_MIN_ZOOM,
      onImageError,
      onIndexChange,
      onOpenChange,
      open,
      showCounter,
      showNav,
      showThumbnails,
      style,
      toolbar = true,
      zoomable = true,
      zoomStep = DEFAULT_ZOOM_STEP,
      ...restProps
    },
    ref,
  ) => {
    const items = useMemo<ImageViewerImage[]>(
      () => images.map((image) => (typeof image === 'string' ? { src: image } : image)),
      [images],
    );

    const initialOpen = open ?? defaultOpen;
    const [state, dispatch] = useReducer(transitionReducer, {
      mounted: initialOpen,
      status: initialOpen ? 'opened' : 'closed',
    });

    const [internalOpen, setInternalOpen] = useState(defaultOpen);
    const isOpen = open ?? internalOpen;

    const [internalIndex, setInternalIndex] = useState(() =>
      clamp(defaultIndex, 0, Math.max(0, items.length - 1)),
    );
    const currentIndex = index ?? internalIndex;
    const safeIndex = items.length === 0 ? 0 : clamp(currentIndex, 0, items.length - 1);

    const [scale, setScaleState] = useState(1);
    const [rotation, setRotationState] = useState<ImageViewerRotation>(0);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [imageStatus, setImageStatus] = useState<'error' | 'loaded' | 'loading'>('loading');
    const [loadedKey, setLoadedKey] = useState<null | string>(null);

    const rafRef = useRef<null | number>(null);
    const dragDistanceRef = useRef(0);
    const imageRef = useRef<HTMLImageElement>(null);
    const panStartRef = useRef<{ pointerId: number; x: number; y: number } | null>(null);
    const pointerDownOnStageRef = useRef(false);
    const pointerStartRef = useRef<{ pointerId: number; x: number; y: number } | null>(null);
    const previousActiveElementRef = useRef<HTMLElement | null>(null);
    const rootRef = useRef<HTMLDialogElement>(null);
    const stageRef = useRef<HTMLDivElement>(null);
    const thumbnailsRef = useRef<HTMLDivElement>(null);
    const transitionTimeoutRef = useRef<null | number>(null);
    const viewRef = useRef<ViewerState>({ rotation: 0, scale: 1, x: 0, y: 0 });

    const reducedMotion = useReducedMotion();
    const effectiveDuration = reducedMotion ? 0 : duration;
    const isVisible = state.status === 'opening' || state.status === 'opened';

    const currentImage = items[safeIndex] ?? EMPTY_IMAGE;
    const resolvedShowCounter = showCounter ?? items.length > 1;
    const resolvedShowNav = showNav ?? items.length > 1;
    const resolvedShowThumbnails = showThumbnails ?? items.length > 1;

    const imageKey = `${safeIndex}-${currentImage.src}`;
    if (loadedKey !== imageKey) {
      setLoadedKey(imageKey);
      if (loadedKey !== null) {
        setImageStatus('loading');
        setScaleState(1);
        setRotationState(0);
      }
    }

    const fullscreenSupported = typeof document !== 'undefined' && document.fullscreenEnabled;

    const applyTransform = useCallback(() => {
      const image = imageRef.current;
      if (!image) {
        return;
      }
      const current = viewRef.current;
      image.style.transform = `translate3d(${current.x}px, ${current.y}px, 0) rotate(${current.rotation}deg) scale(${current.scale})`;
    }, []);

    const getPanBounds = useCallback(
      (currentScale: number, currentRotation: ImageViewerRotation) => {
        const stage = stageRef.current;
        const image = imageRef.current;
        if (!stage || !image || !image.naturalWidth || !image.naturalHeight) {
          return null;
        }
        const swapped = currentRotation === 90 || currentRotation === 270;
        const width = (swapped ? image.naturalHeight : image.naturalWidth) * currentScale;
        const height = (swapped ? image.naturalWidth : image.naturalHeight) * currentScale;
        return {
          x: Math.max(0, (width - stage.clientWidth) / 2),
          y: Math.max(0, (height - stage.clientHeight) / 2),
        };
      },
      [],
    );

    const clampScale = useCallback(
      (value: number) => clamp(value, minZoom, maxZoom),
      [maxZoom, minZoom],
    );

    const handleClose = useCallback(() => {
      if (state.status === 'closing' || state.status === 'closed') {
        return;
      }
      onOpenChange?.(false);
      if (open === undefined) {
        setInternalOpen(false);
      }
    }, [onOpenChange, open, state.status]);

    const changeIndex = useCallback(
      (nextIndex: number) => {
        const count = items.length;
        if (count === 0) {
          return;
        }
        const clampedIndex = clamp(nextIndex, 0, count - 1);
        onIndexChange?.(clampedIndex);
        if (index === undefined) {
          setInternalIndex(clampedIndex);
        }
      },
      [index, items.length, onIndexChange],
    );

    const next = useCallback(() => {
      const count = items.length;
      if (count === 0) {
        return;
      }
      changeIndex(loop ? (safeIndex + 1) % count : safeIndex + 1);
    }, [changeIndex, items.length, loop, safeIndex]);

    const previous = useCallback(() => {
      const count = items.length;
      if (count === 0) {
        return;
      }
      changeIndex(loop ? (safeIndex - 1 + count) % count : safeIndex - 1);
    }, [changeIndex, items.length, loop, safeIndex]);

    const resetTransform = useCallback(() => {
      setScaleState(1);
      setRotationState(0);
      viewRef.current.x = 0;
      viewRef.current.y = 0;
    }, []);

    const zoomTo = useCallback(
      (nextScale: number) => {
        if (!zoomable) {
          return;
        }
        const clampedScale = Math.round(clampScale(nextScale) * 1000) / 1000;
        if (clampedScale <= 1) {
          viewRef.current.x = 0;
          viewRef.current.y = 0;
        }
        setScaleState(clampedScale);
      },
      [clampScale, zoomable],
    );

    const zoomIn = useCallback(() => {
      zoomTo(viewRef.current.scale + zoomStep);
    }, [zoomStep, zoomTo]);

    const zoomOut = useCallback(() => {
      zoomTo(viewRef.current.scale - zoomStep);
    }, [zoomStep, zoomTo]);

    const rotateLeft = useCallback(() => {
      setRotationState(((viewRef.current.rotation + 270) % 360) as ImageViewerRotation);
    }, []);

    const rotateRight = useCallback(() => {
      setRotationState(((viewRef.current.rotation + 90) % 360) as ImageViewerRotation);
    }, []);

    const download = useCallback(() => {
      if (typeof document === 'undefined') {
        return;
      }
      const image = items[safeIndex];
      if (!image) {
        return;
      }
      const anchor = document.createElement('a');
      anchor.download = image.name ?? '';
      anchor.href = image.src;
      anchor.rel = 'noopener';
      anchor.style.display = 'none';
      document.body.append(anchor);
      anchor.click();
      anchor.remove();
    }, [items, safeIndex]);

    const toggleFullscreen = useCallback(() => {
      const root = rootRef.current;
      if (!root || typeof document === 'undefined') {
        return;
      }
      if (document.fullscreenElement === root) {
        void document.exitFullscreen().catch(() => {});
      } else if (document.fullscreenEnabled) {
        void root.requestFullscreen().catch(() => {});
      }
    }, []);

    const contextValue = useMemo<ImageViewerContextValue>(
      () => ({
        close: handleClose,
        currentImage,
        currentIndex: safeIndex,
        download,
        imageCount: items.length,
        isFullscreen,
        next,
        previous,
        reset: resetTransform,
        rotateLeft,
        rotateRight,
        rotation,
        scale,
        setIndex: changeIndex,
        toggleFullscreen,
        zoomIn,
        zoomOut,
      }),
      [
        changeIndex,
        currentImage,
        download,
        handleClose,
        isFullscreen,
        items.length,
        next,
        previous,
        resetTransform,
        rotateLeft,
        rotateRight,
        rotation,
        safeIndex,
        scale,
        toggleFullscreen,
        zoomIn,
        zoomOut,
      ],
    );

    const toolbarKeys = useMemo(() => {
      if (toolbar === false) {
        return [];
      }
      if (Array.isArray(toolbar)) {
        return toolbar;
      }
      return DEFAULT_TOOLBAR;
    }, [toolbar]);

    const toolbarItems = useMemo<Record<ImageViewerToolbarKey, ToolbarItem>>(
      () => ({
        close: { action: handleClose, disabled: false, label: 'Close' },
        download: { action: download, disabled: items.length === 0, label: 'Download image' },
        fullscreen: {
          action: toggleFullscreen,
          disabled: !fullscreenSupported,
          label: isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen',
        },
        reset: { action: resetTransform, disabled: false, label: 'Reset zoom and rotation' },
        rotateLeft: { action: rotateLeft, disabled: false, label: 'Rotate left' },
        rotateRight: { action: rotateRight, disabled: false, label: 'Rotate right' },
        zoomIn: { action: zoomIn, disabled: !zoomable, label: 'Zoom in' },
        zoomOut: { action: zoomOut, disabled: !zoomable, label: 'Zoom out' },
      }),
      [
        download,
        fullscreenSupported,
        handleClose,
        isFullscreen,
        items.length,
        resetTransform,
        rotateLeft,
        rotateRight,
        toggleFullscreen,
        zoomIn,
        zoomOut,
        zoomable,
      ],
    );

    const clearAnimationFrame = useCallback(() => {
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
    }, []);

    const clearTransitionTimeout = useCallback(() => {
      if (transitionTimeoutRef.current !== null) {
        clearTimeout(transitionTimeoutRef.current);
        transitionTimeoutRef.current = null;
      }
    }, []);

    const scheduleOpenAnimation = useCallback(() => {
      clearAnimationFrame();
      clearTransitionTimeout();
      rafRef.current = requestAnimationFrame(() => {
        rafRef.current = requestAnimationFrame(() => {
          dispatch({ type: 'ANIMATION_START' });
          rafRef.current = null;
        });
      });
    }, [clearAnimationFrame, clearTransitionTimeout]);

    const scheduleTransitionSafety = useCallback(() => {
      clearTransitionTimeout();
      if (effectiveDuration === 0) {
        return;
      }
      transitionTimeoutRef.current = window.setTimeout(() => {
        if (state.status === 'opening' || state.status === 'closing') {
          dispatch({ type: 'ANIMATION_END' });
        }
        transitionTimeoutRef.current = null;
      }, effectiveDuration + TRANSITION_END_BUFFER);
    }, [clearTransitionTimeout, effectiveDuration, state.status]);

    useEffect(() => {
      if (isOpen) {
        dispatch({ type: 'OPEN' });
      } else {
        dispatch({ type: 'CLOSE' });
      }
    }, [isOpen]);

    useEffect(() => {
      if (state.status === 'closed' && state.mounted) {
        if (effectiveDuration === 0) {
          dispatch({ type: 'INSTANT_OPEN' });
        } else {
          scheduleOpenAnimation();
        }
      } else if (state.status === 'closing' && effectiveDuration === 0) {
        dispatch({ type: 'ANIMATION_END' });
      } else if (state.status === 'opening' && effectiveDuration === 0) {
        dispatch({ type: 'ANIMATION_END' });
      }

      if (state.status === 'opening' || state.status === 'closing') {
        scheduleTransitionSafety();
      } else {
        clearTransitionTimeout();
      }
    }, [
      clearTransitionTimeout,
      effectiveDuration,
      scheduleOpenAnimation,
      scheduleTransitionSafety,
      state.mounted,
      state.status,
    ]);

    useEffect(() => {
      return () => {
        clearAnimationFrame();
        clearTransitionTimeout();
      };
    }, [clearAnimationFrame, clearTransitionTimeout]);

    useEffect(() => {
      viewRef.current.scale = scale;
      viewRef.current.rotation = rotation;
      if (scale <= 1) {
        viewRef.current.x = 0;
        viewRef.current.y = 0;
      } else {
        const bounds = getPanBounds(scale, rotation);
        if (bounds) {
          viewRef.current.x = clamp(viewRef.current.x, -bounds.x, bounds.x);
          viewRef.current.y = clamp(viewRef.current.y, -bounds.y, bounds.y);
        }
      }
      applyTransform();
    }, [applyTransform, getPanBounds, rotation, scale]);

    useEffect(() => {
      const container = thumbnailsRef.current;
      if (!container) {
        return;
      }
      const active = container.querySelector(`[data-image-index="${safeIndex}"]`);
      active?.scrollIntoView({
        behavior: reducedMotion ? 'auto' : 'smooth',
        block: 'nearest',
        inline: 'center',
      });
    }, [reducedMotion, safeIndex]);

    useEffect(() => {
      if (typeof document === 'undefined') {
        return;
      }
      const handleFullscreenChange = () => {
        setIsFullscreen(document.fullscreenElement === rootRef.current);
      };
      document.addEventListener('fullscreenchange', handleFullscreenChange);
      return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
    }, []);

    const restorePreviousFocus = useCallback(() => {
      previousActiveElementRef.current?.focus?.();
      previousActiveElementRef.current = null;
    }, []);

    useEffect(() => {
      if (state.mounted && !previousActiveElementRef.current) {
        previousActiveElementRef.current = document.activeElement as HTMLElement | null;
      }

      if (!state.mounted) {
        restorePreviousFocus();
      }
    }, [restorePreviousFocus, state.mounted]);

    useEffect(() => restorePreviousFocus, [restorePreviousFocus]);

    useEffect(() => {
      if (!state.mounted || !keyboard) {
        return;
      }
      const handleKeyDown = (event: KeyboardEvent) => {
        switch (event.key) {
          case '-':
            zoomOut();
            break;
          case '+':
            zoomIn();
            break;
          case '=':
            zoomIn();
            break;
          case '0':
            resetTransform();
            break;
          case 'ArrowLeft':
            previous();
            break;
          case 'ArrowRight':
            next();
            break;
          case 'Escape':
            handleClose();
            break;
          case 'r':
            rotateRight();
            break;
          case 'R':
            rotateRight();
            break;
          default:
            break;
        }
      };
      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }, [
      handleClose,
      keyboard,
      next,
      previous,
      resetTransform,
      rotateRight,
      state.mounted,
      zoomIn,
      zoomOut,
    ]);

    useEffect(() => {
      if (!state.mounted || !isVisible) {
        return;
      }
      const container = rootRef.current;
      if (!container) {
        return;
      }

      container.focus();

      const handleTabKey = (event: KeyboardEvent) => {
        if (event.key !== 'Tab') {
          return;
        }
        const focusable = getFocusableElements(container);
        if (focusable.length === 0) {
          return;
        }
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (event.shiftKey) {
          if (document.activeElement === first) {
            event.preventDefault();
            last.focus();
          }
        } else if (document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      };

      document.addEventListener('keydown', handleTabKey);
      return () => document.removeEventListener('keydown', handleTabKey);
    }, [isVisible, state.mounted]);

    useEffect(() => {
      if (!state.mounted) {
        return;
      }
      lockBodyScroll();
      return () => {
        unlockBodyScroll();
      };
    }, [state.mounted]);

    useEffect(() => {
      if (!state.mounted || !zoomable) {
        return;
      }
      const stage = stageRef.current;
      if (!stage) {
        return;
      }
      const handleWheel = (event: WheelEvent) => {
        event.preventDefault();
        zoomTo(viewRef.current.scale + (event.deltaY < 0 ? zoomStep : -zoomStep));
      };
      stage.addEventListener('wheel', handleWheel, { passive: false });
      return () => stage.removeEventListener('wheel', handleWheel);
    }, [state.mounted, zoomStep, zoomTo, zoomable]);

    const handleStageClick = useCallback(
      (event: ReactMouseEvent<HTMLDivElement>) => {
        if (backdrop === 'static') {
          return;
        }
        if (!pointerDownOnStageRef.current || event.target !== event.currentTarget) {
          return;
        }
        if (dragDistanceRef.current > CLICK_DRAG_THRESHOLD) {
          return;
        }
        handleClose();
      },
      [backdrop, handleClose],
    );

    const handlePointerDown = useCallback((event: ReactPointerEvent<HTMLDivElement>) => {
      event.currentTarget.setPointerCapture(event.pointerId);
      dragDistanceRef.current = 0;
      pointerDownOnStageRef.current = event.target === event.currentTarget;
      pointerStartRef.current = { pointerId: event.pointerId, x: event.clientX, y: event.clientY };
      if (viewRef.current.scale > 1) {
        panStartRef.current = {
          pointerId: event.pointerId,
          x: event.clientX - viewRef.current.x,
          y: event.clientY - viewRef.current.y,
        };
      }
    }, []);

    const handlePointerMove = useCallback(
      (event: ReactPointerEvent<HTMLDivElement>) => {
        const start = pointerStartRef.current;
        if (!start || start.pointerId !== event.pointerId) {
          return;
        }
        dragDistanceRef.current = Math.max(
          dragDistanceRef.current,
          Math.hypot(event.clientX - start.x, event.clientY - start.y),
        );

        const panStart = panStartRef.current;
        if (!panStart || panStart.pointerId !== event.pointerId) {
          return;
        }
        const { rotation: currentRotation, scale: currentScale } = viewRef.current;
        const bounds = getPanBounds(currentScale, currentRotation);
        let nextX = event.clientX - panStart.x;
        let nextY = event.clientY - panStart.y;
        if (bounds) {
          nextX = clamp(nextX, -bounds.x, bounds.x);
          nextY = clamp(nextY, -bounds.y, bounds.y);
        }
        viewRef.current.x = nextX;
        viewRef.current.y = nextY;
        applyTransform();
      },
      [applyTransform, getPanBounds],
    );

    const handlePointerEnd = useCallback((event: ReactPointerEvent<HTMLDivElement>) => {
      if (pointerStartRef.current?.pointerId === event.pointerId) {
        pointerStartRef.current = null;
      }
      if (panStartRef.current?.pointerId === event.pointerId) {
        panStartRef.current = null;
      }
    }, []);

    const handleDoubleClick = useCallback(() => {
      if (!zoomable) {
        return;
      }
      zoomTo(viewRef.current.scale > 1 ? 1 : 2);
    }, [zoomTo, zoomable]);

    const handleImageLoad = useCallback(() => {
      setImageStatus('loaded');
    }, []);

    const handleImageError = useCallback(
      (event: SyntheticEvent<HTMLImageElement>) => {
        setImageStatus('error');
        onImageError?.(currentImage, safeIndex, event);
      },
      [currentImage, onImageError, safeIndex],
    );

    const setRootRef = useCallback(
      (node: HTMLDialogElement | null) => {
        rootRef.current = node;
        if (typeof ref === 'function') {
          ref(node);
        } else if (ref) {
          ref.current = node;
        }
      },
      [ref],
    );

    if (typeof document === 'undefined' || !state.mounted || items.length === 0) {
      return null;
    }

    const mergedStyle = {
      ...style,
      '--rbs-image-viewer-duration': `${effectiveDuration}ms`,
    } as CSSProperties;

    return createPortal(
      <ImageViewerContext.Provider value={contextValue}>
        <dialog
          aria-label={ariaLabel}
          aria-modal="true"
          className={clsx(styles.viewer, className)}
          data-status={state.status}
          open
          ref={setRootRef}
          style={mergedStyle}
          tabIndex={-1}
          {...restProps}
        >
          <div aria-hidden="true" className={styles.backdrop} />
          {/* oxlint-disable-next-line jsx-a11y/click-events-have-key-events jsx-a11y/no-static-element-interactions */}
          <div
            className={styles.stage}
            onClick={handleStageClick}
            onDoubleClick={handleDoubleClick}
            onPointerCancel={handlePointerEnd}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerEnd}
            ref={stageRef}
          >
            {imageStatus !== 'error' && (
              <img
                alt={currentImage.alt ?? ''}
                className={styles.stageImage}
                draggable={false}
                key={imageKey}
                onError={handleImageError}
                onLoad={handleImageLoad}
                ref={imageRef}
                src={currentImage.src}
              />
            )}
            {imageStatus === 'loading' && (
              <div className={styles.statusOverlay}>
                <Spinner animation="border" size="sm" variant="light" />
              </div>
            )}
            {imageStatus === 'error' && (
              <div className={styles.statusOverlay}>
                <div className={styles.errorMessage} role="alert">
                  Failed to load image
                </div>
              </div>
            )}
          </div>
          {resolvedShowNav && (
            <>
              <button
                aria-label="Previous image"
                className={clsx(styles.navButton, styles.navPrevious)}
                disabled={!loop && safeIndex === 0}
                onClick={previous}
                type="button"
              >
                <ICONS.chevronLeft aria-hidden="true" className={styles.icon} />
              </button>
              <button
                aria-label="Next image"
                className={clsx(styles.navButton, styles.navNext)}
                disabled={!loop && safeIndex === items.length - 1}
                onClick={next}
                type="button"
              >
                <ICONS.chevronRight aria-hidden="true" className={styles.icon} />
              </button>
            </>
          )}
          {toolbarKeys.length > 0 && (
            <div aria-label="Image viewer toolbar" className={styles.toolbar} role="toolbar">
              {toolbarKeys.map((key) => {
                const Icon = ICONS[key];
                const item = toolbarItems[key];
                return (
                  <button
                    aria-label={item.label}
                    className={styles.toolbarButton}
                    disabled={item.disabled}
                    key={key}
                    onClick={item.action}
                    title={item.label}
                    type="button"
                  >
                    <Icon aria-hidden="true" className={styles.icon} />
                  </button>
                );
              })}
            </div>
          )}
          {resolvedShowCounter && (
            <div className={styles.counter}>
              {safeIndex + 1} / {items.length}
            </div>
          )}
          {currentImage.caption != null && (
            <div
              className={clsx(
                styles.caption,
                resolvedShowThumbnails && styles.captionWithThumbnails,
              )}
            >
              {currentImage.caption}
            </div>
          )}
          {children != null && (
            <div
              className={clsx(styles.footer, resolvedShowThumbnails && styles.footerWithThumbnails)}
            >
              {children}
            </div>
          )}
          {resolvedShowThumbnails && (
            <div className={styles.thumbnails} ref={thumbnailsRef} role="tablist">
              {items.map((image, imageIndex) => (
                <button
                  aria-label={`View image ${imageIndex + 1}`}
                  aria-selected={imageIndex === safeIndex}
                  className={clsx(styles.thumb, imageIndex === safeIndex && styles.thumbActive)}
                  data-image-index={imageIndex}
                  key={`${imageIndex}-${image.src}`}
                  onClick={() => changeIndex(imageIndex)}
                  role="tab"
                  type="button"
                >
                  <img alt="" className={styles.thumbImage} loading="lazy" src={image.src} />
                </button>
              ))}
            </div>
          )}
        </dialog>
      </ImageViewerContext.Provider>,
      document.body,
    );
  },
);

ImageViewer.displayName = 'ImageViewer';

export default ImageViewer;
