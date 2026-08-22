import clsx from 'clsx';
import { type FC } from 'react';

import type { ApiTypeDefinition } from './types.ts';

import { CodeBlock } from './code-block.tsx';
import styles from './doc-template.module.css';
import { extractFencedCode } from './markdown.ts';

export interface TypeDefinitionsProps {
  highlightedType?: string;
  sectionId: string;
  showCopyButton: boolean;
  typeDefIds: ReadonlyMap<string, string>;
  typeDefinitions: ApiTypeDefinition[];
}

export const TypeDefinitions: FC<TypeDefinitionsProps> = ({
  highlightedType,
  sectionId,
  showCopyButton,
  typeDefIds,
  typeDefinitions,
}) => (
  <section className={styles.apiSection} id={sectionId}>
    <h3 className="h5 mb-3">Type Definitions</h3>
    {typeDefinitions.map((typeDef) => (
      <div
        className={clsx(
          styles.typeDef,
          highlightedType === typeDef.name && styles.typeDefHighlight,
        )}
        id={typeDefIds.get(typeDef.name)}
        key={typeDef.name}
      >
        <h4 className="h6">{typeDef.name}</h4>
        {typeDef.description && <p className="text-muted small">{typeDef.description}</p>}
        <CodeBlock
          code={extractFencedCode(typeDef.code)}
          language="typescript"
          showCopyButton={showCopyButton}
        />
      </div>
    ))}
  </section>
);

export default TypeDefinitions;
