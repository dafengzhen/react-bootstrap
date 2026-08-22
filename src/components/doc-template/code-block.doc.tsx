import hljs from 'highlight.js';
import { useState } from 'react';

import type { ApiProp } from './types.ts';

import { CodeBlock } from './code-block.tsx';
import { DemoSection } from './demo-section.tsx';
import { DocTemplate } from './doc-template.tsx';

const basicCode = '<CodeBlock code="const answer = 42;" />';
const titleCode =
  '<CodeBlock code="import { CodeBlock } from \'@dafengzhen/react-bootstrap/doc-template\';" title="安装" />';
const languageCode = '<CodeBlock code="<div>Hello</div>" language="xml" />';
const noCopyCode = '<CodeBlock code="const total = 1 + 2;" showCopyButton={false} />';
const highlightElementCode =
  '<CodeBlock code="const answer = 42;" highlightElement={(element) => hljs.highlightElement(element)} />';
const liveHighlightCode =
  '<textarea value={liveCode} onChange={(event) => setLiveCode(event.target.value)} />\n<CodeBlock code={liveCode} />';

const codeBlockProps: ApiProp[] = [
  {
    defaultValue: '-',
    description: '要高亮显示的源代码',
    name: 'code',
    type: 'string',
  },
  {
    defaultValue: '-',
    description: '语法高亮函数，接收待高亮的代码元素；不传则不进行高亮',
    name: 'highlightElement',
    type: '(element: HTMLElement) => void',
  },
  {
    defaultValue: "'typescript'",
    description: '代码语言，用于语法高亮',
    name: 'language',
    type: 'string',
  },
  {
    defaultValue: 'true',
    description: '是否显示复制按钮',
    name: 'showCopyButton',
    type: 'boolean',
  },
  {
    defaultValue: '-',
    description: '代码块顶部标题',
    name: 'title',
    type: 'string',
  },
];

export const CodeBlockDoc = () => {
  const [liveCode, setLiveCode] = useState('const answer = 42;');

  const demoContent = (
    <>
      <DemoSection code={basicCode} title="基础用法">
        <CodeBlock code="const answer = 42;" />
      </DemoSection>
      <DemoSection code={titleCode} title="带标题">
        <CodeBlock code="const answer = 42;" title="answer.ts" />
      </DemoSection>
      <DemoSection code={languageCode} title="指定语言">
        <CodeBlock code="<div>Hello</div>" language="xml" />
      </DemoSection>
      <DemoSection code={noCopyCode} title="隐藏复制按钮">
        <CodeBlock code="const total = 1 + 2;" showCopyButton={false} />
      </DemoSection>
      <DemoSection code={highlightElementCode} title="外部注入高亮">
        <CodeBlock
          code="const answer = 42;"
          highlightElement={(element) => hljs.highlightElement(element)}
        />
      </DemoSection>
      <DemoSection code={liveHighlightCode} title="实时高亮">
        <textarea
          className="form-control mb-2"
          onChange={(event) => setLiveCode(event.target.value)}
          rows={4}
          value={liveCode}
        />
        <CodeBlock code={liveCode} showCopyButton={false} />
      </DemoSection>
    </>
  );

  return (
    <DocTemplate
      componentDescription="通用代码块组件，支持复制代码与通过 highlightElement 外部注入的语法高亮"
      componentName="CodeBlock"
      componentTags={['文档']}
      demoContent={demoContent}
      props={codeBlockProps}
    />
  );
};

export default CodeBlockDoc;
