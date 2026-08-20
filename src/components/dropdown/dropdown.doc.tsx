import { useState } from 'react';

import {
  type ApiProp,
  type ApiTypeDefinition,
  DemoSection,
  DocTemplate,
} from '../../internal/doc-template';
import { Button } from '../button';
import alignmentCode from './demos/alignment.md?raw';
import autoCloseCode from './demos/auto-close.md?raw';
import basicCode from './demos/basic.md?raw';
import contentCode from './demos/content.md?raw';
import controlledCode from './demos/controlled.md?raw';
import darkCode from './demos/dark.md?raw';
import directionsCode from './demos/directions.md?raw';
import formsCode from './demos/forms.md?raw';
import itemsCode from './demos/items.md?raw';
import selectCode from './demos/select.md?raw';
import sizesCode from './demos/sizes.md?raw';
import splitCode from './demos/split.md?raw';
import {
  Dropdown,
  DropdownButton,
  DropdownDivider,
  DropdownHeader,
  DropdownItem,
  DropdownItemText,
  DropdownMenu,
  DropdownToggle,
  SplitButton,
} from './index';
import dropdownAlignOptionTypeCode from './types/dropdown-align-option.md?raw';
import dropdownAlignTypeCode from './types/dropdown-align.md?raw';
import dropdownAutoCloseTypeCode from './types/dropdown-auto-close.md?raw';
import dropdownButtonPropsTypeCode from './types/dropdown-button-props.md?raw';
import dropdownContextValueTypeCode from './types/dropdown-context-value.md?raw';
import dropdownDirectionTypeCode from './types/dropdown-direction.md?raw';
import dropdownDividerPropsTypeCode from './types/dropdown-divider-props.md?raw';
import dropdownHeaderPropsTypeCode from './types/dropdown-header-props.md?raw';
import dropdownItemPropsTypeCode from './types/dropdown-item-props.md?raw';
import dropdownItemTextPropsTypeCode from './types/dropdown-item-text-props.md?raw';
import dropdownMenuPropsTypeCode from './types/dropdown-menu-props.md?raw';
import dropdownMenuVariantTypeCode from './types/dropdown-menu-variant.md?raw';
import dropdownPositionConfigTypeCode from './types/dropdown-position-config.md?raw';
import dropdownPropsTypeCode from './types/dropdown-props.md?raw';
import dropdownTogglePropsTypeCode from './types/dropdown-toggle-props.md?raw';
import dropdownToggleSourceTypeCode from './types/dropdown-toggle-source.md?raw';
import eventKeyTypeCode from './types/event-key.md?raw';
import selectCallbackTypeCode from './types/select-callback.md?raw';
import splitButtonPropsTypeCode from './types/split-button-props.md?raw';
import toggleCallbackTypeCode from './types/toggle-callback.md?raw';

const dropdownProps: ApiProp[] = [
  {
    component: 'Dropdown',
    defaultValue: "'div'",
    description: '根元素标签',
    name: 'as',
    type: 'ElementType',
  },
  {
    component: 'Dropdown',
    defaultValue: '-',
    description:
      '菜单对齐，`"start"`/`"end"` 渲染 `dropdown-menu-start`/`dropdown-menu-end` 类；对象形式按断点生成响应式的 `dropdown-menu-{断点}-{对齐}` 类，`xs` 同时作为定位计算的基准对齐',
    name: 'align',
    type: 'DropdownAlignOption',
  },
  {
    component: 'Dropdown',
    defaultValue: 'true',
    description:
      '自动关闭策略：`true` 选择菜单项或点击外部都关闭；`"inside"` 仅选择菜单项时关闭；`"outside"` 仅点击外部时关闭；`false` 永不自动关闭',
    name: 'autoClose',
    type: 'DropdownAutoClose',
  },
  {
    component: 'Dropdown',
    defaultValue: 'false',
    description: '非受控模式下的初始展开状态',
    name: 'defaultShow',
    type: 'boolean',
  },
  {
    component: 'Dropdown',
    defaultValue: "'down'",
    description:
      '展开方向，`"up"`/`"up-centered"`/`"down"`/`"down-centered"`/`"start"`/`"end"` 分别渲染 `dropup`、`dropup dropup-center`、`dropdown`、`dropdown dropdown-center`、`dropstart`、`dropend` 类',
    name: 'drop',
    type: 'DropdownDirection',
  },
  {
    component: 'Dropdown',
    defaultValue: 'true',
    description: '是否允许菜单靠近视口边缘时翻转到相反方向',
    name: 'flip',
    type: 'boolean',
  },
  {
    component: 'Dropdown',
    defaultValue: 'false',
    description:
      '展开时是否聚焦第一个菜单项，`"keyboard"` 表示仅通过键盘（如回车激活触发按钮）展开时聚焦',
    name: 'focusFirstItemOnShow',
    type: "'keyboard' | boolean",
  },
  {
    component: 'Dropdown',
    defaultValue: '-',
    description: '选择回调，点击 DropdownItem 且事件未被阻止时触发',
    name: 'onSelect',
    type: 'SelectCallback',
  },
  {
    component: 'Dropdown',
    defaultValue: '-',
    description: '展开状态变化回调，配合 `show` 实现受控模式',
    name: 'onToggle',
    type: 'ToggleCallback',
  },
  {
    component: 'Dropdown',
    defaultValue: '-',
    description:
      '自定义定位配置，可分别覆盖 `flip`（是否允许翻转）、`offset`（[水平偏移, 间距] 元组，默认 `[0, 2]`）与 `padding`（与视口边缘的最小距离，默认 2）',
    name: 'popperConfig',
    type: 'DropdownPositionConfig',
  },
  {
    component: 'Dropdown',
    defaultValue: 'false',
    description: '是否在首次渲染时就挂载菜单，默认首次展开时才挂载',
    name: 'renderMenuOnMount',
    type: 'boolean',
  },
  {
    component: 'Dropdown',
    defaultValue: '-',
    description: '受控的展开状态，需配合 onToggle 更新',
    name: 'show',
    type: 'boolean',
  },
  {
    component: 'DropdownToggle',
    defaultValue: '-',
    description: '触发按钮标签，默认渲染 `button.btn.dropdown-toggle`',
    name: 'as',
    type: 'ElementType',
  },
  {
    component: 'DropdownToggle',
    defaultValue: '-',
    description: '按钮内容；split 模式下未设置时渲染无障碍隐藏标签',
    name: 'children',
    type: 'ReactNode',
  },
  {
    component: 'DropdownToggle',
    defaultValue: 'false',
    description: '禁用触发按钮',
    name: 'disabled',
    type: 'boolean',
  },
  {
    component: 'DropdownToggle',
    defaultValue: '-',
    description: '触发按钮 id，同时作为菜单的 `aria-labelledby` 关联',
    name: 'id',
    type: 'string',
  },
  {
    component: 'DropdownToggle',
    defaultValue: '-',
    description: '按钮尺寸，`lg`/`sm` 渲染 `btn-lg`/`btn-sm`',
    name: 'size',
    type: 'ButtonSize',
  },
  {
    component: 'DropdownToggle',
    defaultValue: 'false',
    description: '分割按钮模式，追加 `dropdown-toggle-split` 类并隐藏按钮文字',
    name: 'split',
    type: 'boolean',
  },
  {
    component: 'DropdownToggle',
    defaultValue: "'Toggle dropdown'",
    description: 'split 模式下屏幕阅读器可读的触发按钮标签',
    name: 'toggleLabel',
    type: 'string',
  },
  {
    component: 'DropdownToggle',
    defaultValue: "'button'",
    description: '渲染为按钮时的 type 属性',
    name: 'type',
    type: "'button' | 'reset' | 'submit'",
  },
  {
    component: 'DropdownToggle',
    defaultValue: '-',
    description: '按钮颜色变体',
    name: 'variant',
    type: 'ButtonVariant',
  },
  {
    component: 'DropdownMenu',
    defaultValue: '-',
    description: '菜单对齐，覆盖 Dropdown 的 align 设置',
    name: 'align',
    type: 'DropdownAlignOption',
  },
  {
    component: 'DropdownMenu',
    defaultValue: "'div'",
    description: '菜单容器标签，默认渲染 `div.dropdown-menu`，内置表单时可用 `as="form"`',
    name: 'as',
    type: 'ElementType',
  },
  {
    component: 'DropdownMenu',
    defaultValue: '-',
    description: '是否允许翻转，覆盖 Dropdown 的 flip 设置',
    name: 'flip',
    type: 'boolean',
  },
  {
    component: 'DropdownMenu',
    defaultValue: '-',
    description: '自定义定位配置，覆盖 Dropdown 的 popperConfig 设置',
    name: 'popperConfig',
    type: 'DropdownPositionConfig',
  },
  {
    component: 'DropdownMenu',
    defaultValue: 'false',
    description:
      '是否在首次渲染时挂载菜单，与 Dropdown 的 renderMenuOnMount 合并（任一为 true 即挂载）',
    name: 'renderOnMount',
    type: 'boolean',
  },
  {
    component: 'DropdownMenu',
    defaultValue: '-',
    description: '独立使用（不在 Dropdown 内）时手动控制展开状态',
    name: 'show',
    type: 'boolean',
  },
  {
    component: 'DropdownMenu',
    defaultValue: '-',
    description: '菜单变体，`"dark"` 渲染 `dropdown-menu-dark` 深色菜单类',
    name: 'variant',
    type: 'DropdownMenuVariant',
  },
  {
    component: 'DropdownItem',
    defaultValue: 'false',
    description: '激活状态，渲染 `active` 类与 `aria-current="true"`',
    name: 'active',
    type: 'boolean',
  },
  {
    component: 'DropdownItem',
    defaultValue: '-',
    description: '渲染的元素标签，设置了 `href` 默认渲染 `a`，否则渲染 `button`',
    name: 'as',
    type: 'ElementType',
  },
  {
    component: 'DropdownItem',
    defaultValue: 'false',
    description:
      '禁用状态，渲染 `disabled` 类与 `aria-disabled`；按钮同时设置原生 disabled 并移除 tabIndex',
    name: 'disabled',
    type: 'boolean',
  },
  {
    component: 'DropdownItem',
    defaultValue: '-',
    description: '关联 Dropdown onSelect 回调的 key，未设置时回调收到 null',
    name: 'eventKey',
    type: 'EventKey',
  },
  {
    component: 'DropdownItem',
    defaultValue: '-',
    description: '链接地址，设置后渲染为 `a` 标签',
    name: 'href',
    type: 'string',
  },
  {
    component: 'DropdownItem',
    defaultValue: '-',
    description: '选择回调，触发后事件继续冒泡到 Dropdown',
    name: 'onSelect',
    type: 'SelectCallback',
  },
  {
    component: 'DropdownItemText',
    defaultValue: "'span'",
    description: '渲染的元素标签，默认渲染 `span.dropdown-item-text` 纯文本条目',
    name: 'as',
    type: 'ElementType',
  },
  {
    component: 'DropdownHeader',
    defaultValue: "'h6'",
    description: '渲染的元素标签，默认渲染 `h6.dropdown-header` 分组标题',
    name: 'as',
    type: 'ElementType',
  },
  {
    component: 'DropdownDivider',
    defaultValue: "'hr'",
    description: '渲染的元素标签，默认渲染 `hr.dropdown-divider` 分割线',
    name: 'as',
    type: 'ElementType',
  },
  {
    component: 'DropdownButton',
    defaultValue: '-',
    description: '触发按钮文案',
    name: 'title',
    type: 'ReactNode',
  },
  {
    component: 'DropdownButton',
    defaultValue: 'false',
    description: '禁用触发按钮',
    name: 'disabled',
    type: 'boolean',
  },
  {
    component: 'DropdownButton',
    defaultValue: '-',
    description: '触发按钮 id，同时作为菜单的 `aria-labelledby` 关联',
    name: 'id',
    type: 'string',
  },
  {
    component: 'DropdownButton',
    defaultValue: '-',
    description: '菜单变体，透传给 DropdownMenu 的 variant',
    name: 'menuVariant',
    type: 'DropdownMenuVariant',
  },
  {
    component: 'DropdownButton',
    defaultValue: '-',
    description: '按钮尺寸，`lg`/`sm` 渲染 `btn-lg`/`btn-sm`',
    name: 'size',
    type: 'ButtonSize',
  },
  {
    component: 'DropdownButton',
    defaultValue: '-',
    description: '触发按钮的自定义类名',
    name: 'toggleClassName',
    type: 'string',
  },
  {
    component: 'DropdownButton',
    defaultValue: '-',
    description: '渲染为按钮时的 type 属性',
    name: 'type',
    type: "'button' | 'reset' | 'submit'",
  },
  {
    component: 'DropdownButton',
    defaultValue: '-',
    description: '按钮颜色变体',
    name: 'variant',
    type: 'ButtonVariant',
  },
  {
    component: 'DropdownButton',
    defaultValue: '-',
    description:
      '菜单内容，通常由 DropdownItem 等组成；其余 Dropdown 属性（align、autoClose、drop、flip、onSelect、onToggle、popperConfig、renderMenuOnMount、show、defaultShow 等）直接继承',
    name: 'children',
    type: 'ReactNode',
  },
  {
    component: 'SplitButton',
    defaultValue: '-',
    description: '主按钮链接，设置后主按钮渲染为 `a` 标签',
    name: 'href',
    type: 'string',
  },
  {
    component: 'SplitButton',
    defaultValue: '-',
    description: '分割箭头按钮的屏幕阅读器标签，透传给 DropdownToggle 的 toggleLabel',
    name: 'toggleLabel',
    type: 'string',
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

const dropdownTypeDefinitions: ApiTypeDefinition[] = [
  {
    code: eventKeyTypeCode,
    description: '菜单项事件 key 类型',
    name: 'EventKey',
  },
  {
    code: selectCallbackTypeCode,
    description: '选择回调函数类型',
    name: 'SelectCallback',
  },
  {
    code: toggleCallbackTypeCode,
    description: '展开状态变化回调函数类型',
    name: 'ToggleCallback',
  },
  {
    code: dropdownAlignTypeCode,
    description: '菜单对齐类型',
    name: 'DropdownAlign',
  },
  {
    code: dropdownAlignOptionTypeCode,
    description: '菜单对齐选项，支持按断点配置响应式对齐',
    name: 'DropdownAlignOption',
  },
  {
    code: dropdownAutoCloseTypeCode,
    description: '自动关闭策略类型',
    name: 'DropdownAutoClose',
  },
  {
    code: dropdownDirectionTypeCode,
    description: '展开方向类型',
    name: 'DropdownDirection',
  },
  {
    code: dropdownMenuVariantTypeCode,
    description: '菜单变体类型',
    name: 'DropdownMenuVariant',
  },
  {
    code: dropdownPositionConfigTypeCode,
    description: '自定义定位配置接口，用于覆盖翻转、偏移与视口边距',
    name: 'DropdownPositionConfig',
  },
  {
    code: dropdownToggleSourceTypeCode,
    description: '展开状态切换来源类型',
    name: 'DropdownToggleSource',
  },
  {
    code: dropdownPropsTypeCode,
    description: '下拉菜单容器组件属性接口',
    name: 'DropdownProps',
  },
  {
    code: dropdownTogglePropsTypeCode,
    description: '下拉触发按钮组件属性接口',
    name: 'DropdownToggleProps',
  },
  {
    code: dropdownMenuPropsTypeCode,
    description: '下拉菜单组件属性接口',
    name: 'DropdownMenuProps',
  },
  {
    code: dropdownItemPropsTypeCode,
    description: '下拉菜单项组件属性接口',
    name: 'DropdownItemProps',
  },
  {
    code: dropdownItemTextPropsTypeCode,
    description: '下拉纯文本条目组件属性接口',
    name: 'DropdownItemTextProps',
  },
  {
    code: dropdownHeaderPropsTypeCode,
    description: '下拉分组标题组件属性接口',
    name: 'DropdownHeaderProps',
  },
  {
    code: dropdownDividerPropsTypeCode,
    description: '下拉分割线组件属性接口',
    name: 'DropdownDividerProps',
  },
  {
    code: dropdownButtonPropsTypeCode,
    description: '下拉按钮快捷组件属性接口',
    name: 'DropdownButtonProps',
  },
  {
    code: splitButtonPropsTypeCode,
    description: '分割按钮快捷组件属性接口',
    name: 'SplitButtonProps',
  },
  {
    code: dropdownContextValueTypeCode,
    description: '下拉菜单上下文，供 DropdownToggle 与 DropdownMenu 等消费',
    name: 'DropdownContextValue',
  },
];

export const DropdownDoc = () => {
  const [controlledShow, setControlledShow] = useState(false);
  const [selected, setSelected] = useState('未选择');

  const demoContent = (
    <>
      <DemoSection code={basicCode} title="基础用法">
        <Dropdown>
          <DropdownToggle id="dropdown-basic-demo" variant="primary">
            下拉按钮
          </DropdownToggle>
          <DropdownMenu>
            <DropdownItem>操作</DropdownItem>
            <DropdownItem>另一个操作</DropdownItem>
            <DropdownItem>还有别的操作</DropdownItem>
          </DropdownMenu>
        </Dropdown>
        <p className="mb-0 mt-3 text-muted small">
          Dropdown 渲染 `div.dropdown`，DropdownToggle 渲染 `button.btn.dropdown-toggle`，
          DropdownMenu 渲染 `div.dropdown-menu`，展开时自动添加 `show` 类并设置 `aria-expanded`
        </p>
      </DemoSection>

      <DemoSection code={splitCode} title="分割按钮">
        <SplitButton id="dropdown-split-demo" title="分割按钮" variant="primary">
          <DropdownItem>操作</DropdownItem>
          <DropdownItem>另一个操作</DropdownItem>
          <DropdownItem>还有别的操作</DropdownItem>
        </SplitButton>
        <p className="mb-0 mt-3 text-muted small">
          SplitButton 渲染 `div.btn-group`，左侧主按钮触发 action，右侧箭头按钮（
          `dropdown-toggle-split`）展开菜单
        </p>
      </DemoSection>

      <DemoSection code={sizesCode} title="尺寸">
        <div className="d-flex flex-wrap gap-2">
          <DropdownButton
            id="dropdown-size-lg-demo"
            size="lg"
            title="大尺寸按钮"
            variant="secondary"
          >
            <DropdownItem>操作</DropdownItem>
            <DropdownItem>另一个操作</DropdownItem>
          </DropdownButton>
          <SplitButton
            id="dropdown-size-lg-split-demo"
            size="lg"
            title="大尺寸分割按钮"
            variant="secondary"
          >
            <DropdownItem>操作</DropdownItem>
            <DropdownItem>另一个操作</DropdownItem>
          </SplitButton>
          <DropdownButton
            id="dropdown-size-sm-demo"
            size="sm"
            title="小尺寸按钮"
            variant="secondary"
          >
            <DropdownItem>操作</DropdownItem>
            <DropdownItem>另一个操作</DropdownItem>
          </DropdownButton>
          <SplitButton
            id="dropdown-size-sm-split-demo"
            size="sm"
            title="小尺寸分割按钮"
            variant="secondary"
          >
            <DropdownItem>操作</DropdownItem>
            <DropdownItem>另一个操作</DropdownItem>
          </SplitButton>
        </div>
        <p className="mb-0 mt-3 text-muted small">
          size 分别渲染 `btn-lg`/`btn-sm` 类，与 Bootstrap 的按钮尺寸规则一致
        </p>
      </DemoSection>

      <DemoSection code={darkCode} title="深色菜单">
        <div className="d-flex flex-wrap gap-2">
          <DropdownButton
            id="dropdown-dark-demo"
            menuVariant="dark"
            title="深色下拉按钮"
            variant="secondary"
          >
            <DropdownItem active>激活项</DropdownItem>
            <DropdownItem>操作</DropdownItem>
            <DropdownItem>另一个操作</DropdownItem>
            <DropdownItem>还有别的操作</DropdownItem>
          </DropdownButton>
          <Dropdown>
            <DropdownToggle id="dropdown-dark-split-demo" variant="dark">
              深色按钮
            </DropdownToggle>
            <DropdownMenu variant="dark">
              <DropdownItem active>激活项</DropdownItem>
              <DropdownItem>操作</DropdownItem>
              <DropdownItem>另一个操作</DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </div>
        <p className="mb-0 mt-3 text-muted small">
          为 DropdownMenu 设置 variant=&quot;dark&quot;（或使用 DropdownButton 的 menuVariant）渲染
          `dropdown-menu-dark` 深色菜单
        </p>
      </DemoSection>

      <DemoSection code={directionsCode} title="展开方向">
        <div className="d-flex flex-wrap gap-2">
          <DropdownButton drop="up" id="dropdown-dropup-demo" title="向上展开" variant="secondary">
            <DropdownItem>操作</DropdownItem>
            <DropdownItem>另一个操作</DropdownItem>
          </DropdownButton>
          <DropdownButton
            drop="up-centered"
            id="dropdown-dropup-center-demo"
            title="居中向上"
            variant="secondary"
          >
            <DropdownItem>操作</DropdownItem>
            <DropdownItem>另一个操作</DropdownItem>
          </DropdownButton>
          <DropdownButton
            drop="down-centered"
            id="dropdown-dropdown-center-demo"
            title="居中向下"
            variant="secondary"
          >
            <DropdownItem>操作</DropdownItem>
            <DropdownItem>另一个操作</DropdownItem>
          </DropdownButton>
          <DropdownButton
            drop="end"
            id="dropdown-dropend-demo"
            title="向右展开"
            variant="secondary"
          >
            <DropdownItem>操作</DropdownItem>
            <DropdownItem>另一个操作</DropdownItem>
          </DropdownButton>
          <DropdownButton
            drop="start"
            id="dropdown-dropstart-demo"
            title="向左展开"
            variant="secondary"
          >
            <DropdownItem>操作</DropdownItem>
            <DropdownItem>另一个操作</DropdownItem>
          </DropdownButton>
        </div>
        <p className="mb-0 mt-3 text-muted small">
          drop 分别渲染 `dropup`、`dropup dropup-center`、`dropdown dropdown-center`、
          `dropend`、`dropstart` 类，箭头方向与菜单定位自动匹配
        </p>
      </DemoSection>

      <DemoSection code={itemsCode} title="菜单项">
        <Dropdown>
          <DropdownToggle id="dropdown-items-demo" variant="secondary">
            菜单项
          </DropdownToggle>
          <DropdownMenu>
            <DropdownItem>普通项</DropdownItem>
            <DropdownItem active>激活项</DropdownItem>
            <DropdownItem href="#dropdown-items-demo">链接项</DropdownItem>
            <DropdownItem disabled>禁用项</DropdownItem>
          </DropdownMenu>
        </Dropdown>
        <p className="mb-0 mt-3 text-muted small">
          active 渲染 `active` 类与 `aria-current`；disabled 渲染 `disabled` 类、 `aria-disabled`
          并移除 tabIndex；设置了 href 的菜单项渲染为 `a` 标签
        </p>
      </DemoSection>

      <DemoSection code={selectCode} title="选择回调">
        <Dropdown
          onSelect={(eventKey) => {
            if (eventKey != null) {
              setSelected(String(eventKey));
            }
          }}
        >
          <DropdownToggle id="dropdown-select-demo" variant="info">
            选择操作
          </DropdownToggle>
          <DropdownMenu>
            <DropdownItem eventKey="edit">编辑</DropdownItem>
            <DropdownItem eventKey="copy">复制</DropdownItem>
            <DropdownItem eventKey="delete">删除</DropdownItem>
          </DropdownMenu>
        </Dropdown>
        <p className="mb-0 mt-3 text-muted small">
          当前选择：{selected}。点击菜单项后 eventKey 通过 onSelect 回调传出，默认自动关闭菜单
        </p>
      </DemoSection>

      <DemoSection code={contentCode} title="菜单内容">
        <Dropdown>
          <DropdownToggle id="dropdown-content-demo" variant="secondary">
            菜单内容
          </DropdownToggle>
          <DropdownMenu>
            <DropdownHeader>标题分组</DropdownHeader>
            <DropdownItem>操作</DropdownItem>
            <DropdownItem>另一个操作</DropdownItem>
            <DropdownDivider />
            <DropdownItemText>一些纯文本内容，不是可点击的菜单项</DropdownItemText>
            <DropdownDivider />
            <DropdownItem>还有别的操作</DropdownItem>
          </DropdownMenu>
        </Dropdown>
        <p className="mb-0 mt-3 text-muted small">
          DropdownHeader 渲染 `h6.dropdown-header`，DropdownDivider 渲染
          `hr.dropdown-divider`，DropdownItemText 渲染 `span.dropdown-item-text`
        </p>
      </DemoSection>

      <DemoSection code={formsCode} title="表单菜单">
        <Dropdown>
          <DropdownToggle id="dropdown-form-demo" variant="secondary">
            表单菜单
          </DropdownToggle>
          <DropdownMenu as="form" className="p-4" onSubmit={(event) => event.preventDefault()}>
            <div className="mb-3">
              <label className="form-label" htmlFor="dropdown-form-email">
                邮箱地址
              </label>
              <input
                className="form-control"
                id="dropdown-form-email"
                placeholder="email@example.com"
                type="email"
              />
            </div>
            <div className="mb-3">
              <label className="form-label" htmlFor="dropdown-form-password">
                密码
              </label>
              <input
                className="form-control"
                id="dropdown-form-password"
                placeholder="Password"
                type="password"
              />
            </div>
            <div className="mb-3">
              <div className="form-check">
                <input className="form-check-input" id="dropdown-form-check" type="checkbox" />
                <label className="form-check-label" htmlFor="dropdown-form-check">
                  记住我
                </label>
              </div>
            </div>
            <Button type="submit" variant="primary">
              登录
            </Button>
          </DropdownMenu>
        </Dropdown>
        <p className="mb-0 mt-3 text-muted small">
          通过 as=&quot;form&quot; 将菜单渲染为表单，表单控件不是菜单项，交互不会触发自动关闭
        </p>
      </DemoSection>

      <DemoSection code={alignmentCode} title="菜单对齐">
        <div className="d-flex flex-wrap gap-2">
          <DropdownButton
            align="end"
            id="dropdown-align-end-demo"
            title="右对齐菜单"
            variant="secondary"
          >
            <DropdownItem>操作</DropdownItem>
            <DropdownItem>另一个操作</DropdownItem>
          </DropdownButton>
          <DropdownButton
            align={{ lg: 'end' }}
            id="dropdown-align-responsive-demo"
            title="响应式对齐（lg 以上右对齐）"
            variant="secondary"
          >
            <DropdownItem>操作</DropdownItem>
            <DropdownItem>另一个操作</DropdownItem>
          </DropdownButton>
        </div>
        <p className="mb-0 mt-3 text-muted small">
          align=&quot;end&quot; 渲染 `dropdown-menu-end` 类；对象形式按断点生成
          `dropdown-menu-lg-end` 等响应式类
        </p>
      </DemoSection>

      <DemoSection code={autoCloseCode} title="自动关闭策略">
        <div className="d-flex flex-wrap gap-2">
          <Dropdown autoClose id="dropdown-autoclose-true-demo">
            <DropdownToggle id="dropdown-autoclose-true-toggle" variant="secondary">
              默认（true）
            </DropdownToggle>
            <DropdownMenu>
              <DropdownItem>选择后关闭，外部点击也关闭</DropdownItem>
              <DropdownItem>另一个操作</DropdownItem>
            </DropdownMenu>
          </Dropdown>
          <Dropdown autoClose="inside" id="dropdown-autoclose-inside-demo">
            <DropdownToggle id="dropdown-autoclose-inside-toggle" variant="secondary">
              inside
            </DropdownToggle>
            <DropdownMenu>
              <DropdownItem>仅选择菜单项时关闭</DropdownItem>
              <DropdownItem>另一个操作</DropdownItem>
            </DropdownMenu>
          </Dropdown>
          <Dropdown autoClose="outside" id="dropdown-autoclose-outside-demo">
            <DropdownToggle id="dropdown-autoclose-outside-toggle" variant="secondary">
              outside
            </DropdownToggle>
            <DropdownMenu>
              <DropdownItem>仅点击外部时关闭</DropdownItem>
              <DropdownItem>另一个操作</DropdownItem>
            </DropdownMenu>
          </Dropdown>
          <Dropdown autoClose={false} id="dropdown-autoclose-false-demo">
            <DropdownToggle id="dropdown-autoclose-false-toggle" variant="secondary">
              false
            </DropdownToggle>
            <DropdownMenu>
              <DropdownItem>不会自动关闭</DropdownItem>
              <DropdownItem>另一个操作</DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </div>
        <p className="mb-0 mt-3 text-muted small">
          autoClose 控制菜单的关闭时机：true 为默认行为，inside/outside 分别只在菜单内/外触发，
          false 只能通过触发按钮或 Esc 键关闭
        </p>
      </DemoSection>

      <DemoSection code={controlledCode} title="受控模式">
        <div className="d-flex align-items-center gap-2">
          <Dropdown onToggle={(nextShow) => setControlledShow(nextShow)} show={controlledShow}>
            <DropdownToggle id="dropdown-controlled-toggle" variant="success">
              受控下拉
            </DropdownToggle>
            <DropdownMenu>
              <DropdownItem>操作</DropdownItem>
              <DropdownItem>另一个操作</DropdownItem>
            </DropdownMenu>
          </Dropdown>
          <Button onClick={() => setControlledShow((prev) => !prev)} variant="outline-secondary">
            外部切换
          </Button>
        </div>
        <p className="mb-0 mt-3 text-muted small">
          当前展开状态：{String(controlledShow)}。传入 show 后 Dropdown 变为受控组件，展开状态完全由
          onToggle 驱动的外部 state 决定
        </p>
      </DemoSection>
    </>
  );

  return (
    <DocTemplate
      componentDescription="基于 Bootstrap 5 的下拉菜单组件，Dropdown 系列（Dropdown、DropdownToggle、DropdownMenu、DropdownItem 等）用于在按钮旁弹出上下文菜单，支持分割按钮、尺寸调整、深色菜单、六个展开方向、菜单项激活/禁用状态、标题/分割线/纯文本、表单菜单、菜单对齐、自动关闭策略、受控模式与键盘导航"
      componentName="Dropdown"
      componentTags={['基础', '导航']}
      demoContent={demoContent}
      props={dropdownProps}
      typeDefinitions={dropdownTypeDefinitions}
    />
  );
};

export default DropdownDoc;
