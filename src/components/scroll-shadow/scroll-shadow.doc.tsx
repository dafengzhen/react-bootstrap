import { useState } from 'react';

import type { ScrollShadowVisibility } from './types';

import { type ApiProp, type ApiTypeDefinition, DemoSection, DocTemplate } from '../doc-template';
import basicCode from './demos/basic.md?raw';
import bothCode from './demos/both.md?raw';
import callbackCode from './demos/callback.md?raw';
import customCode from './demos/custom.md?raw';
import hookCode from './demos/hook.md?raw';
import horizontalCode from './demos/horizontal.md?raw';
import rtlCode from './demos/rtl.md?raw';
import { ScrollShadow, useScrollShadow } from './index';
import scrollShadowDirectionTypeCode from './types/scroll-shadow-direction.md?raw';
import scrollShadowPropsTypeCode from './types/scroll-shadow-props.md?raw';
import scrollShadowVisibilityTypeCode from './types/scroll-shadow-visibility.md?raw';
import useScrollShadowOptionsTypeCode from './types/use-scroll-shadow-options.md?raw';
import useScrollShadowResultTypeCode from './types/use-scroll-shadow-result.md?raw';

const CustomDemo = () => {
  const [shadowSize, setShadowSize] = useState(16);
  const [shadowColor, setShadowColor] = useState('#adb5bd');
  const [disabled, setDisabled] = useState(false);

  return (
    <>
      <div className="d-flex flex-wrap gap-3 mb-3 align-items-center">
        <label className="mb-0 small" htmlFor="scroll-shadow-size">
          尺寸 {shadowSize}px
        </label>
        <input
          className="form-range mb-0"
          id="scroll-shadow-size"
          max={32}
          min={4}
          onChange={(event) => setShadowSize(Number(event.target.value))}
          style={{ width: 140 }}
          type="range"
          value={shadowSize}
        />
        <input
          aria-label="阴影颜色"
          className="form-control form-control-color"
          onChange={(event) => setShadowColor(event.target.value)}
          title="选择阴影颜色"
          type="color"
          value={shadowColor}
        />
        <div className="form-check mb-0">
          <input
            checked={disabled}
            className="form-check-input"
            id="scroll-shadow-disabled"
            onChange={(event) => setDisabled(event.target.checked)}
            type="checkbox"
          />
          <label className="form-check-label" htmlFor="scroll-shadow-disabled">
            禁用阴影
          </label>
        </div>
      </div>
      <ScrollShadow
        className="border rounded-3"
        disabled={disabled}
        shadowColor={shadowColor}
        shadowSize={shadowSize}
        style={{ height: 220 }}
      >
        <div className="p-3">
          {Array.from({ length: 10 }, (_, index) => (
            <p className="mb-2" key={index}>
              第 {index + 1}{' '}
              段内容。调整尺寸与颜色后滚动容器，观察阴影层的变化；勾选“禁用阴影”可以完全关闭阴影。
            </p>
          ))}
        </div>
      </ScrollShadow>
    </>
  );
};

const CallbackDemo = () => {
  const [visibility, setVisibility] = useState<null | ScrollShadowVisibility>(null);

  return (
    <>
      <ScrollShadow
        className="border rounded-3 bg-body"
        onChange={setVisibility}
        style={{ height: 200 }}
      >
        <div className="p-3">
          {Array.from({ length: 10 }, (_, index) => (
            <p className="mb-2" key={index}>
              第 {index + 1} 段内容，滚动容器并观察下方四边可见性徽章的变化。
            </p>
          ))}
        </div>
      </ScrollShadow>
      <div className="d-flex flex-wrap gap-2 mt-3">
        {(['top', 'bottom', 'left', 'right'] as const).map((edge) => (
          <span
            className={`badge text-bg-${visibility?.[edge] ? 'primary' : 'secondary'}`}
            key={edge}
          >
            {edge}: {String(visibility?.[edge] ?? false)}
          </span>
        ))}
      </div>
    </>
  );
};

const HookDemo = () => {
  const { ref, visibility } = useScrollShadow<HTMLDivElement>({ direction: 'horizontal' });

  const gradient = (side: 'left' | 'right') =>
    `linear-gradient(to ${side}, rgba(13, 110, 253, 0.35), transparent)`;

  return (
    <div className="position-relative">
      <div
        className="border rounded-3"
        ref={ref}
        style={{ height: 88, overflowX: 'auto', overflowY: 'hidden', whiteSpace: 'nowrap' }}
      >
        {Array.from({ length: 14 }, (_, index) => (
          <span
            className="badge bg-light text-dark border d-inline-flex align-items-center m-2"
            key={index}
          >
            标签 #{index + 1}
          </span>
        ))}
      </div>
      {visibility.left && (
        <div
          aria-hidden="true"
          className="position-absolute bottom-0 start-0 top-0"
          style={{ background: gradient('left'), pointerEvents: 'none', width: 32 }}
        />
      )}
      {visibility.right && (
        <div
          aria-hidden="true"
          className="position-absolute bottom-0 end-0 top-0"
          style={{ background: gradient('right'), pointerEvents: 'none', width: 32 }}
        />
      )}
    </div>
  );
};

const scrollShadowProps: ApiProp[] = [
  {
    component: 'ScrollShadow',
    defaultValue: "'div'",
    description: '外层包装元素，内部滚动容器始终渲染为 div',
    name: 'as',
    type: 'ElementType',
  },
  {
    component: 'ScrollShadow',
    defaultValue: "'vertical'",
    description:
      '阴影方向：vertical/horizontal/both；同时决定内部容器的滚动轴向，未跟踪的轴 overflow 为 hidden',
    name: 'direction',
    type: 'ScrollShadowDirection',
  },
  {
    component: 'ScrollShadow',
    defaultValue: 'false',
    description: '禁用阴影：不渲染阴影层且不监听滚动，容器仍可正常滚动',
    name: 'disabled',
    type: 'boolean',
  },
  {
    component: 'ScrollShadow',
    defaultValue: '24',
    description: '阴影层厚度（像素）：vertical 时为阴影高度，horizontal 时为阴影宽度',
    name: 'shadowSize',
    type: 'number',
  },
  {
    component: 'ScrollShadow',
    defaultValue: 'rgba(0, 0, 0, 0.05)',
    description:
      '阴影颜色，作为渐变起点自动生成“浓 → 淡 → 透明”的三段式渐变阴影，默认使用 10% 半透明黑色，在深浅背景上都自然可见；也可覆盖 CSS 变量 --rbs-scroll-shadow-color 全局调整',
    name: 'shadowColor',
    type: 'string',
  },
  {
    component: 'ScrollShadow',
    defaultValue: '-',
    description:
      '阴影可见性变化回调，参数为四边可见性对象；挂载时若初始存在阴影也会触发一次（自动支持 RTL 方向）',
    name: 'onChange',
    type: '(visibility: ScrollShadowVisibility) => void',
  },
  {
    component: 'ScrollShadow',
    defaultValue: '-',
    description: '内部滚动容器的滚动事件回调（绑定在滚动元素上，而非外层包装元素）',
    name: 'onScroll',
    type: 'UIEventHandler<HTMLElement>',
  },
  {
    component: 'ScrollShadow',
    defaultValue: '-',
    description: '内部滚动容器的键盘焦点序号，设置后容器可通过键盘滚动',
    name: 'tabIndex',
    type: 'number',
  },
  {
    component: 'ScrollShadow',
    defaultValue: '-',
    description: '可滚动内容，渲染在内部滚动容器中',
    name: 'children',
    type: 'ReactNode',
  },
  {
    component: 'ScrollShadow',
    defaultValue: '-',
    description: '外层包装元素的自定义类名',
    name: 'className',
    type: 'string',
  },
  {
    component: 'ScrollShadow',
    defaultValue: '-',
    description: '外层包装元素的内联样式，通常用来限制滚动区域的高度/宽度',
    name: 'style',
    type: 'CSSProperties',
  },
  {
    component: 'useScrollShadow',
    defaultValue: "'vertical'",
    description: '跟踪的滚动方向，与组件的 direction 行为一致（自动支持 RTL）',
    name: 'direction',
    type: 'ScrollShadowDirection',
  },
  {
    component: 'useScrollShadow',
    defaultValue: 'false',
    description: '禁用跟踪，可见性重置为四边均不可见',
    name: 'disabled',
    type: 'boolean',
  },
  {
    component: 'useScrollShadow',
    defaultValue: '-',
    description: '可见性变化回调，行为与组件的 onChange 一致',
    name: 'onChange',
    type: '(visibility: ScrollShadowVisibility) => void',
  },
  {
    component: 'useScrollShadow',
    defaultValue: '-',
    description:
      '返回的 ref 回调，挂载到任意可滚动元素上开始跟踪（需自行处理监听期间的样式/滚动溢出）',
    name: 'ref',
    type: 'RefCallback<T>',
  },
  {
    component: 'useScrollShadow',
    defaultValue: '-',
    description:
      '返回的可见性对象，top/bottom/left/right 分别表示四边阴影是否可见（即对应方向是否还有可滚动内容）',
    name: 'visibility',
    type: 'ScrollShadowVisibility',
  },
  {
    defaultValue: '-',
    description: '透传原生元素属性（如 `onClick`、`dir`、`role` 等，作用于外层包装元素）',
    name: '...rest',
    type: 'HTMLAttributes',
  },
];

const scrollShadowTypeDefinitions: ApiTypeDefinition[] = [
  {
    code: scrollShadowPropsTypeCode,
    description: '滚动阴影容器组件属性接口',
    name: 'ScrollShadowProps',
  },
  {
    code: scrollShadowDirectionTypeCode,
    description: '滚动阴影方向联合类型',
    name: 'ScrollShadowDirection',
  },
  {
    code: scrollShadowVisibilityTypeCode,
    description: '四边阴影可见性状态',
    name: 'ScrollShadowVisibility',
  },
  {
    code: useScrollShadowOptionsTypeCode,
    description: '滚动阴影跟踪 Hook 配置项',
    name: 'UseScrollShadowOptions',
  },
  {
    code: useScrollShadowResultTypeCode,
    description: '滚动阴影跟踪 Hook 返回值',
    name: 'UseScrollShadowResult',
  },
];

export const ScrollShadowDoc = () => {
  const demoContent = (
    <>
      <DemoSection code={basicCode} title="基础用法">
        <ScrollShadow className="border rounded-3 bg-body" style={{ height: 240 }}>
          <ul className="list-group list-group-flush">
            {Array.from({ length: 12 }, (_, index) => (
              <li className="list-group-item" key={index}>
                <div className="fw-semibold">第 {index + 1} 条消息</div>
                <p className="mb-0 mt-1 text-muted small">
                  向上或向下滚动容器，顶部和底部的阴影会随滚动位置自动淡入淡出，提示对应方向还有更多内容。
                </p>
              </li>
            ))}
          </ul>
        </ScrollShadow>
        <p className="mb-0 mt-3 text-muted small">
          ScrollShadow 默认跟踪垂直方向：内部渲染一个 overflow-y: auto
          的滚动容器，顶部阴影表示上方还有内容，底部阴影表示下方还有内容，滚动到两端时对应阴影自动淡出
        </p>
      </DemoSection>

      <DemoSection code={horizontalCode} title="横向滚动">
        <ScrollShadow className="border rounded-3" direction="horizontal">
          <div className="d-flex flex-nowrap gap-3 p-3">
            {Array.from({ length: 12 }, (_, index) => (
              <div className="card" key={index} style={{ minWidth: 200 }}>
                <div className="card-body">
                  <h6 className="card-title mb-2">卡片 #{index + 1}</h6>
                  <p className="card-text small mb-0">
                    横向滚动容器，观察左右两端的阴影随滚动位置的变化。
                  </p>
                </div>
              </div>
            ))}
          </div>
        </ScrollShadow>
        <p className="mb-0 mt-3 text-muted small">
          direction="horizontal" 时跟踪左右两端：内部容器 overflow-x: auto、overflow-y:
          hidden，内容宽度超过容器宽度后即可横向滚动
        </p>
      </DemoSection>

      <DemoSection code={bothCode} title="双向滚动">
        <ScrollShadow className="border rounded-3" direction="both" style={{ height: 280 }}>
          <table className="table table-bordered table-striped mb-0" style={{ minWidth: 720 }}>
            <thead>
              <tr>
                {Array.from({ length: 8 }, (_, index) => (
                  <th key={index}>列 {index + 1}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {Array.from({ length: 18 }, (_, row) => (
                <tr key={row}>
                  {Array.from({ length: 8 }, (_, column) => (
                    <td key={column}>
                      R{row + 1} C{column + 1}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </ScrollShadow>
        <p className="mb-0 mt-3 text-muted small">
          direction="both"
          同时跟踪垂直与水平两个方向，适合宽高都受限的内容（如宽表格、大画布），四边阴影独立显示
        </p>
      </DemoSection>

      <DemoSection code={rtlCode} title="RTL 布局">
        <ScrollShadow className="border rounded-3" dir="rtl" direction="horizontal">
          <div className="d-flex flex-nowrap gap-3 p-3">
            {Array.from({ length: 12 }, (_, index) => (
              <div className="card bg-body-tertiary" key={index} style={{ minWidth: 160 }}>
                <div className="card-body py-3">
                  <h6 className="card-title mb-0">卡片 #{index + 1}</h6>
                </div>
              </div>
            ))}
          </div>
        </ScrollShadow>
        <p className="mb-0 mt-3 text-muted small">
          在 dir="rtl"
          布局下横向阴影自动换边：初始位置在右侧起点，左端显示阴影；滚动到最左端后右端阴影出现
        </p>
      </DemoSection>

      <DemoSection code={customCode} title="自定义阴影">
        <CustomDemo />
        <p className="mb-0 mt-3 text-muted small">
          shadowSize 控制阴影层厚度，shadowColor 控制渐变起点颜色，disabled 可随时关闭阴影；两者通过
          CSS 变量 --rbs-scroll-shadow-size 与 --rbs-scroll-shadow-color
          生效，也可以在全局样式里统一覆盖
        </p>
      </DemoSection>

      <DemoSection code={callbackCode} title="可见性回调">
        <CallbackDemo />
        <p className="mb-0 mt-3 text-muted small">
          onChange 在四边阴影可见性发生变化时触发（挂载时若初始存在阴影也会触发一次），返回的
          ScrollShadowVisibility 对象可用于渲染自定义提示或与其他状态联动
        </p>
      </DemoSection>

      <DemoSection code={hookCode} title="Hook 自定义组合">
        <HookDemo />
        <p className="mb-0 mt-3 text-muted small">
          useScrollShadow 返回 ref 与 visibility，可挂载到任意已有的滚动容器（如
          .table-responsive）上自行渲染阴影或提示，ScrollShadow 组件本身即基于该 Hook 实现
        </p>
      </DemoSection>
    </>
  );

  return (
    <DocTemplate
      componentDescription="基于 Bootstrap 5 的滚动阴影组件，在可滚动容器的边缘叠加渐变阴影提示剩余内容，支持垂直/水平/双向滚动、阴影尺寸与颜色自定义、可见性变化回调、RTL 布局，以及 useScrollShadow Hook 自定义组合"
      componentName="ScrollShadow"
      componentTags={['基础', '布局']}
      demoContent={demoContent}
      props={scrollShadowProps}
      typeDefinitions={scrollShadowTypeDefinitions}
    />
  );
};

export default ScrollShadowDoc;
