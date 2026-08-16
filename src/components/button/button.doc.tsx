import { useEffect, useRef, useState } from 'react';

import { type ApiProp, ApiTemplate, type ApiTypeDefinition, DemoSection } from '../doc-template';
import { Button } from './button';
import basicVariantsCode from './demos/basic-variants.md?raw';
import blockCode from './demos/block.md?raw';
import combinedCode from './demos/combined.md?raw';
import customClassesCode from './demos/custom-classes.md?raw';
import disabledCode from './demos/disabled.md?raw';
import interactiveCode from './demos/interactive.md?raw';
import loadingCode from './demos/loading.md?raw';
import outlineVariantsCode from './demos/outline-variants.md?raw';
import sizesCode from './demos/sizes.md?raw';

const buttonProps: ApiProp[] = [
  {
    defaultValue: "'primary'",
    description: '按钮视觉变体，支持所有 Bootstrap 5 内置变体及 outline 变体',
    name: 'variant',
    type: 'ButtonVariant',
  },
  {
    defaultValue: "'md'",
    description: '按钮大小，可选 `sm` 或 `lg`',
    name: 'size',
    type: 'ButtonSize',
  },
  {
    defaultValue: 'false',
    description: '是否占据父容器全部宽度',
    name: 'block',
    type: 'boolean',
  },
  {
    defaultValue: 'false',
    description: '是否禁用按钮',
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
    defaultValue: '-',
    description: '按钮子元素',
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
    code: `type ButtonVariant = 
  | 'primary' | 'secondary' | 'success' | 'danger' 
  | 'warning' | 'info' | 'light' | 'dark' | 'link'
  | 'outline-primary' | 'outline-secondary' | 'outline-success' 
  | 'outline-danger' | 'outline-warning' | 'outline-info' 
  | 'outline-light' | 'outline-dark';`,
    description: '按钮变体类型',
    name: 'ButtonVariant',
  },
  {
    code: `type ButtonSize = 'sm' | 'lg';`,
    description: '按钮尺寸类型',
    name: 'ButtonSize',
  },
  {
    code: `export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  block?: boolean;
  disabled?: boolean;
  loading?: boolean;
  loadingText?: string;
  children?: ReactNode;
  className?: string;
}`,
    description: '按钮组件属性接口',
    name: 'ButtonProps',
  },
];

export const ButtonDoc = () => {
  const loadingTimerRef = useRef<null | number>(null);
  const [clickCount, setClickCount] = useState(0);
  const [loading, setLoading] = useState(false);

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

      <DemoSection code={sizesCode} title="尺寸变体">
        <div className="d-flex flex-wrap gap-2 align-items-center">
          <Button size="sm">小按钮 (sm)</Button>
          <Button>默认尺寸 (md)</Button>
          <Button size="lg">大按钮 (lg)</Button>
        </div>
      </DemoSection>

      <DemoSection code={blockCode} title="块级按钮">
        <div className="d-flex flex-column gap-2" style={{ maxWidth: '400px' }}>
          <Button block>块级按钮</Button>
          <Button block variant="success">
            块级成功按钮
          </Button>
        </div>
      </DemoSection>

      <DemoSection code={disabledCode} title="禁用状态">
        <div className="d-flex flex-wrap gap-2">
          <Button disabled>禁用按钮</Button>
          <Button disabled variant="success">
            禁用成功
          </Button>
          <Button disabled variant="outline-danger">
            禁用轮廓
          </Button>
        </div>
      </DemoSection>

      <DemoSection code={loadingCode} title="加载状态">
        <div className="d-flex flex-wrap gap-2">
          <Button loading>加载中</Button>
          <Button loading loadingText="提交中...">
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
        </div>
      </DemoSection>

      <DemoSection code={customClassesCode} title="自定义样式">
        <div className="d-flex flex-wrap gap-2">
          <Button className="shadow-sm">带阴影</Button>
          <Button className="rounded-pill" variant="primary">
            圆角按钮
          </Button>
          <Button className="fw-bold" variant="success">
            粗体文字
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
    <ApiTemplate
      componentDescription="基于 Bootstrap 5 的通用按钮组件，支持多种变体、尺寸和状态"
      componentName="Button"
      demoContent={demoContent}
      props={buttonProps}
      typeDefinitions={buttonTypeDefinitions}
    />
  );
};

export default ButtonDoc;
