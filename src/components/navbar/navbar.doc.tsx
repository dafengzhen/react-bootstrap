import { type CSSProperties, useState } from 'react';

import { Button } from '../button';
import { CloseButton } from '../close-button';
import { type ApiProp, type ApiTypeDefinition, DemoSection, DocTemplate } from '../doc-template';
import { Dropdown, DropdownDivider, DropdownItem, DropdownMenu, DropdownToggle } from '../dropdown';
import { Nav, NavItem, NavLink } from '../tabs';
import brandCode from './demos/brand.md?raw';
import colorSchemesCode from './demos/color-schemes.md?raw';
import containersCode from './demos/containers.md?raw';
import externalContentCode from './demos/external-content.md?raw';
import formsCode from './demos/forms.md?raw';
import navCode from './demos/nav.md?raw';
import offcanvasCode from './demos/offcanvas.md?raw';
import placementCode from './demos/placement.md?raw';
import responsiveCode from './demos/responsive.md?raw';
import scrollingCode from './demos/scrolling.md?raw';
import supportedContentCode from './demos/supported-content.md?raw';
import textCode from './demos/text.md?raw';
import {
  Navbar,
  NavbarBrand,
  NavbarCollapse,
  NavbarOffcanvas,
  NavbarText,
  NavbarToggle,
  useNavbar,
} from './index';
import navbarBrandPropsTypeCode from './types/navbar-brand-props.md?raw';
import navbarCollapsePropsTypeCode from './types/navbar-collapse-props.md?raw';
import navbarContextValueTypeCode from './types/navbar-context-value.md?raw';
import navbarExpandTypeCode from './types/navbar-expand.md?raw';
import navbarFixedTypeCode from './types/navbar-fixed.md?raw';
import navbarOffcanvasPlacementTypeCode from './types/navbar-offcanvas-placement.md?raw';
import navbarOffcanvasPropsTypeCode from './types/navbar-offcanvas-props.md?raw';
import navbarPropsTypeCode from './types/navbar-props.md?raw';
import navbarTextPropsTypeCode from './types/navbar-text-props.md?raw';
import navbarTogglePropsTypeCode from './types/navbar-toggle-props.md?raw';
import navbarVariantTypeCode from './types/navbar-variant.md?raw';

const OffcanvasDemoCloseButton = () => {
  const navbar = useNavbar();

  return <CloseButton aria-label="关闭" onClick={() => navbar?.onToggle()} />;
};

const navbarProps: ApiProp[] = [
  {
    component: 'Navbar',
    defaultValue: "'nav'",
    description: '根元素标签，默认渲染 `nav.navbar`',
    name: 'as',
    type: 'ElementType',
  },
  {
    component: 'Navbar',
    defaultValue: 'true',
    description:
      '折叠断点，控制导航栏在哪个屏幕尺寸以下折叠：`true` 渲染 `navbar-expand`（始终展开），`false` 不渲染展开类（始终可折叠），断点渲染 `navbar-expand-{breakpoint}`',
    name: 'expand',
    type: 'boolean | NavbarExpand',
  },
  {
    component: 'Navbar',
    defaultValue: '-',
    description:
      '受控展开状态，配合 onToggle 实现受控导航栏；未设置时由组件内部维护展开状态（初始为收起）',
    name: 'expanded',
    type: 'boolean',
  },
  {
    component: 'Navbar',
    defaultValue: '-',
    description:
      '展开状态变化回调，在 NavbarToggle 点击或 collapseOnSelect 收起时以新的 expanded 值触发',
    name: 'onToggle',
    type: '(expanded: boolean) => void',
  },
  {
    component: 'Navbar',
    defaultValue: '-',
    description: '选择回调，在导航栏内 Nav 后代的 NavLink 被选择时触发，用于执行导航后的附加操作',
    name: 'onSelect',
    type: '(eventKey: EventKey, event: SyntheticEvent) => void',
  },
  {
    component: 'Navbar',
    defaultValue: 'false',
    description:
      '移动端在 Nav 后代被选择后自动收起导航栏（等价于调用 onToggle(false)），适合点击链接后关闭菜单的场景',
    name: 'collapseOnSelect',
    type: 'boolean',
  },
  {
    component: 'Navbar',
    defaultValue: '-',
    description:
      '背景工具类，渲染 `bg-*` 类，常用 `dark`、`light`、`primary`、`body-tertiary`，也支持任意自定义背景类',
    name: 'bg',
    type: 'string',
  },
  {
    component: 'Navbar',
    defaultValue: '-',
    description:
      'Bootstrap 5.3 配色方案（如 `dark`），控制导航栏内链接、表单等内容的颜色，推荐代替已弃用的 variant',
    name: 'data-bs-theme',
    type: 'string',
  },
  {
    component: 'Navbar',
    defaultValue: '-',
    description:
      '视觉变体，渲染 `navbar-light`/`navbar-dark` 类；Bootstrap 5.3 已弃用，推荐改用 data-bs-theme',
    name: 'variant',
    type: 'NavbarVariant',
  },
  {
    component: 'Navbar',
    defaultValue: '-',
    description: '固定定位，渲染 `fixed-top`/`fixed-bottom` 类，导航栏随页面滚动保持在顶部或底部',
    name: 'fixed',
    type: 'NavbarFixed',
  },
  {
    component: 'Navbar',
    defaultValue: '-',
    description: '粘性定位，渲染 `sticky-top`/`sticky-bottom` 类，滚动经过后才固定在顶部或底部',
    name: 'sticky',
    type: 'NavbarFixed',
  },
  {
    component: 'Navbar',
    defaultValue: "'navigation'",
    description: '无障碍角色；as 渲染为 `nav` 时使用浏览器默认语义，渲染为其他元素时默认设置该角色',
    name: 'role',
    type: 'string',
  },
  {
    component: 'NavbarBrand',
    defaultValue: 'href ? a : span',
    description: '渲染的元素标签，默认设置了 href 渲染 `a`，否则渲染 `span`',
    name: 'as',
    type: 'ElementType',
  },
  {
    component: 'NavbarBrand',
    defaultValue: '-',
    description: '品牌链接地址，设置后默认渲染为 `a.navbar-brand`',
    name: 'href',
    type: 'string',
  },
  {
    component: 'NavbarCollapse',
    defaultValue: '-',
    description:
      '响应式折叠区内容，渲染 `div.collapse.navbar-collapse`，展开时由 Navbar 的 expanded 状态添加 `show` 类；桌面端由 `navbar-expand-*` 样式保持可见，移动端随 NavbarToggle 显示或隐藏',
    name: 'children',
    type: 'ReactNode',
  },
  {
    component: 'NavbarToggle',
    defaultValue: "'button'",
    description: '渲染的元素标签，默认渲染 `button.navbar-toggler`（自动设置 type="button"）',
    name: 'as',
    type: 'ElementType',
  },
  {
    component: 'NavbarToggle',
    defaultValue: "'Toggle navigation'",
    description: '折叠按钮的无障碍标签，写入 aria-label',
    name: 'label',
    type: 'string',
  },
  {
    component: 'NavbarToggle',
    defaultValue: '-',
    description: '自定义按钮内容，未设置时渲染默认的 `span.navbar-toggler-icon` 图标',
    name: 'children',
    type: 'ReactNode',
  },
  {
    component: 'NavbarText',
    defaultValue: "'span'",
    description: '渲染的元素标签，默认渲染 `span.navbar-text`',
    name: 'as',
    type: 'ElementType',
  },
  {
    component: 'NavbarOffcanvas',
    defaultValue: "'start'",
    description:
      '抽屉方向，渲染 `offcanvas-start`/`offcanvas-end`/`offcanvas-top`/`offcanvas-bottom`',
    name: 'placement',
    type: 'NavbarOffcanvasPlacement',
  },
  {
    component: 'NavbarOffcanvas',
    defaultValue: 'true',
    description:
      '遮罩配置：`true` 渲染可点击关闭的遮罩，`"static"` 渲染点击不关闭的遮罩，`false` 不渲染遮罩',
    name: 'backdrop',
    type: "boolean | 'static'",
  },
  {
    component: 'NavbarOffcanvas',
    defaultValue: 'true',
    description: '是否支持按下 Esc 关闭抽屉',
    name: 'keyboard',
    type: 'boolean',
  },
  {
    component: 'NavbarOffcanvas',
    defaultValue: 'false',
    description: '打开期间是否允许页面滚动，默认锁定页面滚动',
    name: 'scroll',
    type: 'boolean',
  },
  {
    component: 'NavbarOffcanvas',
    defaultValue: '300',
    description:
      '滑入/滑出过渡毫秒数，写入 `--bs-offcanvas-transition`；用户偏好减少动态效果时忽略',
    name: 'duration',
    type: 'number',
  },
  {
    component: 'NavbarOffcanvas',
    defaultValue: '-',
    description: '遮罩点击或 Esc 触发关闭时的回调，先收起导航栏再触发',
    name: 'onHide',
    type: '() => void',
  },
  {
    component: 'NavbarOffcanvas',
    defaultValue: '-',
    description: '过渡各阶段回调：onEnter/onEntering/onEntered/onExit/onExiting/onExited',
    name: 'onEnter…',
    type: '() => void',
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
    description: '透传原生元素属性（如 `id`、`style`、`aria-*` 等）',
    name: '...rest',
    type: 'HTMLAttributes',
  },
];

const navbarTypeDefinitions: ApiTypeDefinition[] = [
  {
    code: navbarExpandTypeCode,
    description: '导航栏折叠断点类型',
    name: 'NavbarExpand',
  },
  {
    code: navbarFixedTypeCode,
    description: '导航栏定位方式类型',
    name: 'NavbarFixed',
  },
  {
    code: navbarVariantTypeCode,
    description: '导航栏视觉变体类型',
    name: 'NavbarVariant',
  },
  {
    code: navbarOffcanvasPlacementTypeCode,
    description: '抽屉导航方向类型',
    name: 'NavbarOffcanvasPlacement',
  },
  {
    code: navbarPropsTypeCode,
    description: '导航栏组件属性接口',
    name: 'NavbarProps',
  },
  {
    code: navbarContextValueTypeCode,
    description: '导航栏上下文，供各子组件与 Nav 消费',
    name: 'NavbarContextValue',
  },
  {
    code: navbarBrandPropsTypeCode,
    description: '导航栏品牌组件属性接口',
    name: 'NavbarBrandProps',
  },
  {
    code: navbarCollapsePropsTypeCode,
    description: '导航栏折叠区组件属性接口',
    name: 'NavbarCollapseProps',
  },
  {
    code: navbarOffcanvasPropsTypeCode,
    description: '抽屉导航组件属性接口',
    name: 'NavbarOffcanvasProps',
  },
  {
    code: navbarTextPropsTypeCode,
    description: '导航栏文本组件属性接口',
    name: 'NavbarTextProps',
  },
  {
    code: navbarTogglePropsTypeCode,
    description: '折叠按钮组件属性接口',
    name: 'NavbarToggleProps',
  },
];

export const NavbarDoc = () => {
  const [expanded, setExpanded] = useState(false);

  const demoContent = (
    <>
      <DemoSection code={supportedContentCode} title="支持的内容">
        <Navbar bg="dark" data-bs-theme="dark">
          <div className="container-fluid">
            <NavbarBrand href="#navbar-supported-demo">Navbar</NavbarBrand>
            <Nav className="me-auto">
              <NavItem>
                <NavLink active href="#navbar-supported-demo">
                  首页
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink href="#navbar-supported-demo">功能</NavLink>
              </NavItem>
              <NavItem>
                <NavLink href="#navbar-supported-demo">价格</NavLink>
              </NavItem>
              <NavItem>
                <NavLink disabled href="#navbar-supported-demo">
                  禁用
                </NavLink>
              </NavItem>
            </Nav>
            {/* oxlint-disable-next-line jsx-a11y/prefer-tag-over-role */}
            <form className="d-flex" role="search">
              <input
                aria-label="搜索"
                className="form-control me-2"
                placeholder="搜索"
                type="search"
              />
              <Button className="text-nowrap" type="submit" variant="outline-success">
                搜索
              </Button>
            </form>
          </div>
        </Navbar>
        <p className="mb-0 mt-3 text-muted small">
          导航栏由 Navbar 容器加 Brand、Nav、表单与 Text 等子内容组成；Nav 渲染 `ul.nav`，配合
          `me-auto` 等 Flex 工具类即可排出常见布局
        </p>
      </DemoSection>

      <DemoSection code={brandCode} title="品牌 Brand">
        <Navbar className="bg-body-tertiary mb-3">
          <div className="container-fluid">
            <NavbarBrand href="#navbar-brand-demo">文本品牌</NavbarBrand>
          </div>
        </Navbar>
        <Navbar className="bg-body-tertiary">
          <div className="container-fluid">
            <NavbarBrand href="#navbar-brand-demo">
              <img
                alt="React Bootstrap 品牌 Logo"
                className="d-inline-block align-text-top"
                height="30"
                src="/android-chrome-192x192.png"
                width="30"
              />
              React Bootstrap
            </NavbarBrand>
          </div>
        </Navbar>
        <p className="mb-0 mt-3 text-muted small">
          NavbarBrand 渲染 `navbar-brand` 类；设置 href 后渲染为链接，也可以放入 Logo 图片与文案
        </p>
      </DemoSection>

      <DemoSection code={navCode} title="导航链接">
        <Navbar bg="dark" data-bs-theme="dark">
          <div className="container-fluid">
            <Nav className="me-auto">
              <NavItem>
                <NavLink active href="#navbar-nav-demo">
                  首页
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink href="#navbar-nav-demo">功能</NavLink>
              </NavItem>
              <NavItem>
                <NavLink href="#navbar-nav-demo">价格</NavLink>
              </NavItem>
              <NavItem>
                <NavLink disabled href="#navbar-nav-demo">
                  禁用
                </NavLink>
              </NavItem>
            </Nav>
          </div>
        </Navbar>
        <p className="mb-0 mt-3 text-muted small">
          导航栏内的 Nav 自动追加 `navbar-nav` 类，NavLink 自动携带 `nav-link` 类，激活链接渲染
          `active` 类并设置 `aria-current="page"`
        </p>
      </DemoSection>

      <DemoSection code={formsCode} title="表单与下拉菜单">
        <Navbar className="bg-body-tertiary mb-3">
          <div className="container-fluid">
            {/* oxlint-disable-next-line jsx-a11y/prefer-tag-over-role */}
            <form className="d-flex" role="search">
              <input
                aria-label="搜索"
                className="form-control me-2"
                placeholder="搜索"
                type="search"
              />
              <Button className="text-nowrap" type="submit" variant="outline-success">
                搜索
              </Button>
            </form>
          </div>
        </Navbar>
        <Navbar className="bg-body-tertiary">
          <div className="container-fluid justify-content-start">
            <Dropdown>
              <DropdownToggle id="navbar-dropdown-demo" variant="success">
                下拉菜单
              </DropdownToggle>
              <DropdownMenu>
                <DropdownItem href="#navbar-forms-demo">操作一</DropdownItem>
                <DropdownItem href="#navbar-forms-demo">操作二</DropdownItem>
                <DropdownDivider />
                <DropdownItem href="#navbar-forms-demo">另一个操作</DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </div>
        </Navbar>
        <p className="mb-0 mt-3 text-muted small">
          `d-flex` 表单与 Dropdown 等组件可以直接放入导航栏，配合容器类即可控制对齐方式
        </p>
      </DemoSection>

      <DemoSection code={textCode} title="文本">
        <Navbar className="bg-body-tertiary">
          <div className="container-fluid">
            <NavbarText>带内边距的导航栏文本</NavbarText>
          </div>
        </Navbar>
        <p className="mb-0 mt-3 text-muted small">
          NavbarText 渲染 `navbar-text` 类，为纯文本提供与导航栏一致的内边距与颜色
        </p>
      </DemoSection>

      <DemoSection code={colorSchemesCode} title="配色方案">
        <Navbar bg="dark" className="mb-3" data-bs-theme="dark">
          <div className="container-fluid">
            <NavbarBrand href="#navbar-colors-demo">深色导航栏</NavbarBrand>
          </div>
        </Navbar>
        <Navbar bg="primary" className="mb-3" data-bs-theme="dark">
          <div className="container-fluid">
            <NavbarBrand href="#navbar-colors-demo">主色导航栏</NavbarBrand>
          </div>
        </Navbar>
        <Navbar className="bg-body-tertiary">
          <div className="container-fluid">
            <NavbarBrand href="#navbar-colors-demo">浅色导航栏</NavbarBrand>
          </div>
        </Navbar>
        <p className="mb-0 mt-3 text-muted small">
          data-bs-theme 控制导航栏内容的配色，bg 提供背景色；variant 属性渲染的
          `navbar-light`/`navbar-dark` 在 Bootstrap 5.3 中已弃用，建议统一使用 data-bs-theme
        </p>
      </DemoSection>

      <DemoSection code={containersCode} title="容器">
        <Navbar className="bg-body-tertiary mb-3">
          <div className="container">
            <NavbarBrand href="#navbar-containers-demo">container 容器</NavbarBrand>
          </div>
        </Navbar>
        <Navbar className="bg-body-tertiary mb-3">
          <div className="container-fluid">
            <NavbarBrand href="#navbar-containers-demo">container-fluid 容器</NavbarBrand>
          </div>
        </Navbar>
        <Navbar className="bg-body-tertiary">
          <div className="container-md">
            <NavbarBrand href="#navbar-containers-demo">container-md 容器</NavbarBrand>
          </div>
        </Navbar>
        <p className="mb-0 mt-3 text-muted small">
          在 Navbar 内包裹 `container`、`container-fluid` 或 `container-{'{breakpoint}'}`
          即可按需求限制内容宽度
        </p>
      </DemoSection>

      <DemoSection code={placementCode} title="定位方式">
        <div
          className="border rounded mb-3 overflow-hidden"
          style={{ paddingTop: '4.5rem', transform: 'translateZ(0)' }}
        >
          <Navbar bg="dark" data-bs-theme="dark" fixed="top">
            <div className="container-fluid">
              <NavbarBrand href="#navbar-placement-demo">fixed-top 导航栏</NavbarBrand>
            </div>
          </Navbar>
          <div className="p-3">
            fixed-top 固定在区块顶部，内容通过预留的顶部间距避免被遮挡；实际页面中为 body 添加
            padding-top 即可。
          </div>
        </div>
        <div
          className="border rounded mb-3 overflow-hidden"
          style={{ paddingBottom: '4.5rem', transform: 'translateZ(0)' }}
        >
          <Navbar bg="dark" data-bs-theme="dark" fixed="bottom">
            <div className="container-fluid">
              <NavbarBrand href="#navbar-placement-demo">fixed-bottom 导航栏</NavbarBrand>
            </div>
          </Navbar>
          <div className="p-3">
            fixed-bottom 固定在区块底部，内容通过预留的底部间距避免被遮挡；实际页面中为 body 添加
            padding-bottom 即可。
          </div>
        </div>
        <div className="border rounded overflow-auto" style={{ height: 320 }}>
          <Navbar bg="dark" data-bs-theme="dark" sticky="top">
            <div className="container-fluid">
              <NavbarBrand href="#navbar-placement-demo">sticky-top 导航栏</NavbarBrand>
            </div>
          </Navbar>
          <div className="p-3">
            {Array.from({ length: 10 }, (_, index) => (
              <p className="mb-2" key={index}>
                滚动内容 {index + 1}，sticky-top 导航栏会吸附在滚动容器顶部。
              </p>
            ))}
          </div>
        </div>
        <p className="mb-0 mt-3 text-muted small">
          fixed 渲染 `fixed-top`/`fixed-bottom`（此处通过 transform
          容器演示固定效果，并预留了与导航栏 等高的间距避免遮挡内容），sticky 渲染
          `sticky-top`/`sticky-bottom`，在滚动容器中可观察真实的吸附行为
        </p>
      </DemoSection>

      <DemoSection code={scrollingCode} title="滚动导航">
        <Navbar bg="dark" data-bs-theme="dark" expand="md">
          <div className="container-fluid">
            <Nav
              className="navbar-nav-scroll"
              style={{ '--bs-scroll-height': '100px' } as CSSProperties}
            >
              <NavItem>
                <NavLink active href="#navbar-scrolling-demo">
                  首页
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink href="#navbar-scrolling-demo">链接 1</NavLink>
              </NavItem>
              <NavItem>
                <NavLink href="#navbar-scrolling-demo">链接 2</NavLink>
              </NavItem>
              <NavItem>
                <NavLink href="#navbar-scrolling-demo">链接 3</NavLink>
              </NavItem>
              <NavItem>
                <NavLink href="#navbar-scrolling-demo">链接 4</NavLink>
              </NavItem>
              <NavItem>
                <NavLink href="#navbar-scrolling-demo">链接 5</NavLink>
              </NavItem>
              <NavItem>
                <NavLink href="#navbar-scrolling-demo">链接 6</NavLink>
              </NavItem>
              <NavItem>
                <NavLink href="#navbar-scrolling-demo">链接 7</NavLink>
              </NavItem>
              <NavItem>
                <NavLink href="#navbar-scrolling-demo">链接 8</NavLink>
              </NavItem>
            </Nav>
          </div>
        </Navbar>
        <p className="mb-0 mt-3 text-muted small">
          给 Nav 添加 `navbar-nav-scroll` 类并设置 `--bs-scroll-height` 变量后，链接在 expand
          断点以下会改为纵向滚动；缩小窗口即可观察滚动效果
        </p>
      </DemoSection>

      <DemoSection code={responsiveCode} title="响应式行为">
        <Navbar bg="dark" data-bs-theme="dark" expand="lg">
          <div className="container-fluid">
            <NavbarBrand href="#navbar-responsive-demo">响应式导航栏</NavbarBrand>
            <NavbarToggle aria-controls="navbar-responsive-demo" />
            <NavbarCollapse id="navbar-responsive-demo">
              <Nav className="me-auto">
                <NavItem>
                  <NavLink active href="#navbar-responsive-demo">
                    首页
                  </NavLink>
                </NavItem>
                <NavItem>
                  <NavLink href="#navbar-responsive-demo">功能</NavLink>
                </NavItem>
                <NavItem>
                  <NavLink href="#navbar-responsive-demo">价格</NavLink>
                </NavItem>
              </Nav>
              {/* oxlint-disable-next-line jsx-a11y/prefer-tag-over-role */}
              <form className="d-flex" role="search">
                <input
                  aria-label="搜索"
                  className="form-control me-2"
                  placeholder="搜索"
                  type="search"
                />
                <Button className="text-nowrap" type="submit" variant="outline-success">
                  搜索
                </Button>
              </form>
            </NavbarCollapse>
          </div>
        </Navbar>
        <Navbar bg="dark" className="mb-3 mt-4" collapseOnSelect data-bs-theme="dark" expand="lg">
          <div className="container-fluid">
            <NavbarBrand href="#navbar-responsive-demo">collapseOnSelect</NavbarBrand>
            <NavbarToggle aria-controls="navbar-collapse-on-select-demo" />
            <NavbarCollapse id="navbar-collapse-on-select-demo">
              <Nav className="me-auto">
                <NavItem>
                  <NavLink active eventKey="home">
                    首页
                  </NavLink>
                </NavItem>
                <NavItem>
                  <NavLink eventKey="features">功能</NavLink>
                </NavItem>
                <NavItem>
                  <NavLink eventKey="pricing">价格</NavLink>
                </NavItem>
              </Nav>
            </NavbarCollapse>
          </div>
        </Navbar>
        <p className="mb-0 text-muted small">
          缩小窗口宽度即可看到折叠按钮：NavbarToggle 与 NavbarCollapse 通过 aria-controls/id
          互相关联，点击折叠按钮自动维护展开状态；设置 collapseOnSelect 后移动端点击 NavLink
          会自动收起导航栏
        </p>
      </DemoSection>

      <DemoSection code={externalContentCode} title="受控与外部内容">
        <Button
          className="mb-3"
          onClick={() => setExpanded((value) => !value)}
          variant="outline-dark"
        >
          外部按钮切换导航栏
        </Button>
        <Navbar
          bg="dark"
          data-bs-theme="dark"
          expand="lg"
          expanded={expanded}
          onToggle={setExpanded}
        >
          <div className="container-fluid">
            <NavbarBrand href="#navbar-external-demo">受控导航栏</NavbarBrand>
            <NavbarToggle aria-controls="navbar-external-demo" />
            <NavbarCollapse id="navbar-external-demo">
              <Nav className="me-auto">
                <NavItem>
                  <NavLink active href="#navbar-external-demo">
                    首页
                  </NavLink>
                </NavItem>
                <NavItem>
                  <NavLink href="#navbar-external-demo">功能</NavLink>
                </NavItem>
                <NavItem>
                  <NavLink href="#navbar-external-demo">价格</NavLink>
                </NavItem>
              </Nav>
            </NavbarCollapse>
          </div>
        </Navbar>
        <p className="mb-0 mt-3 text-muted small">
          传入 expanded 与 onToggle 后导航栏变为受控组件，展开状态完全由外部 state 决定，
          因此可以在导航栏之外的任意位置控制其展开与收起
        </p>
      </DemoSection>

      <DemoSection code={offcanvasCode} title="Offcanvas 抽屉导航">
        <Navbar bg="dark" data-bs-theme="dark" expand="lg">
          <div className="container-fluid">
            <NavbarBrand href="#navbar-offcanvas-demo">Offcanvas 导航栏</NavbarBrand>
            <NavbarToggle aria-controls="navbar-offcanvas-demo" />
            <NavbarOffcanvas
              aria-labelledby="navbar-offcanvas-demo-label"
              id="navbar-offcanvas-demo"
              placement="end"
            >
              <div className="offcanvas-header">
                <h5 className="offcanvas-title" id="navbar-offcanvas-demo-label">
                  Offcanvas
                </h5>
                <OffcanvasDemoCloseButton />
              </div>
              <div className="offcanvas-body">
                <Nav className="justify-content-end flex-grow-1 pe-3">
                  <NavItem>
                    <NavLink active href="#navbar-offcanvas-demo">
                      首页
                    </NavLink>
                  </NavItem>
                  <NavItem>
                    <NavLink href="#navbar-offcanvas-demo">功能</NavLink>
                  </NavItem>
                  <NavItem>
                    <NavLink href="#navbar-offcanvas-demo">价格</NavLink>
                  </NavItem>
                  <NavItem>
                    <NavLink disabled href="#navbar-offcanvas-demo">
                      禁用
                    </NavLink>
                  </NavItem>
                </Nav>
                {/* oxlint-disable-next-line jsx-a11y/prefer-tag-over-role */}
                <form className="d-flex mt-3 mt-lg-0" role="search">
                  <input
                    aria-label="搜索"
                    className="form-control me-2"
                    placeholder="搜索"
                    type="search"
                  />
                  <Button className="text-nowrap" type="submit" variant="outline-success">
                    搜索
                  </Button>
                </form>
              </div>
            </NavbarOffcanvas>
          </div>
        </Navbar>
        <p className="mb-0 mt-3 text-muted small">
          缩小窗口后点击折叠按钮，NavbarOffcanvas 会以抽屉形式从右侧滑出（遮罩点击与 Esc
          均可关闭，打开期间锁定页面滚动）；头部关闭按钮通过 useNavbar 取得 onToggle
          收起导航栏。桌面端由 `navbar-expand-lg` 样式自动切换为内联布局；表单使用 `mt-3
          mt-lg-0`、Nav 使用 `pe-3` 保持两种布局下与导航的间距和对齐
        </p>
      </DemoSection>
    </>
  );

  return (
    <DocTemplate
      componentDescription="基于 Bootstrap 5 的导航栏组件，Navbar 系列（Navbar、NavbarBrand、NavbarCollapse、NavbarToggle、NavbarText、NavbarOffcanvas）用于构建响应式顶部导航，支持折叠断点、受控/非受控展开状态、选择后自动收起、配色方案、固定与粘性定位、滚动导航与抽屉式导航，可与 Nav、Dropdown、表单等组件自由组合"
      componentName="Navbar"
      componentTags={['基础', '导航']}
      demoContent={demoContent}
      props={navbarProps}
      typeDefinitions={navbarTypeDefinitions}
    />
  );
};

export default NavbarDoc;
