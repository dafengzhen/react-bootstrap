import { Button } from '../button';
import { type ApiProp, type ApiTypeDefinition, DemoSection, DocTemplate } from '../doc-template';
import asCode from './demos/as.md?raw';
import basicCode from './demos/basic.md?raw';
import nestedCode from './demos/nested.md?raw';
import scalingCode from './demos/scaling.md?raw';
import { Kbd } from './kbd';
import kbdPropsTypeCode from './types/kbd-props.md?raw';

const kbdProps: ApiProp[] = [
  {
    defaultValue: "'kbd'",
    description: '渲染的根元素类型，可传入 `span`、`code` 等以复用按键样式',
    name: 'as',
    type: 'ElementType',
  },
  {
    defaultValue: '-',
    description: '按键内容',
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
    description: '根元素的所有原生属性（如 `title`、`aria-label` 等）',
    name: '...rest',
    type: 'HTMLAttributes',
  },
];

const kbdTypeDefinitions: ApiTypeDefinition[] = [
  {
    code: kbdPropsTypeCode,
    description: '按键组件属性接口',
    name: 'KbdProps',
  },
];

export const KbdDoc = () => {
  const demoContent = (
    <>
      <DemoSection code={basicCode} title="基础用法">
        <>
          <p>
            要切换目录，请键入 <Kbd>cd</Kbd> 后跟目录名。
          </p>
          <p className="mb-0">
            要编辑设置，请按{' '}
            <Kbd>
              <Kbd>ctrl</Kbd> + <Kbd>,</Kbd>
            </Kbd>
          </p>
        </>
      </DemoSection>

      <DemoSection code={nestedCode} title="嵌套组合键">
        <div className="d-flex flex-column gap-2">
          <div>
            打开设置{' '}
            <Kbd>
              <Kbd>ctrl</Kbd> + <Kbd>,</Kbd>
            </Kbd>
          </div>
          <div>
            快速查找{' '}
            <Kbd>
              <Kbd>ctrl</Kbd> + <Kbd>shift</Kbd> + <Kbd>f</Kbd>
            </Kbd>
          </div>
          <div>
            切换终端{' '}
            <Kbd>
              <Kbd>ctrl</Kbd> + <Kbd>`</Kbd>
            </Kbd>
          </div>
        </div>
      </DemoSection>

      <DemoSection code={scalingCode} title="随父级字号缩放">
        <div className="d-flex flex-column gap-3">
          <h1>
            一级标题 <Kbd>esc</Kbd>
          </h1>
          <h3>
            三级标题 <Kbd>esc</Kbd>
          </h3>
          <h6>
            六级标题 <Kbd>esc</Kbd>
          </h6>
          <div className="fs-4">
            大号文本 <Kbd>enter</Kbd>
          </div>
          <div>
            常规文本 <Kbd>enter</Kbd>
          </div>
          <div className="small">
            小号文本 <Kbd>enter</Kbd>
          </div>
        </div>
      </DemoSection>

      <DemoSection code={asCode} title="自定义元素">
        <div className="d-flex flex-column align-items-start gap-3">
          <Kbd as="span">as="span"</Kbd>
          <Button variant="primary">
            打开设置 <Kbd>ctrl</Kbd> + <Kbd>,</Kbd>
          </Button>
          <Button variant="outline-secondary">
            刷新 <Kbd as="span">f5</Kbd>
          </Button>
        </div>
      </DemoSection>
    </>
  );

  return (
    <DocTemplate
      componentDescription="基于 Bootstrap 5 的按键提示组件，用于展示键盘按键与快捷键组合，支持嵌套组合键、随父元素字号自动缩放，并可渲染为任意元素"
      componentName="Kbd"
      componentTags={['基础', '排版']}
      demoContent={demoContent}
      props={kbdProps}
      typeDefinitions={kbdTypeDefinitions}
    />
  );
};

export default KbdDoc;
