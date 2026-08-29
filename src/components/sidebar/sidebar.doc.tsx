import type { CSSProperties, FC, ReactNode } from 'react';

import {
  Bell,
  Book,
  ChartColumn,
  Folder,
  House,
  MessageSquare,
  Settings,
  User,
} from 'lucide-react';
import { useState } from 'react';

import { Button } from '../button';
import { type ApiProp, type ApiTypeDefinition, DemoSection, DocTemplate } from '../doc-template';
import { FormControl } from '../form-control';
import { Progress } from '../progress';
import basicCode from './demos/basic.md?raw';
import collapsibleCode from './demos/collapsible.md?raw';
import controlledCode from './demos/controlled.md?raw';
import interactiveCode from './demos/interactive.md?raw';
import responsiveCode from './demos/responsive.md?raw';
import slotsCode from './demos/slots.md?raw';
import variantsCode from './demos/variants.md?raw';
import withoutIconsCollapseCode from './demos/without-icons-collapse.md?raw';
import withoutIconsCode from './demos/without-icons.md?raw';
import {
  Sidebar,
  SidebarBody,
  SidebarButton,
  SidebarDivider,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarLink,
  SidebarProvider,
  SidebarTrigger,
} from './index';
import sidebarBackdropPropsTypeCode from './types/sidebar-backdrop-props.md?raw';
import sidebarBreakpointTypeCode from './types/sidebar-breakpoint.md?raw';
import sidebarButtonPropsTypeCode from './types/sidebar-button-props.md?raw';
import sidebarContextValueTypeCode from './types/sidebar-context-value.md?raw';
import sidebarDividerPropsTypeCode from './types/sidebar-divider-props.md?raw';
import sidebarGroupContentPropsTypeCode from './types/sidebar-group-content-props.md?raw';
import sidebarGroupLabelPropsTypeCode from './types/sidebar-group-label-props.md?raw';
import sidebarGroupPropsTypeCode from './types/sidebar-group-props.md?raw';
import sidebarItemBasePropsTypeCode from './types/sidebar-item-base-props.md?raw';
import sidebarItemPropsTypeCode from './types/sidebar-item-props.md?raw';
import sidebarLinkPropsTypeCode from './types/sidebar-link-props.md?raw';
import sidebarPlacementTypeCode from './types/sidebar-placement.md?raw';
import sidebarPropsTypeCode from './types/sidebar-props.md?raw';
import sidebarProviderPropsTypeCode from './types/sidebar-provider-props.md?raw';
import sidebarRegionPropsTypeCode from './types/sidebar-region-props.md?raw';
import sidebarStatePropsTypeCode from './types/sidebar-state-props.md?raw';
import sidebarTriggerPropsTypeCode from './types/sidebar-trigger-props.md?raw';
import sidebarVariantTypeCode from './types/sidebar-variant.md?raw';

const HomeIcon = () => <House aria-hidden="true" size={16} />;

const ChartIcon = () => <ChartColumn aria-hidden="true" size={16} />;

const FolderIcon = () => <Folder aria-hidden="true" size={16} />;

const BookIcon = () => <Book aria-hidden="true" size={16} />;

const SettingsIcon = () => <Settings aria-hidden="true" size={16} />;

const BellIcon = () => <Bell aria-hidden="true" size={16} />;

const UserIcon = () => <User aria-hidden="true" size={16} />;

const ChatIcon = () => <MessageSquare aria-hidden="true" size={16} />;

const DemoFrame: FC<{ children?: ReactNode; height?: number }> = ({ children, height = 480 }) => (
  <div
    className="border overflow-hidden rounded"
    style={{ '--rbs-sidebar-height': '100%', height } as CSSProperties}
  >
    {children}
  </div>
);

const preventDefault = (event: { preventDefault: () => void }): void => {
  event.preventDefault();
};

const sidebarProps: ApiProp[] = [
  {
    component: 'Sidebar',
    defaultValue: "'aside'",
    description: '渲染的根元素类型',
    name: 'as',
    type: 'ElementType',
  },
  {
    component: 'Sidebar',
    defaultValue: "'md'",
    description:
      '响应式断点：视口宽度低于该断点时切换为抽屉模式（固定定位 + 遮罩 + 滑动动画）；传入 `null` 始终内联展示',
    name: 'breakpoint',
    type: 'SidebarBreakpoint | null',
  },
  {
    component: 'Sidebar',
    defaultValue: '-',
    description:
      '受控的收起（图标模式）状态；提供后点击触发器不会自动更新，仅触发 onCollapsedChange 回调',
    name: 'collapsed',
    type: 'boolean',
  },
  {
    component: 'Sidebar',
    defaultValue: '60',
    description: '收起态宽度，数字按像素处理，也可传入任意 CSS 长度',
    name: 'collapsedWidth',
    type: 'number | string',
  },
  {
    component: 'Sidebar',
    defaultValue: 'true',
    description: '移动端抽屉模式下点击任意导航项后自动关闭抽屉',
    name: 'collapseOnSelect',
    type: 'boolean',
  },
  {
    component: 'Sidebar',
    defaultValue: 'false',
    description: '非受控模式下的初始收起状态',
    name: 'defaultCollapsed',
    type: 'boolean',
  },
  {
    component: 'Sidebar',
    defaultValue: 'false',
    description: '非受控模式下的初始移动端抽屉打开状态',
    name: 'defaultOpen',
    type: 'boolean',
  },
  {
    component: 'Sidebar',
    defaultValue: '-',
    description: '收起状态变化回调，参数为新的收起状态',
    name: 'onCollapsedChange',
    type: '(collapsed: boolean) => void',
  },
  {
    component: 'Sidebar',
    defaultValue: '-',
    description: '点击任意导航项（SidebarItem/SidebarLink/SidebarButton）后的回调',
    name: 'onItemSelect',
    type: '() => void',
  },
  {
    component: 'Sidebar',
    defaultValue: '-',
    description: '移动端抽屉打开状态变化回调，参数为新的打开状态',
    name: 'onOpenChange',
    type: '(open: boolean) => void',
  },
  {
    component: 'Sidebar',
    defaultValue: '-',
    description: '受控的移动端抽屉打开状态；提供后仅触发 onOpenChange 回调',
    name: 'open',
    type: 'boolean',
  },
  {
    component: 'Sidebar',
    defaultValue: "'start'",
    description: '侧边栏停靠位置，`start` 左侧、`end` 右侧',
    name: 'placement',
    type: 'SidebarPlacement',
  },
  {
    component: 'Sidebar',
    defaultValue: "'light'",
    description: '明暗主题，`dark` 会同时在根元素上设置 `data-bs-theme="dark"`',
    name: 'variant',
    type: 'SidebarVariant',
  },
  {
    component: 'Sidebar',
    defaultValue: '256',
    description: '展开态宽度，数字按像素处理，也可传入任意 CSS 长度',
    name: 'width',
    type: 'number | string',
  },
  {
    component: 'SidebarProvider',
    defaultValue: '-',
    description: '需要被上下文中的 Sidebar、SidebarTrigger、SidebarBackdrop 等消费的子内容',
    name: 'children',
    type: 'ReactNode',
  },
  {
    component: 'SidebarProvider',
    defaultValue: '-',
    description:
      '与 Sidebar 相同的受控/非受控状态属性（breakpoint、collapsed、open 等），由 Provider 统一持有并共享给其子树中的所有 Sidebar 部件',
    name: '...stateProps',
    type: 'SidebarStateProps',
  },
  {
    component: 'SidebarTrigger',
    defaultValue: "'button'",
    description: '渲染的根元素类型',
    name: 'as',
    type: 'ElementType',
  },
  {
    component: 'SidebarTrigger',
    defaultValue: '-',
    description: '触发器上的文字标签，侧边栏收起为图标模式时自动隐藏',
    name: 'children',
    type: 'ReactNode',
  },
  {
    component: 'SidebarTrigger',
    defaultValue: '-',
    description:
      '点击回调；移动端切换抽屉开合，桌面端切换收起状态。未传入 aria-label 时根据当前状态自动生成无障碍标签',
    name: 'onClick',
    type: '(event: MouseEvent) => void',
  },
  {
    component: 'SidebarHeader',
    defaultValue: "'header'",
    description: '渲染的根元素类型',
    name: 'as',
    type: 'ElementType',
  },
  {
    component: 'SidebarHeader',
    defaultValue: '-',
    description: '顶部区域内容，如品牌标识、SidebarTrigger、搜索框',
    name: 'children',
    type: 'ReactNode',
  },
  {
    component: 'SidebarBody',
    defaultValue: "'div'",
    description: '渲染的根元素类型',
    name: 'as',
    type: 'ElementType',
  },
  {
    component: 'SidebarBody',
    defaultValue: '-',
    description: '中间可滚动区域内容，通常放置 SidebarGroup 导航分组',
    name: 'children',
    type: 'ReactNode',
  },
  {
    component: 'SidebarFooter',
    defaultValue: "'footer'",
    description: '渲染的根元素类型',
    name: 'as',
    type: 'ElementType',
  },
  {
    component: 'SidebarFooter',
    defaultValue: '-',
    description: '底部区域内容，如用户信息、版本号',
    name: 'children',
    type: 'ReactNode',
  },
  {
    component: 'SidebarGroup',
    defaultValue: "'div'",
    description: '导航分组容器渲染的根元素类型',
    name: 'as',
    type: 'ElementType',
  },
  {
    component: 'SidebarGroup',
    defaultValue: '-',
    description: '分组内容，通常由 SidebarGroupLabel 与 SidebarGroupContent 组成',
    name: 'children',
    type: 'ReactNode',
  },
  {
    component: 'SidebarGroupLabel',
    defaultValue: "'div'",
    description: '分组标题渲染的根元素类型',
    name: 'as',
    type: 'ElementType',
  },
  {
    component: 'SidebarGroupLabel',
    defaultValue: '-',
    description: '分组标题文本，侧边栏收起为图标模式时自动隐藏',
    name: 'children',
    type: 'ReactNode',
  },
  {
    component: 'SidebarGroupContent',
    defaultValue: "'div'",
    description: '分组内容容器渲染的根元素类型',
    name: 'as',
    type: 'ElementType',
  },
  {
    component: 'SidebarGroupContent',
    defaultValue: '-',
    description: '分组内的导航项列表（SidebarItem/SidebarLink/SidebarButton）',
    name: 'children',
    type: 'ReactNode',
  },
  {
    component: 'SidebarItem',
    defaultValue: 'false',
    description: '是否处于激活状态，激活项渲染高亮背景并设置 aria-current="page"',
    name: 'active',
    type: 'boolean',
  },
  {
    component: 'SidebarItem',
    defaultValue: '-',
    description: '导航项右侧的徽标内容，如 `<span className="badge text-bg-primary">12</span>`',
    name: 'badge',
    type: 'ReactNode',
  },
  {
    component: 'SidebarItem',
    defaultValue: '-',
    description: '导航项文字内容，通常为字符串或带样式文本',
    name: 'children',
    type: 'ReactNode',
  },
  {
    component: 'SidebarItem',
    defaultValue: 'false',
    description: '是否禁用，禁用项不可点击并降低透明度',
    name: 'disabled',
    type: 'boolean',
  },
  {
    component: 'SidebarItem',
    defaultValue: '-',
    description: '链接地址；传入时渲染 `<a>` 元素，否则渲染 `<button>` 元素',
    name: 'href',
    type: 'string',
  },
  {
    component: 'SidebarItem',
    defaultValue: '-',
    description:
      '导航项左侧图标（可选）；未传入时不预留图标位、文字紧贴左侧，收起为图标模式时以内容首字作为图标',
    name: 'icon',
    type: 'ReactNode',
  },
  {
    component: 'SidebarItem',
    defaultValue: '-',
    description: '点击回调；移动端配合 collapseOnSelect 在导航后自动关闭抽屉',
    name: 'onClick',
    type: '(event: MouseEvent) => void',
  },
  {
    component: 'SidebarLink',
    defaultValue: '-',
    description: '链接地址（必填）',
    name: 'href',
    type: 'string',
  },
  {
    component: 'SidebarLink',
    defaultValue: '-',
    description: '与 SidebarItem 相同的导航项配置（active、badge、disabled、icon 等）',
    name: '...itemProps',
    type: 'SidebarItemBaseProps',
  },
  {
    component: 'SidebarButton',
    defaultValue: "'button'",
    description: '按钮原生 type 属性',
    name: 'type',
    type: "ButtonHTMLAttributes['type']",
  },
  {
    component: 'SidebarButton',
    defaultValue: '-',
    description: '与 SidebarItem 相同的导航项配置（active、badge、disabled、icon 等）',
    name: '...itemProps',
    type: 'SidebarItemBaseProps',
  },
  {
    component: 'SidebarDivider',
    defaultValue: '-',
    description: '分隔线原生属性与自定义类名，用于分隔导航分组',
    name: 'className',
    type: 'string',
  },
  {
    component: 'SidebarBackdrop',
    defaultValue: '-',
    description: '移动端抽屉遮罩；Sidebar 在移动端自动通过 Portal 渲染，也可在自定义布局中单独使用',
    name: 'className',
    type: 'string',
  },
  {
    component: 'useSidebar',
    defaultValue: '-',
    description:
      '上下文对象：提供 collapsed、isMobile、mobileOpen 等状态与 setMobileOpen、toggleCollapsed 等操作',
    name: '返回值',
    type: 'SidebarContextValue',
  },
  {
    defaultValue: '-',
    description: '子内容（导航项文字等）',
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
    description: '透传原生元素属性（如 `style`、`aria-label` 等）',
    name: '...rest',
    type: 'HTMLAttributes',
  },
];

const sidebarTypeDefinitions: ApiTypeDefinition[] = [
  {
    code: sidebarBreakpointTypeCode,
    description: '响应式断点类型',
    name: 'SidebarBreakpoint',
  },
  {
    code: sidebarPlacementTypeCode,
    description: '侧边栏停靠位置类型',
    name: 'SidebarPlacement',
  },
  {
    code: sidebarVariantTypeCode,
    description: '明暗主题类型',
    name: 'SidebarVariant',
  },
  {
    code: sidebarStatePropsTypeCode,
    description: 'Sidebar 与 SidebarProvider 共享的状态属性接口',
    name: 'SidebarStateProps',
  },
  {
    code: sidebarContextValueTypeCode,
    description: 'useSidebar 返回的上下文值接口',
    name: 'SidebarContextValue',
  },
  {
    code: sidebarProviderPropsTypeCode,
    description: 'SidebarProvider 属性接口',
    name: 'SidebarProviderProps',
  },
  {
    code: sidebarPropsTypeCode,
    description: 'Sidebar 属性接口',
    name: 'SidebarProps',
  },
  {
    code: sidebarRegionPropsTypeCode,
    description: 'Header/Body/Footer 区域属性接口',
    name: 'SidebarRegionProps',
  },
  {
    code: sidebarGroupPropsTypeCode,
    description: 'SidebarGroup 属性类型',
    name: 'SidebarGroupProps',
  },
  {
    code: sidebarGroupLabelPropsTypeCode,
    description: 'SidebarGroupLabel 属性类型',
    name: 'SidebarGroupLabelProps',
  },
  {
    code: sidebarGroupContentPropsTypeCode,
    description: 'SidebarGroupContent 属性类型',
    name: 'SidebarGroupContentProps',
  },
  {
    code: sidebarItemBasePropsTypeCode,
    description: '导航项共享配置接口',
    name: 'SidebarItemBaseProps',
  },
  {
    code: sidebarItemPropsTypeCode,
    description: 'SidebarItem 属性接口',
    name: 'SidebarItemProps',
  },
  {
    code: sidebarLinkPropsTypeCode,
    description: 'SidebarLink 属性接口',
    name: 'SidebarLinkProps',
  },
  {
    code: sidebarButtonPropsTypeCode,
    description: 'SidebarButton 属性类型',
    name: 'SidebarButtonProps',
  },
  {
    code: sidebarTriggerPropsTypeCode,
    description: 'SidebarTrigger 属性接口',
    name: 'SidebarTriggerProps',
  },
  {
    code: sidebarBackdropPropsTypeCode,
    description: 'SidebarBackdrop 属性类型',
    name: 'SidebarBackdropProps',
  },
  {
    code: sidebarDividerPropsTypeCode,
    description: 'SidebarDivider 属性类型',
    name: 'SidebarDividerProps',
  },
];

export const SidebarDoc = () => {
  const [active, setActive] = useState('dashboard');
  const [collapsed, setCollapsed] = useState(false);

  const demoContent = (
    <>
      <DemoSection code={basicCode} title="基础示例">
        <DemoFrame>
          <Sidebar>
            <SidebarHeader>
              <span className="fw-semibold">管理后台</span>
            </SidebarHeader>
            <SidebarBody>
              <SidebarGroup>
                <SidebarGroupLabel>总览</SidebarGroupLabel>
                <SidebarGroupContent>
                  <SidebarLink
                    active
                    href="#dashboard"
                    icon={<HomeIcon />}
                    onClick={preventDefault}
                  >
                    仪表盘
                  </SidebarLink>
                  <SidebarLink href="#stats" icon={<ChartIcon />} onClick={preventDefault}>
                    数据统计
                  </SidebarLink>
                </SidebarGroupContent>
              </SidebarGroup>
              <SidebarDivider />
              <SidebarGroup>
                <SidebarGroupLabel>内容</SidebarGroupLabel>
                <SidebarGroupContent>
                  <SidebarLink
                    badge={<span className="badge text-bg-primary">12</span>}
                    href="#posts"
                    icon={<BookIcon />}
                    onClick={preventDefault}
                  >
                    文章管理
                  </SidebarLink>
                  <SidebarLink href="#files" icon={<FolderIcon />} onClick={preventDefault}>
                    文件库
                  </SidebarLink>
                </SidebarGroupContent>
              </SidebarGroup>
            </SidebarBody>
            <SidebarFooter>
              <SidebarButton icon={<UserIcon />}>个人中心</SidebarButton>
            </SidebarFooter>
          </Sidebar>
        </DemoFrame>
        <p className="mb-0 mt-3 text-muted small">
          Sidebar 组合 Header/Body/Footer 三个区域，导航内容通过 SidebarGroup
          分组，链接与按钮导航项支持 `icon`、`badge` 与 `active` 状态
        </p>
      </DemoSection>

      <DemoSection code={withoutIconsCode} title="无图标导航项">
        <DemoFrame>
          <Sidebar>
            <SidebarHeader>
              <span className="fw-semibold">文档</span>
            </SidebarHeader>
            <SidebarBody>
              <SidebarGroup>
                <SidebarGroupLabel>指南</SidebarGroupLabel>
                <SidebarGroupContent>
                  <SidebarLink active href="#intro" onClick={preventDefault}>
                    快速开始
                  </SidebarLink>
                  <SidebarLink href="#usage" onClick={preventDefault}>
                    使用指南
                  </SidebarLink>
                  <SidebarLink
                    badge={<span className="badge text-bg-primary">New</span>}
                    href="#faq"
                    onClick={preventDefault}
                  >
                    常见问题
                  </SidebarLink>
                </SidebarGroupContent>
              </SidebarGroup>
              <SidebarDivider />
              <SidebarGroup>
                <SidebarGroupLabel>关于</SidebarGroupLabel>
                <SidebarGroupContent>
                  <SidebarLink href="#about" icon={<BookIcon />} onClick={preventDefault}>
                    关于我们
                  </SidebarLink>
                  <SidebarLink href="#contact" icon={<UserIcon />} onClick={preventDefault}>
                    联系方式
                  </SidebarLink>
                </SidebarGroupContent>
              </SidebarGroup>
            </SidebarBody>
          </Sidebar>
        </DemoFrame>
        <p className="mb-0 mt-3 text-muted small">
          `icon` 为可选属性：未传图标的导航项不预留图标位、文字紧贴左侧；示例第一组为纯文字导航，
          第二组为带图标导航
        </p>
      </DemoSection>

      <DemoSection code={withoutIconsCollapseCode} title="无图标收起展开">
        <DemoFrame>
          <Sidebar>
            <SidebarHeader>
              <SidebarTrigger>文档</SidebarTrigger>
            </SidebarHeader>
            <SidebarBody>
              <SidebarGroup>
                <SidebarGroupLabel>菜单</SidebarGroupLabel>
                <SidebarGroupContent>
                  <SidebarButton active>仪表盘</SidebarButton>
                  <SidebarButton>订单中心</SidebarButton>
                  <SidebarButton badge={<span className="badge text-bg-danger">3</span>}>
                    消息通知
                  </SidebarButton>
                  <SidebarButton>设置</SidebarButton>
                </SidebarGroupContent>
              </SidebarGroup>
            </SidebarBody>
          </Sidebar>
        </DemoFrame>
        <p className="mb-0 mt-3 text-muted small">
          未传入 `icon` 时，收起为图标模式后自动以内容首字作为图标（如「仪」「订」「消」），
          展开时首字淡出、完整文字淡入；点击触发器可观察收起与展开的过渡
        </p>
      </DemoSection>

      <DemoSection code={collapsibleCode} title="收起为图标模式">
        <DemoFrame>
          <Sidebar defaultCollapsed>
            <SidebarHeader>
              <SidebarTrigger />
            </SidebarHeader>
            <SidebarBody>
              <SidebarGroup>
                <SidebarGroupLabel>导航</SidebarGroupLabel>
                <SidebarGroupContent>
                  <SidebarLink href="#home" icon={<HomeIcon />} onClick={preventDefault}>
                    首页
                  </SidebarLink>
                  <SidebarLink href="#stats" icon={<ChartIcon />} onClick={preventDefault}>
                    统计
                  </SidebarLink>
                  <SidebarLink href="#settings" icon={<SettingsIcon />} onClick={preventDefault}>
                    设置
                  </SidebarLink>
                </SidebarGroupContent>
              </SidebarGroup>
            </SidebarBody>
          </Sidebar>
        </DemoFrame>
        <p className="mb-0 mt-3 text-muted small">
          点击 SidebarTrigger 在展开与图标模式之间切换，收起后仅保留图标，分组标题与文字标签自动隐藏
        </p>
      </DemoSection>

      <DemoSection code={variantsCode} title="深色主题与右侧停靠">
        <div className="d-flex flex-wrap gap-3">
          <DemoFrame height={440}>
            <Sidebar variant="dark">
              <SidebarHeader>
                <span className="fw-semibold">深色主题</span>
              </SidebarHeader>
              <SidebarBody>
                <SidebarGroup>
                  <SidebarGroupContent>
                    <SidebarLink active href="#a" icon={<HomeIcon />} onClick={preventDefault}>
                      首页
                    </SidebarLink>
                    <SidebarLink href="#b" icon={<ChartIcon />} onClick={preventDefault}>
                      统计
                    </SidebarLink>
                  </SidebarGroupContent>
                </SidebarGroup>
              </SidebarBody>
            </Sidebar>
          </DemoFrame>
          <DemoFrame height={440}>
            <Sidebar placement="end">
              <SidebarHeader>
                <span className="fw-semibold">右侧停靠</span>
              </SidebarHeader>
              <SidebarBody>
                <SidebarGroup>
                  <SidebarGroupContent>
                    <SidebarLink active href="#c" icon={<HomeIcon />} onClick={preventDefault}>
                      首页
                    </SidebarLink>
                    <SidebarLink href="#d" icon={<ChartIcon />} onClick={preventDefault}>
                      统计
                    </SidebarLink>
                  </SidebarGroupContent>
                </SidebarGroup>
              </SidebarBody>
            </Sidebar>
          </DemoFrame>
        </div>
        <p className="mb-0 mt-3 text-muted small">
          `variant="dark"` 在根元素上设置 `data-bs-theme="dark"`，所有 Bootstrap 变量自动适配；
          `placement="end"` 将侧边栏停靠到右侧
        </p>
      </DemoSection>

      <DemoSection code={responsiveCode} title="响应式抽屉">
        <DemoFrame>
          <Sidebar breakpoint="lg">
            <SidebarHeader>
              <SidebarTrigger>导航</SidebarTrigger>
            </SidebarHeader>
            <SidebarBody>
              <SidebarGroup>
                <SidebarGroupLabel>导航</SidebarGroupLabel>
                <SidebarGroupContent>
                  <SidebarLink active href="#overview" icon={<HomeIcon />} onClick={preventDefault}>
                    概览
                  </SidebarLink>
                  <SidebarLink href="#reports" icon={<ChartIcon />} onClick={preventDefault}>
                    报表
                  </SidebarLink>
                  <SidebarLink href="#messages" icon={<ChatIcon />} onClick={preventDefault}>
                    消息
                  </SidebarLink>
                </SidebarGroupContent>
              </SidebarGroup>
            </SidebarBody>
          </Sidebar>
        </DemoFrame>
        <p className="mb-0 mt-3 text-muted small">
          视口宽度低于 `breakpoint` 时切换为固定定位抽屉：带遮罩与滑动动画，支持点击遮罩、Esc
          键关闭；将浏览器窗口缩窄到 992px 以下即可观察抽屉效果
        </p>
      </DemoSection>

      <DemoSection code={controlledCode} title="Provider 与受控模式">
        <SidebarProvider collapsed={collapsed} onCollapsedChange={setCollapsed}>
          <div className="align-items-center d-flex gap-2 mb-3">
            <SidebarTrigger />
            <Button onClick={() => setCollapsed(!collapsed)} size="sm" variant="outline-secondary">
              {collapsed ? '展开侧边栏' : '收起侧边栏'}
            </Button>
          </div>
          <DemoFrame height={420}>
            <Sidebar>
              <SidebarHeader>
                <SidebarTrigger>受控模式</SidebarTrigger>
              </SidebarHeader>
              <SidebarBody>
                <SidebarGroup>
                  <SidebarGroupContent>
                    <SidebarButton active icon={<HomeIcon />}>
                      首页
                    </SidebarButton>
                    <SidebarButton icon={<SettingsIcon />}>设置</SidebarButton>
                  </SidebarGroupContent>
                </SidebarGroup>
              </SidebarBody>
            </Sidebar>
          </DemoFrame>
        </SidebarProvider>
        <p className="mb-0 mt-3 text-muted small">
          SidebarProvider 将状态提升到侧边栏之外，SidebarTrigger 可以放在任意位置控制侧边栏；通过
          `collapsed`/`onCollapsedChange` 实现受控收起，移动端抽屉对应 `open`/`onOpenChange`
        </p>
      </DemoSection>

      <DemoSection code={interactiveCode} title="交互与状态">
        <DemoFrame>
          <Sidebar>
            <SidebarBody>
              <SidebarGroup>
                <SidebarGroupLabel>导航</SidebarGroupLabel>
                <SidebarGroupContent>
                  <SidebarButton
                    active={active === 'dashboard'}
                    icon={<HomeIcon />}
                    onClick={() => setActive('dashboard')}
                  >
                    仪表盘
                  </SidebarButton>
                  <SidebarButton
                    active={active === 'orders'}
                    icon={<FolderIcon />}
                    onClick={() => setActive('orders')}
                  >
                    订单中心
                  </SidebarButton>
                  <SidebarButton
                    badge={<span className="badge text-bg-danger">3</span>}
                    icon={<BellIcon />}
                    onClick={() => setActive('messages')}
                  >
                    消息通知
                  </SidebarButton>
                  <SidebarDivider />
                  <SidebarButton disabled icon={<SettingsIcon />}>
                    设置（未开放）
                  </SidebarButton>
                </SidebarGroupContent>
              </SidebarGroup>
            </SidebarBody>
          </Sidebar>
        </DemoFrame>
        <p className="mb-0 mt-3 text-muted small">
          `active` 切换高亮导航项，`badge` 展示未读数量，`disabled` 禁用不可用的导航项
        </p>
      </DemoSection>

      <DemoSection code={slotsCode} title="自定义插槽">
        <DemoFrame>
          <Sidebar>
            <SidebarHeader>
              <span className="fw-semibold">工作台</span>
            </SidebarHeader>
            <SidebarBody>
              <FormControl className="mb-3" placeholder="搜索内容…" size="sm" />
              <SidebarGroup>
                <SidebarGroupLabel>项目</SidebarGroupLabel>
                <SidebarGroupContent>
                  <SidebarLink
                    active
                    href="#project"
                    icon={<FolderIcon />}
                    onClick={preventDefault}
                  >
                    当前项目
                  </SidebarLink>
                  <SidebarLink href="#archive" icon={<BookIcon />} onClick={preventDefault}>
                    归档
                  </SidebarLink>
                </SidebarGroupContent>
              </SidebarGroup>
              <div className="px-3 py-2">
                <Progress now={68} />
              </div>
            </SidebarBody>
            <SidebarFooter>
              <span className="small text-secondary">v0.1.0</span>
            </SidebarFooter>
          </Sidebar>
        </DemoFrame>
        <p className="mb-0 mt-3 text-muted small">
          Header/Body/Footer 插槽接受任意内容，可自由组合搜索框、进度条、版本信息等
        </p>
      </DemoSection>
    </>
  );

  return (
    <DocTemplate
      componentDescription="基于 Bootstrap 5 的侧边栏组件，用于构建应用侧边导航：通过 SidebarHeader/SidebarBody/SidebarFooter 组织区域，SidebarGroup 分组导航项，导航项支持图标、徽标、激活与禁用状态；支持收起为图标模式、视口低于断点时自动切换为带遮罩的响应式抽屉（点击遮罩或 Esc 关闭）、明暗主题与左右停靠，并可通过 SidebarProvider/useSidebar 将状态提升实现受控组合"
      componentName="Sidebar"
      componentTags={['基础', '导航']}
      demoContent={demoContent}
      props={sidebarProps}
      typeDefinitions={sidebarTypeDefinitions}
    />
  );
};

export default SidebarDoc;
