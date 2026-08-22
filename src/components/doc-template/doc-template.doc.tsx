import { useState } from 'react';

import type { ApiProp, ApiTypeDefinition } from './types.ts';

import { DemoSection } from './demo-section.tsx';
import { DocTemplate } from './doc-template.tsx';

const usageCode =
  '<DocTemplate\n  componentDescription="描述"\n  componentName="Button"\n  demoContent={demoContent}\n  props={buttonProps}\n  typeDefinitions={buttonTypeDefinitions}\n/>';
const propShapeCode =
  "const props: ApiProp[] = [\n  { defaultValue: '\"primary\"', description: '按钮变体', name: 'variant', type: 'ButtonVariant' },\n];";
const embeddedCode = '<DocTemplate componentName="Demo" embedded={embedded} props={demoProps} />';

const docTemplateProps: ApiProp[] = [
  {
    defaultValue: '-',
    description: '组件描述',
    name: 'componentDescription',
    type: 'string',
  },
  {
    defaultValue: '-',
    description: '组件名称（必填）',
    name: 'componentName',
    type: 'string',
  },
  {
    defaultValue: '[]',
    description: '组件标签',
    name: 'componentTags',
    type: 'string[]',
  },
  {
    defaultValue: '-',
    description: '示例内容（由 DemoSection 组成）',
    name: 'demoContent',
    type: 'ReactNode',
  },
  {
    defaultValue: 'undefined',
    description: '是否以嵌入模式渲染（仅内容，不渲染独立侧边栏），默认根据上下文自动判断',
    name: 'embedded',
    type: 'boolean',
  },
  {
    defaultValue: '-',
    description: '属性列表（必填）',
    name: 'props',
    type: 'ApiProp[]',
  },
  {
    defaultValue: 'true',
    description: '是否显示代码复制按钮',
    name: 'showCopyButton',
    type: 'boolean',
  },
  {
    defaultValue: '[]',
    description: '类型定义列表',
    name: 'typeDefinitions',
    type: 'ApiTypeDefinition[]',
  },
];

const docTemplatePropsTypeDefinition: ApiTypeDefinition = {
  code: 'export interface DocTemplateProps {\n  componentDescription?: string;\n  componentName: string;\n  componentTags?: string[];\n  demoContent?: ReactNode;\n  embedded?: boolean;\n  props: ApiProp[];\n  showCopyButton?: boolean;\n  typeDefinitions?: ApiTypeDefinition[];\n}',
  description: '组件文档模板属性接口',
  name: 'DocTemplateProps',
};

const demoProps: ApiProp[] = [
  { defaultValue: '-', description: '示例属性', name: 'name', type: 'string' },
];

export const DocTemplateDoc = () => {
  const [embedded, setEmbedded] = useState(false);

  const demoContent = (
    <>
      <DemoSection code={usageCode} title="用法">
        <p className="mb-0">DocTemplate 用于渲染完整的组件文档页，组合示例、属性表与类型定义。</p>
      </DemoSection>
      <DemoSection code={propShapeCode} title="属性数据">
        <p className="mb-0">
          props 与 typeDefinitions 分别为 ApiProp[] 与
          ApiTypeDefinition[]，驱动属性表与类型定义区块。
        </p>
      </DemoSection>
      <DemoSection code={embeddedCode} title="内嵌切换">
        <div className="d-flex gap-2 mb-3">
          <button
            className={`btn btn-sm ${embedded ? 'btn-primary' : 'btn-outline-secondary'}`}
            onClick={() => setEmbedded(true)}
            type="button"
          >
            内嵌
          </button>
          <button
            className={`btn btn-sm ${!embedded ? 'btn-primary' : 'btn-outline-secondary'}`}
            onClick={() => setEmbedded(false)}
            type="button"
          >
            独立
          </button>
        </div>
        <DocTemplate
          componentDescription="演示 embedded 属性切换"
          componentName="Demo"
          demoContent={<p className="mb-0">这是内容区域。</p>}
          embedded={embedded}
          props={demoProps}
        />
      </DemoSection>
    </>
  );

  return (
    <DocTemplate
      componentDescription="组件文档模板，用于渲染单个组件的文档页，统一组合标题、示例与 API 文档"
      componentName="DocTemplate"
      componentTags={['文档']}
      demoContent={demoContent}
      props={docTemplateProps}
      typeDefinitions={[docTemplatePropsTypeDefinition]}
    />
  );
};

export default DocTemplateDoc;
