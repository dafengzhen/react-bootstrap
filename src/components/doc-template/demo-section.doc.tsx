import { useState } from 'react';

import type { ApiProp } from './types.ts';

import { DemoSection } from './demo-section.tsx';
import { DocTemplate } from './doc-template.tsx';

const basicCode =
  '<DemoSection title="基础用法">\n  <p className="mb-0">这是示例内容</p>\n</DemoSection>';
const codePropCode =
  '<DemoSection code="<Alert>内容</Alert>" title="查看代码">\n  <p className="mb-0">点击右上角查看示例代码</p>\n</DemoSection>';
const levelCode = '<DemoSection level={3} title="三级标题">\n  使用 level=3\n</DemoSection>';
const interactiveCode =
  '<DemoSection title="交互内容">\n  <button onClick={handleClick}>点击 +1</button>\n  <span>计数：{count}</span>\n</DemoSection>';

const demoSectionProps: ApiProp[] = [
  {
    defaultValue: '-',
    description: '示例预览区域的内容',
    name: 'children',
    type: 'ReactNode',
  },
  {
    defaultValue: '-',
    description: '自定义类名',
    name: 'className',
    type: 'string',
  },
  {
    defaultValue: '-',
    description: '示例代码（Markdown 或纯代码字符串）',
    name: 'code',
    type: 'string',
  },
  {
    defaultValue: "'tsx'",
    description: '示例代码语言',
    name: 'codeLanguage',
    type: 'string',
  },
  {
    defaultValue: '-',
    description: '示例区块锚点 id',
    name: 'id',
    type: 'string',
  },
  {
    defaultValue: '2',
    description: '标题层级（2 或 3）',
    name: 'level',
    type: 'TocLevel',
  },
  {
    defaultValue: '-',
    description: '示例标题（必填）',
    name: 'title',
    type: 'string',
  },
];

export const DemoSectionDoc = () => {
  const [count, setCount] = useState(0);

  const demoContent = (
    <>
      <DemoSection code={basicCode} title="基础用法">
        <p className="mb-0">这是示例内容</p>
      </DemoSection>
      <DemoSection code={codePropCode} title="查看代码">
        <p className="mb-0">点击右上角「查看代码」切换代码展示</p>
      </DemoSection>
      <DemoSection code={levelCode} title="标题层级">
        <DemoSection level={3} title="三级标题">
          <span className="text-muted small">使用 level=3 呈现更小的三级标题</span>
        </DemoSection>
      </DemoSection>
      <DemoSection code={interactiveCode} title="交互内容">
        <div className="d-flex align-items-center gap-3">
          <button
            className="btn btn-primary"
            onClick={() => setCount((prev) => prev + 1)}
            type="button"
          >
            点击 +1
          </button>
          <span>计数：{count}</span>
          <button className="btn btn-outline-secondary" onClick={() => setCount(0)} type="button">
            重置
          </button>
        </div>
      </DemoSection>
    </>
  );

  return (
    <DocTemplate
      componentDescription="示例区块组件，用于在组件文档中展示可运行示例及其对应源代码"
      componentName="DemoSection"
      componentTags={['文档']}
      demoContent={demoContent}
      props={demoSectionProps}
    />
  );
};

export default DemoSectionDoc;
