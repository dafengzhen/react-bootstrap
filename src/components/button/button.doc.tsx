import { type CSSProperties, useEffect, useRef, useState } from 'react';

import {
  type ApiProp,
  type ApiTypeDefinition,
  DemoSection,
  DocTemplate,
} from '../../internal/doc-template';
import { Button } from './button';
import baseCode from './demos/base.md?raw';
import basicVariantsCode from './demos/basic-variants.md?raw';
import blockCode from './demos/block.md?raw';
import combinedCode from './demos/combined.md?raw';
import customClassesCode from './demos/custom-classes.md?raw';
import disabledCode from './demos/disabled.md?raw';
import interactiveCode from './demos/interactive.md?raw';
import loadingCode from './demos/loading.md?raw';
import outlineVariantsCode from './demos/outline-variants.md?raw';
import sizesCode from './demos/sizes.md?raw';
import tagsCode from './demos/tags.md?raw';
import toggleCode from './demos/toggle.md?raw';
import buttonPropsTypeCode from './types/button-props.md?raw';
import buttonSizeTypeCode from './types/button-size.md?raw';
import buttonVariantTypeCode from './types/button-variant.md?raw';

const buttonProps: ApiProp[] = [
  {
    defaultValue: "'button'",
    description: '渲染的根元素，可传入 `a`、`input` 或任意组件',
    name: 'as',
    type: 'ElementType',
  },
  {
    defaultValue: '-',
    description: '按钮视觉变体，对应 Bootstrap 的 `btn-*` 类；不提供时仅应用基础 `btn` 类',
    name: 'variant',
    type: 'ButtonVariant',
  },
  {
    defaultValue: '-',
    description: '按钮大小，可选 `sm` 或 `lg`',
    name: 'size',
    type: 'ButtonSize',
  },
  {
    defaultValue: 'false',
    description: '激活状态：应用 `active` 类；与 `toggle` 配合时作为受控的按压状态',
    name: 'active',
    type: 'boolean',
  },
  {
    defaultValue: 'false',
    description: '`toggle` 按钮在非受控模式下的初始按压状态',
    name: 'defaultActive',
    type: 'boolean',
  },
  {
    defaultValue: 'false',
    description: '切换按钮：管理 `aria-pressed` 与 `active` 类，未提供 `active` 时点击自动切换',
    name: 'toggle',
    type: 'boolean',
  },
  {
    defaultValue: 'false',
    description: '是否占据父容器全部宽度（`w-100`），建议配合 `d-grid` 容器使用',
    name: 'block',
    type: 'boolean',
  },
  {
    defaultValue: 'false',
    description:
      '是否禁用按钮；渲染为 `a` 时会应用 `disabled` 类、`aria-disabled` 与 `tabIndex=-1`',
    name: 'disabled',
    type: 'boolean',
  },
  {
    defaultValue: 'false',
    description: '是否显示加载状态',
    name: 'loading',
    type: 'boolean',
  },
  {
    defaultValue: '-',
    description: '加载状态显示的文本，若未提供则显示 `children`',
    name: 'loadingText',
    type: 'string',
  },
  {
    defaultValue: "'button'",
    description: '原生 `type` 属性，仅对 `button` 与 `input` 元素生效',
    name: 'type',
    type: 'string',
  },
  {
    defaultValue: '-',
    description: '链接地址，提供后自动渲染为 `a` 元素；可配合 `target`、`rel`、`download` 使用',
    name: 'href',
    type: 'string',
  },
  {
    defaultValue: '-',
    description: '按钮子元素（`as="input"` 时忽略，请改用 `value`）',
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
    description: '原生 button 元素的所有属性（如 `onClick`、`onFocus` 等）',
    name: '...rest',
    type: 'ButtonHTMLAttributes',
  },
];

const buttonTypeDefinitions: ApiTypeDefinition[] = [
  {
    code: buttonVariantTypeCode,
    description: '按钮变体类型',
    name: 'ButtonVariant',
  },
  {
    code: buttonSizeTypeCode,
    description: '按钮尺寸类型',
    name: 'ButtonSize',
  },
  {
    code: buttonPropsTypeCode,
    description: '按钮组件属性接口',
    name: 'ButtonProps',
  },
];

const customSizeStyle = {
  '--bs-btn-font-size': '.75rem',
  '--bs-btn-padding-x': '.5rem',
  '--bs-btn-padding-y': '.25rem',
} as CSSProperties;

export const ButtonDoc = () => {
  const loadingTimerRef = useRef<null | number>(null);
  const [clickCount, setClickCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [toggled, setToggled] = useState(false);

  useEffect(
    () => () => {
      if (loadingTimerRef.current !== null) {
        clearTimeout(loadingTimerRef.current);
      }
    },
    [],
  );

  const handleLoadingClick = () => {
    setLoading(true);
    if (loadingTimerRef.current !== null) {
      clearTimeout(loadingTimerRef.current);
    }
    loadingTimerRef.current = setTimeout(() => {
      loadingTimerRef.current = null;
      setLoading(false);
    }, 3000);
  };

  const handleCountClick = () => {
    setClickCount((prev) => prev + 1);
  };

  const demoContent = (
    <>
      <DemoSection code={baseCode} title="基础类">
        <div>
          <Button>基础类按钮</Button>
        </div>
        <p className="mb-0 mt-3 text-muted small">
          仅使用基础 `btn` 类时不带任何变体样式，可在此基础上自定义，注意为 `:focus`
          状态提供明确的样式
        </p>
      </DemoSection>

      <DemoSection code={basicVariantsCode} title="基础变体">
        <div className="d-flex flex-wrap gap-2">
          <Button variant="primary">主要</Button>
          <Button variant="secondary">次要</Button>
          <Button variant="success">成功</Button>
          <Button variant="danger">危险</Button>
          <Button variant="warning">警告</Button>
          <Button variant="info">信息</Button>
          <Button variant="light">亮色</Button>
          <Button variant="dark">暗色</Button>
          <Button variant="link">链接</Button>
        </div>
      </DemoSection>

      <DemoSection code={outlineVariantsCode} title="轮廓变体">
        <div className="d-flex flex-wrap gap-2">
          <Button variant="outline-primary">主要</Button>
          <Button variant="outline-secondary">次要</Button>
          <Button variant="outline-success">成功</Button>
          <Button variant="outline-danger">危险</Button>
          <Button variant="outline-warning">警告</Button>
          <Button variant="outline-info">信息</Button>
          <Button variant="outline-light">亮色</Button>
          <Button variant="outline-dark">暗色</Button>
        </div>
      </DemoSection>

      <DemoSection code={sizesCode} title="尺寸">
        <div className="d-flex flex-wrap gap-2 align-items-center">
          <Button size="sm" variant="primary">
            小按钮 (sm)
          </Button>
          <Button variant="primary">默认尺寸</Button>
          <Button size="lg" variant="primary">
            大按钮 (lg)
          </Button>
          <Button style={customSizeStyle} variant="primary">
            自定义尺寸
          </Button>
        </div>
      </DemoSection>

      <DemoSection code={tagsCode} title="按钮标签">
        <div className="d-flex flex-wrap gap-2">
          {/* oxlint-disable-next-line jsx-a11y/prefer-tag-over-role */}
          <Button as="a" href="#" role="button" variant="primary">
            a 链接
          </Button>
          {/* oxlint-disable-next-line jsx-a11y/prefer-tag-over-role */}
          <Button href="#" role="button" variant="primary">
            href 自动渲染为 a
          </Button>
          <Button as="input" type="button" value="Input 按钮" variant="primary" />
          <Button as="input" type="submit" value="Submit 按钮" variant="primary" />
          <Button as="input" type="reset" value="Reset 按钮" variant="primary" />
        </div>
        <p className="mb-0 mt-3 text-muted small">
          `btn` 类同样适用于 `a` 与 `input` 元素；用于触发页内功能（而非跳转）的链接按钮应添加
          `role="button"`
        </p>
      </DemoSection>

      <DemoSection code={disabledCode} title="禁用状态">
        <div className="d-flex flex-wrap gap-2">
          <Button disabled variant="primary">
            禁用按钮
          </Button>
          <Button disabled variant="outline-danger">
            禁用轮廓按钮
          </Button>
          {/* oxlint-disable-next-line jsx-a11y/prefer-tag-over-role */}
          <Button as="a" disabled href="#" role="button" variant="primary">
            禁用链接
          </Button>
          {/* oxlint-disable-next-line jsx-a11y/prefer-tag-over-role */}
          <Button as="a" disabled role="button" variant="secondary">
            无 href 的禁用链接
          </Button>
        </div>
        <p className="mb-0 mt-3 text-muted small">
          禁用链接会自动应用 `disabled` 类、`aria-disabled="true"` 与 `tabIndex=-1`，建议同时移除
          `href`
        </p>
      </DemoSection>

      <DemoSection code={blockCode} title="块级按钮">
        <div className="d-grid gap-2" style={{ maxWidth: '400px' }}>
          <Button block variant="primary">
            块级按钮
          </Button>
          <Button block variant="success">
            块级成功按钮
          </Button>
        </div>
        <p className="mb-0 mt-3 text-muted small">
          `block` 为按钮添加 `w-100`，配合 `d-grid gap-2` 容器即可创建响应式的全宽按钮堆叠
        </p>
      </DemoSection>

      <DemoSection code={toggleCode} title="切换状态">
        <div className="d-flex flex-wrap gap-2">
          <Button toggle>切换按钮</Button>
          <Button defaultActive toggle>
            预激活切换按钮
          </Button>
          <Button disabled toggle>
            禁用切换按钮
          </Button>
          <Button toggle variant="primary">
            主要切换按钮
          </Button>
          <Button defaultActive toggle variant="primary">
            预激活主要按钮
          </Button>
        </div>
        <p className="mb-0 mt-3 text-muted small">
          切换状态由 React 管理（无需引入 Bootstrap JS）：点击自动切换 `active` 类与
          `aria-pressed`，受控场景使用 `active`
        </p>
      </DemoSection>

      <DemoSection code={loadingCode} title="加载状态">
        <div className="d-flex flex-wrap gap-2">
          <Button loading variant="primary">
            加载中
          </Button>
          <Button loading loadingText="提交中..." variant="secondary">
            提交
          </Button>
          <Button loading loadingText="保存中..." variant="success">
            保存
          </Button>
          <Button loading loadingText="删除中..." variant="danger">
            删除
          </Button>
        </div>
      </DemoSection>

      <DemoSection code={interactiveCode} title="交互演示">
        <div className="d-flex flex-wrap gap-3">
          <div className="d-flex flex-wrap gap-2 align-items-center">
            <Button
              loading={loading}
              loadingText="处理中..."
              onClick={handleLoadingClick}
              variant="primary"
            >
              点击触发加载
            </Button>
            <span className="text-muted small">
              {loading ? '模拟异步操作...' : '点击触发 3 秒加载状态'}
            </span>
          </div>

          <div className="d-flex flex-wrap gap-2 align-items-center">
            <Button onClick={handleCountClick} variant="success">
              点击计数: {clickCount}
            </Button>
            <span className="text-muted small">每次点击增加计数</span>
          </div>

          <div className="d-flex flex-wrap gap-2 align-items-center">
            <Button
              active={toggled}
              onClick={() => setToggled((prev) => !prev)}
              toggle
              variant="info"
            >
              受控切换: {toggled ? '已激活' : '未激活'}
            </Button>
            <span className="text-muted small">active 受控的切换按钮</span>
          </div>
        </div>
      </DemoSection>

      <DemoSection code={customClassesCode} title="自定义样式">
        <div className="d-flex flex-wrap gap-2">
          <Button className="shadow-sm" variant="secondary">
            带阴影
          </Button>
          <Button className="rounded-pill" variant="primary">
            圆角按钮
          </Button>
          <Button className="fw-bold" variant="success">
            粗体文字
          </Button>
          <Button className="text-nowrap" variant="info">
            超长文字不换行按钮示例
          </Button>
        </div>
      </DemoSection>

      <DemoSection code={combinedCode} title="组合使用">
        <div className="d-flex flex-column gap-2" style={{ maxWidth: '500px' }}>
          <Button block size="lg" variant="primary">
            大型块级主要按钮
          </Button>
          <Button loading loadingText="加载中..." size="sm" variant="outline-success">
            小型加载轮廓按钮
          </Button>
        </div>
      </DemoSection>
    </>
  );

  return (
    <DocTemplate
      componentDescription="基于 Bootstrap 5 的通用按钮组件，支持多种变体、尺寸与状态，可渲染为 button、a、input 等元素，并提供切换与加载能力"
      componentName="Button"
      componentTags={['基础', '表单']}
      demoContent={demoContent}
      props={buttonProps}
      typeDefinitions={buttonTypeDefinitions}
    />
  );
};

export default ButtonDoc;
