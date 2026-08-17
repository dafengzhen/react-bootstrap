import { useState } from 'react';

import { Button } from '../button';
import { type ApiProp, type ApiTypeDefinition, DemoSection, DocTemplate } from '../doc-template';
import { CloseButton } from './close-button';
import basicCode from './demos/basic.md?raw';
import customClassesCode from './demos/custom-classes.md?raw';
import disabledCode from './demos/disabled.md?raw';
import interactiveCode from './demos/interactive.md?raw';
import whiteCode from './demos/white.md?raw';
import closeButtonPropsTypeCode from './types/close-button-props.md?raw';
import closeButtonVariantTypeCode from './types/close-button-variant.md?raw';

const closeButtonProps: ApiProp[] = [
  {
    defaultValue: '-',
    description: '按钮变体，可选 `white`，用于深色背景',
    name: 'variant',
    type: 'CloseButtonVariant',
  },
  {
    defaultValue: 'false',
    description: '是否禁用按钮',
    name: 'disabled',
    type: 'boolean',
  },
  {
    defaultValue: "'Close'",
    description: '无障碍标签，向屏幕阅读器描述按钮用途',
    name: 'aria-label',
    type: 'string',
  },
  {
    defaultValue: "'button'",
    description: '原生 button 的 type，默认为 button 以避免意外提交表单',
    name: 'type',
    type: "'button' | 'submit' | 'reset'",
  },
  {
    defaultValue: '-',
    description: '自定义类名',
    name: 'className',
    type: 'string',
  },
  {
    defaultValue: '-',
    description: '原生 button 元素的所有属性（如 `onClick`、`onFocus` 等）',
    name: '...rest',
    type: 'ButtonHTMLAttributes',
  },
];

const closeButtonTypeDefinitions: ApiTypeDefinition[] = [
  {
    code: closeButtonVariantTypeCode,
    description: '关闭按钮变体类型',
    name: 'CloseButtonVariant',
  },
  {
    code: closeButtonPropsTypeCode,
    description: '关闭按钮组件属性接口',
    name: 'CloseButtonProps',
  },
];

export const CloseButtonDoc = () => {
  const [visible, setVisible] = useState(true);

  const handleDismiss = () => {
    setVisible(false);
  };

  const demoContent = (
    <>
      <DemoSection code={basicCode} title="基础用法">
        <div className="d-flex align-items-center gap-3">
          <CloseButton aria-label="关闭弹窗" />
          <span className="text-muted small">屏幕阅读器将朗读 aria-label 中的文本</span>
        </div>
      </DemoSection>

      <DemoSection code={whiteCode} title="深色背景变体">
        <div className="bg-dark d-inline-flex align-items-center gap-3 p-3 rounded-3">
          <CloseButton aria-label="关闭" variant="white" />
          <CloseButton aria-label="关闭" disabled variant="white" />
          <span className="text-white small">深色背景上使用白色变体</span>
        </div>
      </DemoSection>

      <DemoSection code={disabledCode} title="禁用状态">
        <div className="d-flex align-items-center gap-3">
          <CloseButton aria-label="关闭" disabled />
          <span className="text-muted small">禁用状态不响应点击</span>
        </div>
      </DemoSection>

      <DemoSection code={customClassesCode} title="自定义样式">
        <div className="d-flex align-items-center gap-3">
          <CloseButton aria-label="小号关闭按钮" className="fs-6" />
          <CloseButton aria-label="默认大小关闭按钮" />
          <CloseButton aria-label="大号关闭按钮" className="fs-2" />
          <CloseButton aria-label="超大关闭按钮" className="fs-1" />
        </div>
      </DemoSection>

      <DemoSection code={interactiveCode} title="交互演示">
        {visible ? (
          <div
            className="alert alert-warning alert-dismissible d-flex align-items-center fade show"
            role="alert"
          >
            <div className="me-auto">
              <strong>注意！</strong> 这是一条可以关闭的警告消息。
            </div>
            <CloseButton aria-label="关闭警告" onClick={handleDismiss} />
          </div>
        ) : (
          <div className="d-flex align-items-center gap-2">
            <span className="text-muted small">警告已关闭</span>
            <Button onClick={() => setVisible(true)} size="sm" variant="outline-primary">
              重新显示
            </Button>
          </div>
        )}
      </DemoSection>
    </>
  );

  return (
    <DocTemplate
      componentDescription="基于 Bootstrap 5 的关闭按钮组件，用于弹窗、警告框、Toast 等场景的关闭操作，支持白色变体与禁用状态"
      componentName="CloseButton"
      componentTags={['基础', '浮层']}
      demoContent={demoContent}
      props={closeButtonProps}
      typeDefinitions={closeButtonTypeDefinitions}
    />
  );
};

export default CloseButtonDoc;
