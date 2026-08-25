import { useState } from 'react';

import type { SplitterSize } from './types';

import { Button } from '../button';
import { type ApiProp, type ApiTypeDefinition, DemoSection, DocTemplate } from '../doc-template';
import basicCode from './demos/basic.md?raw';
import collapsibleCode from './demos/collapsible.md?raw';
import controlledCode from './demos/controlled.md?raw';
import customBarCode from './demos/custom-bar.md?raw';
import disabledCode from './demos/disabled.md?raw';
import minMaxCode from './demos/min-max.md?raw';
import nestedCode from './demos/nested.md?raw';
import sizesCode from './demos/sizes.md?raw';
import verticalCode from './demos/vertical.md?raw';
import { Splitter } from './splitter';
import { SplitterPanel } from './splitter-panel';
import splitterBarRenderPropsTypeCode from './types/splitter-bar-render-props.md?raw';
import splitterContextValueTypeCode from './types/splitter-context-value.md?raw';
import splitterLayoutTypeCode from './types/splitter-layout.md?raw';
import splitterPanelPropsTypeCode from './types/splitter-panel-props.md?raw';
import splitterPropsTypeCode from './types/splitter-props.md?raw';
import splitterSizeTypeCode from './types/splitter-size.md?raw';

const splitterProps: ApiProp[] = [
  {
    component: 'Splitter',
    defaultValue: "'div'",
    description: '根容器渲染的元素类型',
    name: 'as',
    type: 'ElementType',
  },
  {
    component: 'Splitter',
    defaultValue: '8',
    description: '分隔条厚度（像素）',
    name: 'barSize',
    type: 'number',
  },
  {
    component: 'Splitter',
    defaultValue: '-',
    description: '面板内容，仅识别 `SplitterPanel`，其余子项会被忽略',
    name: 'children',
    type: 'ReactNode',
  },
  {
    component: 'Splitter',
    defaultValue: '-',
    description: '自定义类名，作用于根容器',
    name: 'className',
    type: 'string',
  },
  {
    component: 'Splitter',
    defaultValue: '-',
    description:
      '非受控模式下的初始尺寸数组，按面板顺序对应，缺失项视为 `auto`；优先级高于面板的 `defaultSize`',
    name: 'defaultSizes',
    type: 'SplitterSize[]',
  },
  {
    component: 'Splitter',
    defaultValue: 'false',
    description: '是否禁用所有分隔条的拖拽、键盘调整与双击折叠',
    name: 'disabled',
    type: 'boolean',
  },
  {
    component: 'Splitter',
    defaultValue: "'horizontal'",
    description: '布局方向，`horizontal` 左右分栏、`vertical` 上下分栏',
    name: 'layout',
    type: 'SplitterLayout',
  },
  {
    component: 'Splitter',
    defaultValue: '-',
    description: '尺寸变化时回调，参数为当前各面板尺寸数组（拖拽、键盘调整、折叠均会触发）',
    name: 'onChange',
    type: '(sizes: SplitterSize[]) => void',
  },
  {
    component: 'Splitter',
    defaultValue: '-',
    description: '一次拖拽调整结束时回调，参数为调整后的尺寸数组',
    name: 'onResizeEnd',
    type: '(sizes: SplitterSize[]) => void',
  },
  {
    component: 'Splitter',
    defaultValue: '-',
    description: '开始拖拽调整时回调，参数为调整前的尺寸数组',
    name: 'onResizeStart',
    type: '(sizes: SplitterSize[]) => void',
  },
  {
    component: 'Splitter',
    defaultValue: '-',
    description:
      '自定义分隔条渲染函数，参数为分隔条属性集合（无障碍与样式属性，含 `data-splitter-bar` 标识）与分隔条序号（从 0 开始）；拖拽、键盘与折叠交互由组件自动附加到返回的元素上',
    name: 'renderBar',
    type: '(props: SplitterBarRenderProps, index: number) => ReactNode',
  },
  {
    component: 'Splitter',
    defaultValue: '-',
    description: '受控尺寸数组，提供后组件不再维护内部尺寸，仅在尺寸变化时触发 `onChange`',
    name: 'sizes',
    type: 'SplitterSize[]',
  },
  {
    component: 'Splitter',
    defaultValue: '-',
    description: '根容器的所有原生属性（如 `style`、`id` 等）',
    name: '...rest',
    type: 'HTMLAttributes',
  },
  {
    component: 'SplitterPanel',
    defaultValue: "'div'",
    description: '面板渲染的元素类型',
    name: 'as',
    type: 'ElementType',
  },
  {
    component: 'SplitterPanel',
    defaultValue: '-',
    description: '面板内容',
    name: 'children',
    type: 'ReactNode',
  },
  {
    component: 'SplitterPanel',
    defaultValue: '-',
    description: '自定义类名，作用于面板',
    name: 'className',
    type: 'string',
  },
  {
    component: 'SplitterPanel',
    defaultValue: 'false',
    description: '是否允许通过双击相邻分隔条折叠该面板',
    name: 'collapsible',
    type: 'boolean',
  },
  {
    component: 'SplitterPanel',
    defaultValue: 'false',
    description: '受控的折叠状态，提供后双击/拖拽不会自动更新，仅触发 `onCollapse` 回调',
    name: 'collapsed',
    type: 'boolean',
  },
  {
    component: 'SplitterPanel',
    defaultValue: '0',
    description: '折叠后的面板尺寸',
    name: 'collapsedSize',
    type: 'number | string',
  },
  {
    component: 'SplitterPanel',
    defaultValue: 'false',
    description: '非受控模式下的初始折叠状态',
    name: 'defaultCollapsed',
    type: 'boolean',
  },
  {
    component: 'SplitterPanel',
    defaultValue: "'auto'",
    description:
      '非受控模式下的初始尺寸，支持像素数字、`200px` 像素字符串、`40%` 百分比字符串或 `auto`',
    name: 'defaultSize',
    type: 'number | string',
  },
  {
    component: 'SplitterPanel',
    defaultValue: '-',
    description: '面板的最大尺寸（像素或百分比）',
    name: 'max',
    type: 'number | string',
  },
  {
    component: 'SplitterPanel',
    defaultValue: '-',
    description: '面板的最小尺寸（像素或百分比）',
    name: 'min',
    type: 'number | string',
  },
  {
    component: 'SplitterPanel',
    defaultValue: '-',
    description: '折叠状态变化时回调，参数为新的折叠状态',
    name: 'onCollapse',
    type: '(collapsed: boolean) => void',
  },
  {
    component: 'SplitterPanel',
    defaultValue: 'true',
    description: '是否允许通过相邻分隔条调整该面板尺寸；相邻两侧均不可调整时分隔条会被禁用',
    name: 'resizable',
    type: 'boolean',
  },
  {
    component: 'SplitterPanel',
    defaultValue: '-',
    description: '面板的所有原生属性（如 `style`、`data-*` 等）',
    name: '...rest',
    type: 'HTMLAttributes',
  },
];

const splitterTypeDefinitions: ApiTypeDefinition[] = [
  {
    code: splitterPropsTypeCode,
    description: '分栏容器组件属性接口',
    name: 'SplitterProps',
  },
  {
    code: splitterPanelPropsTypeCode,
    description: '面板组件属性接口',
    name: 'SplitterPanelProps',
  },
  {
    code: splitterContextValueTypeCode,
    description: '分栏上下文值，可通过 `useSplitter` 获取（不在 `Splitter` 内返回 `null`）',
    name: 'SplitterContextValue',
  },
  {
    code: splitterLayoutTypeCode,
    description: '分栏布局方向类型',
    name: 'SplitterLayout',
  },
  {
    code: splitterSizeTypeCode,
    description: '面板尺寸类型，支持像素数字、像素字符串与百分比字符串',
    name: 'SplitterSize',
  },
  {
    code: splitterBarRenderPropsTypeCode,
    description: '自定义分隔条渲染属性，在原生 HTML 属性之上附带 `data-splitter-bar` 分隔条标识',
    name: 'SplitterBarRenderProps',
  },
];

export const SplitterDoc = () => {
  const [collapsed, setCollapsed] = useState(true);
  const [sizes, setSizes] = useState<SplitterSize[]>(['25%', '75%']);

  const demoContent = (
    <>
      <DemoSection code={basicCode} title="基础用法">
        <Splitter style={{ height: 320 }}>
          <SplitterPanel defaultSize="30%">
            <div className="h-100 d-flex align-items-center justify-content-center bg-light border rounded-3">
              左侧面板
            </div>
          </SplitterPanel>
          <SplitterPanel>
            <div className="h-100 d-flex align-items-center justify-content-center bg-body border rounded-3">
              右侧面板
            </div>
          </SplitterPanel>
        </Splitter>
        <p className="mb-0 mt-3 text-muted small">
          拖拽中间分隔条调整两侧宽度，未指定尺寸的面板默认为 auto
          并自动占据剩余空间；分隔条支持键盘操作：方向键调整 10%，Shift+方向键微调 1%，Home/End
          直达最小/最大尺寸
        </p>
      </DemoSection>

      <DemoSection code={verticalCode} title="垂直布局">
        <Splitter layout="vertical" style={{ height: 320 }}>
          <SplitterPanel defaultSize="40%" min="20%">
            <div className="h-100 d-flex align-items-center justify-content-center bg-light border rounded-3">
              上方面板
            </div>
          </SplitterPanel>
          <SplitterPanel>
            <div className="h-100 d-flex align-items-center justify-content-center bg-body border rounded-3">
              下方面板
            </div>
          </SplitterPanel>
        </Splitter>
        <p className="mb-0 mt-3 text-muted small">
          layout 设为 vertical 时面板上下排列；垂直布局需要容器具有确定的高度，百分比尺寸与 min/max
          均相对容器高度计算
        </p>
      </DemoSection>

      <DemoSection code={sizesCode} title="像素与百分比">
        <Splitter style={{ height: 280 }}>
          <SplitterPanel defaultSize={200}>
            <div className="h-100 d-flex align-items-center justify-content-center bg-light border rounded-3">
              固定像素 200px
            </div>
          </SplitterPanel>
          <SplitterPanel defaultSize="30%">
            <div className="h-100 d-flex align-items-center justify-content-center bg-body border rounded-3">
              百分比 30%
            </div>
          </SplitterPanel>
          <SplitterPanel>
            <div className="h-100 d-flex align-items-center justify-content-center bg-light-subtle border rounded-3">
              auto 自适应剩余空间
            </div>
          </SplitterPanel>
        </Splitter>
        <p className="mb-0 mt-3 text-muted small">
          尺寸支持像素数字、像素字符串与百分比字符串，未指定或传入 auto 的面板按剩余空间均分；拖拽后
          auto 面板会转换为像素尺寸，百分比面板保持百分比单位
        </p>
      </DemoSection>

      <DemoSection code={minMaxCode} title="最小与最大尺寸">
        <Splitter style={{ height: 280 }}>
          <SplitterPanel defaultSize="40%" max="60%" min="20%">
            <div className="h-100 d-flex align-items-center justify-content-center bg-light border rounded-3">
              范围 20% ~ 60%
            </div>
          </SplitterPanel>
          <SplitterPanel min="25%">
            <div className="h-100 d-flex align-items-center justify-content-center bg-body border rounded-3">
              最小 25%
            </div>
          </SplitterPanel>
        </Splitter>
        <p className="mb-0 mt-3 text-muted small">
          拖拽与键盘调整都会被两侧面板的 min/max 同时约束，越界时会自动钳制
        </p>
      </DemoSection>

      <DemoSection code={collapsibleCode} title="折叠面板">
        <Splitter style={{ height: 260 }}>
          <SplitterPanel collapsible defaultSize="30%" min="15%">
            <div className="h-100 d-flex align-items-center justify-content-center bg-light border rounded-3">
              双击分隔条折叠
            </div>
          </SplitterPanel>
          <SplitterPanel>
            <div className="h-100 d-flex align-items-center justify-content-center bg-body border rounded-3">
              内容区域
            </div>
          </SplitterPanel>
        </Splitter>
        <p className="mb-0 mt-3 text-muted small">
          开启 collapsible
          后双击分隔条即可折叠/展开左侧面板，再次双击恢复折叠前的尺寸；拖拽或键盘调整
          也可将折叠面板重新展开
        </p>
        <Splitter className="mt-4" style={{ height: 260 }}>
          <SplitterPanel
            collapsed={collapsed}
            collapsible
            defaultSize="30%"
            min="15%"
            onCollapse={setCollapsed}
          >
            <div className="h-100 d-flex align-items-center justify-content-center bg-light border rounded-3">
              受控折叠
            </div>
          </SplitterPanel>
          <SplitterPanel>
            <div className="h-100 d-flex align-items-center justify-content-center bg-body border rounded-3">
              内容区域
            </div>
          </SplitterPanel>
        </Splitter>
        <Button
          className="mt-3"
          onClick={() => setCollapsed((prev) => !prev)}
          variant="outline-primary"
        >
          {collapsed ? '展开' : '折叠'}侧边栏
        </Button>
        <p className="mb-0 mt-2 text-muted small">
          受控模式通过 collapsed 与 onCollapse 管理折叠状态，双击分隔条仅触发 onCollapse 回调
        </p>
      </DemoSection>

      <DemoSection code={controlledCode} title="受控模式">
        <Splitter onChange={setSizes} sizes={sizes} style={{ height: 280 }}>
          <SplitterPanel min="15%">
            <div className="h-100 d-flex align-items-center justify-content-center bg-light border rounded-3">
              左侧面板
            </div>
          </SplitterPanel>
          <SplitterPanel>
            <div className="h-100 d-flex align-items-center justify-content-center bg-body border rounded-3">
              右侧面板
            </div>
          </SplitterPanel>
        </Splitter>
        <div className="d-flex align-items-center gap-2 mt-3">
          <Button onClick={() => setSizes(['50%', '50%'])} variant="outline-secondary">
            平均分配
          </Button>
          <Button onClick={() => setSizes(['70%', '30%'])} variant="outline-secondary">
            7:3
          </Button>
          <code className="ms-auto">{sizes.join(' / ')}</code>
        </div>
        <p className="mb-0 mt-2 text-muted small">
          提供 sizes 后组件进入受控模式，拖拽、键盘与折叠仅触发 onChange，由外部状态驱动渲染
        </p>
      </DemoSection>

      <DemoSection code={disabledCode} title="禁用与不可调整">
        <Splitter disabled style={{ height: 260 }}>
          <SplitterPanel defaultSize="40%">
            <div className="h-100 d-flex align-items-center justify-content-center bg-light border rounded-3">
              左侧面板
            </div>
          </SplitterPanel>
          <SplitterPanel>
            <div className="h-100 d-flex align-items-center justify-content-center bg-body border rounded-3">
              右侧面板
            </div>
          </SplitterPanel>
        </Splitter>
        <p className="mb-0 mt-3 text-muted small">
          disabled 禁用整个分割器的拖拽、键盘调整与双击折叠
        </p>
        <Splitter className="mt-4" style={{ height: 260 }}>
          <SplitterPanel defaultSize="40%" resizable={false}>
            <div className="h-100 d-flex align-items-center justify-content-center bg-light border rounded-3">
              固定面板（不可调整）
            </div>
          </SplitterPanel>
          <SplitterPanel>
            <div className="h-100 d-flex align-items-center justify-content-center bg-body border rounded-3">
              可调整面板
            </div>
          </SplitterPanel>
        </Splitter>
        <p className="mb-0 mt-3 text-muted small">
          面板设置 resizable=&quot;false&quot; 后其相邻分隔条会被禁用
        </p>
      </DemoSection>

      <DemoSection code={customBarCode} title="自定义分隔条">
        <Splitter
          barSize={16}
          renderBar={(props) => (
            <div {...props}>
              <span
                style={{
                  background: 'var(--bs-primary)',
                  borderRadius: 999,
                  display: 'block',
                  height: 32,
                  width: 4,
                }}
              />
            </div>
          )}
          style={{ height: 280 }}
        >
          <SplitterPanel defaultSize="40%">
            <div className="h-100 d-flex align-items-center justify-content-center bg-light border rounded-3">
              左侧面板
            </div>
          </SplitterPanel>
          <SplitterPanel>
            <div className="h-100 d-flex align-items-center justify-content-center bg-body border rounded-3">
              右侧面板
            </div>
          </SplitterPanel>
        </Splitter>
        <p className="mb-0 mt-3 text-muted small">
          renderBar
          接收分隔条的无障碍与样式属性，展开到自定义元素上即可；拖拽、键盘与双击折叠交互由组件自动
          处理，barSize 可调整分隔条厚度
        </p>
      </DemoSection>

      <DemoSection code={nestedCode} title="嵌套布局">
        <Splitter layout="vertical" style={{ height: 480 }}>
          <SplitterPanel defaultSize="30%" min="20%">
            <div className="h-100 d-flex align-items-center justify-content-center bg-light border rounded-3">
              顶部工具栏
            </div>
          </SplitterPanel>
          <SplitterPanel>
            <Splitter className="h-100" defaultSizes={['25%', '75%']}>
              <SplitterPanel min="15%">
                <div className="h-100 d-flex align-items-center justify-content-center bg-body border rounded-3">
                  资源管理器
                </div>
              </SplitterPanel>
              <SplitterPanel>
                <div className="h-100 d-flex align-items-center justify-content-center bg-light-subtle border rounded-3">
                  编辑器
                </div>
              </SplitterPanel>
            </Splitter>
          </SplitterPanel>
        </Splitter>
        <p className="mb-0 mt-3 text-muted small">
          面板内容可以继续嵌套任意方向的分割器，组合出 IDE 式多区域可调整布局
        </p>
      </DemoSection>
    </>
  );

  return (
    <DocTemplate
      componentDescription="基于 Bootstrap 5 的分栏布局组件，用于在两个或多个面板之间创建可拖拽调整的布局，支持水平/垂直方向、像素/百分比/自适应尺寸、最小最大约束、折叠面板、键盘操作、自定义分隔条以及受控/非受控模式"
      componentName="Splitter"
      componentTags={['基础', '布局']}
      demoContent={demoContent}
      props={splitterProps}
      typeDefinitions={splitterTypeDefinitions}
    />
  );
};

export default SplitterDoc;
