import { type ApiProp, type ApiTypeDefinition, DemoSection, DocTemplate } from '../doc-template';
import { Abbr } from './abbr';
import basicCode from './demos/basic.md?raw';
import contextCode from './demos/context.md?raw';
import initialismCode from './demos/initialism.md?raw';
import abbrPropsTypeCode from './types/abbr-props.md?raw';

const abbrProps: ApiProp[] = [
  {
    defaultValue: "'abbr'",
    description: '渲染的根元素类型',
    name: 'as',
    type: 'ElementType',
  },
  {
    defaultValue: '-',
    description: '缩写内容',
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
    defaultValue: 'false',
    description: '是否使用小型大写字母样式（.initialism），适合略长于首字母的缩写',
    name: 'initialism',
    type: 'boolean',
  },
  {
    defaultValue: '-',
    description: '缩写的完整说明，悬停时以浏览器原生提示展示（透传 `title` 属性）',
    name: 'title',
    type: 'string',
  },
  {
    defaultValue: '-',
    description: '根元素的所有原生属性',
    name: '...rest',
    type: 'HTMLAttributes',
  },
];

const abbrTypeDefinitions: ApiTypeDefinition[] = [
  {
    code: abbrPropsTypeCode,
    description: '缩写组件属性接口',
    name: 'AbbrProps',
  },
];

export const AbbrDoc = () => {
  const demoContent = (
    <>
      <DemoSection code={basicCode} title="基础用法">
        <p className="mb-0">
          <Abbr title="HyperText Markup Language">HTML</Abbr> 是构建网页的标准标记语言。
        </p>
      </DemoSection>

      <DemoSection code={initialismCode} title="缩写词样式">
        <p className="mb-0">
          <Abbr initialism title="HyperText Markup Language">
            HTML
          </Abbr>{' '}
          与{' '}
          <Abbr initialism title="Cascading Style Sheets">
            CSS
          </Abbr>{' '}
          是前端开发的基础。
        </p>
      </DemoSection>

      <DemoSection code={contextCode} title="长说明与自定义">
        <p className="mb-0">
          <Abbr title="Application Programming Interface">API</Abbr> 文档中通常使用{' '}
          <Abbr className="text-muted" title="A distinct part of a larger structure">
            缩略词
          </Abbr>{' '}
          来简化长术语，鼠标悬停即可查看完整说明。
        </p>
      </DemoSection>
    </>
  );

  return (
    <DocTemplate
      componentDescription="基于 Bootstrap 5 的缩写组件，用于展示缩写或首字母缩略词，通过 title 属性在悬停时显示完整说明，支持小型大写字母样式"
      componentName="Abbr"
      componentTags={['基础', '排版']}
      demoContent={demoContent}
      props={abbrProps}
      typeDefinitions={abbrTypeDefinitions}
    />
  );
};

export default AbbrDoc;
