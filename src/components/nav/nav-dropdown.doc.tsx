import { useState } from 'react';

import { Button } from '../button';
import { type ApiProp, type ApiTypeDefinition, DemoSection, DocTemplate } from '../doc-template';
import { DropdownItem } from '../dropdown';
import dropdownActiveCode from './demos/dropdown-active.md?raw';
import dropdownBasicCode from './demos/dropdown-basic.md?raw';
import dropdownControlledCode from './demos/dropdown-controlled.md?raw';
import dropdownDarkCode from './demos/dropdown-dark.md?raw';
import dropdownDirectionsCode from './demos/dropdown-directions.md?raw';
import dropdownDisabledCode from './demos/dropdown-disabled.md?raw';
import { Nav, NavDropdown, NavItem, NavLink } from './index';
import eventKeyTypeCode from './types/event-key.md?raw';
import navDropdownPropsTypeCode from './types/nav-dropdown-props.md?raw';

const navDropdownProps: ApiProp[] = [
  {
    defaultValue: '-',
    description: '触发按钮文案，渲染在 `a.nav-link.dropdown-toggle` 内（必填）',
    name: 'title',
    type: 'ReactNode',
  },
  {
    defaultValue: '-',
    description: '菜单内容，通常由多个 DropdownItem 组成',
    name: 'children',
    type: 'ReactNode',
  },
  {
    defaultValue: '-',
    description: '关联 Nav 激活状态的 key，与 Nav 的 activeKey 匹配后 NavDropdown 显示 active',
    name: 'eventKey',
    type: 'EventKey',
  },
  {
    defaultValue: '-',
    description: '触发按钮 id，同时作为菜单的 `aria-labelledby` 关联',
    name: 'id',
    type: 'string',
  },
  {
    defaultValue: 'false',
    description: '禁用触发按钮，点击不再展开菜单，同时渲染 `disabled` 类与 `aria-disabled`',
    name: 'disabled',
    type: 'boolean',
  },
  {
    defaultValue: '-',
    description: '菜单变体，`"dark"` 渲染 `dropdown-menu-dark` 深色菜单类',
    name: 'menuVariant',
    type: 'DropdownMenuVariant',
  },
  {
    defaultValue: '-',
    description:
      '菜单对齐，`"start"`/`"end"` 渲染 `dropdown-menu-start`/`dropdown-menu-end` 类；对象形式按断点生成响应式的 `dropdown-menu-{断点}-{对齐}` 类',
    name: 'align',
    type: 'DropdownAlignOption',
  },
  {
    defaultValue: "'down'",
    description: '展开方向，`"up"`/`"end"`/`"start"` 分别渲染 `dropup`、`dropend`、`dropstart` 类',
    name: 'drop',
    type: 'DropdownDirection',
  },
  {
    defaultValue: 'true',
    description:
      '自动关闭策略：`true` 选择菜单项或点击外部都关闭；`"inside"` 仅选择菜单项时关闭；`"outside"` 仅点击外部时关闭；`false` 永不自动关闭',
    name: 'autoClose',
    type: 'DropdownAutoClose',
  },
  {
    defaultValue: 'true',
    description: '是否允许菜单靠近视口边缘时翻转到相反方向',
    name: 'flip',
    type: 'boolean',
  },
  {
    defaultValue: 'false',
    description: '展开时是否聚焦第一个菜单项，`"keyboard"` 表示仅通过键盘展开时聚焦',
    name: 'focusFirstItemOnShow',
    type: "'keyboard' | boolean",
  },
  {
    defaultValue: '-',
    description: '受控的展开状态，需配合 onToggle 更新',
    name: 'show',
    type: 'boolean',
  },
  {
    defaultValue: 'false',
    description: '非受控模式下的初始展开状态',
    name: 'defaultShow',
    type: 'boolean',
  },
  {
    defaultValue: '-',
    description: '选择回调，点击 DropdownItem 且事件未被阻止时触发',
    name: 'onSelect',
    type: 'SelectCallback',
  },
  {
    defaultValue: '-',
    description: '展开状态变化回调，配合 `show` 实现受控模式',
    name: 'onToggle',
    type: 'ToggleCallback',
  },
  {
    defaultValue: '-',
    description: '自定义定位配置，可分别覆盖 `flip`（是否允许翻转）、`offset` 与 `padding`',
    name: 'popperConfig',
    type: 'DropdownPositionConfig',
  },
  {
    defaultValue: 'false',
    description: '是否在首次渲染时就挂载菜单，默认首次展开时才挂载',
    name: 'renderMenuOnMount',
    type: 'boolean',
  },
  {
    defaultValue: '-',
    description: '自定义类名',
    name: 'className',
    type: 'string',
  },
];

const navDropdownTypeDefinitions: ApiTypeDefinition[] = [
  {
    code: eventKeyTypeCode,
    description: '导航激活 key 类型',
    name: 'EventKey',
  },
  {
    code: navDropdownPropsTypeCode,
    description: '下拉导航组件属性接口',
    name: 'NavDropdownProps',
  },
];

export const NavDropdownDoc = () => {
  const [activeKey, setActiveKey] = useState('home');
  const [show, setShow] = useState(false);

  const demoContent = (
    <>
      <DemoSection code={dropdownBasicCode} title="基础用法">
        <Nav className="gap-1" defaultActiveKey="home" variant="pills">
          <NavItem>
            <NavLink eventKey="home">首页</NavLink>
          </NavItem>
          <NavDropdown eventKey="profile" id="nav-dropdown-basic-demo" title="个人资料">
            <DropdownItem className="my-1" eventKey="profile">编辑资料</DropdownItem>
            <DropdownItem className="my-1" eventKey="settings">账号设置</DropdownItem>
            <DropdownItem className="my-1" eventKey="logout">退出登录</DropdownItem>
          </NavDropdown>
        </Nav>
        <p className="mb-0 mt-3 text-muted small">
          NavDropdown 的 eventKey 与 Nav 的激活状态联动：选择 DropdownItem 后其 eventKey 会同步到
          Nav，NavDropdown 因此显示 active 状态
        </p>
      </DemoSection>

      <DemoSection code={dropdownDirectionsCode} title="展开方向">
        <Nav className="gap-1 mb-0" variant="pills">
          <NavDropdown drop="up" id="nav-dropdown-up-demo" title="向上展开">
            <DropdownItem className="my-1" eventKey="up-1">操作一</DropdownItem>
            <DropdownItem className="my-1" eventKey="up-2">操作二</DropdownItem>
          </NavDropdown>
          <NavDropdown drop="end" id="nav-dropdown-end-demo" title="向右展开">
            <DropdownItem className="my-1" eventKey="end-1">操作一</DropdownItem>
            <DropdownItem className="my-1" eventKey="end-2">操作二</DropdownItem>
          </NavDropdown>
          <NavDropdown drop="start" id="nav-dropdown-start-demo" title="向左展开">
            <DropdownItem className="my-1" eventKey="start-1">操作一</DropdownItem>
            <DropdownItem className="my-1" eventKey="start-2">操作二</DropdownItem>
          </NavDropdown>
        </Nav>
        <p className="mb-0 mt-3 text-muted small">
          drop 分别渲染 `dropup`、`dropend`、`dropstart` 类，控制菜单的展开方向
        </p>
      </DemoSection>

      <DemoSection code={dropdownDarkCode} title="深色菜单">
        <Nav className="gap-1 mb-0" variant="pills">
          <NavItem>
            <NavLink active>首页</NavLink>
          </NavItem>
          <NavDropdown id="nav-dropdown-dark-demo" menuVariant="dark" title="深色菜单">
            <DropdownItem active className="my-1" eventKey="dark-1">
              激活项
            </DropdownItem>
            <DropdownItem className="my-1" eventKey="dark-2">操作</DropdownItem>
            <DropdownItem className="my-1" eventKey="dark-3">另一个操作</DropdownItem>
          </NavDropdown>
        </Nav>
        <p className="mb-0 mt-3 text-muted small">
          menuVariant=&quot;dark&quot; 渲染 `dropdown-menu-dark` 深色菜单类
        </p>
      </DemoSection>

      <DemoSection code={dropdownDisabledCode} title="禁用">
        <Nav className="gap-1 mb-0" variant="pills">
          <NavItem>
            <NavLink active>首页</NavLink>
          </NavItem>
          <NavDropdown disabled id="nav-dropdown-disabled-demo" title="禁用下拉">
            <DropdownItem className="my-1" eventKey="disabled-1">操作一</DropdownItem>
            <DropdownItem className="my-1" eventKey="disabled-2">操作二</DropdownItem>
          </NavDropdown>
        </Nav>
        <p className="mb-0 mt-3 text-muted small">
          disabled 禁用触发按钮，点击不再展开菜单，同时渲染 `disabled` 类与 `aria-disabled`
        </p>
      </DemoSection>

      <DemoSection code={dropdownControlledCode} title="受控展开">
        <div className="d-flex align-items-center gap-3">
          <Nav className="gap-1 mb-0" variant="pills">
            <NavDropdown
              id="nav-dropdown-controlled-demo"
              onToggle={(nextShow) => setShow(nextShow)}
              show={show}
              title="受控下拉"
            >
              <DropdownItem className="my-1" eventKey="controlled-1">操作一</DropdownItem>
              <DropdownItem className="my-1" eventKey="controlled-2">操作二</DropdownItem>
            </NavDropdown>
          </Nav>
          <Button onClick={() => setShow((prev) => !prev)} variant="outline-secondary">
            外部切换
          </Button>
        </div>
        <p className="mb-0 mt-3 text-muted small">
          当前展开状态：{String(show)}。传入 show 后 NavDropdown 变为受控组件，展开状态完全由
          onToggle 驱动的外部 state 决定
        </p>
      </DemoSection>

      <DemoSection code={dropdownActiveCode} title="激活联动">
        <Nav
          activeKey={activeKey}
          className="gap-1"
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
          <NavDropdown eventKey="profile" id="nav-dropdown-active-demo" title="个人资料">
            <DropdownItem className="my-1" eventKey="profile">编辑资料</DropdownItem>
            <DropdownItem className="my-1" eventKey="settings">账号设置</DropdownItem>
          </NavDropdown>
          <NavItem>
            <NavLink eventKey="messages">消息</NavLink>
          </NavItem>
        </Nav>
        <p className="mb-0 mt-3 text-muted small">
          当前激活的 key：{activeKey}。当 activeKey 与 NavDropdown 的 eventKey（或最近选择的
          DropdownItem eventKey）匹配时，NavDropdown 自动渲染 active 状态
        </p>
      </DemoSection>
    </>
  );

  return (
    <DocTemplate
      componentDescription="基于 Bootstrap 5 的下拉导航组件，NavDropdown 将下拉菜单嵌入 Nav 中，渲染为 `li.nav-item.dropdown`，支持深色菜单、菜单对齐、多个展开方向、禁用状态、受控展开与激活状态同步，可与 Nav 的 activeKey/eventKey 联动"
      componentName="NavDropdown"
      componentTags={['基础', '导航']}
      demoContent={demoContent}
      props={navDropdownProps}
      typeDefinitions={navDropdownTypeDefinitions}
    />
  );
};

export default NavDropdownDoc;
