import { type ApiProp, type ApiTypeDefinition, DemoSection, DocTemplate } from '../doc-template';
import { Kbd } from '../kbd';
import { Code } from './code';
import basicCode from './demos/basic.md?raw';
import blockCode from './demos/block.md?raw';
import compareCode from './demos/compare.md?raw';
import inlineCode from './demos/inline.md?raw';
import codePropsTypeCode from './types/code-props.md?raw';

const codeProps: ApiProp[] = [
  {
    defaultValue: "'code'",
    description: '渲染的根元素类型，可传入 `span`、`pre` 等以复用代码样式',
    name: 'as',
    type: 'ElementType',
  },
  {
    defaultValue: '-',
    description: '代码内容',
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

const codeTypeDefinitions: ApiTypeDefinition[] = [
  {
    code: codePropsTypeCode,
    description: '行内代码组件属性接口',
    name: 'CodeProps',
  },
];

export const CodeDoc = () => {
  const demoContent = (
    <>
      <DemoSection code={basicCode} title="基础用法">
        <p className="mb-0">
          在文档中引用行内代码，例如 <Code>Array.from()</Code> 方法。
        </p>
      </DemoSection>

      <DemoSection code={inlineCode} title="命令与包名">
        <p className="mb-0">
          使用 <Code>npm install</Code> 安装 <Code>react-bootstrap</Code> 依赖包。
        </p>
      </DemoSection>

      <DemoSection code={blockCode} title="代码块">
        <pre className="mb-0">
          <Code>{`import { Button } from '@dafengzhen/react-bootstrap';

const App = () => <Button variant="primary">Hello</Button>;`}</Code>
        </pre>
      </DemoSection>

      <DemoSection code={compareCode} title="与按键组件对比">
        <p className="mb-0">
          复制使用 <Kbd>ctrl</Kbd> + <Kbd>c</Kbd>，安装依赖使用 <Code>npm install</Code>。
        </p>
      </DemoSection>
    </>
  );

  return (
    <DocTemplate
      componentDescription="基于 Bootstrap 5 的行内代码组件，用于在文本中展示代码片段、命令与变量名，配合 pre 元素可呈现代码块，样式随父元素字号缩放"
      componentName="Code"
      componentTags={['基础', '排版']}
      demoContent={demoContent}
      props={codeProps}
      typeDefinitions={codeTypeDefinitions}
    />
  );
};

export default CodeDoc;
