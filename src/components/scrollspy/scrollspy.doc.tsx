import { useState } from 'react';

import { type ApiProp, type ApiTypeDefinition, DemoSection, DocTemplate } from '../doc-template';
import basicCode from './demos/basic.md?raw';
import controlledCode from './demos/controlled.md?raw';
import listGroupCode from './demos/list-group.md?raw';
import nestedCode from './demos/nested.md?raw';
import nonVisibleCode from './demos/non-visible.md?raw';
import optionsCode from './demos/options.md?raw';
import windowCode from './demos/window.md?raw';
import { ScrollSpy, ScrollSpyContainer, ScrollSpyLink } from './index';
import scrollspyContainerPropsTypeCode from './types/scrollspy-container-props.md?raw';
import scrollspyContextValueTypeCode from './types/scrollspy-context-value.md?raw';
import scrollspyLinkPropsTypeCode from './types/scrollspy-link-props.md?raw';
import scrollspyPropsTypeCode from './types/scrollspy-props.md?raw';

const OptionsDemo = () => {
  const [rootMargin, setRootMargin] = useState('0px 0px -25%');
  const [threshold, setThreshold] = useState<number[]>([0.1, 0.5, 1]);

  return (
    <>
      <div className="d-flex gap-3 mb-3">
        <select
          className="form-select form-select-sm"
          onChange={(event) => setRootMargin(event.target.value)}
          value={rootMargin}
        >
          <option value="0px 0px -25%">激活线起点：容器顶部（默认）</option>
          <option value="40px 0px -25%">激活线起点：顶部下方 40px</option>
          <option value="80px 0px -25%">激活线起点：顶部下方 80px</option>
          <option value="120px 0px -25%">激活线起点：顶部下方 120px</option>
        </select>
        <select
          className="form-select form-select-sm"
          onChange={(event) => setThreshold(event.target.value.split(',').map(Number))}
          value={threshold.join(',')}
        >
          <option value="0.1,0.5,1">threshold: [0.1, 0.5, 1]（默认）</option>
          <option value="0">threshold: 0</option>
          <option value="0.25,0.75">threshold: [0.25, 0.75]</option>
        </select>
      </div>
      <ScrollSpy rootMargin={rootMargin} smoothScroll threshold={threshold}>
        <div className="row">
          <div className="col-4">
            <nav className="nav nav-pills flex-column">
              <ScrollSpyLink className="nav-link" targetId="spy-options-1">
                区域一
              </ScrollSpyLink>
              <ScrollSpyLink className="nav-link" targetId="spy-options-2">
                区域二
              </ScrollSpyLink>
              <ScrollSpyLink className="nav-link" targetId="spy-options-3">
                区域三
              </ScrollSpyLink>
              <ScrollSpyLink className="nav-link" targetId="spy-options-4">
                区域四
              </ScrollSpyLink>
            </nav>
          </div>
          <div className="col-8">
            <ScrollSpyContainer className="scrollspy-example" tabIndex={0}>
              <h4 id="spy-options-1">区域一</h4>
              <p>
                这是区域一的内容。激活线与可见比例变化后，激活切换的时机也会随之改变，向下滚动观察切换位置的变化。
              </p>
              <h4 id="spy-options-2">区域二</h4>
              <p>
                这是区域二的内容。点击左侧导航链接可以平滑滚动到对应区域，滚动停止后激活项立即与目标区域同步。
              </p>
              <h4 id="spy-options-3">区域三</h4>
              <p>
                这是区域三的内容。rootMargin 顶部边距决定激活线的初始位置，激活线随滚动逐渐下移，
                底部边距与 threshold 决定可见比例门槛。
              </p>
              <h4 id="spy-options-4">区域四</h4>
              <p>
                这是区域四的内容。修改上方下拉框可以实时调整观察配置，滚动到底部时最后一项自动激活。
              </p>
            </ScrollSpyContainer>
          </div>
        </div>
      </ScrollSpy>
    </>
  );
};

const ControlledDemo = () => {
  const [activeId, setActiveId] = useState('spy-controlled-1');

  return (
    <>
      <ScrollSpy
        activeId={activeId}
        onActivate={(id) => {
          setActiveId(id ?? '');
        }}
      >
        <div className="mb-3">
          <ScrollSpyLink
            className="btn btn-outline-primary btn-sm me-2"
            targetId="spy-controlled-1"
          >
            跳到区域一
          </ScrollSpyLink>
          <ScrollSpyLink
            className="btn btn-outline-primary btn-sm me-2"
            targetId="spy-controlled-2"
          >
            跳到区域二
          </ScrollSpyLink>
          <ScrollSpyLink
            className="btn btn-outline-primary btn-sm me-2"
            targetId="spy-controlled-3"
          >
            跳到区域三
          </ScrollSpyLink>
        </div>
        <div className="row">
          <div className="col-4">
            <nav className="nav nav-pills flex-column">
              <ScrollSpyLink className="nav-link" targetId="spy-controlled-1">
                区域一
              </ScrollSpyLink>
              <ScrollSpyLink className="nav-link" targetId="spy-controlled-2">
                区域二
              </ScrollSpyLink>
              <ScrollSpyLink className="nav-link" targetId="spy-controlled-3">
                区域三
              </ScrollSpyLink>
            </nav>
          </div>
          <div className="col-8">
            <ScrollSpyContainer className="scrollspy-example" tabIndex={0}>
              <h4 id="spy-controlled-1">区域一</h4>
              <p>
                这是第一个区域的内容。当前激活的区域由外部 state 控制，滚动容器时 onActivate
                回调会更新该 state，激活项跟随阅读位置变化。
              </p>
              <h4 id="spy-controlled-2">区域二</h4>
              <p>
                这是第二个区域的内容。点击上方按钮可以跳转到对应区域，按钮复用了 ScrollSpyLink
                的滚动逻辑，跳转后激活项立即同步。
              </p>
              <h4 id="spy-controlled-3">区域三</h4>
              <p>
                这是第三个区域的内容。滚动到容器底部时，最后一个链接自动激活，与 Bootstrap 的
                maxScroll 行为一致。
              </p>
            </ScrollSpyContainer>
          </div>
        </div>
      </ScrollSpy>
      <p className="mb-0 mt-3 text-muted small">当前激活的区域：{activeId || '无'}</p>
    </>
  );
};

const scrollspyProps: ApiProp[] = [
  {
    component: 'ScrollSpy',
    defaultValue: '-',
    description:
      '受控激活 id，与 ScrollSpyLink 的 targetId（或 href 锚点）匹配时对应链接自动渲染 active 类，需配合 onActivate 更新',
    name: 'activeId',
    type: 'string',
  },
  {
    component: 'ScrollSpy',
    defaultValue: '-',
    description: '非受控模式下的初始激活 id，设置后滚动监听会自动维护激活状态',
    name: 'defaultActiveId',
    type: 'string',
  },
  {
    component: 'ScrollSpy',
    defaultValue: '-',
    description:
      '激活回调，新区域的标题滚动到激活线时以 (区域 id, 对应链接元素) 触发；滚动到所有区域上方（无区域越过激活线）时以 (null, null) 触发（Bootstrap 仅在激活时触发 activate 事件，此处为 React 受控适配）',
    name: 'onActivate',
    type: '(activeId: string | null, link: HTMLElement | null) => void',
  },
  {
    component: 'ScrollSpy',
    defaultValue: "'0px 0px -25%'",
    description:
      '观察配置（与 Bootstrap 的 rootMargin 选项一致）：顶部边距决定激活线的位置（默认 0，即滚动容器顶部/视口顶部）；当部分章节的标题无法在滚动行程内越过激活线时，激活线会自动逐渐下移，保证每个章节都能依次激活（章节足够高时保持经典行为不变）；底部边距收缩可见区域范围，配合 threshold 控制可见比例门槛',
    name: 'rootMargin',
    type: 'string',
  },
  {
    component: 'ScrollSpy',
    defaultValue: 'false',
    description:
      '点击 ScrollSpyLink 时平滑滚动到目标区域（等价于 Bootstrap 的 smoothScroll 选项），并自动遵循 prefers-reduced-motion',
    name: 'smoothScroll',
    type: 'boolean',
  },
  {
    component: 'ScrollSpy',
    defaultValue: '-',
    description:
      '选择器字符串，等价于 Bootstrap 的 data-bs-target：指定普通 HTML 导航元素，自动收集其中带锚点 href 的链接并直接管理其 active 类，适合静态导航、嵌套导航与列表组；点击其中链接时保留原生锚点跳转（URL hash 同步），并在跳转后让点击的链接保持激活（即使目标标题无法滚动到激活线）',
    name: 'target',
    type: 'string',
  },
  {
    component: 'ScrollSpy',
    defaultValue: '[0.1, 0.5, 1]',
    description:
      '可见比例门槛：区域在（经 rootMargin 收缩后的）可见区域内的可见比例达到该值后才可激活；传入数组时取最小值作为门槛',
    name: 'threshold',
    type: 'number | number[]',
  },
  {
    component: 'ScrollSpy',
    defaultValue: '-',
    description: '由 ScrollSpyContainer 与导航（含 ScrollSpyLink）组成的内容',
    name: 'children',
    type: 'ReactNode',
  },
  {
    component: 'ScrollSpyContainer',
    defaultValue: "'div'",
    description:
      '渲染的元素标签，等价于 Bootstrap 中带 data-bs-spy="scroll" 的滚动容器；默认只设置 position: relative，滚动溢出样式（overflow/height）由使用方控制',
    name: 'as',
    type: 'ElementType',
  },
  {
    component: 'ScrollSpyContainer',
    defaultValue: '0',
    description: '键盘焦点序号，让容器可以通过键盘滚动（Bootstrap 文档建议设置 tabindex="0"）',
    name: 'tabIndex',
    type: 'number',
  },
  {
    component: 'ScrollSpyLink',
    defaultValue: '-',
    description:
      '目标区域 id，未设置时从 href 的 # 锚点解析；在 ScrollSpy 内渲染时自动注册监听并激活',
    name: 'targetId',
    type: 'string',
  },
  {
    component: 'ScrollSpyLink',
    defaultValue: '#targetId',
    description:
      '链接地址，未设置时自动生成 `#targetId`；以 # 开头时参与滚动监听，其他 href 渲染为普通链接',
    name: 'href',
    type: 'string',
  },
  {
    component: 'ScrollSpyLink',
    defaultValue: '-',
    description: '覆盖 ScrollSpy 的 smoothScroll 设置，单独控制该链接点击时的滚动行为',
    name: 'smoothScroll',
    type: 'boolean',
  },
  {
    component: 'ScrollSpyLink',
    defaultValue: '-',
    description: '点击回调，触发后再执行默认滚动逻辑；调用 event.preventDefault() 可阻止滚动',
    name: 'onClick',
    type: '(event: MouseEvent<HTMLElement>) => void',
  },
  {
    component: 'ScrollSpyLink',
    defaultValue: "'a'",
    description: '渲染的元素标签，便于接入路由组件等自定义链接',
    name: 'as',
    type: 'ElementType',
  },
  {
    defaultValue: '-',
    description: '组件内容',
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
    description: '透传原生元素属性（如 `style`、`role` 等）',
    name: '...rest',
    type: 'HTMLAttributes',
  },
];

const scrollspyTypeDefinitions: ApiTypeDefinition[] = [
  {
    code: scrollspyPropsTypeCode,
    description: '滚动监听组件属性接口',
    name: 'ScrollSpyProps',
  },
  {
    code: scrollspyContainerPropsTypeCode,
    description: '滚动监听容器组件属性接口',
    name: 'ScrollSpyContainerProps',
  },
  {
    code: scrollspyLinkPropsTypeCode,
    description: '滚动监听链接组件属性接口',
    name: 'ScrollSpyLinkProps',
  },
  {
    code: scrollspyContextValueTypeCode,
    description: '滚动监听上下文，供 ScrollSpyContainer 与 ScrollSpyLink 消费',
    name: 'ScrollSpyContextValue',
  },
];

export const ScrollSpyDoc = () => {
  const demoContent = (
    <>
      <DemoSection code={basicCode} title="基础用法">
        <ScrollSpy>
          <nav className="nav nav-pills flex-column mb-3">
            <ScrollSpyLink className="nav-link" targetId="spy-basic-1">
              第一个
            </ScrollSpyLink>
            <ScrollSpyLink className="nav-link" targetId="spy-basic-2">
              第二个
            </ScrollSpyLink>
            <ScrollSpyLink className="nav-link" targetId="spy-basic-3">
              第三个
            </ScrollSpyLink>
            <ScrollSpyLink className="nav-link" targetId="spy-basic-4">
              第四个
            </ScrollSpyLink>
            <ScrollSpyLink className="nav-link" targetId="spy-basic-5">
              第五个
            </ScrollSpyLink>
          </nav>
          <ScrollSpyContainer className="scrollspy-example bg-body-tertiary p-3 rounded-2">
            <h4 id="spy-basic-1">第一个标题</h4>
            <p>
              这是第一个区域的内容。向下滚动容器，每个区域的标题会依次越过容器顶部的激活线，导航中的对应链接随之自动高亮。
              当前标题越过激活线后，其链接会一直保持激活，直到下一个标题到达，确保激活项始终跟随阅读位置。
            </p>
            <h4 id="spy-basic-2">第二个标题</h4>
            <p>
              这是第二个区域的内容。激活状态由滚动位置实时计算，切换时机由 rootMargin
              顶部边距决定的激活线控制。继续向下滚动，后续区域的标题会依次越过激活线，导航激活项随之逐个切换。
            </p>
            <h4 id="spy-basic-3">第三个标题</h4>
            <p>
              这是第三个区域的内容。向上滚动时，激活项会按照相反的顺序逐个切换回前面的区域，与阅读位置保持一致。
              点击上方导航链接可以直接跳转到对应区域，跳转后激活项立即同步。
            </p>
            <h4 id="spy-basic-4">第四个标题</h4>
            <p>
              这是第四个区域的内容。每个区域都包含足够的内容，保证在滚动过程中后一个区域的标题能够到达激活线，
              从而依次触发导航切换，中间不会出现空档或跳项。
            </p>
            <h4 id="spy-basic-5">第五个标题</h4>
            <p>
              这是最后一个区域的内容。当容器滚动到底部时，最后一个链接会自动激活（与 Bootstrap 的
              maxScroll 行为一致），保证导航始终有选中的项。
            </p>
          </ScrollSpyContainer>
        </ScrollSpy>
        <p className="mb-0 mt-3 text-muted small">
          ScrollSpy 提供上下文，ScrollSpyLink 根据当前激活 id 自动渲染 active 类；ScrollSpyContainer
          默认渲染 `position: relative` 的可滚动容器（高度与 overflow 由使用方样式控制）；底层通过
          IntersectionObserver 跟踪各区域的几何信息，结合滚动位置实时计算激活项
        </p>
      </DemoSection>

      <DemoSection code={nestedCode} title="嵌套导航（普通 HTML 目标）">
        <div className="row">
          <div className="col-4">
            <nav
              className="h-100 flex-column align-items-stretch pe-4 border-end"
              id="spy-nested-nav"
            >
              <nav className="nav nav-pills flex-column">
                <a className="nav-link" href="#spy-nested-1">
                  第一个
                </a>
                <nav className="nav nav-pills flex-column">
                  <a className="nav-link ms-3 my-1" href="#spy-nested-1-1">
                    第一个-1
                  </a>
                  <a className="nav-link ms-3 my-1" href="#spy-nested-1-2">
                    第一个-2
                  </a>
                </nav>
                <a className="nav-link" href="#spy-nested-2">
                  第二个
                </a>
                <a className="nav-link" href="#spy-nested-3">
                  第三个
                </a>
                <nav className="nav nav-pills flex-column">
                  <a className="nav-link ms-3 my-1" href="#spy-nested-3-1">
                    第三个-1
                  </a>
                  <a className="nav-link ms-3 my-1" href="#spy-nested-3-2">
                    第三个-2
                  </a>
                </nav>
              </nav>
            </nav>
          </div>
          <div className="col-8">
            <ScrollSpy target="#spy-nested-nav">
              <ScrollSpyContainer className="scrollspy-example" tabIndex={0}>
                <div id="spy-nested-1">
                  <h5>第一个</h5>
                  <p>
                    这是第一个区域的内容。向下滚动容器，本区域的两个子区域标题会依次越过激活线，
                    左侧嵌套导航中对应的链接随之激活。
                  </p>
                </div>
                <div id="spy-nested-1-1">
                  <h5>第一个-1</h5>
                  <p>
                    这是“第一个-1”子区域的内容。子区域与普通区域共用同一套激活机制，切换顺序由标题越过激活线的先后决定。
                  </p>
                </div>
                <div id="spy-nested-1-2">
                  <h5>第一个-2</h5>
                  <p>
                    这是“第一个-2”子区域的内容。继续向下滚动，激活项会切换到下一个子区域或区域。
                  </p>
                </div>
                <div id="spy-nested-2">
                  <h5>第二个</h5>
                  <p>
                    这是第二个区域的内容。向上滚动时，激活项会依次切换回前面的区域与子区域，与阅读位置保持一致。
                  </p>
                </div>
                <div id="spy-nested-3">
                  <h5>第三个</h5>
                  <p>
                    这是第三个区域的内容，同样包含两个子区域。滚动到子区域标题越过激活线时，对应链接会自动激活。
                  </p>
                </div>
                <div id="spy-nested-3-1">
                  <h5>第三个-1</h5>
                  <p>
                    这是“第三个-1”子区域的内容。本例的导航是普通 HTML，组件通过 target
                    选择器直接管理其中链接的 active 类。
                  </p>
                </div>
                <div id="spy-nested-3-2">
                  <h5>第三个-2</h5>
                  <p>
                    这是“第三个-2”子区域的内容。滚动到容器底部时，最后一个链接会自动激活，保证导航始终有选中的项。
                  </p>
                </div>
              </ScrollSpyContainer>
            </ScrollSpy>
          </div>
        </div>
        <p className="mb-0 mt-3 text-muted small">
          传入 target 选择器（等价于 Bootstrap 的
          data-bs-target）后，组件自动收集目标元素中所有带锚点 href 的链接，并按 Bootstrap
          的行为直接管理其 active 类，导航可以是任意普通 HTML
        </p>
      </DemoSection>

      <DemoSection code={listGroupCode} title="列表组目标">
        <div className="row">
          <div className="col-4">
            <div className="list-group" id="spy-list-nav">
              <a className="list-group-item list-group-item-action" href="#spy-list-1">
                列表项 1
              </a>
              <a className="list-group-item list-group-item-action" href="#spy-list-2">
                列表项 2
              </a>
              <a className="list-group-item list-group-item-action" href="#spy-list-3">
                列表项 3
              </a>
              <a className="list-group-item list-group-item-action" href="#spy-list-4">
                列表项 4
              </a>
            </div>
          </div>
          <div className="col-8">
            <ScrollSpy target="#spy-list-nav">
              <ScrollSpyContainer className="scrollspy-example" tabIndex={0}>
                <h4 id="spy-list-1">列表项 1</h4>
                <p>
                  这是第一个列表项对应的内容区域。向下滚动容器，后续列表项的标题会依次越过激活线，
                  左侧列表组中对应的项随之激活。
                </p>
                <h4 id="spy-list-2">列表项 2</h4>
                <p>
                  这是第二个列表项对应的内容区域。激活的列表项会渲染 active 类，与 Bootstrap 中
                  list-group-item 的激活样式保持一致。
                </p>
                <h4 id="spy-list-3">列表项 3</h4>
                <p>
                  这是第三个列表项对应的内容区域。继续向下滚动即可切换到下一个列表项，向上滚动则依次返回。
                </p>
                <h4 id="spy-list-4">列表项 4</h4>
                <p>
                  这是第四个列表项对应的内容区域。滚动到底部时，最后一个列表项自动激活，保证导航始终有选中的项。
                </p>
              </ScrollSpyContainer>
            </ScrollSpy>
          </div>
        </div>
        <p className="mb-0 mt-3 text-muted small">
          与 Bootstrap 一致，target 中的任意 `[href]` 元素（如 list-group-item）都能作为激活目标，
          激活时为其添加 active 类
        </p>
      </DemoSection>

      <DemoSection code={optionsCode} title="观察配置（rootMargin 与 threshold）">
        <OptionsDemo />
        <p className="mb-0 mt-3 text-muted small">
          顶部边距决定激活线的位置；当滚动行程不足以让所有章节依次越过激活线时，激活线会自动下移，
          保证每个区域都能依次激活；底部边距与 threshold 决定区域在可见区域内的比例门槛；开启
          smoothScroll 后点击导航链接会平滑滚动，且自动遵循系统的减少动态效果设置
        </p>
      </DemoSection>

      <DemoSection code={controlledCode} title="受控模式">
        <ControlledDemo />
        <p className="mb-0 mt-3 text-muted small">
          传入 activeId 后 ScrollSpy 变为受控组件，激活状态完全由 onActivate 驱动的外部 state 决定；
          上方按钮通过 ScrollSpyLink 的按钮样式复用点击滚动逻辑
        </p>
      </DemoSection>

      <DemoSection code={windowCode} title="页面滚动监听">
        <ScrollSpy>
          <nav
            className="nav nav-pills flex-column bg-body mb-3 position-sticky rounded shadow-sm"
            style={{ top: '0.5rem', zIndex: 1 }}
          >
            <ScrollSpyLink className="nav-link" targetId="spy-window-1">
              区域一
            </ScrollSpyLink>
            <ScrollSpyLink className="nav-link" targetId="spy-window-2">
              区域二
            </ScrollSpyLink>
            <ScrollSpyLink className="nav-link" targetId="spy-window-3">
              区域三
            </ScrollSpyLink>
            <ScrollSpyLink className="nav-link" targetId="spy-window-4">
              区域四
            </ScrollSpyLink>
          </nav>
          <ScrollSpyContainer>
            <h4 id="spy-window-1">区域一</h4>
            <p>
              当 ScrollSpyContainer 未设置滚动溢出样式（overflow-y 为
              visible）时，监听根自动切换为浏览器视口，此时滚动整个页面即可切换导航激活状态，等价于
              Bootstrap 中在 body 上初始化
              ScrollSpy。上方导航在页面滚动时固定在视口顶部，方便观察激活变化。
            </p>
            <h4 id="spy-window-2">区域二</h4>
            <p>
              继续向下滚动页面，“区域二”的标题滚动到视口顶部（激活线）时，导航中的对应链接会被激活。
              每个区域的标题越过激活线后，其链接保持激活，直到下一个标题到达。
            </p>
            <h4 id="spy-window-3">区域三</h4>
            <p>
              激活线的位置由 rootMargin 的顶部边距决定，可见比例门槛由 threshold
              决定。向上滚动页面时，激活项会依次切换回前面的区域。
            </p>
            <h4 id="spy-window-4">区域四</h4>
            <p>
              这是最后一个区域的内容。页面滚动到底部时，最后一个链接自动激活（与 Bootstrap 在 body
              上使用 ScrollSpy 的 maxScroll 行为一致）。
            </p>
          </ScrollSpyContainer>
        </ScrollSpy>
        <p className="mb-0 mt-3 text-muted small">
          与 Bootstrap 的 ScrollSpy 实现一致：当监听容器 overflow-y 为 visible
          时，观察根回退为浏览器视口， 向下滚动本页面即可看到导航激活状态的变化
        </p>
      </DemoSection>

      <DemoSection code={nonVisibleCode} title="不可见元素与禁用链接">
        <div className="row">
          <div className="col-4">
            <nav className="nav nav-pills flex-column" id="spy-hidden-nav">
              <a className="nav-link" href="#spy-hidden-1">
                可见区域
              </a>
              <a className="nav-link" href="#spy-hidden-2">
                隐藏区域
              </a>
              <a className="nav-link disabled" href="#spy-hidden-3">
                禁用链接
              </a>
              <a className="nav-link" href="#spy-hidden-4">
                另一个区域
              </a>
            </nav>
          </div>
          <div className="col-8">
            <ScrollSpy target="#spy-hidden-nav">
              <ScrollSpyContainer className="scrollspy-example" tabIndex={0}>
                <h4 id="spy-hidden-1">可见区域</h4>
                <p>
                  这是一个正常可见的区域，向下滚动时它会正常激活对应链接。本区域包含足够的内容，
                  保证后续区域能够依次到达激活线。
                </p>
                <h4 className="d-none" id="spy-hidden-2">
                  隐藏区域
                </h4>
                <p className="d-none">
                  设置了 display: none 的区域不会被监听，因此“隐藏区域”链接永远不会被激活。
                </p>
                <h4 id="spy-hidden-4">另一个区域</h4>
                <p>
                  滚动到这里时，“另一个区域”链接会被激活。“禁用链接”由于带 disabled
                  类被跳过，始终保持不可交互状态。
                </p>
              </ScrollSpyContainer>
            </ScrollSpy>
          </div>
        </div>
        <p className="mb-0 mt-3 text-muted small">
          与 Bootstrap 一致：不可见（display: none 等）的区域不会注册观察；带 disabled 属性或
          disabled 类的链接会被跳过，不会参与激活
        </p>
      </DemoSection>
    </>
  );

  return (
    <DocTemplate
      componentDescription="基于 Bootstrap 5 的滚动监听组件，使用 IntersectionObserver 跟踪区域几何信息并结合滚动位置实时计算激活状态，支持 rootMargin/threshold 观察配置、平滑滚动、受控模式、上下文式链接（ScrollSpyLink）与普通 HTML 导航（target 选择器）两种接入方式"
      componentName="ScrollSpy"
      componentTags={['基础', '导航']}
      demoContent={demoContent}
      props={scrollspyProps}
      typeDefinitions={scrollspyTypeDefinitions}
    />
  );
};

export default ScrollSpyDoc;
