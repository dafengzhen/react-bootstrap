import {
  FileText,
  House,
  Lock,
  MessageSquare,
  PanelLeft,
  Settings,
  Trash2,
  User,
} from 'lucide-react';
import { useState } from 'react';

import { type ApiProp, type ApiTypeDefinition, DemoSection, DocTemplate } from '../doc-template';
import { IconButton } from '../icon-button';
import basicCode from './demos/basic.md?raw';
import collapsedCode from './demos/collapsed.md?raw';
import customCode from './demos/custom.md?raw';
import darkCode from './demos/dark.md?raw';
import disabledCode from './demos/disabled.md?raw';
import groupCode from './demos/group.md?raw';
import horizontalCode from './demos/horizontal.md?raw';
import inlineCode from './demos/inline.md?raw';
import multipleCode from './demos/multiple.md?raw';
import selectableCode from './demos/selectable.md?raw';
import verticalCode from './demos/vertical.md?raw';
import { Menu, MenuDivider, MenuGroup, MenuItem, MenuSubMenu } from './index';
import eventKeyTypeCode from './types/event-key.md?raw';
import menuContextValueTypeCode from './types/menu-context-value.md?raw';
import menuDividerPropsTypeCode from './types/menu-divider-props.md?raw';
import menuGroupPropsTypeCode from './types/menu-group-props.md?raw';
import menuItemPropsTypeCode from './types/menu-item-props.md?raw';
import menuModeTypeCode from './types/menu-mode.md?raw';
import menuPropsTypeCode from './types/menu-props.md?raw';
import menuSubMenuPropsTypeCode from './types/menu-sub-menu-props.md?raw';
import menuThemeTypeCode from './types/menu-theme.md?raw';
import menuTriggerTypeCode from './types/menu-trigger.md?raw';

const menuProps: ApiProp[] = [
  {
    component: 'Menu',
    defaultValue: "'ul'",
    description: '根元素标签，默认渲染 `ul` 并设置 `role="menu"`',
    name: 'as',
    type: 'ElementType',
  },
  {
    component: 'Menu',
    defaultValue: "'vertical'",
    description:
      '菜单模式：`vertical` 子菜单在右侧弹出，`inline` 子菜单内嵌展开，`horizontal` 根条目水平排列且子菜单向下弹出',
    name: 'mode',
    type: 'MenuMode',
  },
  {
    component: 'Menu',
    defaultValue: "'light'",
    description: '主题，`"dark"` 渲染深色配色，弹出层同时应用深色背景',
    name: 'theme',
    type: 'MenuTheme',
  },
  {
    component: 'Menu',
    defaultValue: '-',
    description:
      '弹出式子菜单的触发方式，默认 horizontal 为 `hover`、vertical/inline 为 `click`；折叠模式下固定为 hover',
    name: 'trigger',
    type: 'MenuTrigger',
  },
  {
    component: 'Menu',
    defaultValue: 'false',
    description:
      '折叠模式：仅显示图标，悬停子菜单时在右侧弹出飞入层；根菜单宽度收缩为 collapsedWidth',
    name: 'inlineCollapsed',
    type: 'boolean',
  },
  {
    component: 'Menu',
    defaultValue: '56',
    description: '折叠模式下根菜单的宽度（px），默认 56 保证图标左右留白与展开状态对称',
    name: 'collapsedWidth',
    type: 'number',
  },
  {
    component: 'Menu',
    defaultValue: '24',
    description: '内嵌子菜单每一级的缩进距离（px）',
    name: 'inlineIndent',
    type: 'number',
  },
  {
    component: 'Menu',
    defaultValue: 'true',
    description: '是否可选中，为 `false` 时条目不渲染选中样式且不触发选中回调',
    name: 'selectable',
    type: 'boolean',
  },
  {
    component: 'Menu',
    defaultValue: 'false',
    description: '多选模式，点击已选中的条目会取消选中，activeKey 使用数组形式',
    name: 'multiple',
    type: 'boolean',
  },
  {
    component: 'Menu',
    defaultValue: '-',
    description: '受控选中 key（multiple 时为数组），与 MenuItem 的 eventKey 匹配',
    name: 'activeKey',
    type: 'EventKey | EventKey[]',
  },
  {
    component: 'Menu',
    defaultValue: '-',
    description: '非受控模式下的初始选中 key（multiple 时为数组），设置后点击条目自动维护选中状态',
    name: 'defaultActiveKey',
    type: 'EventKey | EventKey[]',
  },
  {
    component: 'Menu',
    defaultValue: '[]',
    description: '受控展开的子菜单 key 列表，与 MenuSubMenu 的 eventKey 匹配',
    name: 'openKeys',
    type: 'EventKey[]',
  },
  {
    component: 'Menu',
    defaultValue: '[]',
    description: '非受控模式下的初始展开子菜单 key 列表，设置后点击标题自动维护展开状态',
    name: 'defaultOpenKeys',
    type: 'EventKey[]',
  },
  {
    component: 'Menu',
    defaultValue: '-',
    description: '选中回调，点击 MenuItem 且事件未被阻止时触发',
    name: 'onSelect',
    type: '(eventKey: EventKey, event: SyntheticEvent) => void',
  },
  {
    component: 'Menu',
    defaultValue: '-',
    description: '展开状态变化回调，在内嵌子菜单切换展开时触发',
    name: 'onOpenChange',
    type: '(openKeys: EventKey[]) => void',
  },
  {
    component: 'Menu',
    defaultValue: '-',
    description: '自定义类名',
    name: 'className',
    type: 'string',
  },
  {
    component: 'MenuItem',
    defaultValue: '-',
    description: '条目 key，用于选中与展开状态匹配；未设置时按渲染位置自动生成',
    name: 'eventKey',
    type: 'EventKey',
  },
  {
    component: 'MenuItem',
    defaultValue: '-',
    description: '条目图标，渲染在文本左侧',
    name: 'icon',
    type: 'ReactNode',
  },
  {
    component: 'MenuItem',
    defaultValue: 'false',
    description: '禁用状态，渲染禁用样式与 `aria-disabled`，点击不触发选中',
    name: 'disabled',
    type: 'boolean',
  },
  {
    component: 'MenuItem',
    defaultValue: 'false',
    description: '危险状态，渲染危险色文本',
    name: 'danger',
    type: 'boolean',
  },
  {
    component: 'MenuItem',
    defaultValue: '-',
    description: '悬停提示；折叠模式下当内容为字符串时自动取内容文本',
    name: 'title',
    type: 'string',
  },
  {
    component: 'MenuItem',
    defaultValue: '-',
    description: '条目选择回调，在点击且事件未被阻止时触发，之后继续触发 Menu 的 onSelect',
    name: 'onSelect',
    type: '(eventKey: EventKey, event: SyntheticEvent) => void',
  },
  {
    component: 'MenuItem',
    defaultValue: "'li'",
    description: '渲染的元素标签，默认渲染 `li[role="menuitem"]`',
    name: 'as',
    type: 'ElementType',
  },
  {
    component: 'MenuItem',
    defaultValue: '-',
    description: '自定义类名',
    name: 'className',
    type: 'string',
  },
  {
    component: 'MenuSubMenu',
    defaultValue: '-',
    description: '子菜单标题（必填），渲染在标题行文本位置',
    name: 'title',
    type: 'ReactNode',
  },
  {
    component: 'MenuSubMenu',
    defaultValue: '-',
    description: '子菜单 key，用于展开状态匹配；未设置时按渲染位置自动生成',
    name: 'eventKey',
    type: 'EventKey',
  },
  {
    component: 'MenuSubMenu',
    defaultValue: '-',
    description: '子菜单标题图标',
    name: 'icon',
    type: 'ReactNode',
  },
  {
    component: 'MenuSubMenu',
    defaultValue: 'false',
    description: '禁用状态，标题行不可点击展开',
    name: 'disabled',
    type: 'boolean',
  },
  {
    component: 'MenuSubMenu',
    defaultValue: "'li'",
    description: '渲染的元素标签，默认渲染 `li`',
    name: 'as',
    type: 'ElementType',
  },
  {
    component: 'MenuSubMenu',
    defaultValue: '-',
    description: '自定义类名',
    name: 'className',
    type: 'string',
  },
  {
    component: 'MenuGroup',
    defaultValue: '-',
    description: '分组标题（必填），渲染为不可选中的说明文本；折叠模式下自动隐藏',
    name: 'label',
    type: 'ReactNode',
  },
  {
    component: 'MenuGroup',
    defaultValue: "'li'",
    description: '渲染的元素标签，默认渲染 `li`',
    name: 'as',
    type: 'ElementType',
  },
  {
    component: 'MenuGroup',
    defaultValue: '-',
    description: '自定义类名',
    name: 'className',
    type: 'string',
  },
  {
    component: 'MenuDivider',
    defaultValue: "'li'",
    description: '渲染的元素标签，默认渲染 `li`，内部为 `hr` 分隔线',
    name: 'as',
    type: 'ElementType',
  },
  {
    component: 'MenuDivider',
    defaultValue: '-',
    description: '自定义类名',
    name: 'className',
    type: 'string',
  },
];

const menuTypeDefinitions: ApiTypeDefinition[] = [
  {
    code: eventKeyTypeCode,
    description: '菜单 key 类型',
    name: 'EventKey',
  },
  {
    code: menuModeTypeCode,
    description: '菜单模式类型',
    name: 'MenuMode',
  },
  {
    code: menuThemeTypeCode,
    description: '菜单主题类型',
    name: 'MenuTheme',
  },
  {
    code: menuTriggerTypeCode,
    description: '弹出式子菜单触发方式类型',
    name: 'MenuTrigger',
  },
  {
    code: menuPropsTypeCode,
    description: '菜单容器组件属性接口',
    name: 'MenuProps',
  },
  {
    code: menuItemPropsTypeCode,
    description: '菜单条目组件属性接口',
    name: 'MenuItemProps',
  },
  {
    code: menuSubMenuPropsTypeCode,
    description: '子菜单组件属性接口',
    name: 'MenuSubMenuProps',
  },
  {
    code: menuGroupPropsTypeCode,
    description: '菜单分组组件属性接口',
    name: 'MenuGroupProps',
  },
  {
    code: menuDividerPropsTypeCode,
    description: '菜单分隔线组件属性接口',
    name: 'MenuDividerProps',
  },
  {
    code: menuContextValueTypeCode,
    description: '菜单上下文，供所有子组件消费',
    name: 'MenuContextValue',
  },
];

export const MenuDoc = () => {
  const [activeKey, setActiveKey] = useState('home');
  const [collapsed, setCollapsed] = useState(false);

  const demoContent = (
    <>
      <DemoSection code={basicCode} title="基础用法">
        <Menu defaultActiveKey="home" style={{ width: 200 }}>
          <MenuItem eventKey="home" icon={<House size={16} />}>
            首页
          </MenuItem>
          <MenuItem eventKey="profile" icon={<User size={16} />}>
            个人资料
          </MenuItem>
          <MenuItem eventKey="settings" icon={<Settings size={16} />}>
            设置
          </MenuItem>
        </Menu>
        <p className="mb-0 mt-3 text-muted small">
          Menu 渲染 `ul[role="menu"]`，MenuItem 渲染
          `li[role="menuitem"]`，选中条目渲染高亮背景与主题色文本； 未设置 eventKey
          的条目会按渲染位置自动生成 key
        </p>
      </DemoSection>

      <DemoSection code={inlineCode} title="内嵌子菜单">
        <Menu defaultOpenKeys={['docs']} mode="inline" style={{ width: 240 }}>
          <MenuItem eventKey="home" icon={<House size={16} />}>
            首页
          </MenuItem>
          <MenuSubMenu eventKey="docs" icon={<FileText size={16} />} title="文档">
            <MenuItem eventKey="guide">快速上手</MenuItem>
            <MenuItem eventKey="api">API 参考</MenuItem>
            <MenuSubMenu eventKey="advanced" title="进阶">
              <MenuItem eventKey="theme">主题定制</MenuItem>
              <MenuItem eventKey="ssr">SSR 渲染</MenuItem>
            </MenuSubMenu>
          </MenuSubMenu>
          <MenuSubMenu eventKey="account" icon={<User size={16} />} title="账号">
            <MenuItem eventKey="profile">个人资料</MenuItem>
            <MenuItem eventKey="logout">退出登录</MenuItem>
          </MenuSubMenu>
        </Menu>
        <p className="mb-0 mt-3 text-muted small">
          mode=&quot;inline&quot; 时子菜单在标题下方内嵌展开，支持任意层级嵌套；展开状态由 openKeys
          / defaultOpenKeys 维护，每一级默认缩进 inlineIndent 像素
        </p>
      </DemoSection>

      <DemoSection code={verticalCode} title="垂直弹出子菜单">
        <Menu defaultActiveKey="home" mode="vertical" style={{ width: 220 }}>
          <MenuItem eventKey="home" icon={<House size={16} />}>
            首页
          </MenuItem>
          <MenuSubMenu eventKey="docs" icon={<FileText size={16} />} title="文档">
            <MenuItem eventKey="guide">快速上手</MenuItem>
            <MenuItem eventKey="api">API 参考</MenuItem>
          </MenuSubMenu>
          <MenuSubMenu eventKey="account" icon={<User size={16} />} title="账号">
            <MenuItem eventKey="profile">个人资料</MenuItem>
            <MenuItem eventKey="logout">退出登录</MenuItem>
          </MenuSubMenu>
          <MenuItem eventKey="settings" icon={<Settings size={16} />}>
            设置
          </MenuItem>
        </Menu>
        <p className="mb-0 mt-3 text-muted small">
          mode=&quot;vertical&quot; 时点击标题在右侧弹出子菜单，弹出层靠近视口边缘会自动翻转方向，
          点击条目后自动关闭
        </p>
      </DemoSection>

      <DemoSection code={horizontalCode} title="水平菜单">
        <Menu defaultActiveKey="home" mode="horizontal" style={{ width: '100%' }}>
          <MenuItem eventKey="home" icon={<House size={16} />}>
            首页
          </MenuItem>
          <MenuSubMenu eventKey="docs" icon={<FileText size={16} />} title="文档">
            <MenuItem eventKey="guide">快速上手</MenuItem>
            <MenuItem eventKey="api">API 参考</MenuItem>
            <MenuSubMenu eventKey="advanced" title="进阶">
              <MenuItem eventKey="theme">主题定制</MenuItem>
              <MenuItem eventKey="ssr">SSR 渲染</MenuItem>
            </MenuSubMenu>
          </MenuSubMenu>
          <MenuSubMenu eventKey="account" icon={<User size={16} />} title="账号">
            <MenuItem eventKey="profile">个人资料</MenuItem>
            <MenuItem eventKey="logout">退出登录</MenuItem>
          </MenuSubMenu>
          <MenuItem eventKey="settings" icon={<Settings size={16} />}>
            设置
          </MenuItem>
        </Menu>
        <p className="mb-0 mt-3 text-muted small">
          mode=&quot;horizontal&quot; 时根条目横向排列，子菜单在标题下方弹出，默认 hover 触发（带
          100ms 打开与 150ms 关闭延迟），点击标题可固定展开；弹出层内的嵌套子菜单内嵌展开
        </p>
      </DemoSection>

      <DemoSection code={groupCode} title="分组与分隔线">
        <Menu defaultActiveKey="profile" mode="inline" style={{ width: 240 }}>
          <MenuGroup label="常规">
            <MenuItem eventKey="home" icon={<House size={16} />}>
              首页
            </MenuItem>
            <MenuItem eventKey="profile" icon={<User size={16} />}>
              个人资料
            </MenuItem>
            <MenuItem eventKey="settings" icon={<Settings size={16} />}>
              设置
            </MenuItem>
          </MenuGroup>
          <MenuDivider />
          <MenuGroup label="帮助">
            <MenuItem eventKey="docs" icon={<FileText size={16} />}>
              文档
            </MenuItem>
            <MenuDivider />
            <MenuItem eventKey="feedback" icon={<MessageSquare size={16} />}>
              反馈
            </MenuItem>
          </MenuGroup>
        </Menu>
        <p className="mb-0 mt-3 text-muted small">
          MenuGroup 渲染分组标题与条目列表，MenuDivider 渲染 `hr` 分隔线，两者都不可选中
        </p>
      </DemoSection>

      <DemoSection code={darkCode} title="深色主题">
        <div className="rounded" style={{ backgroundColor: '#212529', width: 240 }}>
          <Menu defaultActiveKey="home" defaultOpenKeys={['docs']} mode="inline" theme="dark">
            <MenuItem eventKey="home" icon={<House size={16} />}>
              首页
            </MenuItem>
            <MenuItem eventKey="profile" icon={<User size={16} />}>
              个人资料
            </MenuItem>
            <MenuSubMenu eventKey="docs" icon={<FileText size={16} />} title="文档">
              <MenuItem eventKey="guide">快速上手</MenuItem>
              <MenuItem eventKey="api">API 参考</MenuItem>
            </MenuSubMenu>
            <MenuItem eventKey="settings" icon={<Settings size={16} />}>
              设置
            </MenuItem>
          </Menu>
        </div>
        <p className="mb-0 mt-3 text-muted small">
          theme=&quot;dark&quot;
          切换深色配色：文本、悬停背景、禁用与分组颜色全部适配，弹出层同步渲染深色背景；
          内嵌模式本身不带背景，可放入任意深色容器中
        </p>
      </DemoSection>

      <DemoSection code={selectableCode} title="选中状态">
        <div className="d-flex flex-wrap gap-4">
          <Menu defaultActiveKey="home" style={{ width: 200 }}>
            <MenuItem eventKey="home">首页</MenuItem>
            <MenuItem eventKey="settings">设置</MenuItem>
            <MenuItem eventKey="docs">文档</MenuItem>
          </Menu>
          <div className="d-flex flex-column gap-2">
            <Menu
              activeKey={activeKey}
              onSelect={(key) => {
                if (key != null) {
                  setActiveKey(String(key));
                }
              }}
              style={{ width: 200 }}
            >
              <MenuItem eventKey="home">首页</MenuItem>
              <MenuItem eventKey="settings">设置</MenuItem>
              <MenuItem eventKey="docs">文档</MenuItem>
            </Menu>
            <p className="mb-0 text-muted small">当前选中：{activeKey}</p>
          </div>
        </div>
        <p className="mb-0 mt-3 text-muted small">
          defaultActiveKey 提供非受控的初始选中，点击条目自动维护；传入 activeKey 后变为受控组件，
          选中状态完全由 onSelect 驱动的外部 state 决定；selectable=&quot;false&quot; 可整体关闭选中
        </p>
      </DemoSection>

      <DemoSection code={multipleCode} title="多选">
        <Menu defaultActiveKey={['home', 'docs']} multiple style={{ width: 220 }}>
          <MenuItem eventKey="home" icon={<House size={16} />}>
            首页
          </MenuItem>
          <MenuItem eventKey="docs" icon={<FileText size={16} />}>
            文档
          </MenuItem>
          <MenuItem eventKey="settings" icon={<Settings size={16} />}>
            设置
          </MenuItem>
          <MenuItem eventKey="messages" icon={<MessageSquare size={16} />}>
            消息
          </MenuItem>
        </Menu>
        <p className="mb-0 mt-3 text-muted small">
          multiple 开启多选，点击已选中的条目会取消选中，activeKey / defaultActiveKey 使用数组形式
        </p>
      </DemoSection>

      <DemoSection code={disabledCode} title="禁用与危险">
        <Menu defaultActiveKey="home" mode="inline" style={{ width: 220 }}>
          <MenuItem eventKey="home" icon={<House size={16} />}>
            首页
          </MenuItem>
          <MenuItem disabled eventKey="locked" icon={<Lock size={16} />}>
            锁定项
          </MenuItem>
          <MenuSubMenu disabled eventKey="archived" title="禁用的子菜单">
            <MenuItem eventKey="hidden">不可达</MenuItem>
          </MenuSubMenu>
          <MenuItem danger eventKey="delete" icon={<Trash2 size={16} />}>
            删除账户
          </MenuItem>
        </Menu>
        <p className="mb-0 mt-3 text-muted small">
          disabled 条目与子菜单渲染禁用样式并设置 `aria-disabled`，不可选中也不可展开； danger
          条目渲染危险色文本，适合删除类操作
        </p>
      </DemoSection>

      <DemoSection code={collapsedCode} title="折叠模式">
        <div className="d-flex align-items-start gap-3">
          <Menu
            defaultActiveKey="home"
            defaultOpenKeys={['docs']}
            inlineCollapsed={collapsed}
            mode="inline"
            style={{ width: 220 }}
          >
            <MenuItem eventKey="home" icon={<House size={16} />}>
              首页
            </MenuItem>
            <MenuItem eventKey="profile" icon={<User size={16} />}>
              个人资料
            </MenuItem>
            <MenuSubMenu eventKey="docs" icon={<FileText size={16} />} title="文档">
              <MenuItem eventKey="guide">快速上手</MenuItem>
              <MenuItem eventKey="api">API 参考</MenuItem>
            </MenuSubMenu>
            <MenuItem eventKey="settings" icon={<Settings size={16} />}>
              设置
            </MenuItem>
          </Menu>
          <IconButton
            active={collapsed}
            className="align-self-start"
            label="折叠或展开"
            onClick={() => setCollapsed((prev) => !prev)}
            toggle
            variant="outline-primary"
          >
            <PanelLeft size={18} />
          </IconButton>
        </div>
        <p className="mb-0 mt-3 text-muted small">
          inlineCollapsed 将菜单收缩为 collapsedWidth
          宽度的图标轨道：条目只显示图标（与展开状态保持相同的左侧间距、左右留白对称）并自动生成悬停提示，
          子菜单在右侧弹出飞入层，默认 hover 触发；折叠与展开由外部 state 驱动
        </p>
      </DemoSection>

      <DemoSection code={customCode} title="自定义内容">
        <Menu mode="inline" selectable={false} style={{ width: 240 }}>
          <MenuItem eventKey="link" icon={<House size={16} />}>
            <a className="text-decoration-none" href="#menu-custom-demo">
              链接内容
            </a>
          </MenuItem>
          <MenuItem eventKey="messages">
            <span className="d-flex align-items-center justify-content-between w-100">
              消息
              <span className="badge rounded-pill text-bg-primary">3</span>
            </span>
          </MenuItem>
          <MenuItem className="fw-bold" eventKey="bold">
            加粗条目
          </MenuItem>
          <MenuItem eventKey="long" title="这是一段很长的菜单内容，超出宽度后会被截断并显示省略号">
            这是一段很长的菜单内容，超出宽度后会被截断并显示省略号
          </MenuItem>
        </Menu>
        <p className="mb-0 mt-3 text-muted small">
          条目内容完全自由：可以嵌入链接、徽标等任意元素，超长文本自动截断并显示省略号（配合 title
          提供完整提示）， 也可以用 className 定制样式
        </p>
      </DemoSection>
    </>
  );

  return (
    <DocTemplate
      componentDescription="基于 Bootstrap 5 的菜单组件，Menu 套件（Menu、MenuItem、MenuSubMenu、MenuGroup、MenuDivider）用于构建垂直与水平导航菜单，支持内嵌展开与弹出式子菜单、任意层级嵌套、分组与分隔线、图标、禁用与危险状态、单选与多选、受控/非受控的选中与展开状态、深色主题、折叠图标轨道与完整键盘导航"
      componentName="Menu"
      componentTags={['基础', '导航']}
      demoContent={demoContent}
      props={menuProps}
      typeDefinitions={menuTypeDefinitions}
    />
  );
};

export default MenuDoc;
