import { useState } from 'react';

import { type ApiProp, type ApiTypeDefinition, DemoSection, DocTemplate } from '../doc-template';
import allowNewCode from './demos/allow-new.md?raw';
import basicCode from './demos/basic.md?raw';
import controlledCode from './demos/controlled.md?raw';
import customMenuCode from './demos/custom-menu.md?raw';
import highlightCode from './demos/highlight.md?raw';
import hintCode from './demos/hint.md?raw';
import multipleCode from './demos/multiple.md?raw';
import sizesCode from './demos/sizes.md?raw';
import statesCode from './demos/states.md?raw';
import { AutoComplete, AutoCompleteItem, AutoCompleteMenu } from './index';
import autoCompleteAlignTypeCode from './types/auto-complete-align.md?raw';
import autoCompleteAllowNewTypeCode from './types/auto-complete-allow-new.md?raw';
import autoCompleteContextValueTypeCode from './types/auto-complete-context-value.md?raw';
import autoCompleteFilterContextTypeCode from './types/auto-complete-filter-context.md?raw';
import autoCompleteHighlighterPropsTypeCode from './types/auto-complete-highlighter-props.md?raw';
import autoCompleteHintPropsTypeCode from './types/auto-complete-hint-props.md?raw';
import autoCompleteInputPropsTypeCode from './types/auto-complete-input-props.md?raw';
import autoCompleteItemPropsTypeCode from './types/auto-complete-item-props.md?raw';
import autoCompleteLabelKeyTypeCode from './types/auto-complete-label-key.md?raw';
import autoCompleteMenuItemRenderPropsTypeCode from './types/auto-complete-menu-item-render-props.md?raw';
import autoCompleteMenuPropsTypeCode from './types/auto-complete-menu-props.md?raw';
import autoCompleteOptionTypeCode from './types/auto-complete-option.md?raw';
import autoCompletePropsTypeCode from './types/auto-complete-props.md?raw';
import autoCompleteRenderPropsTypeCode from './types/auto-complete-render-props.md?raw';
import autoCompleteSelectHintTypeCode from './types/auto-complete-select-hint.md?raw';
import autoCompleteSizeTypeCode from './types/auto-complete-size.md?raw';
import autoCompleteTokenPropsTypeCode from './types/auto-complete-token-props.md?raw';

const states = [
  'Alabama',
  'Alaska',
  'Arizona',
  'Arkansas',
  'California',
  'Colorado',
  'Connecticut',
  'Delaware',
  'Florida',
  'Georgia',
  'Hawaii',
  'Idaho',
  'Illinois',
  'Indiana',
  'Iowa',
];

const autoCompleteProps: ApiProp[] = [
  {
    component: 'AutoComplete',
    defaultValue: "'justify'",
    description:
      '菜单对齐方式，`"justify"` 菜单与输入框等宽，`"left"`/`"right"` 分别对齐输入框的左/右边缘',
    name: 'align',
    type: 'AutoCompleteAlign',
  },
  {
    component: 'AutoComplete',
    defaultValue: 'false',
    description:
      '是否允许创建新选项，可传函数接收当前结果集与过滤上下文自行判断；新建选项仅加入选中列表，不会修改原始 options',
    name: 'allowNew',
    type: 'AutoCompleteAllowNew',
  },
  {
    component: 'AutoComplete',
    defaultValue: "'div'",
    description: '根元素标签',
    name: 'as',
    type: 'ElementType',
  },
  {
    component: 'AutoComplete',
    defaultValue: 'false',
    description: '组件挂载后自动聚焦输入框',
    name: 'autoFocus',
    type: 'boolean',
  },
  {
    component: 'AutoComplete',
    defaultValue: 'false',
    description: '是否区分大小写过滤选项',
    name: 'caseSensitive',
    type: 'boolean',
  },
  {
    component: 'AutoComplete',
    defaultValue: '-',
    description:
      '组件内容；传函数时接收渲染属性（activeIndex、getInputProps、isMenuShown、results 等）用于自定义组合',
    name: 'children',
    type: 'AutoCompleteRenderProps',
  },
  {
    component: 'AutoComplete',
    defaultValue: 'false',
    description: '有选中项时在输入框右侧显示清空按钮',
    name: 'clearButton',
    type: 'boolean',
  },
  {
    component: 'AutoComplete',
    defaultValue: '-',
    description: '根元素自定义类名',
    name: 'className',
    type: 'string',
  },
  {
    component: 'AutoComplete',
    defaultValue: "''",
    description: '非受控模式下的初始输入值',
    name: 'defaultInputValue',
    type: 'string',
  },
  {
    component: 'AutoComplete',
    defaultValue: 'false',
    description: '非受控模式下菜单初始是否展开',
    name: 'defaultOpen',
    type: 'boolean',
  },
  {
    component: 'AutoComplete',
    defaultValue: '[]',
    description: '非受控模式下的初始选中项',
    name: 'defaultSelected',
    type: 'T[]',
  },
  {
    component: 'AutoComplete',
    defaultValue: 'false',
    description: '禁用输入框',
    name: 'disabled',
    type: 'boolean',
  },
  {
    component: 'AutoComplete',
    defaultValue: 'false',
    description: '菜单向上展开，默认向下',
    name: 'dropup',
    type: 'boolean',
  },
  {
    component: 'AutoComplete',
    defaultValue: "'No matches found.'",
    description: '没有匹配结果时显示的提示内容',
    name: 'emptyLabel',
    type: 'ReactNode',
  },
  {
    component: 'AutoComplete',
    defaultValue: 'false',
    description: '菜单靠近视口边缘时是否翻转到相反方向',
    name: 'flip',
    type: 'boolean',
  },
  {
    component: 'AutoComplete',
    defaultValue: 'false',
    description: '只有一个结果时高亮该项并允许按回车直接选中，与 allowNew 同时设置时失效',
    name: 'highlightOnlyResult',
    type: 'boolean',
  },
  {
    component: 'AutoComplete',
    defaultValue: '-',
    description: '组件 id，用于 aria-owns/aria-activedescendant 关联与菜单 id，无障碍访问必需',
    name: 'id',
    type: 'string | number',
  },
  {
    component: 'AutoComplete',
    defaultValue: 'true',
    description: '过滤时是否忽略重音符号等变音标记',
    name: 'ignoreDiacritics',
    type: 'boolean',
  },
  {
    component: 'AutoComplete',
    defaultValue: '-',
    description: '直接透传给输入框的属性（onBlur、onChange、onFocus、onKeyDown 除外）',
    name: 'inputProps',
    type: 'AutoCompleteInputProps',
  },
  {
    component: 'AutoComplete',
    defaultValue: 'false',
    description: '无效校验状态，渲染 `is-invalid` 类',
    name: 'isInvalid',
    type: 'boolean',
  },
  {
    component: 'AutoComplete',
    defaultValue: 'false',
    description: '有效校验状态，渲染 `is-valid` 类',
    name: 'isValid',
    type: 'boolean',
  },
  {
    component: 'AutoComplete',
    defaultValue: "'label'",
    description: '选项的显示字段名或返回显示字符串的函数，字符串选项直接使用自身',
    name: 'labelKey',
    type: 'AutoCompleteLabelKey',
  },
  {
    component: 'AutoComplete',
    defaultValue: "'300px'",
    description: '菜单最大高度，超出后滚动',
    name: 'maxHeight',
    type: 'string',
  },
  {
    component: 'AutoComplete',
    defaultValue: '100',
    description: '菜单最多显示的结果数量',
    name: 'maxResults',
    type: 'number',
  },
  {
    component: 'AutoComplete',
    defaultValue: '0',
    description: '输入达到多少字符后才显示菜单',
    name: 'minLength',
    type: 'number',
  },
  {
    component: 'AutoComplete',
    defaultValue: 'false',
    description: '是否允许多选，选中项渲染为可删除的标签（AutoCompleteToken）',
    name: 'multiple',
    type: 'boolean',
  },
  {
    component: 'AutoComplete',
    defaultValue: "'New selection: '",
    description: '新建选项的展示前缀，仅 allowNew 生效时有效',
    name: 'newSelectionPrefix',
    type: 'ReactNode',
  },
  {
    component: 'AutoComplete',
    defaultValue: '-',
    description: '输入框失焦回调',
    name: 'onBlur',
    type: '(event) => void',
  },
  {
    component: 'AutoComplete',
    defaultValue: '-',
    description: '选中项增删时触发，接收最新选中项数组',
    name: 'onChange',
    type: '(selected: T[]) => void',
  },
  {
    component: 'AutoComplete',
    defaultValue: '-',
    description: '输入框聚焦回调',
    name: 'onFocus',
    type: '(event) => void',
  },
  {
    component: 'AutoComplete',
    defaultValue: '-',
    description: '输入值变化回调，接收当前文本与原生事件',
    name: 'onInputChange',
    type: '(text, event) => void',
  },
  {
    component: 'AutoComplete',
    defaultValue: '-',
    description: '输入框按键回调，在内部键盘导航处理之后触发',
    name: 'onKeyDown',
    type: '(event) => void',
  },
  {
    component: 'AutoComplete',
    defaultValue: '-',
    description: '菜单显隐变化回调',
    name: 'onMenuToggle',
    type: '(show: boolean) => void',
  },
  {
    component: 'AutoComplete',
    defaultValue: '-',
    description: '受控的菜单展开状态，优先级高于内部状态',
    name: 'open',
    type: 'boolean',
  },
  {
    component: 'AutoComplete',
    defaultValue: '-',
    description: '候选选项集，元素为字符串或对象',
    name: 'options',
    type: 'readonly T[]',
  },
  {
    component: 'AutoComplete',
    defaultValue: '-',
    description: '输入框占位文本',
    name: 'placeholder',
    type: 'string',
  },
  {
    component: 'AutoComplete',
    defaultValue: '-',
    description:
      '自定义输入渲染，接收输入框属性（含 inputRef/referenceElementRef）与渲染属性；多选时需自行渲染选中项',
    name: 'renderInput',
    type: '(inputProps, state) => ReactNode',
  },
  {
    component: 'AutoComplete',
    defaultValue: '-',
    description: '自定义菜单渲染，接收结果集、菜单属性（展开到 AutoCompleteMenu 或容器）与渲染属性',
    name: 'renderMenu',
    type: '(results, menuProps, state) => ReactNode',
  },
  {
    component: 'AutoComplete',
    defaultValue: '-',
    description: '自定义菜单项内容，接收选项、active/disabled 状态与索引',
    name: 'renderMenuItemChildren',
    type: '(option, props, index) => ReactNode',
  },
  {
    component: 'AutoComplete',
    defaultValue: '-',
    description: '自定义多选标签渲染，接收选项、标签属性与索引',
    name: 'renderToken',
    type: '(option, props, index) => ReactNode',
  },
  {
    component: 'AutoComplete',
    defaultValue: 'false',
    description:
      '是否显示输入提示（Hint），可按 Tab 或光标在末尾时按方向键右选中提示；传函数可在选中前自定义判断',
    name: 'selectHint',
    type: 'AutoCompleteSelectHint',
  },
  {
    component: 'AutoComplete',
    defaultValue: 'false',
    description: '存在提示时按回车直接选中提示项（第一个结果）',
    name: 'selectHintOnEnter',
    type: 'boolean',
  },
  {
    component: 'AutoComplete',
    defaultValue: '-',
    description: '受控的选中项数组',
    name: 'selected',
    type: 'T[]',
  },
  {
    component: 'AutoComplete',
    defaultValue: '-',
    description: '输入框尺寸，`lg`/`sm` 渲染 `form-control-lg`/`form-control-sm`',
    name: 'size',
    type: 'AutoCompleteSize',
  },
  {
    component: 'AutoCompleteMenu',
    defaultValue: "'div'",
    description: '菜单容器标签，默认渲染 `div.dropdown-menu`',
    name: 'as',
    type: 'ElementType',
  },
  {
    component: 'AutoCompleteMenu',
    defaultValue: "'No matches found.'",
    description: '没有子项时显示的提示内容',
    name: 'emptyLabel',
    type: 'ReactNode',
  },
  {
    component: 'AutoCompleteMenu',
    defaultValue: '-',
    description: '菜单 id，同时作为输入框 aria-owns 的关联目标',
    name: 'id',
    type: 'string',
  },
  {
    component: 'AutoCompleteMenu',
    defaultValue: "'300px'",
    description: '菜单最大高度，超出后滚动',
    name: 'maxHeight',
    type: 'string',
  },
  {
    component: 'AutoCompleteItem',
    defaultValue: '-',
    description: '激活状态，默认由菜单内 position 与当前激活索引比对得出',
    name: 'active',
    type: 'boolean',
  },
  {
    component: 'AutoCompleteItem',
    defaultValue: "'a'",
    description: '菜单项标签，默认渲染 `a.dropdown-item`',
    name: 'as',
    type: 'ElementType',
  },
  {
    component: 'AutoCompleteItem',
    defaultValue: '-',
    description: '菜单项内容，默认渲染高亮后的选项标签',
    name: 'children',
    type: 'ReactNode',
  },
  {
    component: 'AutoCompleteItem',
    defaultValue: '-',
    description: '禁用状态，默认读取选项的 disabled 字段',
    name: 'disabled',
    type: 'boolean',
  },
  {
    component: 'AutoCompleteItem',
    defaultValue: "'#'",
    description: '渲染为 `a` 标签时的链接地址',
    name: 'href',
    type: 'string',
  },
  {
    component: 'AutoCompleteItem',
    defaultValue: '-',
    description: '覆盖上下文的 labelKey，用于默认内容渲染',
    name: 'labelKey',
    type: 'AutoCompleteLabelKey',
  },
  {
    component: 'AutoCompleteItem',
    defaultValue: '-',
    description: '选择回调，事件未阻止时继续触发 AutoComplete 的选择逻辑',
    name: 'onSelect',
    type: '(option, event) => void',
  },
  {
    component: 'AutoCompleteItem',
    defaultValue: '-',
    description: '选项对象，选择时通过上下文提交给 AutoComplete',
    name: 'option',
    type: 'AutoCompleteOption',
  },
  {
    component: 'AutoCompleteItem',
    defaultValue: '-',
    description: '选项索引，用于激活状态与 aria-activedescendant 关联',
    name: 'position',
    type: 'number',
  },
  {
    component: 'AutoCompleteToken',
    defaultValue: '-',
    description: '标签内容，通常为选项的显示文本',
    name: 'children',
    type: 'ReactNode',
  },
  {
    component: 'AutoCompleteToken',
    defaultValue: 'false',
    description: '禁用标签，不显示移除按钮且不可交互',
    name: 'disabled',
    type: 'boolean',
  },
  {
    component: 'AutoCompleteToken',
    defaultValue: '-',
    description: '移除回调，设置后渲染移除按钮；聚焦标签时按退格键也可移除',
    name: 'onRemove',
    type: '() => void',
  },
  {
    component: 'AutoCompleteToken',
    defaultValue: '0',
    description: '标签的 tabIndex，仅在可移除时生效',
    name: 'tabIndex',
    type: 'number',
  },
  {
    component: 'AutoCompleteHint',
    defaultValue: '-',
    description: '被包裹的输入框元素，Hint 会在其后追加一层透明提示输入框',
    name: 'children',
    type: 'ReactNode',
  },
  {
    component: 'AutoCompleteHighlighter',
    defaultValue: '-',
    description: '要高亮的文本内容',
    name: 'children',
    type: 'string',
  },
  {
    component: 'AutoCompleteHighlighter',
    defaultValue: '-',
    description: '匹配文本的 mark 元素类名，默认加粗展示',
    name: 'className',
    type: 'string',
  },
  {
    component: 'AutoCompleteHighlighter',
    defaultValue: '-',
    description: '搜索文本，不区分大小写与变音标记匹配',
    name: 'search',
    type: 'string',
  },
  {
    defaultValue: '-',
    description: '透传原生元素属性（如 onClick、style 等）',
    name: '...rest',
    type: 'HTMLAttributes',
  },
];

const autoCompleteTypeDefinitions: ApiTypeDefinition[] = [
  {
    code: autoCompleteOptionTypeCode,
    description: '候选选项类型，支持字符串与对象',
    name: 'AutoCompleteOption',
  },
  {
    code: autoCompleteLabelKeyTypeCode,
    description: '选项显示字段名或显示函数类型',
    name: 'AutoCompleteLabelKey',
  },
  {
    code: autoCompleteAlignTypeCode,
    description: '菜单对齐方式类型',
    name: 'AutoCompleteAlign',
  },
  {
    code: autoCompleteAllowNewTypeCode,
    description: '新建选项策略类型',
    name: 'AutoCompleteAllowNew',
  },
  {
    code: autoCompleteSelectHintTypeCode,
    description: '输入提示选中策略类型',
    name: 'AutoCompleteSelectHint',
  },
  {
    code: autoCompleteSizeTypeCode,
    description: '输入框尺寸类型',
    name: 'AutoCompleteSize',
  },
  {
    code: autoCompleteFilterContextTypeCode,
    description: '过滤与新建判断的上下文接口',
    name: 'AutoCompleteFilterContext',
  },
  {
    code: autoCompleteRenderPropsTypeCode,
    description: '渲染属性接口，用于 children 函数与自定义渲染',
    name: 'AutoCompleteRenderProps',
  },
  {
    code: autoCompleteInputPropsTypeCode,
    description: '输入框属性接口，附加 inputRef/referenceElementRef 用于自定义渲染',
    name: 'AutoCompleteInputProps',
  },
  {
    code: autoCompleteMenuItemRenderPropsTypeCode,
    description: '菜单项自定义渲染时的状态属性接口',
    name: 'AutoCompleteMenuItemRenderProps',
  },
  {
    code: autoCompletePropsTypeCode,
    description: 'AutoComplete 组件属性接口',
    name: 'AutoCompleteProps',
  },
  {
    code: autoCompleteMenuPropsTypeCode,
    description: 'AutoCompleteMenu 组件属性接口',
    name: 'AutoCompleteMenuProps',
  },
  {
    code: autoCompleteItemPropsTypeCode,
    description: 'AutoCompleteItem 组件属性接口',
    name: 'AutoCompleteItemProps',
  },
  {
    code: autoCompleteTokenPropsTypeCode,
    description: 'AutoCompleteToken 组件属性接口',
    name: 'AutoCompleteTokenProps',
  },
  {
    code: autoCompleteHintPropsTypeCode,
    description: 'AutoCompleteHint 组件属性接口',
    name: 'AutoCompleteHintProps',
  },
  {
    code: autoCompleteHighlighterPropsTypeCode,
    description: 'AutoCompleteHighlighter 组件属性接口',
    name: 'AutoCompleteHighlighterProps',
  },
  {
    code: autoCompleteContextValueTypeCode,
    description: 'AutoComplete 上下文，供菜单项与提示框等消费',
    name: 'AutoCompleteContextValue',
  },
];

export const AutoCompleteDoc = () => {
  const [controlledSelected, setControlledSelected] = useState<string[]>([]);

  const demoContent = (
    <>
      <DemoSection code={basicCode} title="基础用法">
        <div style={{ maxWidth: 320 }}>
          <AutoComplete
            id="auto-complete-basic-demo"
            options={states}
            placeholder="选择一个州..."
          />
        </div>
        <p className="mb-0 mt-3 text-muted small">
          输入文字即过滤选项，支持方向键导航、回车选中、Esc 关闭，默认不区分大小写并忽略变音标记，
          匹配文本自动高亮
        </p>
      </DemoSection>

      <DemoSection code={multipleCode} title="多选模式">
        <div style={{ maxWidth: 480 }}>
          <AutoComplete
            id="auto-complete-multiple-demo"
            multiple
            options={states}
            placeholder="选择多个州..."
          />
        </div>
        <p className="mb-0 mt-3 text-muted small">
          multiple 模式将选中项渲染为标签，点击 × 移除；输入框为空时按退格键聚焦最后一个标签，
          再按退格键移除
        </p>
      </DemoSection>

      <DemoSection code={controlledCode} title="受控模式">
        <div style={{ maxWidth: 320 }}>
          <AutoComplete
            clearButton
            id="auto-complete-controlled-demo"
            onChange={setControlledSelected}
            options={states}
            placeholder="选择一个州..."
            selected={controlledSelected}
          />
        </div>
        <p className="mb-0 mt-3 text-muted small">
          当前选中：{controlledSelected.join('、') || '无'}。传入 selected 后变为受控组件，
          clearButton 在右侧显示清空按钮
        </p>
      </DemoSection>

      <DemoSection code={hintCode} title="输入提示">
        <div style={{ maxWidth: 320 }}>
          <AutoComplete
            id="auto-complete-hint-demo"
            options={states}
            placeholder="输入字母查看提示..."
            selectHint
            selectHintOnEnter
          />
        </div>
        <p className="mb-0 mt-3 text-muted small">
          selectHint 开启后，第一个匹配项以灰色提示展示；按 Tab、光标在末尾时按方向键右或按回车
          （selectHintOnEnter）直接选中提示
        </p>
      </DemoSection>

      <DemoSection code={allowNewCode} title="创建新选项">
        <div style={{ maxWidth: 320 }}>
          <AutoComplete
            allowNew
            id="auto-complete-allow-new-demo"
            newSelectionPrefix="新建选项："
            options={states}
            placeholder="输入不存在的选项..."
          />
        </div>
        <p className="mb-0 mt-3 text-muted small">
          没有精确匹配时菜单末尾出现带前缀的新建选项，选中后加入选中列表（不修改原始 options），
          可通过 onChange 感知
        </p>
      </DemoSection>

      <DemoSection code={highlightCode} title="匹配高亮">
        <div style={{ maxWidth: 320 }}>
          <AutoComplete
            id="auto-complete-highlight-demo"
            options={states}
            placeholder="搜索时自动高亮匹配文本..."
          />
        </div>
        <p className="mb-0 mt-3 text-muted small">
          默认菜单项使用 AutoCompleteHighlighter 渲染，匹配部分加粗展示； 也可用
          renderMenuItemChildren 完全自定义
        </p>
      </DemoSection>

      <DemoSection code={customMenuCode} title="自定义菜单">
        <div style={{ maxWidth: 320 }}>
          <AutoComplete
            id="auto-complete-custom-demo"
            minLength={2}
            options={states}
            placeholder="输入至少 2 个字符..."
            renderMenu={(results, menuProps) => (
              <AutoCompleteMenu {...menuProps}>
                <div className="dropdown-header">搜索建议（{results.length} 条）</div>
                {results.map((option, index) => (
                  <AutoCompleteItem key={index} option={option} position={index}>
                    <span>{option}</span>
                    <span className="ms-auto text-muted small">#{index + 1}</span>
                  </AutoCompleteItem>
                ))}
              </AutoCompleteMenu>
            )}
          />
        </div>
        <p className="mb-0 mt-3 text-muted small">
          renderMenu 接收结果集与菜单属性，配合 AutoCompleteMenu/AutoCompleteItem 组合自定义内容；
          minLength 限制输入长度，无结果时菜单显示 emptyLabel
        </p>
      </DemoSection>

      <DemoSection code={sizesCode} title="尺寸">
        <div className="d-flex flex-column gap-3" style={{ maxWidth: 320 }}>
          <AutoComplete
            id="auto-complete-size-lg-demo"
            options={states}
            placeholder="大尺寸"
            size="lg"
          />
          <AutoComplete
            id="auto-complete-size-sm-demo"
            options={states}
            placeholder="小尺寸"
            size="sm"
          />
        </div>
        <p className="mb-0 mt-3 text-muted small">
          size 分别渲染 `form-control-lg`/`form-control-sm` 类，与 Bootstrap 表单尺寸规则一致
        </p>
      </DemoSection>

      <DemoSection code={statesCode} title="禁用与校验状态">
        <div className="d-flex flex-column gap-3" style={{ maxWidth: 320 }}>
          <AutoComplete
            disabled
            id="auto-complete-disabled-demo"
            options={states}
            placeholder="禁用状态"
          />
          <AutoComplete
            id="auto-complete-valid-demo"
            isValid
            options={states}
            placeholder="有效状态"
          />
          <AutoComplete
            id="auto-complete-invalid-demo"
            isInvalid
            options={states}
            placeholder="无效状态"
          />
        </div>
        <p className="mb-0 mt-3 text-muted small">
          disabled 禁用输入框；isValid/isInvalid 渲染 `is-valid`/`is-invalid` 类并影响多选容器的
          聚焦样式
        </p>
      </DemoSection>
    </>
  );

  return (
    <DocTemplate
      componentDescription="基于 Bootstrap 5 的自动完成组件，AutoComplete 系列（AutoComplete、AutoCompleteMenu、AutoCompleteItem、AutoCompleteToken、AutoCompleteHint、AutoCompleteHighlighter）提供输入即搜索的候选下拉，支持单选/多选标签、键盘导航、输入提示、新建选项、匹配高亮、受控模式与自定义渲染"
      componentName="AutoComplete"
      componentTags={['基础', '表单']}
      demoContent={demoContent}
      props={autoCompleteProps}
      typeDefinitions={autoCompleteTypeDefinitions}
    />
  );
};

export default AutoCompleteDoc;
