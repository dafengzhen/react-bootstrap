import { useState } from 'react';

import {
  type ApiProp,
  type ApiTypeDefinition,
  DemoSection,
  DocTemplate,
} from '../../internal/doc-template';
import { Button } from '../button';
import backdropCode from './demos/backdrop.md?raw';
import basicCode from './demos/basic.md?raw';
import formCode from './demos/form.md?raw';
import keyboardCode from './demos/keyboard.md?raw';
import placementsCode from './demos/placements.md?raw';
import scrollCode from './demos/scroll.md?raw';
import {
  Offcanvas,
  OffcanvasBody,
  OffcanvasHeader,
  type OffcanvasPlacement,
  OffcanvasTitle,
} from './index';
import offcanvasAnimationStatusTypeCode from './types/offcanvas-animation-status.md?raw';
import offcanvasBackdropTypeCode from './types/offcanvas-backdrop.md?raw';
import offcanvasContextValueTypeCode from './types/offcanvas-context-value.md?raw';
import offcanvasPartPropsTypeCode from './types/offcanvas-part-props.md?raw';
import offcanvasPlacementTypeCode from './types/offcanvas-placement.md?raw';
import offcanvasPropsTypeCode from './types/offcanvas-props.md?raw';

const offcanvasProps: ApiProp[] = [
  {
    defaultValue: 'false',
    description: '受控的打开状态，为 `true` 时抽屉打开',
    name: 'isOpen',
    type: 'boolean',
  },
  {
    defaultValue: '-',
    description:
      '打开状态变化回调，抽屉通过它请求关闭（如 Esc 键、遮罩点击、`OffcanvasClose`），由使用者更新 `isOpen`',
    name: 'onOpenChange',
    type: '(isOpen: boolean) => void',
  },
  {
    defaultValue: "'start'",
    description: '抽屉位置，`start`、`end`、`top`、`bottom` 分别对应左侧、右侧、顶部与底部',
    name: 'placement',
    type: 'OffcanvasPlacement',
  },
  {
    defaultValue: 'true',
    description:
      '背景遮罩行为，为 `false` 时不渲染遮罩且抽屉自动添加 `shadow-lg` 阴影（点击抽屉以外区域仍可关闭），为 `"static"` 时点击遮罩不会关闭',
    name: 'backdrop',
    type: 'OffcanvasBackdrop',
  },
  {
    defaultValue: 'true',
    description: '是否允许通过 Esc 键关闭抽屉',
    name: 'keyboard',
    type: 'boolean',
  },
  {
    defaultValue: 'false',
    description: '抽屉打开期间是否允许背景滚动，为 `false` 时锁定背景滚动',
    name: 'scroll',
    type: 'boolean',
  },
  {
    defaultValue: '300',
    description: '滑入与滑出动画时长（毫秒），系统开启减少动态效果时自动为 0',
    name: 'duration',
    type: 'number',
  },
  {
    defaultValue: '-',
    description: '无障碍标签，不提供时通过 `OffcanvasTitle` 生成的 id 关联标题',
    name: 'ariaLabel',
    type: 'string',
  },
  {
    defaultValue: '-',
    description: '抽屉根元素自定义类名',
    name: 'className',
    type: 'string',
  },
  {
    defaultValue: '-',
    description: '遮罩层自定义类名',
    name: 'backdropClassName',
    type: 'string',
  },
  {
    defaultValue: '-',
    description: '遮罩层自定义内联样式',
    name: 'backdropStyle',
    type: 'CSSProperties',
  },
  {
    defaultValue: '-',
    description: '抽屉根元素自定义内联样式',
    name: 'style',
    type: 'CSSProperties',
  },
  {
    defaultValue: '-',
    description: '抽屉内容，支持任意 React 节点',
    name: 'children',
    type: 'ReactNode',
  },
  {
    defaultValue: '-',
    description: '透传原生 dialog 元素的所有属性（如 `id`、`onClick`、`onKeyDown` 等）',
    name: '...rest',
    type: 'DialogHTMLAttributes',
  },
];

const offcanvasTypeDefinitions: ApiTypeDefinition[] = [
  {
    code: offcanvasPlacementTypeCode,
    description: '抽屉位置类型',
    name: 'OffcanvasPlacement',
  },
  {
    code: offcanvasBackdropTypeCode,
    description: '抽屉遮罩行为类型',
    name: 'OffcanvasBackdrop',
  },
  {
    code: offcanvasAnimationStatusTypeCode,
    description: '抽屉动画状态类型',
    name: 'OffcanvasAnimationStatus',
  },
  {
    code: offcanvasPropsTypeCode,
    description: '抽屉组件属性接口',
    name: 'OffcanvasProps',
  },
  {
    code: offcanvasContextValueTypeCode,
    description: '抽屉上下文，供 OffcanvasTitle、OffcanvasClose 等子组件消费',
    name: 'OffcanvasContextValue',
  },
  {
    code: offcanvasPartPropsTypeCode,
    description:
      '抽屉子组件属性接口（OffcanvasHeader、OffcanvasTitle、OffcanvasBody、OffcanvasClose）',
    name: 'OffcanvasPartProps',
  },
];

export const OffcanvasDoc = () => {
  const [formOpen, setFormOpen] = useState(false);
  const [keyboardOpen, setKeyboardOpen] = useState(false);
  const [noBackdropOpen, setNoBackdropOpen] = useState(false);
  const [open, setOpen] = useState(false);
  const [placement, setPlacement] = useState<OffcanvasPlacement>('start');
  const [placementOpen, setPlacementOpen] = useState(false);
  const [scrollOpen, setScrollOpen] = useState(false);
  const [staticOpen, setStaticOpen] = useState(false);

  const handleOpenPlacement = (value: OffcanvasPlacement) => {
    setPlacement(value);
    setPlacementOpen(true);
  };

  const demoContent = (
    <>
      <DemoSection code={basicCode} title="基础用法">
        <Button onClick={() => setOpen(true)} variant="primary">
          打开侧边抽屉
        </Button>
        <Offcanvas isOpen={open} onOpenChange={setOpen}>
          <OffcanvasHeader closeButton>
            <OffcanvasTitle>抽屉标题</OffcanvasTitle>
          </OffcanvasHeader>
          <OffcanvasBody>
            抽屉打开后会自动锁定背景滚动、将焦点移入抽屉，并可通过 Esc 键、遮罩点击或关闭按钮退出。
          </OffcanvasBody>
        </Offcanvas>
      </DemoSection>

      <DemoSection code={placementsCode} title="四个方向">
        <div className="d-flex flex-wrap gap-2">
          <Button onClick={() => handleOpenPlacement('start')} variant="outline-primary">
            左侧
          </Button>
          <Button onClick={() => handleOpenPlacement('end')} variant="outline-primary">
            右侧
          </Button>
          <Button onClick={() => handleOpenPlacement('top')} variant="outline-primary">
            顶部
          </Button>
          <Button onClick={() => handleOpenPlacement('bottom')} variant="outline-primary">
            底部
          </Button>
        </div>
        <Offcanvas isOpen={placementOpen} onOpenChange={setPlacementOpen} placement={placement}>
          <OffcanvasHeader closeButton>
            <OffcanvasTitle>位置演示</OffcanvasTitle>
          </OffcanvasHeader>
          <OffcanvasBody>当前抽屉位置：{placement}</OffcanvasBody>
        </Offcanvas>
      </DemoSection>

      <DemoSection code={backdropCode} title="遮罩选项">
        <div className="d-flex flex-wrap gap-2">
          <Button onClick={() => setStaticOpen(true)} variant="outline-secondary">
            静态遮罩
          </Button>
          <Button onClick={() => setNoBackdropOpen(true)} variant="outline-secondary">
            无遮罩
          </Button>
        </div>
        <Offcanvas backdrop="static" isOpen={staticOpen} onOpenChange={setStaticOpen}>
          <OffcanvasHeader closeButton>
            <OffcanvasTitle>静态遮罩</OffcanvasTitle>
          </OffcanvasHeader>
          <OffcanvasBody>
            backdrop 为 static 时点击遮罩不会关闭，只能通过按钮或 Esc 退出。
          </OffcanvasBody>
        </Offcanvas>
        <Offcanvas backdrop={false} isOpen={noBackdropOpen} onOpenChange={setNoBackdropOpen}>
          <OffcanvasHeader closeButton>
            <OffcanvasTitle>无遮罩</OffcanvasTitle>
          </OffcanvasHeader>
          <OffcanvasBody>
            backdrop 为 false 时不渲染背景遮罩，抽屉自动添加 shadow-lg
            阴影，点击抽屉以外的区域仍可关闭。
          </OffcanvasBody>
        </Offcanvas>
      </DemoSection>

      <DemoSection code={scrollCode} title="背景滚动">
        <Button onClick={() => setScrollOpen(true)} variant="primary">
          打开允许背景滚动的抽屉
        </Button>
        <Offcanvas isOpen={scrollOpen} onOpenChange={setScrollOpen} scroll>
          <OffcanvasHeader closeButton>
            <OffcanvasTitle>背景滚动</OffcanvasTitle>
          </OffcanvasHeader>
          <OffcanvasBody>
            <p>scroll 为 true 时抽屉打开期间背景仍可滚动；默认为 false，打开时锁定背景滚动。</p>
            {Array.from({ length: 8 }, (_, index) => (
              <p key={index}>
                第 {index + 1}{' '}
                段内容。这是用于演示抽屉内部滚动行为的占位文本，内容足够长时正文区域会出现滚动条。
              </p>
            ))}
          </OffcanvasBody>
        </Offcanvas>
      </DemoSection>

      <DemoSection code={keyboardCode} title="键盘控制">
        <Button onClick={() => setKeyboardOpen(true)} variant="outline-secondary">
          禁用 Esc 关闭
        </Button>
        <Offcanvas isOpen={keyboardOpen} keyboard={false} onOpenChange={setKeyboardOpen}>
          <OffcanvasHeader closeButton>
            <OffcanvasTitle>禁用 Esc</OffcanvasTitle>
          </OffcanvasHeader>
          <OffcanvasBody>
            keyboard 为 false 时按 Esc 键不会关闭抽屉，但仍可通过遮罩点击或关闭按钮退出。
          </OffcanvasBody>
        </Offcanvas>
      </DemoSection>

      <DemoSection code={formCode} title="表单交互">
        <Button onClick={() => setFormOpen(true)} variant="primary">
          新建项目
        </Button>
        <Offcanvas isOpen={formOpen} onOpenChange={setFormOpen}>
          <OffcanvasHeader closeButton>
            <OffcanvasTitle>新建项目</OffcanvasTitle>
          </OffcanvasHeader>
          <OffcanvasBody>
            <form>
              <div className="mb-3">
                <label className="form-label" htmlFor="offcanvas-form-name">
                  项目名称
                </label>
                <input
                  className="form-control"
                  id="offcanvas-form-name"
                  placeholder="输入项目名称"
                />
              </div>
              <div className="mb-3">
                <label className="form-label" htmlFor="offcanvas-form-desc">
                  项目描述
                </label>
                <textarea
                  className="form-control"
                  id="offcanvas-form-desc"
                  placeholder="输入项目描述"
                  rows={3}
                />
              </div>
              <div className="d-flex gap-2 justify-content-end">
                <Button onClick={() => setFormOpen(false)} variant="secondary">
                  取消
                </Button>
                <Button onClick={() => setFormOpen(false)} variant="primary">
                  创建
                </Button>
              </div>
            </form>
          </OffcanvasBody>
        </Offcanvas>
      </DemoSection>
    </>
  );

  return (
    <DocTemplate
      componentDescription="基于 React Portal 的侧边抽屉组件，支持四个方向的滑入滑出动画、遮罩与键盘选项、背景滚动控制，内置焦点管理与自定义过渡动画，可通过页眉、标题、正文与关闭按钮子组件自由组合内容"
      componentName="Offcanvas"
      componentTags={['基础', '对话框']}
      demoContent={demoContent}
      props={offcanvasProps}
      typeDefinitions={offcanvasTypeDefinitions}
    />
  );
};

export default OffcanvasDoc;
