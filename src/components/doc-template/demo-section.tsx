import clsx from 'clsx';
import {
  createContext,
  type FC,
  useCallback,
  useContext,
  useId,
  useLayoutEffect,
  useMemo,
  useState,
  useSyncExternalStore,
} from 'react';

import type { DemoSectionProps, TocLevel } from './types';

import { CodeBlock } from './code-block';
import { extractFencedCode } from './markdown';
import { sanitizeUseId, slugify } from './utils';

export interface DemoSectionMeta {
  id?: string;
  level: TocLevel;
  title: string;
}

export interface DemoSectionsContextValue {
  getSectionId: (key: string) => string | undefined;
  register: (key: string, meta: DemoSectionMeta) => string;
  subscribe: (listener: () => void) => () => void;
  unregister: (key: string) => void;
}

export const DemoSectionsContext = createContext<DemoSectionsContextValue | null>(null);

export const DemoSection: FC<DemoSectionProps> = ({
  children,
  className,
  code,
  codeLanguage = 'tsx',
  id,
  level = 2,
  title,
  ...rest
}) => {
  const context = useContext(DemoSectionsContext);
  const codeRegionId = useId();
  const instanceKey = useId();
  const [codeVisible, setCodeVisible] = useState(false);

  const fallbackSectionId = useMemo(
    () => id ?? `demo-${slugify(title) || 'section'}-${sanitizeUseId(instanceKey)}`,
    [id, instanceKey, title],
  );

  const subscribe = useCallback(
    (listener: () => void) => context?.subscribe(listener) ?? (() => {}),
    [context],
  );

  const getSectionSnapshot = useCallback(
    () => context?.getSectionId(instanceKey) ?? fallbackSectionId,
    [context, fallbackSectionId, instanceKey],
  );

  const sectionId = useSyncExternalStore(subscribe, getSectionSnapshot, () => fallbackSectionId);

  const resolvedCode = useMemo(() => (code ? extractFencedCode(code) : ''), [code]);

  useLayoutEffect(() => {
    if (!context) {
      return;
    }
    context.register(instanceKey, { id, level, title });
    return () => {
      context.unregister(instanceKey);
    };
  }, [context, id, instanceKey, level, title]);

  const handleToggleCode = useCallback(() => {
    setCodeVisible((prev) => !prev);
  }, []);

  const Heading = level === 3 ? 'h3' : 'h2';

  return (
    <section className={clsx('demo-section', className)} id={sectionId || undefined} {...rest}>
      <div className="demo-section-heading">
        <Heading className={clsx('demo-section-title', level === 3 ? 'h6' : 'h5')}>{title}</Heading>
        {code ? (
          <button
            aria-controls={codeRegionId}
            aria-expanded={codeVisible}
            className="demo-code-toggle"
            onClick={handleToggleCode}
            title={codeVisible ? '隐藏示例代码' : '查看示例代码'}
            type="button"
          >
            {codeVisible ? '隐藏代码' : '查看代码'}
          </button>
        ) : null}
      </div>
      <div className={clsx('demo-preview', code && codeVisible && 'demo-preview-code-open')}>
        {children}
      </div>
      {code && codeVisible ? (
        <div className="demo-code" id={codeRegionId}>
          <CodeBlock code={resolvedCode} language={codeLanguage} />
        </div>
      ) : null}
    </section>
  );
};

export default DemoSection;
