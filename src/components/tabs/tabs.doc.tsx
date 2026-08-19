import { useState } from 'react';
import { Link } from 'react-router';

import {
  type ApiProp,
  type ApiTypeDefinition,
  DemoSection,
  DocTemplate,
} from '../../internal/doc-template';
import baseCode from './demos/base.md?raw';
import buttonsCode from './demos/buttons.md?raw';
import controlledCode from './demos/controlled.md?raw';
import fillJustifyCode from './demos/fill-justify.md?raw';
import flexCode from './demos/flex.md?raw';
import routerCode from './demos/router.md?raw';
import statesCode from './demos/states.md?raw';
import tabContainerCode from './demos/tab-container.md?raw';
import tabsCode from './demos/tabs.md?raw';
import variantsCode from './demos/variants.md?raw';
import { Nav, NavItem, NavLink, Tab, TabContainer, TabContent, TabPane, Tabs } from './index';
import eventKeyTypeCode from './types/event-key.md?raw';
import navBreakpointTypeCode from './types/nav-breakpoint.md?raw';
import navContextValueTypeCode from './types/nav-context-value.md?raw';
import navItemPropsTypeCode from './types/nav-item-props.md?raw';
import navLinkPropsTypeCode from './types/nav-link-props.md?raw';
import navPropsTypeCode from './types/nav-props.md?raw';
import navVariantTypeCode from './types/nav-variant.md?raw';
import tabContainerPropsTypeCode from './types/tab-container-props.md?raw';
import tabContentPropsTypeCode from './types/tab-content-props.md?raw';
import tabPanePropsTypeCode from './types/tab-pane-props.md?raw';
import tabPropsTypeCode from './types/tab-props.md?raw';
import tabsContextValueTypeCode from './types/tabs-context-value.md?raw';
import tabsPropsTypeCode from './types/tabs-props.md?raw';

const tabsProps: ApiProp[] = [
  {
    component: 'Nav',
    defaultValue: "'ul'",
    description: '根元素标签，默认渲染 `ul.nav`',
    name: 'as',
    type: 'ElementType',
  },
  {
    component: 'Nav',
    defaultValue: '-',
    description:
      '样式变体，`tabs`/`pills`/`underline` 分别渲染 `nav-tabs`/`nav-pills`/`nav-underline` 类，并自动为容器设置 `role="tablist"`',
    name: 'variant',
    type: 'NavVariant',
  },
  {
    component: 'Nav',
    defaultValue: '-',
    description:
      '受控激活 key，与 NavLink 的 eventKey（未设置时回退到 href）匹配后自动设置激活样式，需配合 onSelect 更新',
    name: 'activeKey',
    type: 'EventKey',
  },
  {
    component: 'Nav',
    defaultValue: '-',
    description:
      '非受控模式下的初始激活 key，设置后点击 NavLink 会自动维护激活状态；未设置时 Nav 仅做静态展示',
    name: 'defaultActiveKey',
    type: 'EventKey',
  },
  {
    component: 'Nav',
    defaultValue: '-',
    description: '选择回调，在 NavLink 点击且未被阻止时触发',
    name: 'onSelect',
    type: '(eventKey: EventKey, event: SyntheticEvent) => void',
  },
  {
    component: 'Nav',
    defaultValue: 'false',
    description: '渲染 `nav-fill` 类，让每个条目按内容比例填满可用宽度',
    name: 'fill',
    type: 'boolean',
  },
  {
    component: 'Nav',
    defaultValue: 'false',
    description: '渲染 `nav-justified` 类，让每个条目等宽填满可用宽度',
    name: 'justify',
    type: 'boolean',
  },
  {
    component: 'Nav',
    defaultValue: 'false',
    description:
      '垂直布局，为 `true` 时渲染 `flex-column`，传入断点时渲染 `flex-{breakpoint}-column`',
    name: 'vertical',
    type: 'boolean | NavBreakpoint',
  },
  {
    component: 'NavItem',
    defaultValue: "'li'",
    description: '渲染的元素标签，默认渲染 `li.nav-item`',
    name: 'as',
    type: 'ElementType',
  },
  {
    component: 'NavLink',
    defaultValue: 'false',
    description: '强制激活状态，未设置时由 Nav 的 activeKey 与 eventKey（或 href）匹配得出',
    name: 'active',
    type: 'boolean',
  },
  {
    component: 'NavLink',
    defaultValue: '-',
    description: '渲染的元素标签，默认设置了 `href` 渲染 `a`，否则渲染 `button`',
    name: 'as',
    type: 'ElementType',
  },
  {
    component: 'NavLink',
    defaultValue: 'false',
    description:
      '禁用状态，渲染 `disabled` 类与 `aria-disabled`；按钮同时设置原生 disabled，链接同时设置 `tabIndex={-1}`',
    name: 'disabled',
    type: 'boolean',
  },
  {
    component: 'NavLink',
    defaultValue: 'href',
    description: '关联 Nav/TabContainer 激活状态的 key，未设置时回退为 href',
    name: 'eventKey',
    type: 'EventKey',
  },
  {
    component: 'NavLink',
    defaultValue: '-',
    description: '链接地址，设置后渲染为 `a` 标签；值为 `"#"` 时点击自动 `preventDefault`',
    name: 'href',
    type: 'string',
  },
  {
    component: 'NavLink',
    defaultValue: '-',
    description: '点击回调，触发后事件继续冒泡到 Nav 或 TabContainer',
    name: 'onSelect',
    type: '(eventKey: EventKey, event: SyntheticEvent) => void',
  },
  {
    component: 'NavLink',
    defaultValue: "'button'",
    description: '渲染为按钮时的 type 属性',
    name: 'type',
    type: "'button' | 'reset' | 'submit'",
  },
  {
    component: 'Tab',
    defaultValue: '-',
    description: '标签触发按钮的文案',
    name: 'title',
    type: 'ReactNode',
  },
  {
    component: 'Tab',
    defaultValue: '-',
    description: '关联 TabContainer 激活状态的 key',
    name: 'eventKey',
    type: 'EventKey',
  },
  {
    component: 'Tab',
    defaultValue: 'false',
    description: '禁用该标签，触发按钮不可交互',
    name: 'disabled',
    type: 'boolean',
  },
  {
    component: 'Tab',
    defaultValue: '-',
    description: '标签触发按钮的自定义类名',
    name: 'tabClassName',
    type: 'string',
  },
  {
    component: 'Tab',
    defaultValue: '-',
    description: '标签条目（nav-item）的自定义类名',
    name: 'className',
    type: 'string',
  },
  {
    component: 'Tab',
    defaultValue: '-',
    description: '面板内容，由 Tabs 自动提取到对应 TabPane 中',
    name: 'children',
    type: 'ReactNode',
  },
  {
    component: 'TabContainer',
    defaultValue: '-',
    description: '受控激活 key，控制 Nav 与 TabPane 的激活状态',
    name: 'activeKey',
    type: 'EventKey',
  },
  {
    component: 'TabContainer',
    defaultValue: '-',
    description: '非受控模式下的初始激活 key',
    name: 'defaultActiveKey',
    type: 'EventKey',
  },
  {
    component: 'TabContainer',
    defaultValue: '-',
    description:
      '无障碍 id 前缀，为 NavLink 生成 `{id}-tab-{eventKey}`、为 TabPane 生成 `{id}-tabpane-{eventKey}` 并互相关联',
    name: 'id',
    type: 'string',
  },
  {
    component: 'TabContainer',
    defaultValue: '-',
    description: '选择回调，在 NavLink 点击且 key 不为 null 时触发',
    name: 'onSelect',
    type: '(eventKey: EventKey, event: SyntheticEvent) => void',
  },
  {
    component: 'TabContainer',
    defaultValue: 'false',
    description: '面板淡入动画的默认值，TabPane 可通过同名属性单独覆盖',
    name: 'transition',
    type: 'boolean',
  },
  {
    component: 'TabContainer',
    defaultValue: "'div'",
    description: '根元素标签',
    name: 'as',
    type: 'ElementType',
  },
  {
    component: 'TabContent',
    defaultValue: "'div'",
    description: '渲染的元素标签，默认渲染 `div.tab-content`',
    name: 'as',
    type: 'ElementType',
  },
  {
    component: 'TabPane',
    defaultValue: 'false',
    description: '独立使用（不在 TabContainer 内）时手动控制激活状态',
    name: 'active',
    type: 'boolean',
  },
  {
    component: 'TabPane',
    defaultValue: "'div'",
    description: '渲染的元素标签，默认渲染 `div.tab-pane`',
    name: 'as',
    type: 'ElementType',
  },
  {
    component: 'TabPane',
    defaultValue: '-',
    description: '与 TabContainer 的 activeKey 匹配后自动渲染 active/show 类',
    name: 'eventKey',
    type: 'EventKey',
  },
  {
    component: 'TabPane',
    defaultValue: '-',
    description: '是否启用淡入动画，覆盖 TabContainer 的 transition 设置',
    name: 'transition',
    type: 'boolean',
  },
  {
    component: 'Tabs',
    defaultValue: '-',
    description: '受控激活 key，控制标签与面板的切换',
    name: 'activeKey',
    type: 'EventKey',
  },
  {
    component: 'Tabs',
    defaultValue: '-',
    description: '非受控模式下的初始激活 key',
    name: 'defaultActiveKey',
    type: 'EventKey',
  },
  {
    component: 'Tabs',
    defaultValue: '-',
    description: '选择回调，在标签切换时触发',
    name: 'onSelect',
    type: '(eventKey: EventKey, event: SyntheticEvent) => void',
  },
  {
    component: 'Tabs',
    defaultValue: '-',
    description: '无障碍 id 前缀，用于关联标签与面板',
    name: 'id',
    type: 'string',
  },
  {
    component: 'Tabs',
    defaultValue: "'tabs'",
    description:
      '标签页样式变体，`tabs`/`pills`/`underline` 分别渲染 `nav-tabs`/`nav-pills`/`nav-underline`',
    name: 'variant',
    type: 'NavVariant',
  },
  {
    component: 'Tabs',
    defaultValue: 'false',
    description: '渲染 `nav-fill` 类，让标签按内容比例填满可用宽度',
    name: 'fill',
    type: 'boolean',
  },
  {
    component: 'Tabs',
    defaultValue: 'false',
    description: '渲染 `nav-justified` 类，让标签等宽填满可用宽度',
    name: 'justify',
    type: 'boolean',
  },
  {
    component: 'Tabs',
    defaultValue: 'false',
    description: '是否启用面板淡入动画',
    name: 'transition',
    type: 'boolean',
  },
  {
    component: 'Tabs',
    defaultValue: '-',
    description: '根容器自定义类名',
    name: 'className',
    type: 'string',
  },
  {
    component: 'Tabs',
    defaultValue: '-',
    description: '导航（nav）自定义类名',
    name: 'navClassName',
    type: 'string',
  },
  {
    component: 'Tabs',
    defaultValue: '-',
    description: '面板容器（tab-content）自定义类名',
    name: 'contentClassName',
    type: 'string',
  },
  {
    component: 'Tabs',
    defaultValue: '-',
    description: '标签页内容，由若干个 Tab 组件组成',
    name: 'children',
    type: 'ReactNode',
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
    description: '透传原生元素属性（如 `onClick`、`style`、`role` 等）',
    name: '...rest',
    type: 'HTMLAttributes',
  },
];

const tabsTypeDefinitions: ApiTypeDefinition[] = [
  {
    code: eventKeyTypeCode,
    description: '标签页激活 key 类型',
    name: 'EventKey',
  },
  {
    code: navBreakpointTypeCode,
    description: '垂直布局断点类型',
    name: 'NavBreakpoint',
  },
  {
    code: navVariantTypeCode,
    description: '导航样式变体类型',
    name: 'NavVariant',
  },
  {
    code: navPropsTypeCode,
    description: '导航容器组件属性接口',
    name: 'NavProps',
  },
  {
    code: navItemPropsTypeCode,
    description: '导航条目组件属性接口',
    name: 'NavItemProps',
  },
  {
    code: navLinkPropsTypeCode,
    description: '导航链接组件属性接口',
    name: 'NavLinkProps',
  },
  {
    code: navContextValueTypeCode,
    description: '导航上下文，供 NavItem 与 NavLink 消费',
    name: 'NavContextValue',
  },
  {
    code: tabContainerPropsTypeCode,
    description: '标签页容器组件属性接口',
    name: 'TabContainerProps',
  },
  {
    code: tabContentPropsTypeCode,
    description: '标签页面板容器组件属性接口',
    name: 'TabContentProps',
  },
  {
    code: tabPanePropsTypeCode,
    description: '标签页面板组件属性接口',
    name: 'TabPaneProps',
  },
  {
    code: tabPropsTypeCode,
    description: '标签页条目组件属性接口',
    name: 'TabProps',
  },
  {
    code: tabsPropsTypeCode,
    description: '标签页组件属性接口',
    name: 'TabsProps',
  },
  {
    code: tabsContextValueTypeCode,
    description: '标签页上下文，供 Nav、NavLink 与 TabPane 消费',
    name: 'TabsContextValue',
  },
];

export const TabsDoc = () => {
  const [activeKey, setActiveKey] = useState('home');

  const demoContent = (
    <>
      <DemoSection code={baseCode} title="基础导航">
        <Nav>
          <NavItem>
            <NavLink active href="#tabs-base-demo">
              激活
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink href="#tabs-base-demo">链接</NavLink>
          </NavItem>
          <NavItem>
            <NavLink href="#tabs-base-demo">另一个链接</NavLink>
          </NavItem>
          <NavItem>
            <NavLink disabled href="#tabs-base-demo">
              禁用
            </NavLink>
          </NavItem>
        </Nav>
        <p className="mb-0 mt-3 text-muted small">
          Nav 渲染 `ul.nav`，NavItem 渲染 `li.nav-item`，NavLink 渲染 `a.nav-link`， 与 Bootstrap
          的导航结构一一对应
        </p>
      </DemoSection>

      <DemoSection code={variantsCode} title="样式变体">
        <Nav className="mb-3" variant="tabs">
          <NavItem>
            <NavLink active href="#tabs-variant-demo">
              激活
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink href="#tabs-variant-demo">链接</NavLink>
          </NavItem>
          <NavItem>
            <NavLink href="#tabs-variant-demo">另一个链接</NavLink>
          </NavItem>
        </Nav>
        <Nav className="mb-3" variant="pills">
          <NavItem>
            <NavLink active href="#tabs-variant-demo">
              激活
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink href="#tabs-variant-demo">链接</NavLink>
          </NavItem>
          <NavItem>
            <NavLink href="#tabs-variant-demo">另一个链接</NavLink>
          </NavItem>
        </Nav>
        <Nav className="mb-0" variant="underline">
          <NavItem>
            <NavLink active href="#tabs-variant-demo">
              激活
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink href="#tabs-variant-demo">链接</NavLink>
          </NavItem>
          <NavItem>
            <NavLink href="#tabs-variant-demo">另一个链接</NavLink>
          </NavItem>
        </Nav>
        <p className="mb-0 mt-3 text-muted small">
          variant 分别渲染 `nav-tabs`、`nav-pills` 与 `nav-underline` 类，并自动为容器设置
          `role="tablist"`
        </p>
      </DemoSection>

      <DemoSection code={statesCode} title="激活与禁用">
        <Nav className="mb-3" variant="tabs">
          <NavItem>
            <NavLink active href="#tabs-states-demo">
              激活
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink href="#tabs-states-demo">链接</NavLink>
          </NavItem>
          <NavItem>
            <NavLink disabled href="#tabs-states-demo">
              禁用链接
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink disabled>禁用按钮</NavLink>
          </NavItem>
        </Nav>
        <Nav className="mb-0" defaultActiveKey="home" variant="pills">
          <NavItem>
            <NavLink eventKey="home">首页</NavLink>
          </NavItem>
          <NavItem>
            <NavLink eventKey="profile">个人资料</NavLink>
          </NavItem>
          <NavItem>
            <NavLink disabled eventKey="settings">
              设置
            </NavLink>
          </NavItem>
        </Nav>
        <p className="mb-0 mt-3 text-muted small">
          激活链接渲染 `active` 类并设置 `aria-current="page"`；禁用链接同时设置 `aria-disabled` 与
          `tabIndex={-1}`，禁用按钮使用原生 disabled 属性。设置了 defaultActiveKey 的 Nav
          会根据点击自动维护激活状态
        </p>
      </DemoSection>

      <DemoSection code={fillJustifyCode} title="填充与两端对齐">
        <Nav className="mb-3" fill variant="pills">
          <NavItem>
            <NavLink active href="#tabs-fill-demo">
              内容多一点的链接
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink href="#tabs-fill-demo">短链接</NavLink>
          </NavItem>
          <NavItem>
            <NavLink href="#tabs-fill-demo">另一个链接</NavLink>
          </NavItem>
          <NavItem>
            <NavLink disabled href="#tabs-fill-demo">
              禁用链接
            </NavLink>
          </NavItem>
        </Nav>
        <Nav className="mb-0" justify variant="pills">
          <NavItem>
            <NavLink active href="#tabs-fill-demo">
              内容多一点的链接
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink href="#tabs-fill-demo">短链接</NavLink>
          </NavItem>
          <NavItem>
            <NavLink href="#tabs-fill-demo">另一个链接</NavLink>
          </NavItem>
          <NavItem>
            <NavLink disabled href="#tabs-fill-demo">
              禁用链接
            </NavLink>
          </NavItem>
        </Nav>
        <p className="mb-0 mt-3 text-muted small">
          fill 按内容比例分配宽度，justify 让所有条目等宽，分别对应 `nav-fill` 与 `nav-justified` 类
        </p>
      </DemoSection>

      <DemoSection code={flexCode} title="Flex 布局">
        <Nav className="justify-content-center mb-3" variant="pills">
          <NavItem>
            <NavLink active href="#tabs-flex-demo">
              激活
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink href="#tabs-flex-demo">链接</NavLink>
          </NavItem>
          <NavItem>
            <NavLink href="#tabs-flex-demo">另一个链接</NavLink>
          </NavItem>
        </Nav>
        <Nav className="justify-content-end mb-3" variant="pills">
          <NavItem>
            <NavLink active href="#tabs-flex-demo">
              激活
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink href="#tabs-flex-demo">链接</NavLink>
          </NavItem>
          <NavItem>
            <NavLink href="#tabs-flex-demo">另一个链接</NavLink>
          </NavItem>
        </Nav>
        <Nav className="mb-3" variant="pills" vertical>
          <NavItem>
            <NavLink active href="#tabs-flex-demo">
              激活
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink href="#tabs-flex-demo">链接</NavLink>
          </NavItem>
          <NavItem>
            <NavLink href="#tabs-flex-demo">另一个链接</NavLink>
          </NavItem>
        </Nav>
        <Nav className="mb-0" variant="pills" vertical="sm">
          <NavItem>
            <NavLink active href="#tabs-flex-demo">
              激活
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink href="#tabs-flex-demo">链接</NavLink>
          </NavItem>
          <NavItem>
            <NavLink href="#tabs-flex-demo">另一个链接</NavLink>
          </NavItem>
        </Nav>
        <p className="mb-0 mt-3 text-muted small">
          className 可直接传入任意 `justify-content-*` 类；vertical 渲染 `flex-column`，
          传入断点时渲染响应式的 `flex-断点-column` 类（如 flex-sm-column）
        </p>
      </DemoSection>

      <DemoSection code={buttonsCode} title="链接与按钮">
        <Nav className="mb-3" variant="pills">
          <NavItem>
            <NavLink active>按钮激活</NavLink>
          </NavItem>
          <NavItem>
            <NavLink>普通按钮</NavLink>
          </NavItem>
          <NavItem>
            <NavLink disabled>禁用按钮</NavLink>
          </NavItem>
        </Nav>
        <Nav as="div" className="mb-0" variant="tabs">
          <NavItem as="div">
            <NavLink active as="span" href="#tabs-buttons-demo">
              自定义标签
            </NavLink>
          </NavItem>
          <NavItem as="div">
            <NavLink as="span" href="#tabs-buttons-demo">
              另一个自定义标签
            </NavLink>
          </NavItem>
        </Nav>
        <p className="mb-0 mt-3 text-muted small">
          未设置 href 时 NavLink 自动渲染为 `button`；通过 as 属性可将任意一层替换为自定义标签，
          便于接入路由组件
        </p>
      </DemoSection>

      <DemoSection code={tabsCode} title="Tabs 标签页">
        <Tabs className="mb-3" defaultActiveKey="home" id="tabs-demo">
          <Tab eventKey="home" title="首页">
            首页内容：这是通过 Tabs 与 Tab 声明的第一个面板。
          </Tab>
          <Tab eventKey="profile" title="个人资料">
            个人资料内容：点击上方标签切换面板，无需 Bootstrap JS。
          </Tab>
          <Tab disabled eventKey="contact" title="禁用标签">
            禁用标签无法被选中，也不会渲染可交互的触发按钮。
          </Tab>
        </Tabs>
        <Tabs defaultActiveKey="first" id="tabs-pills-demo" transition variant="pills">
          <Tab eventKey="first" title="第一个">
            胶囊样式的标签页，切换时带有淡入动画。
          </Tab>
          <Tab eventKey="second" title="第二个">
            通过 variant 与 transition 属性分别控制样式与动画。
          </Tab>
        </Tabs>
        <p className="mb-0 text-muted small">
          Tabs 将每个 Tab 的 title 渲染为标签按钮、children 渲染为面板内容；设置 id 后自动生成 `
          {'{id}-tab-{key}'}` 与 `{'{id}-tabpane-{key}'}` 关联 id
        </p>
      </DemoSection>

      <DemoSection code={controlledCode} title="受控标签页">
        <Tabs
          activeKey={activeKey}
          id="tabs-controlled-demo"
          onSelect={(key) => {
            if (key != null) {
              setActiveKey(String(key));
            }
          }}
        >
          <Tab eventKey="home" title="首页">
            首页内容：当前激活的 key 由外部 state 控制。
          </Tab>
          <Tab eventKey="profile" title="个人资料">
            个人资料内容：切换标签会触发 onSelect 回调。
          </Tab>
          <Tab eventKey="messages" title="消息">
            消息内容：activeKey 与 onSelect 配合即可实现受控标签页。
          </Tab>
        </Tabs>
        <p className="mb-0 mt-3 text-muted small">
          当前激活的 key：{activeKey}。传入 activeKey 后 Tabs 变为受控组件， 切换状态完全由 onSelect
          驱动的外部 state 决定
        </p>
      </DemoSection>

      <DemoSection code={tabContainerCode} title="TabContainer 自由组合">
        <TabContainer defaultActiveKey="first" id="tab-container-demo" transition>
          <Nav variant="pills">
            <NavItem>
              <NavLink eventKey="first">第一个</NavLink>
            </NavItem>
            <NavItem>
              <NavLink eventKey="second">第二个</NavLink>
            </NavItem>
            <NavItem>
              <NavLink disabled eventKey="third">
                禁用
              </NavLink>
            </NavItem>
          </Nav>
          <TabContent>
            <TabPane eventKey="first">第一个面板的内容。</TabPane>
            <TabPane eventKey="second">第二个面板的内容。</TabPane>
            <TabPane eventKey="third">禁用面板的内容，永远不会显示。</TabPane>
          </TabContent>
        </TabContainer>
        <p className="mb-0 mt-3 text-muted small">
          TabContainer 通过上下文把 Nav 中的 NavLink 与 TabContent 中的 TabPane 按 eventKey
          关联起来，导航与面板可以自由布局；transition 为面板启用淡入动画
        </p>
      </DemoSection>

      <DemoSection code={routerCode} title="路由集成">
        <Nav variant="pills">
          <NavItem>
            <Link aria-current="page" className="nav-link active" to="/components/tabs">
              当前页面
            </Link>
          </NavItem>
          <NavItem>
            <Link className="nav-link" to="/components/breadcrumb">
              Breadcrumb
            </Link>
          </NavItem>
          <NavItem>
            <Link className="nav-link" to="/components/pagination">
              Pagination
            </Link>
          </NavItem>
        </Nav>
        <p className="mb-0 mt-3 text-muted small">
          使用 react-router 等路由库时，可直接将路由 Link 作为条目内容， 配合 `nav-link`
          类即可实现客户端路由跳转
        </p>
      </DemoSection>
    </>
  );

  return (
    <DocTemplate
      componentDescription="基于 Bootstrap 5 的导航与标签页组件，Nav 系列（Nav、NavItem、NavLink）用于构建基础导航，Tabs 系列（Tabs、Tab、TabContainer、TabContent、TabPane）用于构建带内容面板的标签页，支持三种样式变体、填充与两端对齐、垂直布局、激活/禁用状态与淡入动画"
      componentName="Tabs"
      componentTags={['基础', '导航']}
      demoContent={demoContent}
      props={tabsProps}
      typeDefinitions={tabsTypeDefinitions}
    />
  );
};

export default TabsDoc;
