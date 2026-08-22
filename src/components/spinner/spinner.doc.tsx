import { useState } from 'react';

import { Button } from '../button';
import { type ApiProp, type ApiTypeDefinition, DemoSection, DocTemplate } from '../doc-template';
import alignmentCode from './demos/alignment.md?raw';
import animationsCode from './demos/animations.md?raw';
import basicCode from './demos/basic.md?raw';
import buttonsCode from './demos/buttons.md?raw';
import colorsCode from './demos/colors.md?raw';
import interactiveCode from './demos/interactive.md?raw';
import sizingCode from './demos/sizing.md?raw';
import { Spinner } from './spinner';
import spinnerAnimationTypeCode from './types/spinner-animation.md?raw';
import spinnerPropsTypeCode from './types/spinner-props.md?raw';
import spinnerSizeTypeCode from './types/spinner-size.md?raw';
import spinnerVariantTypeCode from './types/spinner-variant.md?raw';

const spinnerProps: ApiProp[] = [
  {
    defaultValue: "'border'",
    description: '动画类型，`border` 渲染 `spinner-border` 类，`grow` 渲染 `spinner-grow` 类',
    name: 'animation',
    type: 'SpinnerAnimation',
  },
  {
    defaultValue: "'div'",
    description: '渲染的根元素类型，在按钮内使用时建议传入 `span`',
    name: 'as',
    type: 'ElementType',
  },
  {
    defaultValue: '-',
    description:
      '加载器内容，通常为视觉隐藏文本（如 `<span className="visually-hidden">`），向屏幕阅读器描述加载状态',
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
    defaultValue: "'status'",
    description:
      '无障碍角色，告知屏幕阅读器这是一个状态区域；在按钮内使用时可通过 `aria-hidden` 隐藏',
    name: 'role',
    type: 'string',
  },
  {
    defaultValue: '-',
    description:
      '加载器尺寸，`sm` 渲染 `spinner-border-sm`/`spinner-grow-sm` 类；自定义尺寸请使用内联样式',
    name: 'size',
    type: 'SpinnerSize',
  },
  {
    defaultValue: '-',
    description: '颜色变体，渲染 `text-*` 类改变加载器颜色',
    name: 'variant',
    type: 'SpinnerVariant',
  },
  {
    defaultValue: '-',
    description: '根元素的所有原生属性（如 `aria-hidden`、`style` 等）',
    name: '...rest',
    type: 'HTMLAttributes',
  },
];

const spinnerTypeDefinitions: ApiTypeDefinition[] = [
  {
    code: spinnerAnimationTypeCode,
    description: '加载器动画类型',
    name: 'SpinnerAnimation',
  },
  {
    code: spinnerPropsTypeCode,
    description: '加载器组件属性接口',
    name: 'SpinnerProps',
  },
  {
    code: spinnerSizeTypeCode,
    description: '加载器尺寸类型',
    name: 'SpinnerSize',
  },
  {
    code: spinnerVariantTypeCode,
    description: '加载器颜色变体类型',
    name: 'SpinnerVariant',
  },
];

export const SpinnerDoc = () => {
  const [loading, setLoading] = useState(false);

  const handleReset = () => {
    setLoading(false);
  };

  const handleToggle = () => {
    setLoading((prev) => !prev);
  };

  const demoContent = (
    <>
      <DemoSection code={basicCode} title="基础用法">
        <Spinner>
          <span className="visually-hidden">加载中...</span>
        </Spinner>
        <p className="mb-0 mt-3 text-muted small">
          边框加载器默认渲染 `spinner-border` 类，配合视觉隐藏文本可让屏幕阅读器朗读加载状态
        </p>
      </DemoSection>

      <DemoSection code={animationsCode} title="动画类型">
        <div className="d-flex align-items-center gap-3">
          <Spinner animation="border" />
          <Spinner animation="grow" />
        </div>
        <p className="mb-0 mt-3 text-muted small">
          `border` 为旋转边框动画，`grow` 为反复缩放淡入的生长动画
        </p>
      </DemoSection>

      <DemoSection code={colorsCode} title="颜色变体">
        <div className="d-flex flex-wrap gap-2">
          <Spinner variant="primary" />
          <Spinner variant="secondary" />
          <Spinner variant="success" />
          <Spinner variant="danger" />
          <Spinner variant="warning" />
          <Spinner variant="info" />
          <Spinner variant="light" />
          <Spinner variant="dark" />
        </div>
        <div className="d-flex flex-wrap gap-2 mt-3">
          <Spinner animation="grow" variant="primary" />
          <Spinner animation="grow" variant="secondary" />
          <Spinner animation="grow" variant="success" />
          <Spinner animation="grow" variant="danger" />
          <Spinner animation="grow" variant="warning" />
          <Spinner animation="grow" variant="info" />
          <Spinner animation="grow" variant="light" />
          <Spinner animation="grow" variant="dark" />
        </div>
        <p className="mb-0 mt-3 text-muted small">
          variant 渲染 `text-*` 类为加载器着色，两种动画均支持全部主题色
        </p>
      </DemoSection>

      <DemoSection code={sizingCode} title="尺寸">
        <div className="d-flex align-items-center gap-3">
          <Spinner size="sm" />
          <Spinner animation="grow" size="sm" />
          <Spinner style={{ height: '3rem', width: '3rem' }} />
          <Spinner animation="grow" style={{ height: '3rem', width: '3rem' }} />
        </div>
        <p className="mb-0 mt-3 text-muted small">
          size="sm" 渲染 `spinner-border-sm`/`spinner-grow-sm`
          小尺寸类；任意尺寸均可通过内联样式调整
        </p>
      </DemoSection>

      <DemoSection code={buttonsCode} title="按钮中使用">
        <div className="d-flex flex-wrap gap-2">
          <Button disabled variant="primary">
            <Spinner animation="border" aria-hidden="true" as="span" size="sm" />
            <span className="visually-hidden">加载中...</span>
          </Button>
          <Button disabled variant="primary">
            <Spinner animation="border" aria-hidden="true" as="span" size="sm" />
            {/* oxlint-disable-next-line jsx-a11y/prefer-tag-over-role */}
            <span role="status">加载中...</span>
          </Button>
          <Button disabled variant="primary">
            <Spinner animation="grow" aria-hidden="true" as="span" size="sm" />
            {/* oxlint-disable-next-line jsx-a11y/prefer-tag-over-role */}
            <span role="status">加载中...</span>
          </Button>
        </div>
        <p className="mb-0 mt-3 text-muted small">
          在禁用按钮内使用 `as="span"` 与 `aria-hidden="true"`
          渲染小尺寸加载器，并为可见或视觉隐藏的文案添加 `role="status"`
        </p>
      </DemoSection>

      <DemoSection code={alignmentCode} title="对齐与边距">
        <div className="d-flex align-items-center">
          {/* oxlint-disable-next-line jsx-a11y/prefer-tag-over-role */}
          <strong role="status">加载中...</strong>
          <Spinner aria-hidden="true" className="ms-auto" />
        </div>
        <div className="d-flex justify-content-center mt-3">
          <Spinner>
            <span className="visually-hidden">加载中...</span>
          </Spinner>
        </div>
        <p className="mb-0 mt-3 text-muted small">
          加载器默认不占满整行，可配合 flex 工具类与边距类（如 `ms-auto`）实现对齐
        </p>
      </DemoSection>

      <DemoSection code={interactiveCode} title="交互示例">
        <Button className="me-2" disabled={loading} onClick={handleToggle} variant="primary">
          {loading && (
            <Spinner animation="border" aria-hidden="true" as="span" className="me-2" size="sm" />
          )}
          {loading ? '提交中...' : '提交'}
        </Button>
        <Button disabled={loading} onClick={handleReset} variant="outline-secondary">
          重置
        </Button>
        <p className="mb-0 mt-3 text-muted small">
          通过 state 控制按钮的加载状态，当前状态：{loading ? '加载中' : '空闲'}
        </p>
      </DemoSection>
    </>
  );

  return (
    <DocTemplate
      componentDescription="基于 Bootstrap 5 的加载指示器组件，用于表明组件或页面的加载状态，支持 border/grow 两种动画、8 种颜色变体、sm 尺寸与自定义尺寸，以及按钮内使用"
      componentName="Spinner"
      componentTags={['基础', '反馈']}
      demoContent={demoContent}
      props={spinnerProps}
      typeDefinitions={spinnerTypeDefinitions}
    />
  );
};

export default SpinnerDoc;
