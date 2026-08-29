import { type ApiProp, type ApiTypeDefinition, DemoSection, DocTemplate } from '../doc-template';
import { Blockquote } from './blockquote';
import { BlockquoteFooter } from './blockquote-footer';
import basicCode from './demos/basic.md?raw';
import centeredCode from './demos/centered.md?raw';
import customCode from './demos/custom.md?raw';
import sourceCode from './demos/source.md?raw';
import blockquoteFooterPropsTypeCode from './types/blockquote-footer-props.md?raw';
import blockquotePropsTypeCode from './types/blockquote-props.md?raw';

const blockquoteProps: ApiProp[] = [
  {
    component: 'Blockquote',
    defaultValue: "'blockquote'",
    description: '渲染的根元素类型',
    name: 'as',
    type: 'ElementType',
  },
  {
    component: 'Blockquote',
    defaultValue: '-',
    description: '引用内容，通常为 p 元素文本',
    name: 'children',
    type: 'ReactNode',
  },
  {
    component: 'Blockquote',
    defaultValue: '-',
    description: '自定义类名，作用于 blockquote 元素',
    name: 'className',
    type: 'string',
  },
  {
    component: 'Blockquote',
    defaultValue: '-',
    description: '根元素的所有原生属性（如 `style`、`aria-*` 等）',
    name: '...rest',
    type: 'HTMLAttributes',
  },
  {
    component: 'BlockquoteFooter',
    defaultValue: "'figcaption'",
    description: '渲染的根元素类型，通常配合 figure 使用',
    name: 'as',
    type: 'ElementType',
  },
  {
    component: 'BlockquoteFooter',
    defaultValue: '-',
    description: '标注内容，如「Someone famous in」',
    name: 'children',
    type: 'ReactNode',
  },
  {
    component: 'BlockquoteFooter',
    defaultValue: '-',
    description: '自定义类名',
    name: 'className',
    type: 'string',
  },
  {
    component: 'BlockquoteFooter',
    defaultValue: '-',
    description: '出处名称，渲染在 cite 元素内',
    name: 'source',
    type: 'ReactNode',
  },
  {
    component: 'BlockquoteFooter',
    defaultValue: '-',
    description: '出处的 title 提示，透传给 cite 元素',
    name: 'sourceTitle',
    type: 'string',
  },
  {
    component: 'BlockquoteFooter',
    defaultValue: '-',
    description: '根元素的所有原生属性',
    name: '...rest',
    type: 'HTMLAttributes',
  },
];

const blockquoteTypeDefinitions: ApiTypeDefinition[] = [
  {
    code: blockquoteFooterPropsTypeCode,
    description: '引用出处组件属性接口',
    name: 'BlockquoteFooterProps',
  },
  {
    code: blockquotePropsTypeCode,
    description: '引用组件属性接口',
    name: 'BlockquoteProps',
  },
];

export const BlockquoteDoc = () => {
  const demoContent = (
    <>
      <DemoSection code={basicCode} title="基础用法">
        <Blockquote>
          <p>一个被版面分散注意力的读者，将无法专注于排版本身。</p>
        </Blockquote>
      </DemoSection>

      <DemoSection code={sourceCode} title="标注出处">
        <figure className="mb-0">
          <Blockquote>
            <p>一个被版面分散注意力的读者，将无法专注于排版本身。</p>
          </Blockquote>
          <BlockquoteFooter source="Source Title" sourceTitle="Someone famous">
            Someone famous in
          </BlockquoteFooter>
        </figure>
      </DemoSection>

      <DemoSection code={centeredCode} title="居中引用">
        <figure className="mb-0 text-center">
          <Blockquote>
            <p>一个被版面分散注意力的读者，将无法专注于排版本身。</p>
          </Blockquote>
          <BlockquoteFooter source="Source Title" sourceTitle="Someone famous">
            Someone famous in
          </BlockquoteFooter>
        </figure>
      </DemoSection>

      <DemoSection code={customCode} title="自定义结构">
        <Blockquote className="mb-3">
          <p>通过 as 与 className 可以自定义根元素与样式。</p>
          <BlockquoteFooter as="div" source="dafengzhen">
            作者
          </BlockquoteFooter>
        </Blockquote>
      </DemoSection>
    </>
  );

  return (
    <DocTemplate
      componentDescription="基于 Bootstrap 5 的引用组件，用于展示引述内容，提供 Blockquote 与 BlockquoteFooter 子组件，支持标注出处、居中引用与自定义结构"
      componentName="Blockquote"
      componentTags={['基础', '排版']}
      demoContent={demoContent}
      props={blockquoteProps}
      typeDefinitions={blockquoteTypeDefinitions}
    />
  );
};

export default BlockquoteDoc;
