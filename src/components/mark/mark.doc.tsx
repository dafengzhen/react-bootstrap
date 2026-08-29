import { type ApiProp, type ApiTypeDefinition, DemoSection, DocTemplate } from '../doc-template';
import basicCode from './demos/basic.md?raw';
import combinedCode from './demos/combined.md?raw';
import contextCode from './demos/context.md?raw';
import { Mark } from './mark';
import markPropsTypeCode from './types/mark-props.md?raw';

const markProps: ApiProp[] = [
  {
    defaultValue: "'mark'",
    description: '渲染的根元素类型，可传入 `span` 等以复用高亮样式',
    name: 'as',
    type: 'ElementType',
  },
  {
    defaultValue: '-',
    description: '高亮内容',
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
    description: '根元素的所有原生属性（如 `title`、`style` 等）',
    name: '...rest',
    type: 'HTMLAttributes',
  },
];

const markTypeDefinitions: ApiTypeDefinition[] = [
  {
    code: markPropsTypeCode,
    description: '高亮组件属性接口',
    name: 'MarkProps',
  },
];

export const MarkDoc = () => {
  const demoContent = (
    <>
      <DemoSection code={basicCode} title="基础用法">
        <p className="mb-0">
          <Mark>高亮显示的文本</Mark> 可以突出段落中的重点内容。
        </p>
      </DemoSection>

      <DemoSection code={contextCode} title="搜索结果标记">
        <p className="mb-0">
          搜索结果中共找到 <Mark>3</Mark> 处与关键词相关的匹配，请查看 <Mark>第 2 页</Mark>{' '}
          的详细说明。
        </p>
      </DemoSection>

      <DemoSection code={combinedCode} title="组合样式">
        <p className="mb-0">
          高亮可以与{' '}
          <Mark>
            <strong>加粗</strong>
          </Mark>{' '}
          或{' '}
          <Mark>
            <em>斜体</em>
          </Mark>{' '}
          组合使用，也可以自定义类名调整样式。
        </p>
      </DemoSection>
    </>
  );

  return (
    <DocTemplate
      componentDescription="基于 Bootstrap 5 的高亮组件，用于标记或突出文本内容，如搜索结果、关键信息等，支持与加粗、斜体等样式自由组合"
      componentName="Mark"
      componentTags={['基础', '排版']}
      demoContent={demoContent}
      props={markProps}
      typeDefinitions={markTypeDefinitions}
    />
  );
};

export default MarkDoc;
