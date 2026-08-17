import clsx from 'clsx';
import { type FC } from 'react';

import type { ApiTypeDefinition } from './types';

import { CodeBlock } from './code-block';
import { extractFencedCode } from './markdown';

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
  <section className="api-section" id={sectionId}>
    <h3 className="h5 mb-3">Type Definitions</h3>
    {typeDefinitions.map((typeDef) => (
      <div
        className={clsx('type-def', highlightedType === typeDef.name && 'type-def-highlight')}
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
