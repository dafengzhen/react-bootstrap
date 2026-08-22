import { useState } from 'react';

import { Button } from '../button';
import { type ApiProp, type ApiTypeDefinition, DemoSection, DocTemplate } from '../doc-template';
import alignmentCode from './demos/alignment.md?raw';
import basicCode from './demos/basic.md?raw';
import controlledCode from './demos/controlled.md?raw';
import customCode from './demos/custom.md?raw';
import delayCode from './demos/delay.md?raw';
import directionsCode from './demos/directions.md?raw';
import disabledCode from './demos/disabled.md?raw';
import htmlCode from './demos/html.md?raw';
import positioningCode from './demos/positioning.md?raw';
import standaloneCode from './demos/standalone.md?raw';
import triggersCode from './demos/triggers.md?raw';
import { Popover, PopoverTrigger } from './index';
import popoverDelayTypeCode from './types/popover-delay.md?raw';
import popoverPropsTypeCode from './types/popover-props.md?raw';
import popoverTriggerPropsTypeCode from './types/popover-trigger-props.md?raw';
import popoverTriggerTypeTypeCode from './types/popover-trigger-type.md?raw';

const popoverProps: ApiProp[] = [
  {
    component: 'Popover',
    defaultValue: 'true',
    description: '是否渲染 `fade` 类，配合 PopoverTrigger 播放淡入淡出过渡动画',
    name: 'animation',
    type: 'boolean',
  },
  {
    component: 'Popover',
    defaultValue: '-',
    description: '透传给箭头元素（`.popover-arrow`）的属性',
    name: 'arrowProps',
    type: 'HTMLAttributes',
  },
  {
    component: 'Popover',
    defaultValue: "'div'",
    description: '根元素标签',
    name: 'as',
    type: 'ElementType',
  },
  {
    component: 'Popover',
    defaultValue: '-',
    description: '透传给正文元素（`.popover-body`）的属性',
    name: 'bodyProps',
    type: 'HTMLAttributes',
  },
  {
    component: 'Popover',
    defaultValue: '-',
    description: '弹窗正文内容，渲染在 `.popover-body` 内',
    name: 'children',
    type: 'ReactNode',
  },
  {
    component: 'Popover',
    defaultValue: '-',
    description: '自定义类名，对应 Bootstrap 的 `customClass` 选项',
    name: 'className',
    type: 'string',
  },
  {
    component: 'Popover',
    defaultValue: 'true',
    description:
      '`true` 渲染 `bs-popover-auto` 类；`false` 渲染 `bs-popover-{placement}` 静态类。箭头方向始终随 `data-popper-placement`（当前实际位置）变化',
    name: 'flip',
    type: 'boolean',
  },
  {
    component: 'Popover',
    defaultValue: '-',
    description: '透传给标题元素（`.popover-header`）的属性',
    name: 'headerProps',
    type: 'HTMLAttributes',
  },
  {
    component: 'Popover',
    defaultValue: '-',
    description: '弹窗元素 id，供触发元素的 `aria-describedby` 引用',
    name: 'id',
    type: 'string',
  },
  {
    component: 'Popover',
    defaultValue: "'right'",
    description: '展示位置，仅影响类名与箭头方向，实际定位由 PopoverTrigger 完成',
    name: 'placement',
    type: 'Placement',
  },
  {
    component: 'Popover',
    defaultValue: 'true',
    description: '是否显示，渲染 `show` 类（配合 `fade` 播放透明度过渡）',
    name: 'show',
    type: 'boolean',
  },
  {
    component: 'Popover',
    defaultValue: '-',
    description:
      '弹窗标题，渲染在 `.popover-header` 内；空值不渲染标题元素。存在标题时，箭头三角默认与标题背景色（`--bs-popover-header-bg`）一致',
    name: 'title',
    type: 'ReactNode',
  },
  {
    component: 'PopoverTrigger',
    defaultValue: 'true',
    description: '是否启用淡入淡出动画，系统开启减少动态效果（prefers-reduced-motion）时自动禁用',
    name: 'animation',
    type: 'boolean',
  },
  {
    component: 'PopoverTrigger',
    defaultValue: '-',
    description: '单个触发元素，组件会克隆该元素并注入触发事件与 `aria-describedby`',
    name: 'children',
    type: 'ReactElement',
  },
  {
    component: 'PopoverTrigger',
    defaultValue: '-',
    description:
      '弹窗正文内容（简写形式），`title` 或 `content` 任一非空即可显示（与 Bootstrap 一致）',
    name: 'content',
    type: 'ReactNode',
  },
  {
    component: 'PopoverTrigger',
    defaultValue: '-',
    description: '弹窗上的自定义类名，可用于通过 CSS 变量定制外观',
    name: 'customClass',
    type: 'string',
  },
  {
    component: 'PopoverTrigger',
    defaultValue: 'false',
    description: '非受控模式下的初始显示状态',
    name: 'defaultShow',
    type: 'boolean',
  },
  {
    component: 'PopoverTrigger',
    defaultValue: '0',
    description: '显示/隐藏延迟（毫秒），传入数字同时作用于两者，或传 `{ show, hide }` 分别设置',
    name: 'delay',
    type: 'number | PopoverDelay',
  },
  {
    component: 'PopoverTrigger',
    defaultValue: 'false',
    description: '是否禁用触发，等价于 Bootstrap 的 `disable()` 方法',
    name: 'disabled',
    type: 'boolean',
  },
  {
    component: 'PopoverTrigger',
    defaultValue: 'true',
    description: '靠近视口边缘时是否自动翻转方向',
    name: 'flip',
    type: 'boolean',
  },
  {
    component: 'PopoverTrigger',
    defaultValue: '-',
    description: '弹窗元素 id，缺省时自动生成',
    name: 'id',
    type: 'string',
  },
  {
    component: 'PopoverTrigger',
    defaultValue: "'[0, 8]'",
    description: '定位偏移 `[水平偏移, 间距]` 元组，对应 Bootstrap 的 `offset` 选项',
    name: 'offset',
    type: '[number, number]',
  },
  {
    component: 'PopoverTrigger',
    defaultValue: '-',
    description: '显示状态变化回调，配合 `show` 实现受控模式',
    name: 'onToggle',
    type: '(nextShow: boolean) => void',
  },
  {
    component: 'PopoverTrigger',
    defaultValue: '-',
    description:
      '自定义覆盖元素（如 `<Popover id="...">`），与 `title`/`content` 二选一，需支持注入 ref、`show`、`placement`、`id`',
    name: 'overlay',
    type: 'ReactElement',
  },
  {
    component: 'PopoverTrigger',
    defaultValue: '2',
    description: '弹窗与视口边缘的最小距离（像素）',
    name: 'padding',
    type: 'number',
  },
  {
    component: 'PopoverTrigger',
    defaultValue: "'right'",
    description: '期望的显示位置，支持 `top`/`right`/`bottom`/`left` 及 `-start`/`-end` 对齐变体',
    name: 'placement',
    type: 'Placement',
  },
  {
    component: 'PopoverTrigger',
    defaultValue: '-',
    description: '受控的显示状态，需配合 `onToggle` 更新',
    name: 'show',
    type: 'boolean',
  },
  {
    component: 'PopoverTrigger',
    defaultValue: '-',
    description: '弹窗标题（简写形式），渲染在 `.popover-header` 内',
    name: 'title',
    type: 'ReactNode',
  },
  {
    component: 'PopoverTrigger',
    defaultValue: "['click']",
    description: '触发方式：`click`/`hover`/`focus`/`manual`，可传入数组组合',
    name: 'trigger',
    type: 'PopoverTriggerType | PopoverTriggerType[]',
  },
];

const popoverTypeDefinitions: ApiTypeDefinition[] = [
  {
    code: popoverDelayTypeCode,
    description: '显示/隐藏延迟配置',
    name: 'PopoverDelay',
  },
  {
    code: popoverPropsTypeCode,
    description: '弹窗组件属性接口',
    name: 'PopoverProps',
  },
  {
    code: popoverTriggerPropsTypeCode,
    description: '弹窗触发器组件属性接口',
    name: 'PopoverTriggerProps',
  },
  {
    code: popoverTriggerTypeTypeCode,
    description: '触发方式类型',
    name: 'PopoverTriggerType',
  },
];

export const PopoverDoc = () => {
  const [controlledShow, setControlledShow] = useState(false);

  const demoContent = (
    <>
      <DemoSection code={basicCode} title="基础用法">
        <PopoverTrigger
          content="这是一段弹窗正文内容，它比提示气泡更长，适合展示更丰富的信息。"
          placement="right"
          title="弹窗标题"
        >
          <Button variant="primary">点击查看弹窗</Button>
        </PopoverTrigger>
        <p className="mb-0 mt-3 text-muted small">
          默认 trigger 为 `['click']`，placement 为 `'right'`；标题或正文任一非空即可显示，与
          Bootstrap 的「title/content 均为空时不显示」行为一致
        </p>
      </DemoSection>

      <DemoSection code={directionsCode} title="四个方向">
        <div className="d-flex flex-wrap gap-2">
          <PopoverTrigger content="顶部的弹窗内容" placement="top" title="顶部">
            <Button variant="secondary">顶部</Button>
          </PopoverTrigger>
          <PopoverTrigger content="右侧的弹窗内容" placement="right" title="右侧">
            <Button variant="secondary">右侧</Button>
          </PopoverTrigger>
          <PopoverTrigger content="底部的弹窗内容" placement="bottom" title="底部">
            <Button variant="secondary">底部</Button>
          </PopoverTrigger>
          <PopoverTrigger content="左侧的弹窗内容" placement="left" title="左侧">
            <Button variant="secondary">左侧</Button>
          </PopoverTrigger>
        </div>
        <p className="mb-0 mt-3 text-muted small">
          placement 支持 `top`/`right`/`bottom`/`left` 四个方向，RTL 布局下方向自动镜像
        </p>
      </DemoSection>

      <DemoSection code={alignmentCode} title="对齐变体">
        <div className="d-flex flex-wrap gap-2">
          <PopoverTrigger content="顶部起始对齐" placement="top-start" title="对齐">
            <Button variant="secondary">top-start</Button>
          </PopoverTrigger>
          <PopoverTrigger content="顶部结束对齐" placement="top-end" title="对齐">
            <Button variant="secondary">top-end</Button>
          </PopoverTrigger>
          <PopoverTrigger content="右侧起始对齐" placement="right-start" title="对齐">
            <Button variant="secondary">right-start</Button>
          </PopoverTrigger>
          <PopoverTrigger content="右侧结束对齐" placement="right-end" title="对齐">
            <Button variant="secondary">right-end</Button>
          </PopoverTrigger>
          <PopoverTrigger content="底部起始对齐" placement="bottom-start" title="对齐">
            <Button variant="secondary">bottom-start</Button>
          </PopoverTrigger>
          <PopoverTrigger content="底部结束对齐" placement="bottom-end" title="对齐">
            <Button variant="secondary">bottom-end</Button>
          </PopoverTrigger>
        </div>
        <p className="mb-0 mt-3 text-muted small">
          每个方向都支持 `-start`/`-end` 对齐变体，与 Bootstrap 的 placement 选项一致
        </p>
      </DemoSection>

      <DemoSection code={htmlCode} title="HTML 内容">
        <PopoverTrigger
          content={
            <>
              <em>弹窗</em> <u>正文</u> <strong>支持 HTML</strong>，还可以嵌套链接与按钮
            </>
          }
          placement="right"
          title={
            <>
              弹窗标题 <small className="text-muted">副标题</small>
            </>
          }
        >
          <Button variant="secondary">HTML 内容</Button>
        </PopoverTrigger>
        <p className="mb-0 mt-3 text-muted small">
          title 与 content 都是 ReactNode，天然支持富文本内容，无需 Bootstrap 的 `html` 选项
        </p>
      </DemoSection>

      <DemoSection code={customCode} title="自定义样式">
        <style>{`.custom-popover { --bs-popover-max-width: 280px; --bs-popover-bg: var(--bs-dark); --bs-popover-header-bg: var(--bs-dark); --bs-popover-header-color: var(--bs-white); --bs-popover-body-color: var(--bs-white); --bs-popover-border-color: var(--bs-dark); }`}</style>
        <PopoverTrigger
          content="使用 CSS 变量定制的深色弹窗"
          customClass="custom-popover"
          title="自定义样式"
        >
          <Button variant="secondary">自定义样式</Button>
        </PopoverTrigger>
        <p className="mb-0 mt-3 text-muted small">
          customClass 对应 Bootstrap 的 `customClass` 选项，配合 `--bs-popover-bg` 等 CSS
          变量即可定制外观；箭头三角默认跟随 `--bs-popover-header-bg`，修改该变量即可同步换色
        </p>
      </DemoSection>

      <DemoSection code={disabledCode} title="禁用元素">
        <PopoverTrigger content="禁用按钮的弹窗内容" title="弹窗标题">
          {/* oxlint-disable-next-line jsx-a11y/no-noninteractive-tabindex */}
          <span className="d-inline-block" tabIndex={0}>
            <Button disabled style={{ pointerEvents: 'none' }} variant="primary">
              禁用按钮
            </Button>
          </span>
        </PopoverTrigger>
        <p className="mb-0 mt-3 text-muted small">
          禁用元素不触发鼠标事件，需将触发元素包裹在带 `tabIndex={0}` 的 `span` 中；给禁用按钮设置
          `pointer-events: none` 可让鼠标事件穿透到外层 span（与 Bootstrap 文档一致）
        </p>
      </DemoSection>

      <DemoSection code={triggersCode} title="触发方式">
        <div className="d-flex flex-wrap gap-2">
          <PopoverTrigger content="点击触发" title="触发方式" trigger="click">
            <Button variant="secondary">点击触发</Button>
          </PopoverTrigger>
          <PopoverTrigger content="仅聚焦触发" title="触发方式" trigger="focus">
            <Button variant="secondary">聚焦触发</Button>
          </PopoverTrigger>
          <PopoverTrigger content="悬停触发" title="触发方式" trigger="hover">
            <Button variant="secondary">悬停触发</Button>
          </PopoverTrigger>
        </div>
        <p className="mb-0 mt-3 text-muted small">
          `click`/`focus`/`hover` 可单独使用或组合，`manual` 则完全由 `show` 属性控制；弹窗显示时按
          Esc 可关闭
        </p>
      </DemoSection>

      <DemoSection code={delayCode} title="延迟与动画">
        <div className="d-flex flex-wrap gap-2">
          <PopoverTrigger content="显示与隐藏均延迟 500ms" delay={500} title="延迟">
            <Button variant="secondary">数字延迟</Button>
          </PopoverTrigger>
          <PopoverTrigger
            content="显示 500ms，隐藏 200ms"
            delay={{ hide: 200, show: 500 }}
            title="延迟"
          >
            <Button variant="secondary">对象延迟</Button>
          </PopoverTrigger>
          <PopoverTrigger animation={false} content="无淡入淡出动画" title="动画">
            <Button variant="secondary">禁用动画</Button>
          </PopoverTrigger>
        </div>
        <p className="mb-0 mt-3 text-muted small">
          delay 传入数字同时作用于显示与隐藏，或传 `{'{ show, hide }'}` 分别设置；动画基于 Bootstrap
          的 `fade` 类，并自动响应系统的减少动态效果设置
        </p>
      </DemoSection>

      <DemoSection code={positioningCode} title="定位配置">
        <div className="d-flex flex-wrap gap-2">
          <PopoverTrigger content="额外偏移 12px" offset={[0, 12]} placement="top" title="偏移">
            <Button variant="secondary">偏移 12</Button>
          </PopoverTrigger>
          <PopoverTrigger content="禁止翻转" flip={false} placement="top" title="翻转">
            <Button variant="secondary">禁止翻转</Button>
          </PopoverTrigger>
          <PopoverTrigger content="视口留白 48px" padding={48} placement="top" title="留白">
            <Button variant="secondary">视口留白</Button>
          </PopoverTrigger>
        </div>
        <p className="mb-0 mt-3 text-muted small">
          定位基于 `src/utils/position.ts` 计算：offset 调整与触发元素的间距，padding
          约束与视口边缘的距离，flip 控制靠近视口边缘时是否翻转方向
        </p>
      </DemoSection>

      <DemoSection code={controlledCode} title="受控模式">
        <div className="d-flex align-items-center gap-2">
          <PopoverTrigger
            content="受控的弹窗内容"
            onToggle={setControlledShow}
            show={controlledShow}
            title="受控模式"
            trigger="manual"
          >
            <Button variant="success">受控触发</Button>
          </PopoverTrigger>
          <Button onClick={() => setControlledShow((prev) => !prev)} variant="outline-secondary">
            切换（当前 {String(controlledShow)}）
          </Button>
        </div>
        <p className="mb-0 mt-3 text-muted small">
          传入 `show` 后组件变为受控，配合 `trigger=&quot;manual&quot;` 完全由外部状态控制显示
        </p>
      </DemoSection>

      <DemoSection code={standaloneCode} title="单独使用">
        <div className="d-flex flex-wrap gap-4">
          <Popover placement="top" style={{ position: 'relative' }} title="顶部弹窗">
            这是顶部弹窗的正文
          </Popover>
          <Popover placement="right" style={{ position: 'relative' }}>
            无标题弹窗
          </Popover>
          <Popover placement="bottom" style={{ position: 'relative' }} title="底部弹窗">
            这是底部弹窗的正文
          </Popover>
          <Popover placement="left" style={{ position: 'relative' }} title="左侧弹窗">
            这是左侧弹窗的正文
          </Popover>
        </div>
        <p className="mb-0 mt-3 text-muted small">
          Popover 单独渲染弹窗结构，与 Bootstrap 生成的结构一致（`.popover` 包含 `.popover-arrow`、
          `.popover-header` 与 `.popover-body`，标题为空时不渲染 header），也可作为 `overlay` 传给
          PopoverTrigger
        </p>
      </DemoSection>
    </>
  );

  return (
    <DocTemplate
      componentDescription="基于 Bootstrap 5 的弹窗组件，Popover 渲染标准的弹窗结构（.popover > .popover-arrow + .popover-header + .popover-body），PopoverTrigger 负责触发、延迟、动画与定位，支持四个方向与对齐变体、HTML 内容、CSS 变量定制、click/hover/focus/manual 触发、受控模式、禁用元素与视口翻转"
      componentName="Popover"
      componentTags={['基础', '反馈']}
      demoContent={demoContent}
      props={popoverProps}
      typeDefinitions={popoverTypeDefinitions}
    />
  );
};

export default PopoverDoc;
