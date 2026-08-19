import { useState } from 'react';

import {
  type ApiProp,
  type ApiTypeDefinition,
  DemoSection,
  DocTemplate,
} from '../../internal/doc-template';
import { Button } from '../button';
import { Card, CardBody, CardImg, CardText, CardTitle } from '../card';
import animationCode from './demos/animation.md?raw';
import basicCode from './demos/basic.md?raw';
import cardCode from './demos/card.md?raw';
import colorCode from './demos/color.md?raw';
import interactiveCode from './demos/interactive.md?raw';
import sizingCode from './demos/sizing.md?raw';
import widthCode from './demos/width.md?raw';
import { Placeholder, PlaceholderButton } from './index';
import placeholderAnimationTypeCode from './types/placeholder-animation.md?raw';
import placeholderBgTypeCode from './types/placeholder-bg.md?raw';
import placeholderButtonPropsTypeCode from './types/placeholder-button-props.md?raw';
import placeholderPropsTypeCode from './types/placeholder-props.md?raw';
import placeholderSizeTypeCode from './types/placeholder-size.md?raw';

const CARD_IMAGE = `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(
  '<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="180" role="img" aria-label="占位图片" preserveAspectRatio="xMidYMid slice" viewBox="0 0 318 180"><rect width="100%" height="100%" fill="#868e96"/><text x="50%" y="50%" dy=".3em" fill="#dee2e6" style="font-size:1.125rem;text-anchor:middle">图片</text></svg>',
)}`;

const placeholderProps: ApiProp[] = [
  {
    component: 'Placeholder',
    defaultValue: '-',
    description:
      '占位符动画，`glow`/`wave` 分别渲染 `placeholder-glow`/`placeholder-wave` 类并替换默认的 `placeholder` 类，通常渲染为包裹多个占位符的容器元素',
    name: 'animation',
    type: 'PlaceholderAnimation',
  },
  {
    component: 'Placeholder',
    defaultValue: "'span'",
    description: '渲染的元素标签，配合 animation 时可渲染为 `p`、`div` 等容器元素',
    name: 'as',
    type: 'ElementType',
  },
  {
    component: 'Placeholder',
    defaultValue: '-',
    description: '背景色，渲染 `bg-*` 类以覆盖默认的 `currentColor` 背景',
    name: 'bg',
    type: 'PlaceholderBg',
  },
  {
    component: 'Placeholder',
    defaultValue: '-',
    description:
      '占位符尺寸，`lg`/`sm`/`xs` 分别渲染 `placeholder-lg`/`placeholder-sm`/`placeholder-xs` 类',
    name: 'size',
    type: 'PlaceholderSize',
  },
  {
    component: 'Placeholder',
    defaultValue: '-',
    description:
      '网格列宽度，数字渲染 `col-{n}` 类，`auto` 渲染 `col-auto` 类，`true` 渲染 `col` 类',
    name: 'xs',
    type: "'auto' | boolean | number",
  },
  {
    component: 'PlaceholderButton',
    defaultValue: '-',
    description:
      '占位按钮动画，渲染 `placeholder-glow`/`placeholder-wave` 类并替换默认的 `placeholder` 类',
    name: 'animation',
    type: 'PlaceholderAnimation',
  },
  {
    component: 'PlaceholderButton',
    defaultValue: '-',
    description: '背景色，渲染 `bg-*` 类以覆盖按钮默认背景',
    name: 'bg',
    type: 'PlaceholderBg',
  },
  {
    component: 'PlaceholderButton',
    defaultValue: '-',
    description: '占位按钮尺寸，渲染 `placeholder-lg`/`placeholder-sm`/`placeholder-xs` 类',
    name: 'size',
    type: 'PlaceholderSize',
  },
  {
    component: 'PlaceholderButton',
    defaultValue: "'primary'",
    description: '按钮变体，渲染 `btn-*` 类并透传给 Button 组件',
    name: 'variant',
    type: 'ButtonVariant',
  },
  {
    component: 'PlaceholderButton',
    defaultValue: '-',
    description:
      '网格列宽度，数字渲染 `col-{n}` 类，`auto` 渲染 `col-auto` 类，`true` 渲染 `col` 类',
    name: 'xs',
    type: "'auto' | boolean | number",
  },
  {
    defaultValue: '-',
    description: '占位符内容，可用 `&nbsp;` 等占位内容撑起与真实内容一致的高度',
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
    description:
      '透传原生元素属性（如 `onClick`、`style` 等），PlaceholderButton 透传给 Button 组件',
    name: '...rest',
    type: 'HTMLAttributes | ButtonHTMLAttributes',
  },
];

const placeholderTypeDefinitions: ApiTypeDefinition[] = [
  {
    code: placeholderAnimationTypeCode,
    description: '占位符动画类型',
    name: 'PlaceholderAnimation',
  },
  {
    code: placeholderBgTypeCode,
    description: '占位符背景色类型',
    name: 'PlaceholderBg',
  },
  {
    code: placeholderButtonPropsTypeCode,
    description: '占位按钮组件属性接口',
    name: 'PlaceholderButtonProps',
  },
  {
    code: placeholderPropsTypeCode,
    description: '占位符组件属性接口',
    name: 'PlaceholderProps',
  },
  {
    code: placeholderSizeTypeCode,
    description: '占位符尺寸类型',
    name: 'PlaceholderSize',
  },
];

export const PlaceholderDoc = () => {
  const [loading, setLoading] = useState(true);

  const demoContent = (
    <>
      <DemoSection code={basicCode} title="基础示例">
        <p aria-hidden="true">
          <Placeholder xs={6} />
        </p>
        <PlaceholderButton xs={4} />
        <p className="mb-0 mt-3 text-muted small">
          占位符由 `placeholder` 类与网格列类（如
          `col-6`）组合而成，用于指示内容仍在加载中；对屏幕阅读器隐藏的占位内容建议添加
          `aria-hidden="true"`
        </p>
      </DemoSection>

      <DemoSection code={cardCode} title="卡片加载占位">
        <div className="d-flex flex-wrap gap-3 justify-content-around">
          <Card style={{ width: '18rem' }}>
            <CardImg src={CARD_IMAGE} />
            <CardBody>
              <CardTitle>卡片标题</CardTitle>
              <CardText>一些用于构建卡片标题并构成卡片主体内容的快速示例文本。</CardText>
              <Button variant="primary">前往某处</Button>
            </CardBody>
          </Card>

          <Card aria-hidden="true" style={{ width: '18rem' }}>
            <Placeholder as="div" className="card-img-top" style={{ height: 180 }} />
            <CardBody>
              <CardTitle className="placeholder-glow">
                <Placeholder xs={6} />
              </CardTitle>
              <CardText className="placeholder-glow">
                <Placeholder xs={7} />
                <Placeholder xs={4} />
                <Placeholder xs={4} />
                <Placeholder xs={6} />
                <Placeholder xs={8} />
              </CardText>
              <PlaceholderButton xs={6} />
            </CardBody>
          </Card>
        </div>
        <p className="mb-0 mt-3 text-muted small">
          将占位符应用到卡片各区域即可构建“加载卡片”，尺寸与比例和真实卡片保持一致，切换状态时需要编写少量
          JavaScript 来替换内容
        </p>
      </DemoSection>

      <DemoSection code={widthCode} title="宽度">
        <Placeholder xs={6} />
        <Placeholder className="w-75" />
        <Placeholder style={{ width: '25%' }} />
        <p className="mb-0 mt-3 text-muted small">
          宽度可通过网格列类（xs 渲染 `col-*`）、宽度工具类或内联样式调整
        </p>
      </DemoSection>

      <DemoSection code={colorCode} title="颜色">
        <Placeholder xs={12} />
        <Placeholder bg="primary" xs={12} />
        <Placeholder bg="secondary" xs={12} />
        <Placeholder bg="success" xs={12} />
        <Placeholder bg="danger" xs={12} />
        <Placeholder bg="warning" xs={12} />
        <Placeholder bg="info" xs={12} />
        <Placeholder bg="light" xs={12} />
        <Placeholder bg="dark" xs={12} />
        <p className="mb-0 mt-3 text-muted small">
          默认使用 `currentColor` 作为背景，可通过 bg 渲染 `bg-*` 类覆盖为任意主题色
        </p>
      </DemoSection>

      <DemoSection code={sizingCode} title="尺寸">
        <Placeholder size="lg" xs={12} />
        <Placeholder xs={12} />
        <Placeholder size="sm" xs={12} />
        <Placeholder size="xs" xs={12} />
        <p className="mb-0 mt-3 text-muted small">
          占位符尺寸基于父元素排版样式，size 分别渲染
          `placeholder-lg`/`placeholder-sm`/`placeholder-xs` 类进行调整
        </p>
      </DemoSection>

      <DemoSection code={animationCode} title="动画">
        <Placeholder animation="glow" as="p">
          <Placeholder xs={7} />
          <Placeholder xs={4} />
          <Placeholder xs={4} />
          <Placeholder xs={6} />
          <Placeholder xs={8} />
        </Placeholder>

        <Placeholder animation="wave" as="p" className="mb-0">
          <Placeholder xs={12} />
        </Placeholder>
        <p className="mb-0 mt-3 text-muted small">
          animation 渲染 `placeholder-glow`/`placeholder-wave`
          类，为占位符添加发光或波浪动画，更直观地传达“正在加载”的状态
        </p>
      </DemoSection>

      <DemoSection code={interactiveCode} title="交互示例">
        <Button className="mb-3" onClick={() => setLoading(!loading)} variant="secondary">
          {loading ? '加载完成' : '开始加载'}
        </Button>

        {loading ? (
          <Card aria-hidden="true" style={{ width: '18rem' }}>
            <Placeholder as="div" className="card-img-top" style={{ height: 180 }} />
            <CardBody>
              <CardTitle className="placeholder-glow">
                <Placeholder xs={6} />
              </CardTitle>
              <CardText className="placeholder-glow">
                <Placeholder xs={7} />
                <Placeholder xs={4} />
                <Placeholder xs={4} />
                <Placeholder xs={6} />
                <Placeholder xs={8} />
              </CardText>
              <PlaceholderButton xs={6} />
            </CardBody>
          </Card>
        ) : (
          <Card style={{ width: '18rem' }}>
            <CardImg src={CARD_IMAGE} />
            <CardBody>
              <CardTitle>卡片标题</CardTitle>
              <CardText>加载完成后的真实内容。</CardText>
              <Button variant="primary">前往某处</Button>
            </CardBody>
          </Card>
        )}
        <p className="mb-0 mt-3 text-muted small">
          通过 state 控制加载状态即可在占位内容与真实内容之间切换，当前状态：
          {loading ? '加载中' : '已加载'}
        </p>
      </DemoSection>
    </>
  );

  return (
    <DocTemplate
      componentDescription="基于 Bootstrap 5 的占位符组件，用于为组件或页面构建骨架屏加载状态，支持网格列宽度、主题背景色、lg/sm/xs 三种尺寸、glow/wave 动画以及占位按钮"
      componentName="Placeholder"
      componentTags={['基础', '反馈']}
      demoContent={demoContent}
      props={placeholderProps}
      typeDefinitions={placeholderTypeDefinitions}
    />
  );
};

export default PlaceholderDoc;
