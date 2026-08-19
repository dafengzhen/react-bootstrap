import { useState } from 'react';

import {
  type ApiProp,
  type ApiTypeDefinition,
  DemoSection,
  DocTemplate,
} from '../../internal/doc-template';
import { Button } from '../button';
import { Badge } from './badge';
import basicCode from './demos/basic.md?raw';
import buttonsCode from './demos/buttons.md?raw';
import interactiveCode from './demos/interactive.md?raw';
import linksCode from './demos/links.md?raw';
import pillCode from './demos/pill.md?raw';
import variantsCode from './demos/variants.md?raw';
import badgeBgTypeCode from './types/badge-bg.md?raw';
import badgePropsTypeCode from './types/badge-props.md?raw';
import badgeTextTypeCode from './types/badge-text.md?raw';

const badgeProps: ApiProp[] = [
  {
    defaultValue: "'span'",
    description: '渲染的根元素类型，可传入 `a`、`button` 等以复用徽章样式',
    name: 'as',
    type: 'ElementType',
  },
  {
    defaultValue: "'primary'",
    description: '徽章背景色变体，对应 Bootstrap 的 `text-bg-*` 工具类',
    name: 'bg',
    type: 'BadgeBg',
  },
  {
    defaultValue: '-',
    description: '徽章内容',
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
    description: '链接地址，与 `as="a"` 配合使用',
    name: 'href',
    type: 'string',
  },
  {
    defaultValue: 'false',
    description: '是否使用胶囊（全圆角）形状',
    name: 'pill',
    type: 'boolean',
  },
  {
    defaultValue: '-',
    description: '徽章文字颜色，提供后使用 `bg-*` 与 `text-*` 组合替代 `text-bg-*`',
    name: 'text',
    type: 'BadgeText',
  },
  {
    defaultValue: '-',
    description: '根元素的所有原生属性（如 `href`、`onClick` 等）',
    name: '...rest',
    type: 'HTMLAttributes',
  },
];

const badgeTypeDefinitions: ApiTypeDefinition[] = [
  {
    code: badgeBgTypeCode,
    description: '徽章背景色变体类型',
    name: 'BadgeBg',
  },
  {
    code: badgePropsTypeCode,
    description: '徽章组件属性接口',
    name: 'BadgeProps',
  },
  {
    code: badgeTextTypeCode,
    description: '徽章文字颜色类型',
    name: 'BadgeText',
  },
];

export const BadgeDoc = () => {
  const [count, setCount] = useState(0);

  const handleIncrement = () => {
    setCount((prev) => prev + 1);
  };

  const handleReset = () => {
    setCount(0);
  };

  const demoContent = (
    <>
      <DemoSection code={basicCode} title="基础用法">
        <div>
          <h1>
            标题一 <Badge bg="secondary">New</Badge>
          </h1>
          <h2>
            标题二 <Badge bg="secondary">New</Badge>
          </h2>
          <h3>
            标题三 <Badge bg="secondary">New</Badge>
          </h3>
          <h4>
            标题四 <Badge bg="secondary">New</Badge>
          </h4>
          <h5>
            标题五 <Badge bg="secondary">New</Badge>
          </h5>
          <h6>
            标题六 <Badge bg="secondary">New</Badge>
          </h6>
        </div>
        <p className="mb-0 mt-3 text-muted small">
          徽章使用相对字号（em 单位），会随父元素的字号自动缩放
        </p>
      </DemoSection>

      <DemoSection code={variantsCode} title="背景色变体">
        <div className="d-flex flex-wrap gap-2">
          <Badge bg="primary">Primary</Badge>
          <Badge bg="secondary">Secondary</Badge>
          <Badge bg="success">Success</Badge>
          <Badge bg="danger">Danger</Badge>
          <Badge bg="warning">Warning</Badge>
          <Badge bg="info">Info</Badge>
          <Badge bg="light">Light</Badge>
          <Badge bg="dark">Dark</Badge>
          <Badge bg="body-secondary">Body Secondary</Badge>
        </div>
      </DemoSection>

      <DemoSection code={pillCode} title="胶囊徽章">
        <div className="d-flex flex-wrap gap-2">
          <Badge bg="primary" pill>
            Primary
          </Badge>
          <Badge bg="secondary" pill>
            Secondary
          </Badge>
          <Badge bg="success" pill>
            Success
          </Badge>
          <Badge bg="danger" pill>
            Danger
          </Badge>
          <Badge bg="warning" pill>
            Warning
          </Badge>
          <Badge bg="info" pill>
            Info
          </Badge>
          <Badge bg="light" pill>
            Light
          </Badge>
          <Badge bg="dark" pill>
            Dark
          </Badge>
        </div>
      </DemoSection>

      <DemoSection code={buttonsCode} title="按钮中的徽章">
        <div className="d-flex flex-wrap gap-3 align-items-center">
          <Button variant="primary">
            通知 <Badge bg="secondary">4</Badge>
          </Button>
          <Button className="position-relative" variant="primary">
            收件箱
            <Badge bg="danger" className="position-absolute top-0 start-100 translate-middle" pill>
              99+
            </Badge>
          </Button>
        </div>
      </DemoSection>

      <DemoSection code={linksCode} title="链接徽章">
        <div className="d-flex flex-wrap gap-2">
          <Badge as="a" bg="primary" href="#">
            Primary
          </Badge>
          <Badge as="a" bg="secondary" href="#">
            Secondary
          </Badge>
          <Badge as="a" bg="success" href="#">
            Success
          </Badge>
          <Badge as="a" bg="danger" href="#">
            Danger
          </Badge>
          <Badge as="a" bg="warning" href="#">
            Warning
          </Badge>
          <Badge as="a" bg="info" href="#">
            Info
          </Badge>
          <Badge as="a" bg="light" href="#">
            Light
          </Badge>
          <Badge as="a" bg="dark" href="#">
            Dark
          </Badge>
        </div>
      </DemoSection>

      <DemoSection code={interactiveCode} title="交互演示">
        <div className="d-flex align-items-center gap-3">
          <Button onClick={handleIncrement} variant="primary">
            消息
            <Badge bg="danger" className="ms-1">
              {count}
            </Badge>
          </Button>
          <Button onClick={handleReset} size="sm" variant="outline-secondary">
            重置
          </Button>
          <span className="text-muted small">点击「消息」按钮，徽章计数会增加</span>
        </div>
      </DemoSection>
    </>
  );

  return (
    <DocTemplate
      componentDescription="基于 Bootstrap 5 的徽章组件，用于展示状态、数量或标签等小范围内容，支持多种背景色、胶囊形状、按钮与链接形式，并随父元素字号自动缩放"
      componentName="Badge"
      componentTags={['基础', '反馈']}
      demoContent={demoContent}
      props={badgeProps}
      typeDefinitions={badgeTypeDefinitions}
    />
  );
};

export default BadgeDoc;
