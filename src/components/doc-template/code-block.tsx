import clsx from 'clsx';
import { type FC, useCallback, useEffect, useRef, useState } from 'react';

import type { CodeBlockProps } from './types.ts';

import styles from './doc-template.module.css';
import { useCodeBlockHighlight } from './highlight-context.ts';

const COPY_FEEDBACK_DURATION = 2000;

async function copyToClipboard(text: string): Promise<boolean> {
  if (navigator.clipboard?.writeText) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch {
      return false;
    }
  }

  const textarea = document.createElement('textarea');
  textarea.style.left = '-9999px';
  textarea.style.position = 'fixed';
  textarea.value = text;
  document.body.append(textarea);
  textarea.select();
  const succeeded = document.execCommand('copy');
  textarea.remove();
  return succeeded;
}

export const CodeBlock: FC<CodeBlockProps> = ({
  code,
  highlightElement,
  language = 'typescript',
  showCopyButton = true,
  title,
}) => {
  const codeRef = useRef<HTMLElement>(null);
  const timerRef = useRef<null | number>(null);
  const [copied, setCopied] = useState(false);
  const contextHighlightElement = useCodeBlockHighlight();
  const resolvedHighlightElement = highlightElement ?? contextHighlightElement;

  useEffect(() => {
    const element = codeRef.current;
    if (!element) {
      return;
    }
    element.textContent = code;
    delete element.dataset.highlighted;
    resolvedHighlightElement?.(element);
  }, [code, language, resolvedHighlightElement]);

  useEffect(
    () => () => {
      if (timerRef.current !== null) {
        clearTimeout(timerRef.current);
      }
    },
    [],
  );

  const handleCopy = useCallback(async () => {
    if (!(await copyToClipboard(code))) {
      return;
    }
    setCopied(true);
    if (timerRef.current !== null) {
      clearTimeout(timerRef.current);
    }
    timerRef.current = setTimeout(() => setCopied(false), COPY_FEEDBACK_DURATION);
  }, [code]);

  const copyButton = showCopyButton ? (
    <button
      aria-label="复制代码"
      aria-live="polite"
      className={clsx(styles.copyButton, copied && styles.copied)}
      onClick={handleCopy}
      title={copied ? '已复制' : '复制代码'}
      type="button"
    >
      {copied ? '已复制 ✓' : '复制'}
    </button>
  ) : null;

  return (
    <div className={styles.codeBlockWrapper}>
      {title ? (
        <div className={styles.codeTitle}>
          <span>{title}</span>
          {copyButton}
        </div>
      ) : (
        copyButton
      )}
      <pre>
        <code className={`language-${language}`} ref={codeRef}>
          {code}
        </code>
      </pre>
    </div>
  );
};

export default CodeBlock;
