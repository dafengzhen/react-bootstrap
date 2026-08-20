import { useState } from 'react';

import {
  type ApiProp,
  type ApiTypeDefinition,
  DemoSection,
  DocTemplate,
} from '../../internal/doc-template';
import { Button } from '../button';
import autohideCode from './demos/autohide.md?raw';
import basicCode from './demos/basic.md?raw';
import customCode from './demos/custom.md?raw';
import placementCode from './demos/placement.md?raw';
import stackingCode from './demos/stacking.md?raw';
import variantsCode from './demos/variants.md?raw';
import {
  Toast,
  ToastBody,
  ToastClose,
  ToastContainer,
  ToastHeader,
  type ToastPlacement,
} from './index';
import toastAnimationStatusTypeCode from './types/toast-animation-status.md?raw';
import toastBodyPropsTypeCode from './types/toast-body-props.md?raw';
import toastClosePropsTypeCode from './types/toast-close-props.md?raw';
import toastContainerPropsTypeCode from './types/toast-container-props.md?raw';
import toastContextValueTypeCode from './types/toast-context-value.md?raw';
import toastHeaderPropsTypeCode from './types/toast-header-props.md?raw';
import toastPlacementTypeCode from './types/toast-placement.md?raw';
import toastPositionTypeCode from './types/toast-position.md?raw';
import toastPropsTypeCode from './types/toast-props.md?raw';
import toastVariantTypeCode from './types/toast-variant.md?raw';

const toastProps: ApiProp[] = [
  {
    defaultValue: 'true',
    description: '是否在 `delay` 毫秒后自动隐藏，鼠标悬停在 Toast 上时暂停计时，移出后重新计时',
    name: 'autohide',
    type: 'boolean',
  },
  {
    defaultValue: '5000',
    description: '自动隐藏延时（毫秒），`autohide` 为 `false` 时忽略',
    name: 'delay',
    type: 'number',
  },
  {
    defaultValue: '300',
    description: '显示与隐藏过渡动画时长（毫秒），系统开启减少动态效果时自动为 0',
    name: 'duration',
    type: 'number',
  },
  {
    defaultValue: '-',
    description:
      '受控的显示状态，为 `false` 时播放退出动画后卸载；未提供时组件自行管理（初始显示）',
    name: 'show',
    type: 'boolean',
  },
  {
    defaultValue: '-',
    description: '请求关闭回调，由关闭按钮或自动隐藏触发，受控模式下由使用者更新 `show`',
    name: 'onClose',
    type: '() => void',
  },
  {
    defaultValue: '-',
    description: '颜色变体，对应 Bootstrap 的 `text-bg-*` 工具类',
    name: 'variant',
    type: 'ToastVariant',
  },
  {
    defaultValue: "'alert'",
    description: '无障碍角色，不重要的通知可改为 `"status"`',
    name: 'role',
    type: 'AriaRole',
  },
  {
    defaultValue: "'assertive'",
    description: '无障碍实时区域属性，通知整个 Toast 的变更',
    name: 'aria-live',
    type: "'assertive' | 'off' | 'polite'",
  },
  {
    defaultValue: 'true',
    description: '无障碍原子性，确保 Toast 内容作为整体被读屏软件播报',
    name: 'aria-atomic',
    type: 'boolean',
  },
  {
    defaultValue: '-',
    description: 'Toast 内容，配合 `ToastHeader`、`ToastBody` 等子组件使用',
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
    description: '透传原生 div 元素的所有属性（如 `onClick`、`onMouseEnter` 等）',
    name: '...rest',
    type: 'HTMLAttributes',
  },
];

const toastContainerProps: ApiProp[] = [
  {
    component: 'ToastContainer',
    defaultValue: "'absolute'",
    description: '容器定位方式，`static` 用于将多条 Toast 堆叠在文档流中，`fixed` 用于固定到视口',
    name: 'position',
    type: 'ToastPosition',
  },
  {
    component: 'ToastContainer',
    defaultValue: '-',
    description:
      '容器方位（左上、顶部居中、右上、左中、居中、右中、左下、底部居中、右下），映射为 Bootstrap 定位工具类；未提供时需自行通过 `className` 指定位置',
    name: 'placement',
    type: 'ToastPlacement',
  },
  {
    component: 'ToastContainer',
    defaultValue: '-',
    description: '容器内容，通常为一条或多条 `Toast`',
    name: 'children',
    type: 'ReactNode',
  },
  {
    component: 'ToastContainer',
    defaultValue: '-',
    description: '自定义类名',
    name: 'className',
    type: 'string',
  },
  {
    component: 'ToastContainer',
    defaultValue: '-',
    description: '透传原生 div 元素的所有属性（如 `aria-live` 等）',
    name: '...rest',
    type: 'HTMLAttributes',
  },
];

const toastHeaderProps: ApiProp[] = [
  {
    component: 'ToastHeader',
    defaultValue: 'true',
    description: '是否渲染关闭按钮',
    name: 'closeButton',
    type: 'boolean',
  },
  {
    component: 'ToastHeader',
    defaultValue: "'Close'",
    description: '关闭按钮的无障碍标签',
    name: 'closeLabel',
    type: 'string',
  },
  {
    component: 'ToastHeader',
    defaultValue: '-',
    description: '页眉内容，如标题、时间等',
    name: 'children',
    type: 'ReactNode',
  },
  {
    component: 'ToastHeader',
    defaultValue: '-',
    description: '自定义类名',
    name: 'className',
    type: 'string',
  },
  {
    component: 'ToastHeader',
    defaultValue: '-',
    description: '透传原生 div 元素的所有属性',
    name: '...rest',
    type: 'HTMLAttributes',
  },
];

const toastBodyProps: ApiProp[] = [
  {
    component: 'ToastBody',
    defaultValue: '-',
    description: '正文内容',
    name: 'children',
    type: 'ReactNode',
  },
  {
    component: 'ToastBody',
    defaultValue: '-',
    description: '自定义类名',
    name: 'className',
    type: 'string',
  },
  {
    component: 'ToastBody',
    defaultValue: '-',
    description: '透传原生 div 元素的所有属性',
    name: '...rest',
    type: 'HTMLAttributes',
  },
];

const toastCloseProps: ApiProp[] = [
  {
    component: 'ToastClose',
    defaultValue: "'Close'",
    description: '无障碍标签',
    name: 'aria-label',
    type: 'string',
  },
  {
    component: 'ToastClose',
    defaultValue: "'button'",
    description: '按钮类型',
    name: 'type',
    type: 'string',
  },
  {
    component: 'ToastClose',
    defaultValue: '-',
    description: '点击关闭按钮时触发的额外回调',
    name: 'onClick',
    type: 'MouseEventHandler<HTMLButtonElement>',
  },
  {
    component: 'ToastClose',
    defaultValue: '-',
    description: '按钮内容',
    name: 'children',
    type: 'ReactNode',
  },
  {
    component: 'ToastClose',
    defaultValue: '-',
    description: '自定义类名',
    name: 'className',
    type: 'string',
  },
  {
    component: 'ToastClose',
    defaultValue: '-',
    description: '透传原生 button 元素的所有属性',
    name: '...rest',
    type: 'ButtonHTMLAttributes',
  },
];

const toastPropsGroups = [
  ...toastProps,
  ...toastContainerProps,
  ...toastHeaderProps,
  ...toastBodyProps,
  ...toastCloseProps,
];

const toastTypeDefinitions: ApiTypeDefinition[] = [
  {
    code: toastVariantTypeCode,
    description: 'Toast 颜色变体类型',
    name: 'ToastVariant',
  },
  {
    code: toastPlacementTypeCode,
    description: 'Toast 容器方位类型',
    name: 'ToastPlacement',
  },
  {
    code: toastPositionTypeCode,
    description: 'Toast 容器定位方式类型',
    name: 'ToastPosition',
  },
  {
    code: toastAnimationStatusTypeCode,
    description: 'Toast 过渡动画状态类型',
    name: 'ToastAnimationStatus',
  },
  {
    code: toastPropsTypeCode,
    description: 'Toast 组件属性接口',
    name: 'ToastProps',
  },
  {
    code: toastContainerPropsTypeCode,
    description: 'Toast 容器组件属性接口',
    name: 'ToastContainerProps',
  },
  {
    code: toastHeaderPropsTypeCode,
    description: 'Toast 页眉组件属性接口',
    name: 'ToastHeaderProps',
  },
  {
    code: toastBodyPropsTypeCode,
    description: 'Toast 正文组件属性接口',
    name: 'ToastBodyProps',
  },
  {
    code: toastClosePropsTypeCode,
    description: 'Toast 关闭按钮组件属性接口',
    name: 'ToastCloseProps',
  },
  {
    code: toastContextValueTypeCode,
    description: 'Toast 上下文，供 ToastHeader、ToastClose 等子组件消费',
    name: 'ToastContextValue',
  },
];

export const ToastDoc = () => {
  const [autoDelay, setAutoDelay] = useState(1000);
  const [autoShow, setAutoShow] = useState(false);
  const [basicShow, setBasicShow] = useState(false);
  const [customShow, setCustomShow] = useState(false);
  const [defaultDelayShow, setDefaultDelayShow] = useState(false);
  const [fixedShow, setFixedShow] = useState(false);
  const [placement, setPlacement] = useState<ToastPlacement>('top-end');
  const [placementShow, setPlacementShow] = useState(false);
  const [stayShow, setStayShow] = useState(false);

  const handlePlacement = (value: ToastPlacement) => {
    setPlacement(value);
    setPlacementShow(true);
  };

  const handleShowFast = () => {
    setAutoDelay(1000);
    setAutoShow(true);
  };

  const handleShowFixed = () => {
    setFixedShow(true);
  };

  const demoContent = (
    <>
      <DemoSection code={basicCode} title="基础用法">
        <Button onClick={() => setBasicShow(true)} variant="primary">
          显示 Toast
        </Button>

        <Toast className="mt-3" onClose={() => setBasicShow(false)} show={basicShow}>
          <ToastHeader>
            <div className="bg-primary rounded me-2" style={{ height: 20, width: 20 }} />
            <strong className="me-auto">React Bootstrap</strong>
            <small>11 分钟前</small>
          </ToastHeader>
          <ToastBody>你好，世界！这是一条 Toast 消息。</ToastBody>
        </Toast>
      </DemoSection>

      <DemoSection code={stackingCode} title="堆叠显示">
        <ToastContainer className="mt-3" position="static">
          <Toast autohide={false}>
            <ToastHeader>
              <div className="bg-primary rounded me-2" style={{ height: 20, width: 20 }} />
              <strong className="me-auto">React Bootstrap</strong>
              <small>刚刚</small>
            </ToastHeader>
            <ToastBody>看到我了吗？这是一条 Toast 消息。</ToastBody>
          </Toast>
          <Toast autohide={false} className="mt-2">
            <ToastHeader>
              <div className="bg-primary rounded me-2" style={{ height: 20, width: 20 }} />
              <strong className="me-auto">React Bootstrap</strong>
              <small>2 秒前</small>
            </ToastHeader>
            <ToastBody>第二条消息堆叠在下方。</ToastBody>
          </Toast>
        </ToastContainer>
      </DemoSection>

      <DemoSection code={placementCode} title="位置控制">
        <div className="d-flex flex-wrap gap-2">
          <Button onClick={() => handlePlacement('top-start')} variant="outline-primary">
            左上
          </Button>
          <Button onClick={() => handlePlacement('top-end')} variant="outline-primary">
            右上
          </Button>
          <Button onClick={() => handlePlacement('bottom-start')} variant="outline-primary">
            左下
          </Button>
          <Button onClick={() => handlePlacement('bottom-end')} variant="outline-primary">
            右下
          </Button>
          <Button onClick={handleShowFixed} variant="outline-primary">
            固定到视口
          </Button>
        </div>

        <div className="border position-relative rounded mt-3" style={{ height: 200 }}>
          <span className="position-absolute start-50 text-muted top-50 translate-middle">
            演示区域
          </span>
          <ToastContainer placement={placement}>
            <Toast onClose={() => setPlacementShow(false)} show={placementShow}>
              <ToastHeader>
                <strong className="me-auto">位置演示</strong>
                <small>当前：{placement}</small>
              </ToastHeader>
              <ToastBody>Toast 会出现在演示区域对应的角落。</ToastBody>
            </Toast>
          </ToastContainer>
        </div>

        <ToastContainer placement="top-end" position="fixed">
          <Toast onClose={() => setFixedShow(false)} show={fixedShow}>
            <ToastHeader>
              <strong className="me-auto">固定定位</strong>
              <small>刚刚</small>
            </ToastHeader>
            <ToastBody>position 为 fixed 时，Toast 固定在视口右上角。</ToastBody>
          </Toast>
        </ToastContainer>
      </DemoSection>

      <DemoSection code={variantsCode} title="颜色变体">
        <div className="d-flex flex-wrap gap-3 mt-3">
          {(
            [
              'primary',
              'secondary',
              'success',
              'danger',
              'warning',
              'info',
              'light',
              'dark',
            ] as const
          ).map((variant) => (
            <Toast autohide={false} key={variant} variant={variant}>
              <div className="d-flex">
                <ToastBody>Hello, world! This is a toast message.</ToastBody>
                <ToastClose className="m-auto me-2" />
              </div>
            </Toast>
          ))}
        </div>
      </DemoSection>

      <DemoSection code={autohideCode} title="自动隐藏">
        <div className="d-flex flex-wrap gap-2">
          <Button onClick={() => setDefaultDelayShow(true)} variant="outline-primary">
            默认 5 秒
          </Button>
          <Button onClick={handleShowFast} variant="outline-primary">
            1 秒后隐藏
          </Button>
          <Button onClick={() => setStayShow(true)} variant="outline-primary">
            不自动隐藏
          </Button>
        </div>

        <ToastContainer className="mt-3" position="static">
          <Toast onClose={() => setDefaultDelayShow(false)} show={defaultDelayShow}>
            <ToastHeader>
              <strong className="me-auto">自动隐藏</strong>
              <small>5 秒</small>
            </ToastHeader>
            <ToastBody>delay 默认 5000 毫秒，悬停时会暂停计时。</ToastBody>
          </Toast>
          <Toast delay={autoDelay} onClose={() => setAutoShow(false)} show={autoShow}>
            <ToastHeader>
              <strong className="me-auto">自动隐藏</strong>
              <small>{autoDelay / 1000} 秒</small>
            </ToastHeader>
            <ToastBody>通过 delay 自定义自动隐藏时间。</ToastBody>
          </Toast>
          <Toast autohide={false} onClose={() => setStayShow(false)} show={stayShow}>
            <ToastHeader>
              <strong className="me-auto">不自动隐藏</strong>
              <small>常驻</small>
            </ToastHeader>
            <ToastBody>autohide 为 false 时不会自动隐藏，需要手动关闭。</ToastBody>
          </Toast>
        </ToastContainer>
      </DemoSection>

      <DemoSection code={customCode} title="自定义内容">
        <Button onClick={() => setCustomShow(true)} variant="primary">
          显示自定义内容
        </Button>

        <Toast
          autohide={false}
          className="mt-3"
          onClose={() => setCustomShow(false)}
          show={customShow}
        >
          <ToastHeader>
            <strong className="me-auto">自定义内容</strong>
            <small>刚刚</small>
          </ToastHeader>
          <ToastBody>
            Toast 正文支持任意内容，例如按钮或链接。
            <div className="border-top mt-2 pt-2">
              <Button size="sm" variant="primary">
                采取行动
              </Button>{' '}
              <Button size="sm" variant="secondary">
                稍后处理
              </Button>
            </div>
          </ToastBody>
        </Toast>
      </DemoSection>
    </>
  );

  return (
    <DocTemplate
      componentDescription="基于 Bootstrap 5 的 Toast 轻量通知组件，支持页眉/正文结构、堆叠显示、九种容器方位、颜色变体与自动隐藏（悬停暂停），过渡动画由 useReducer 驱动并支持减少动态效果偏好"
      componentName="Toast"
      componentTags={['基础', '反馈']}
      demoContent={demoContent}
      props={toastPropsGroups}
      typeDefinitions={toastTypeDefinitions}
    />
  );
};

export default ToastDoc;
