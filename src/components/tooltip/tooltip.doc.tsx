import { useState } from 'react';

import {
  type ApiProp,
  type ApiTypeDefinition,
  DemoSection,
  DocTemplate,
} from '../../internal/doc-template';
import { Button } from '../button';
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
import { Tooltip, TooltipTrigger } from './index';
import tooltipDelayTypeCode from './types/tooltip-delay.md?raw';
import tooltipPropsTypeCode from './types/tooltip-props.md?raw';
import tooltipTriggerPropsTypeCode from './types/tooltip-trigger-props.md?raw';
import tooltipTriggerTypeTypeCode from './types/tooltip-trigger-type.md?raw';

const tooltipProps: ApiProp[] = [
  {
    component: 'Tooltip',
    defaultValue: 'true',
    description: '是否渲染 `fade` 类，配合 TooltipTrigger 播放淡入淡出过渡动画',
    name: 'animation',
    type: 'boolean',
  },
  {
    component: 'Tooltip',
    defaultValue: '-',
    description: '透传给箭头元素（`.tooltip-arrow`）的属性',
    name: 'arrowProps',
    type: 'HTMLAttributes',
  },
  {
    component: 'Tooltip',
    defaultValue: "'div'",
    description: '根元素标签',
    name: 'as',
    type: 'ElementType',
  },
  {
    component: 'Tooltip',
    defaultValue: '-',
    description: '提示内容，渲染在 `.tooltip-inner` 内',
    name: 'children',
    type: 'ReactNode',
  },
  {
    component: 'Tooltip',
    defaultValue: '-',
    description: '自定义类名，对应 Bootstrap 的 `customClass` 选项',
    name: 'className',
    type: 'string',
  },
  {
    component: 'Tooltip',
    defaultValue: 'true',
    description:
      '`true` 渲染 `bs-tooltip-auto` 类；`false` 渲染 `bs-tooltip-{placement}` 静态类。箭头方向始终随 `data-popper-placement`（当前实际位置）变化',
    name: 'flip',
    type: 'boolean',
  },
  {
    component: 'Tooltip',
    defaultValue: '-',
    description: '提示元素 id，供触发元素的 `aria-describedby` 引用',
    name: 'id',
    type: 'string',
  },
  {
    component: 'Tooltip',
    defaultValue: "'top'",
    description: '展示位置，仅影响类名与箭头方向，实际定位由 TooltipTrigger 完成',
    name: 'placement',
    type: 'Placement',
  },
  {
    component: 'Tooltip',
    defaultValue: 'true',
    description: '是否显示，渲染 `show` 类（配合 `fade` 播放透明度过渡）',
    name: 'show',
    type: 'boolean',
  },
  {
    component: 'TooltipTrigger',
    defaultValue: 'true',
    description: '是否启用淡入淡出动画，系统开启减少动态效果（prefers-reduced-motion）时自动禁用',
    name: 'animation',
    type: 'boolean',
  },
  {
    component: 'TooltipTrigger',
    defaultValue: '-',
    description: '单个触发元素，组件会克隆该元素并注入触发事件与 `aria-describedby`',
    name: 'children',
    type: 'ReactElement',
  },
  {
    component: 'TooltipTrigger',
    defaultValue: '-',
    description: '提示气泡上的自定义类名，可用于通过 CSS 变量定制外观',
    name: 'customClass',
    type: 'string',
  },
  {
    component: 'TooltipTrigger',
    defaultValue: 'false',
    description: '非受控模式下的初始显示状态',
    name: 'defaultShow',
    type: 'boolean',
  },
  {
    component: 'TooltipTrigger',
    defaultValue: '0',
    description: '显示/隐藏延迟（毫秒），传入数字同时作用于两者，或传 `{ show, hide }` 分别设置',
    name: 'delay',
    type: 'number | TooltipDelay',
  },
  {
    component: 'TooltipTrigger',
    defaultValue: 'false',
    description: '是否禁用触发，等价于 Bootstrap 的 `disable()` 方法',
    name: 'disabled',
    type: 'boolean',
  },
  {
    component: 'TooltipTrigger',
    defaultValue: 'true',
    description: '靠近视口边缘时是否自动翻转方向',
    name: 'flip',
    type: 'boolean',
  },
  {
    component: 'TooltipTrigger',
    defaultValue: '-',
    description: '提示元素 id，缺省时自动生成',
    name: 'id',
    type: 'string',
  },
  {
    component: 'TooltipTrigger',
    defaultValue: "'[0, 6]'",
    description: '定位偏移 `[水平偏移, 间距]` 元组，对应 Bootstrap 的 `offset` 选项',
    name: 'offset',
    type: '[number, number]',
  },
  {
    component: 'TooltipTrigger',
    defaultValue: '-',
    description: '显示状态变化回调，配合 `show` 实现受控模式',
    name: 'onToggle',
    type: '(nextShow: boolean) => void',
  },
  {
    component: 'TooltipTrigger',
    defaultValue: '-',
    description:
      '自定义覆盖元素（如 `<Tooltip id="...">`），与 `title` 二选一，需支持注入 ref、`show`、`placement`、`id`',
    name: 'overlay',
    type: 'ReactElement',
  },
  {
    component: 'TooltipTrigger',
    defaultValue: '2',
    description: '提示与视口边缘的最小距离（像素）',
    name: 'padding',
    type: 'number',
  },
  {
    component: 'TooltipTrigger',
    defaultValue: "'top'",
    description: '期望的显示位置，支持 `top`/`right`/`bottom`/`left` 及 `-start`/`-end` 对齐变体',
    name: 'placement',
    type: 'Placement',
  },
  {
    component: 'TooltipTrigger',
    defaultValue: '-',
    description: '受控的显示状态，需配合 `onToggle` 更新',
    name: 'show',
    type: 'boolean',
  },
  {
    component: 'TooltipTrigger',
    defaultValue: '-',
    description: '提示内容（简写形式），空内容不显示（与 Bootstrap 一致）',
    name: 'title',
    type: 'ReactNode',
  },
  {
    component: 'TooltipTrigger',
    defaultValue: "['hover', 'focus']",
    description: '触发方式：`click`/`hover`/`focus`/`manual`，可传入数组组合',
    name: 'trigger',
    type: 'TooltipTriggerType | TooltipTriggerType[]',
  },
];

const tooltipTypeDefinitions: ApiTypeDefinition[] = [
  {
    code: tooltipDelayTypeCode,
    description: '显示/隐藏延迟配置',
    name: 'TooltipDelay',
  },
  {
    code: tooltipPropsTypeCode,
    description: '提示气泡组件属性接口',
    name: 'TooltipProps',
  },
  {
    code: tooltipTriggerPropsTypeCode,
    description: '提示触发器组件属性接口',
    name: 'TooltipTriggerProps',
  },
  {
    code: tooltipTriggerTypeTypeCode,
    description: '触发方式类型',
    name: 'TooltipTriggerType',
  },
];

export const TooltipDoc = () => {
  const [controlledShow, setControlledShow] = useState(false);

  const demoContent = (
    <>
      <DemoSection code={basicCode} title="基础用法">
        <TooltipTrigger placement="right" title="右侧的提示气泡">
          <Button variant="primary">悬停查看提示</Button>
        </TooltipTrigger>
        <p className="mb-0 mt-3 text-muted small">
          默认 trigger 为 `['hover', 'focus']`，悬停或聚焦按钮显示提示；空内容不渲染，与 Bootstrap
          的「零长度标题不显示」行为一致
        </p>
      </DemoSection>

      <DemoSection code={directionsCode} title="四个方向">
        <div className="d-flex flex-wrap gap-2">
          <TooltipTrigger placement="top" title="顶部提示">
            <Button variant="secondary">顶部</Button>
          </TooltipTrigger>
          <TooltipTrigger placement="right" title="右侧提示">
            <Button variant="secondary">右侧</Button>
          </TooltipTrigger>
          <TooltipTrigger placement="bottom" title="底部提示">
            <Button variant="secondary">底部</Button>
          </TooltipTrigger>
          <TooltipTrigger placement="left" title="左侧提示">
            <Button variant="secondary">左侧</Button>
          </TooltipTrigger>
        </div>
        <p className="mb-0 mt-3 text-muted small">
          placement 支持 `top`/`right`/`bottom`/`left` 四个方向，RTL 布局下方向自动镜像
        </p>
      </DemoSection>

      <DemoSection code={alignmentCode} title="对齐变体">
        <div className="d-flex flex-wrap gap-2">
          <TooltipTrigger placement="top-start" title="顶部起始对齐">
            <Button variant="secondary">top-start</Button>
          </TooltipTrigger>
          <TooltipTrigger placement="top-end" title="顶部结束对齐">
            <Button variant="secondary">top-end</Button>
          </TooltipTrigger>
          <TooltipTrigger placement="right-start" title="右侧起始对齐">
            <Button variant="secondary">right-start</Button>
          </TooltipTrigger>
          <TooltipTrigger placement="right-end" title="右侧结束对齐">
            <Button variant="secondary">right-end</Button>
          </TooltipTrigger>
          <TooltipTrigger placement="bottom-start" title="底部起始对齐">
            <Button variant="secondary">bottom-start</Button>
          </TooltipTrigger>
          <TooltipTrigger placement="bottom-end" title="底部结束对齐">
            <Button variant="secondary">bottom-end</Button>
          </TooltipTrigger>
        </div>
        <p className="mb-0 mt-3 text-muted small">
          每个方向都支持 `-start`/`-end` 对齐变体，与 Bootstrap 的 placement 选项一致
        </p>
      </DemoSection>

      <DemoSection code={htmlCode} title="HTML 内容">
        <TooltipTrigger
          placement="right"
          title={
            <>
              <em>提示</em> <u>内容</u> <strong>支持 HTML</strong>
            </>
          }
        >
          <Button variant="secondary">HTML 内容</Button>
        </TooltipTrigger>
        <p className="mb-0 mt-3 text-muted small">
          title 是 ReactNode，天然支持富文本内容，无需 Bootstrap 的 `html` 选项
        </p>
      </DemoSection>

      <DemoSection code={customCode} title="自定义样式">
        <style>{`.custom-tooltip { --bs-tooltip-bg: var(--bs-primary); --bs-tooltip-color: var(--bs-white); }`}</style>
        <TooltipTrigger customClass="custom-tooltip" title="使用 CSS 变量定制的提示">
          <Button variant="secondary">自定义样式</Button>
        </TooltipTrigger>
        <p className="mb-0 mt-3 text-muted small">
          customClass 对应 Bootstrap 的 `customClass` 选项，配合 `--bs-tooltip-bg` 等 CSS
          变量即可定制外观
        </p>
      </DemoSection>

      <DemoSection code={disabledCode} title="禁用元素">
        <TooltipTrigger title="禁用按钮的提示">
          {/* oxlint-disable-next-line jsx-a11y/no-noninteractive-tabindex */}
          <span className="d-inline-block" tabIndex={0}>
            <Button disabled style={{ pointerEvents: 'none' }} variant="primary">
              禁用按钮
            </Button>
          </span>
        </TooltipTrigger>
        <p className="mb-0 mt-3 text-muted small">
          禁用元素不触发鼠标事件，需将触发元素包裹在带 `tabIndex={0}` 的 `span` 中；给禁用按钮设置
          `pointer-events: none` 可让鼠标事件穿透到外层 span（与 Bootstrap 文档一致）
        </p>
      </DemoSection>

      <DemoSection code={triggersCode} title="触发方式">
        <div className="d-flex flex-wrap gap-2">
          <TooltipTrigger title="点击触发" trigger="click">
            <Button variant="secondary">点击触发</Button>
          </TooltipTrigger>
          <TooltipTrigger title="仅聚焦触发" trigger="focus">
            <Button variant="secondary">聚焦触发</Button>
          </TooltipTrigger>
          <TooltipTrigger title="悬停触发" trigger="hover">
            <Button variant="secondary">悬停触发</Button>
          </TooltipTrigger>
        </div>
        <p className="mb-0 mt-3 text-muted small">
          `click`/`focus`/`hover` 可单独使用或组合，`manual` 则完全由 `show` 属性控制；提示显示时按
          Esc 可关闭
        </p>
      </DemoSection>

      <DemoSection code={delayCode} title="延迟与动画">
        <div className="d-flex flex-wrap gap-2">
          <TooltipTrigger delay={500} placement="top" title="显示与隐藏均延迟 500ms">
            <Button variant="secondary">数字延迟</Button>
          </TooltipTrigger>
          <TooltipTrigger
            delay={{ hide: 200, show: 500 }}
            placement="top"
            title="显示 500ms，隐藏 200ms"
          >
            <Button variant="secondary">对象延迟</Button>
          </TooltipTrigger>
          <TooltipTrigger animation={false} placement="top" title="无淡入淡出动画">
            <Button variant="secondary">禁用动画</Button>
          </TooltipTrigger>
        </div>
        <p className="mb-0 mt-3 text-muted small">
          delay 传入数字同时作用于显示与隐藏，或传 `{'{ show, hide }'}` 分别设置；动画基于 Bootstrap
          的 `fade` 类，并自动响应系统的减少动态效果设置
        </p>
      </DemoSection>

      <DemoSection code={positioningCode} title="定位配置">
        <div className="d-flex flex-wrap gap-2">
          <TooltipTrigger offset={[0, 12]} placement="top" title="额外偏移 12px">
            <Button variant="secondary">偏移 12</Button>
          </TooltipTrigger>
          <TooltipTrigger flip={false} placement="top" title="禁止翻转">
            <Button variant="secondary">禁止翻转</Button>
          </TooltipTrigger>
          <TooltipTrigger padding={48} placement="top" title="视口留白 48px">
            <Button variant="secondary">视口留白</Button>
          </TooltipTrigger>
        </div>
        <p className="mb-0 mt-3 text-muted small">
          定位基于 `src/utils/position.ts` 计算：offset 调整与触发元素的间距，padding
          约束与视口边缘的 距离，flip 控制靠近视口边缘时是否翻转方向
        </p>
      </DemoSection>

      <DemoSection code={controlledCode} title="受控模式">
        <div className="d-flex align-items-center gap-2">
          <TooltipTrigger
            onToggle={setControlledShow}
            placement="top"
            show={controlledShow}
            title="受控的提示"
            trigger="manual"
          >
            <Button variant="success">受控触发</Button>
          </TooltipTrigger>
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
          <Tooltip placement="top" style={{ position: 'relative' }}>
            顶部提示
          </Tooltip>
          <Tooltip placement="right" style={{ position: 'relative' }}>
            右侧提示
          </Tooltip>
          <Tooltip placement="bottom" style={{ position: 'relative' }}>
            底部提示
          </Tooltip>
          <Tooltip placement="left" style={{ position: 'relative' }}>
            左侧提示
          </Tooltip>
        </div>
        <p className="mb-0 mt-3 text-muted small">
          Tooltip 单独渲染气泡结构，与 Bootstrap 生成的结构一致（`.tooltip` 包含 `.tooltip-arrow` 与
          `.tooltip-inner`），也可作为 `overlay` 传给 TooltipTrigger
        </p>
      </DemoSection>
    </>
  );

  return (
    <DocTemplate
      componentDescription="基于 Bootstrap 5 的提示气泡组件，Tooltip 渲染标准的气泡结构（.tooltip > .tooltip-arrow + .tooltip-inner），TooltipTrigger 负责触发、延迟、动画与定位，支持四个方向与对齐变体、HTML 内容、CSS 变量定制、click/hover/focus/manual 触发、受控模式、禁用元素与视口翻转"
      componentName="Tooltip"
      componentTags={['基础', '反馈']}
      demoContent={demoContent}
      props={tooltipProps}
      typeDefinitions={tooltipTypeDefinitions}
    />
  );
};

export default TooltipDoc;
