import clsx from 'clsx';
import { Check, Copy } from 'lucide-react';
import {
  type CSSProperties,
  type ElementType,
  forwardRef,
  type KeyboardEvent,
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';

import type { TypographyCommonProps } from './types';

import { Kbd } from '../kbd';
import { useTypography } from './typography-context';
import { copyText, getTypographyText } from './typography-utils';
import styles from './typography.module.css';

const COPY_FEEDBACK_DURATION = 2000;

const DEFAULT_COLLAPSE_SYMBOL = 'Collapse';
const DEFAULT_COPY_TOOLTIPS: [string, string] = ['Copy', 'Copied'];
const DEFAULT_EDIT_TOOLTIP = 'Edit text';
const DEFAULT_EXPAND_SYMBOL = 'Expand';

export interface TypographyBaseProps extends TypographyCommonProps {
  element: ElementType;
  multiline?: boolean;
}

export const TypographyBase = forwardRef<HTMLElement, TypographyBaseProps>((props, ref) => {
  const {
    as,
    children,
    className,
    code,
    copyable,
    delete: del,
    disabled,
    editable,
    ellipsis,
    italic,
    keyboard,
    mark,
    multiline,
    muted,
    strong,
    type,
    underline,
    ...rest
  } = props;

  const context = useTypography();

  const [copied, setCopied] = useState(false);
  const [editing, setEditing] = useState(false);
  const [editValue, setEditValue] = useState('');
  const [expanded, setExpanded] = useState(false);
  const [overflowing, setOverflowing] = useState(false);

  const clampRef = useRef<HTMLSpanElement | null>(null);
  const copyTimerRef = useRef<null | number>(null);
  const editRef = useRef<HTMLInputElement | HTMLTextAreaElement | null>(null);
  const finishedRef = useRef(false);

  const Component = as ?? props.element;

  const resolvedCode = code ?? context?.code ?? false;
  const resolvedCopyable = copyable ?? context?.copyable;
  const resolvedDelete = del ?? context?.delete ?? false;
  const resolvedDisabled = disabled ?? context?.disabled ?? false;
  const resolvedEditable = editable ?? context?.editable;
  const resolvedEllipsis = ellipsis ?? context?.ellipsis;
  const resolvedItalic = italic ?? context?.italic ?? false;
  const resolvedKeyboard = keyboard ?? context?.keyboard ?? false;
  const resolvedMark = mark ?? context?.mark ?? false;
  const resolvedMuted = muted ?? context?.muted ?? false;
  const resolvedStrong = strong ?? context?.strong ?? false;
  const resolvedType = type ?? context?.type;
  const resolvedUnderline = underline ?? context?.underline ?? false;

  const copyableConfig = typeof resolvedCopyable === 'object' ? resolvedCopyable : undefined;
  const editableConfig = typeof resolvedEditable === 'object' ? resolvedEditable : undefined;
  const ellipsisConfig = typeof resolvedEllipsis === 'object' ? resolvedEllipsis : undefined;

  const copyableEnabled =
    resolvedCopyable !== undefined && resolvedCopyable !== false && !resolvedDisabled;
  const editableEnabled =
    resolvedEditable !== undefined && resolvedEditable !== false && !resolvedDisabled;
  const ellipsisEnabled = resolvedEllipsis !== undefined && resolvedEllipsis !== false;

  const editAutoSize = editableConfig?.autoSize;
  const editMaxRows = typeof editAutoSize === 'object' ? editAutoSize.maxRows : undefined;
  const editMinRows = typeof editAutoSize === 'object' ? (editAutoSize.minRows ?? 1) : 1;
  const editableText = editableConfig?.text ?? getTypographyText(children);

  const clamped = ellipsisEnabled && !expanded && !editing;
  const copyTextContent = copyableConfig?.text ?? getTypographyText(children);
  const copyTooltips = copyableConfig?.tooltips ?? DEFAULT_COPY_TOOLTIPS;
  const ellipsisExpandable = ellipsisConfig?.expandable ?? false;
  const ellipsisRows = ellipsisConfig?.rows ?? 1;
  const ellipsisTitle =
    ellipsisConfig?.tooltip === true
      ? getTypographyText(children)
      : typeof ellipsisConfig?.tooltip === 'string'
        ? ellipsisConfig.tooltip
        : undefined;
  const expandContent =
    typeof ellipsisConfig?.symbol === 'function'
      ? ellipsisConfig.symbol(expanded)
      : (ellipsisConfig?.symbol ?? (expanded ? DEFAULT_COLLAPSE_SYMBOL : DEFAULT_EXPAND_SYMBOL));

  const finishEditing = useCallback(
    (commit: boolean) => {
      if (finishedRef.current) {
        return;
      }
      finishedRef.current = true;
      setEditing(false);
      if (commit && editValue !== editableText) {
        editableConfig?.onChange?.(editValue);
      }
      editableConfig?.onEnd?.();
    },
    [editValue, editableConfig, editableText],
  );

  const handleCopy = useCallback(async () => {
    await copyText(copyTextContent);
    copyableConfig?.onCopy?.(copyTextContent);
    setCopied(true);
    if (copyTimerRef.current !== null) {
      window.clearTimeout(copyTimerRef.current);
    }
    copyTimerRef.current = window.setTimeout(() => setCopied(false), COPY_FEEDBACK_DURATION);
  }, [copyableConfig, copyTextContent]);

  const handleEditBlur = useCallback(() => {
    finishEditing(true);
  }, [finishEditing]);

  const handleEditChange = useCallback((value: string) => {
    setEditValue(value);
  }, []);

  const handleEditKeyDown = useCallback(
    (event: KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      if (event.key === 'Enter' && !multiline && !event.nativeEvent.isComposing) {
        finishEditing(true);
      }
      if (event.key === 'Escape') {
        finishEditing(false);
      }
    },
    [finishEditing, multiline],
  );

  const handleStartEditing = useCallback(() => {
    finishedRef.current = false;
    setEditValue(editableConfig?.text ?? getTypographyText(children));
    setEditing(true);
    editableConfig?.onStart?.();
  }, [children, editableConfig]);

  const handleToggleExpand = useCallback(() => {
    const next = !expanded;
    setExpanded(next);
    ellipsisConfig?.onExpand?.(next);
  }, [ellipsisConfig, expanded]);

  useLayoutEffect(() => {
    const element = clampRef.current;
    if (!clamped || !ellipsisExpandable || element === null) {
      setOverflowing(false);
      return undefined;
    }
    const update = () => setOverflowing(element.scrollHeight > element.clientHeight);
    update();
    const observer = new ResizeObserver(update);
    observer.observe(element);
    return () => observer.disconnect();
  }, [children, clamped, ellipsisExpandable]);

  useLayoutEffect(() => {
    if (editing) {
      editRef.current?.focus();
    }
  }, [editing]);

  useEffect(
    () => () => {
      if (copyTimerRef.current !== null) {
        window.clearTimeout(copyTimerRef.current);
      }
    },
    [],
  );

  const componentClassName = clsx(
    resolvedType !== undefined && `text-${resolvedType}`,
    resolvedMuted && 'text-muted',
    resolvedDelete && 'text-decoration-line-through',
    resolvedItalic && 'fst-italic',
    resolvedStrong && 'fw-semibold',
    resolvedUnderline && 'text-decoration-underline',
    resolvedDisabled && styles.disabled,
    className,
  );

  const editingElement = multiline ? (
    <textarea
      className={clsx(
        styles.editableInput,
        styles.editableTextarea,
        editMaxRows !== undefined && styles.editableTextareaLimit,
      )}
      maxLength={editableConfig?.maxLength}
      onBlur={handleEditBlur}
      onChange={(event) => handleEditChange(event.target.value)}
      onKeyDown={handleEditKeyDown}
      ref={(element) => {
        editRef.current = element;
      }}
      rows={editMinRows}
      style={
        editMaxRows !== undefined
          ? ({ '--rbs-typography-max-rows': editMaxRows } as CSSProperties)
          : undefined
      }
      value={editValue}
    />
  ) : (
    <input
      className={styles.editableInput}
      maxLength={editableConfig?.maxLength}
      onBlur={handleEditBlur}
      onChange={(event) => handleEditChange(event.target.value)}
      onKeyDown={handleEditKeyDown}
      ref={(element) => {
        editRef.current = element;
      }}
      value={editValue}
    />
  );

  const editableTrigger = (
    <button
      className={styles.editableTrigger}
      onClick={handleStartEditing}
      title={editableConfig?.tooltip ?? DEFAULT_EDIT_TOOLTIP}
      type="button"
    >
      {children}
    </button>
  );

  const renderedContent = editing ? editingElement : editableEnabled ? editableTrigger : children;

  const inlineContent =
    resolvedCode || resolvedMark || resolvedKeyboard ? (
      <span className={clsx(resolvedCode && styles.code, resolvedMark && styles.mark)}>
        {resolvedKeyboard ? <Kbd>{renderedContent}</Kbd> : renderedContent}
      </span>
    ) : (
      renderedContent
    );

  return (
    <Component className={componentClassName} ref={ref} {...rest}>
      {clamped ? (
        <span
          className={styles.clamp}
          ref={clampRef}
          style={{ '--rbs-typography-rows': ellipsisRows } as CSSProperties}
          title={ellipsisTitle}
        >
          {inlineContent}
        </span>
      ) : (
        inlineContent
      )}
      {copyableEnabled && !editing && (
        <button
          aria-label={copied ? copyTooltips[1] : copyTooltips[0]}
          className={clsx(styles.action, copied && styles.actionCopied)}
          onClick={handleCopy}
          title={copied ? copyTooltips[1] : copyTooltips[0]}
          type="button"
        >
          {copied ? <Check size="0.85em" /> : <Copy size="0.85em" />}
        </button>
      )}
      {ellipsisEnabled && ellipsisExpandable && !editing && (overflowing || expanded) && (
        <button
          aria-expanded={expanded}
          className={styles.expand}
          onClick={handleToggleExpand}
          type="button"
        >
          {expandContent}
        </button>
      )}
    </Component>
  );
});

TypographyBase.displayName = 'TypographyBase';

export default TypographyBase;
