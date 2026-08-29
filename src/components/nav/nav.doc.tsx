import { Bell, FileText, Folder, House, Settings, User } from 'lucide-react';
import { useState } from 'react';

import { type ApiProp, type ApiTypeDefinition, DemoSection, DocTemplate } from '../doc-template';
import { DropdownItem } from '../dropdown';
import alignmentCode from './demos/alignment.md?raw';
import basicCode from './demos/basic.md?raw';
import controlledCode from './demos/controlled.md?raw';
import dropdownCode from './demos/dropdown.md?raw';
import linksCode from './demos/links.md?raw';
import statesCode from './demos/states.md?raw';
import variantsCode from './demos/variants.md?raw';
import verticalCode from './demos/vertical.md?raw';
import { Nav, NavDropdown, NavItem, NavLink } from './index';
import eventKeyTypeCode from './types/event-key.md?raw';
import navBreakpointTypeCode from './types/nav-breakpoint.md?raw';
import navContextValueTypeCode from './types/nav-context-value.md?raw';
import navItemPropsTypeCode from './types/nav-item-props.md?raw';
import navLinkPropsTypeCode from './types/nav-link-props.md?raw';
import navPropsTypeCode from './types/nav-props.md?raw';
import navVariantTypeCode from './types/nav-variant.md?raw';

const navProps: ApiProp[] = [
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
    component: 'Nav',
    defaultValue: '-',
    description: '无障碍角色，设置 variant 时默认自动设置为 `tablist`',
    name: 'role',
    type: 'string',
  },
  {
    component: 'Nav',
    defaultValue: '-',
    description: '自定义类名',
    name: 'className',
    type: 'string',
  },
  {
    component: 'NavItem',
    defaultValue: "'li'",
    description: '渲染的元素标签，默认渲染 `li.nav-item`',
    name: 'as',
    type: 'ElementType',
  },
  {
    component: 'NavItem',
    defaultValue: '-',
    description: '自定义类名',
    name: 'className',
    type: 'string',
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
    description: '关联 Nav 激活状态的 key，未设置时回退为 href',
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
    description: '点击回调，触发后事件继续冒泡到 Nav',
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
];

const navTypeDefinitions: ApiTypeDefinition[] = [
  {
    code: eventKeyTypeCode,
    description: '导航激活 key 类型',
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
];

export const NavDoc = () => {
  const [activeKey, setActiveKey] = useState('home');

  const demoContent = (
    <>
      <DemoSection code={basicCode} title="基础用法">
        <Nav>
          <NavItem>
            <NavLink active href="#nav-basic-demo">
              激活
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink href="#nav-basic-demo">链接</NavLink>
          </NavItem>
          <NavItem>
            <NavLink href="#nav-basic-demo">另一个链接</NavLink>
          </NavItem>
          <NavItem>
            <NavLink disabled href="#nav-basic-demo">
              禁用
            </NavLink>
          </NavItem>
        </Nav>
        <p className="mb-0 mt-3 text-muted small">
          Nav 渲染 `ul.nav`，NavItem 渲染 `li.nav-item`，NavLink 渲染 `a.nav-link`， 与 Bootstrap
          的导航结构一一对应；Nav 位于 Navbar 内时会自动追加 `navbar-nav` 类
        </p>
      </DemoSection>

      <DemoSection code={variantsCode} title="样式变体">
        <Nav className="mb-3" variant="tabs">
          <NavItem>
            <NavLink active href="#nav-variants-demo">
              激活
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink href="#nav-variants-demo">链接</NavLink>
          </NavItem>
          <NavItem>
            <NavLink href="#nav-variants-demo">另一个链接</NavLink>
          </NavItem>
        </Nav>
        <Nav className="mb-3" variant="pills">
          <NavItem>
            <NavLink active href="#nav-variants-demo">
              激活
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink href="#nav-variants-demo">链接</NavLink>
          </NavItem>
          <NavItem>
            <NavLink href="#nav-variants-demo">另一个链接</NavLink>
          </NavItem>
        </Nav>
        <Nav className="mb-0" variant="underline">
          <NavItem>
            <NavLink active href="#nav-variants-demo">
              激活
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink href="#nav-variants-demo">链接</NavLink>
          </NavItem>
          <NavItem>
            <NavLink href="#nav-variants-demo">另一个链接</NavLink>
          </NavItem>
        </Nav>
        <p className="mb-0 mt-3 text-muted small">
          variant 分别渲染 `nav-tabs`、`nav-pills` 与 `nav-underline` 类，并自动为容器设置
          `role="tablist"`
        </p>
      </DemoSection>

      <DemoSection code={alignmentCode} title="填充与两端对齐">
        <Nav className="mb-3" fill variant="pills">
          <NavItem>
            <NavLink active href="#nav-alignment-demo">
              内容多一点的链接
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink href="#nav-alignment-demo">短链接</NavLink>
          </NavItem>
          <NavItem>
            <NavLink href="#nav-alignment-demo">另一个链接</NavLink>
          </NavItem>
          <NavItem>
            <NavLink disabled href="#nav-alignment-demo">
              禁用链接
            </NavLink>
          </NavItem>
        </Nav>
        <Nav className="mb-0" justify variant="pills">
          <NavItem>
            <NavLink active href="#nav-alignment-demo">
              内容多一点的链接
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink href="#nav-alignment-demo">短链接</NavLink>
          </NavItem>
          <NavItem>
            <NavLink href="#nav-alignment-demo">另一个链接</NavLink>
          </NavItem>
          <NavItem>
            <NavLink disabled href="#nav-alignment-demo">
              禁用链接
            </NavLink>
          </NavItem>
        </Nav>
        <p className="mb-0 mt-3 text-muted small">
          fill 按内容比例分配宽度，justify 让所有条目等宽，分别对应 `nav-fill` 与 `nav-justified` 类
        </p>
      </DemoSection>

      <DemoSection code={verticalCode} title="垂直导航">
        <Nav className="mb-3" vertical>
          <NavItem>
            <NavLink active href="#nav-vertical-demo">
              <House size={16} /> 首页
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink href="#nav-vertical-demo">
              <User size={16} /> 个人资料
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink href="#nav-vertical-demo">
              <Bell size={16} /> 通知
            </NavLink>
          </NavItem>
        </Nav>
        <Nav className="mb-0" variant="pills" vertical="lg">
          <NavItem>
            <NavLink active href="#nav-vertical-demo">
              <Folder size={16} /> 文件
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink href="#nav-vertical-demo">
              <FileText size={16} /> 文档
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink href="#nav-vertical-demo">
              <Settings size={16} /> 设置
            </NavLink>
          </NavItem>
        </Nav>
        <p className="mb-0 mt-3 text-muted small">
          vertical 渲染 `flex-column`，传入断点时渲染响应式的 `flex-{'{breakpoint}'}-column` 类（如
          flex-lg-column）
        </p>
      </DemoSection>

      <DemoSection code={linksCode} title="链接型导航">
        <Nav className="mb-3">
          <NavItem>
            <NavLink href="#nav-links-demo">链接型</NavLink>
          </NavItem>
          <NavItem>
            <NavLink href="#nav-links-demo">另一个链接</NavLink>
          </NavItem>
          <NavItem>
            <NavLink disabled href="#nav-links-demo">
              禁用链接
            </NavLink>
          </NavItem>
        </Nav>
        <Nav className="mb-0">
          <NavItem>
            <NavLink>按钮型</NavLink>
          </NavItem>
          <NavItem>
            <NavLink>另一个按钮</NavLink>
          </NavItem>
          <NavItem>
            <NavLink disabled>禁用按钮</NavLink>
          </NavItem>
        </Nav>
        <p className="mb-0 mt-3 text-muted small">
          设置了 href 的 NavLink 渲染为 `a` 元素；未设置时渲染为 `button`，两者都携带 `nav-link` 类
        </p>
      </DemoSection>

      <DemoSection code={statesCode} title="激活与禁用">
        <Nav className="mb-3" variant="tabs">
          <NavItem>
            <NavLink active href="#nav-states-demo">
              激活
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink href="#nav-states-demo">链接</NavLink>
          </NavItem>
          <NavItem>
            <NavLink disabled href="#nav-states-demo">
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

      <DemoSection code={controlledCode} title="受控导航">
        <Nav
          activeKey={activeKey}
          onSelect={(key) => {
            if (key != null) {
              setActiveKey(String(key));
            }
          }}
          variant="pills"
        >
          <NavItem>
            <NavLink eventKey="home">首页</NavLink>
          </NavItem>
          <NavItem>
            <NavLink eventKey="profile">个人资料</NavLink>
          </NavItem>
          <NavItem>
            <NavLink eventKey="messages">消息</NavLink>
          </NavItem>
        </Nav>
        <p className="mb-0 mt-3 text-muted small">
          当前激活的 key：{activeKey}。传入 activeKey 后 Nav 变为受控组件，切换状态完全由 onSelect
          驱动的外部 state 决定
        </p>
      </DemoSection>

      <DemoSection code={dropdownCode} title="嵌入下拉菜单">
        <Nav className="gap-1" variant="pills">
          <NavItem>
            <NavLink active>首页</NavLink>
          </NavItem>
          <NavItem>
            <NavLink>链接</NavLink>
          </NavItem>
          <NavDropdown id="nav-dropdown-demo" title="下拉菜单">
            <DropdownItem className="my-1" eventKey="action-1">
              操作一
            </DropdownItem>
            <DropdownItem className="my-1" eventKey="action-2">
              操作二
            </DropdownItem>
            <DropdownItem className="my-1" eventKey="action-3">
              操作三
            </DropdownItem>
          </NavDropdown>
        </Nav>
        <p className="mb-0 mt-3 text-muted small">
          NavDropdown 渲染为 `li.nav-item.dropdown`，触发按钮为 `a.nav-link.dropdown-toggle`，
          菜单内容由 DropdownItem 组成，可与 Nav 无缝组合
        </p>
      </DemoSection>
    </>
  );

  return (
    <DocTemplate
      componentDescription="基于 Bootstrap 5 的导航组件，Nav 系列（Nav、NavItem、NavLink）用于构建基础导航，支持 tabs/pills/underline 三种样式变体、填充与两端对齐、垂直布局、激活/禁用状态、受控/非受控激活 key 与自定义元素渲染，并可嵌入 NavDropdown 下拉菜单"
      componentName="Nav"
      componentTags={['基础', '导航']}
      demoContent={demoContent}
      props={navProps}
      typeDefinitions={navTypeDefinitions}
    />
  );
};

export default NavDoc;
