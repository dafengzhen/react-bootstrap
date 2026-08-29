import { useState } from 'react';

import { type ApiProp, type ApiTypeDefinition, DemoSection, DocTemplate } from '../doc-template';
import basicCode from './demos/basic.md?raw';
import colorsCode from './demos/colors.md?raw';
import copyableCode from './demos/copyable.md?raw';
import customElementCode from './demos/custom-element.md?raw';
import defaultsCode from './demos/defaults.md?raw';
import editableCode from './demos/editable.md?raw';
import ellipsisExpandableCode from './demos/ellipsis-expandable.md?raw';
import ellipsisCode from './demos/ellipsis.md?raw';
import linkCode from './demos/link.md?raw';
import paragraphCode from './demos/paragraph.md?raw';
import textStylesCode from './demos/text-styles.md?raw';
import titleLevelsCode from './demos/title-levels.md?raw';
import typographyAutoSizeTypeCode from './types/typography-auto-size.md?raw';
import typographyColorTypeCode from './types/typography-color.md?raw';
import typographyCommonPropsTypeCode from './types/typography-common-props.md?raw';
import typographyContextValueTypeCode from './types/typography-context-value.md?raw';
import typographyCopyableTypeCode from './types/typography-copyable.md?raw';
import typographyEditableTypeCode from './types/typography-editable.md?raw';
import typographyEllipsisTypeCode from './types/typography-ellipsis.md?raw';
import typographyLinkPropsTypeCode from './types/typography-link-props.md?raw';
import typographyParagraphPropsTypeCode from './types/typography-paragraph-props.md?raw';
import typographyPropsTypeCode from './types/typography-props.md?raw';
import typographyTextPropsTypeCode from './types/typography-text-props.md?raw';
import typographyTitleLevelTypeCode from './types/typography-title-level.md?raw';
import typographyTitlePropsTypeCode from './types/typography-title-props.md?raw';
import { Typography } from './typography';
import { TypographyLink } from './typography-link';
import { TypographyParagraph } from './typography-paragraph';
import { TypographyText } from './typography-text';
import { TypographyTitle } from './typography-title';

const typographyProps: ApiProp[] = [
  {
    defaultValue: '-',
    description:
      '渲染的根元素类型，默认值随子组件变化：Title 为 h1–h6（由 level 决定）、Text 为 span、Paragraph 为 p、Link 为 a',
    name: 'as',
    type: 'ElementType',
  },
  {
    defaultValue: '-',
    description: '文本内容，可复制、可编辑与省略截断时会自动提取其中的纯文本',
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
    defaultValue: 'false',
    description: '是否以行内代码样式展示（等宽字体、强调色）',
    name: 'code',
    type: 'boolean',
  },
  {
    defaultValue: 'false',
    description: '是否可复制，配置对象支持自定义复制文本、提示文案与复制回调',
    name: 'copyable',
    type: 'TypographyCopyable',
  },
  {
    defaultValue: 'false',
    description: '是否显示删除线',
    name: 'delete',
    type: 'boolean',
  },
  {
    defaultValue: 'false',
    description: '是否禁用，文本变灰并显示不可用光标，同时隐藏复制按钮',
    name: 'disabled',
    type: 'boolean',
  },
  {
    defaultValue: 'false',
    description:
      '是否可编辑，点击文本进入编辑态：Text/Title/Link 渲染为 input，Paragraph 渲染为 textarea，回车（单行）或失焦保存，Esc 取消',
    name: 'editable',
    type: 'TypographyEditable',
  },
  {
    defaultValue: 'false',
    description: '文本超出时是否省略截断，配置对象支持行数、展开按钮与提示',
    name: 'ellipsis',
    type: 'TypographyEllipsis',
  },
  {
    defaultValue: 'false',
    description: '是否以斜体展示',
    name: 'italic',
    type: 'boolean',
  },
  {
    defaultValue: 'false',
    description: '是否以按键样式展示（复用 Kbd 组件）',
    name: 'keyboard',
    type: 'boolean',
  },
  {
    defaultValue: 'false',
    description: '是否以高亮样式展示',
    name: 'mark',
    type: 'boolean',
  },
  {
    defaultValue: 'false',
    description: '是否以次要文本样式展示',
    name: 'muted',
    type: 'boolean',
  },
  {
    defaultValue: 'false',
    description: '是否以加粗展示',
    name: 'strong',
    type: 'boolean',
  },
  {
    defaultValue: '-',
    description: '文本颜色变体，对应 Bootstrap 的 `text-*` 工具类',
    name: 'type',
    type: 'TypographyColor',
  },
  {
    defaultValue: 'false',
    description: '是否显示下划线',
    name: 'underline',
    type: 'boolean',
  },
  {
    defaultValue: '-',
    description: '根元素的所有原生属性（如 `style`、`onClick`、`aria-*` 等）',
    name: '...rest',
    type: 'HTMLAttributes',
  },
  {
    component: 'TypographyTitle',
    defaultValue: '1',
    description: '标题级别，对应 h1–h6 元素',
    name: 'level',
    type: 'TypographyTitleLevel',
  },
  {
    component: 'TypographyLink',
    defaultValue: '-',
    description: '链接地址，透传给 a 元素',
    name: 'href',
    type: 'string',
  },
];

const typographyTypeDefinitions: ApiTypeDefinition[] = [
  {
    code: typographyAutoSizeTypeCode,
    description: '可编辑 textarea 的自动尺寸配置',
    name: 'TypographyAutoSize',
  },
  {
    code: typographyColorTypeCode,
    description: '文本颜色变体类型',
    name: 'TypographyColor',
  },
  {
    code: typographyCommonPropsTypeCode,
    description: '各子组件共享的基础属性接口',
    name: 'TypographyCommonProps',
  },
  {
    code: typographyContextValueTypeCode,
    description: 'Typography 根组件通过 Context 提供的默认值类型',
    name: 'TypographyContextValue',
  },
  {
    code: typographyCopyableTypeCode,
    description: '可复制配置类型',
    name: 'TypographyCopyable',
  },
  {
    code: typographyEditableTypeCode,
    description: '可编辑配置类型',
    name: 'TypographyEditable',
  },
  {
    code: typographyEllipsisTypeCode,
    description: '省略截断配置类型',
    name: 'TypographyEllipsis',
  },
  {
    code: typographyLinkPropsTypeCode,
    description: '链接子组件属性类型',
    name: 'TypographyLinkProps',
  },
  {
    code: typographyParagraphPropsTypeCode,
    description: '段落子组件属性类型',
    name: 'TypographyParagraphProps',
  },
  {
    code: typographyPropsTypeCode,
    description: 'Typography 根组件属性接口',
    name: 'TypographyProps',
  },
  {
    code: typographyTextPropsTypeCode,
    description: '文本子组件属性类型',
    name: 'TypographyTextProps',
  },
  {
    code: typographyTitleLevelTypeCode,
    description: '标题级别类型',
    name: 'TypographyTitleLevel',
  },
  {
    code: typographyTitlePropsTypeCode,
    description: '标题子组件属性接口',
    name: 'TypographyTitleProps',
  },
];

export const TypographyDoc = () => {
  const [copyFeedback, setCopyFeedback] = useState('');
  const [editableValue, setEditableValue] = useState('');

  const demoContent = (
    <>
      <DemoSection code={basicCode} title="基础用法">
        <TypographyText>基础的文本展示组件，支持多种行内样式。</TypographyText>
      </DemoSection>

      <DemoSection code={titleLevelsCode} title="标题层级">
        <div className="d-flex flex-column gap-2">
          <TypographyTitle>一级标题 h1</TypographyTitle>
          <TypographyTitle level={2}>二级标题 h2</TypographyTitle>
          <TypographyTitle level={3}>三级标题 h3</TypographyTitle>
          <TypographyTitle level={4}>四级标题 h4</TypographyTitle>
          <TypographyTitle level={5}>五级标题 h5</TypographyTitle>
          <TypographyTitle level={6}>六级标题 h6</TypographyTitle>
        </div>
      </DemoSection>

      <DemoSection code={textStylesCode} title="行内文本样式">
        <div className="d-flex flex-column gap-2">
          <div>
            <TypographyText mark>mark 高亮文本</TypographyText>
          </div>
          <div>
            安装依赖：<TypographyText code>npm install</TypographyText>
          </div>
          <div>
            复制快捷键：<TypographyText keyboard>ctrl</TypographyText> +{' '}
            <TypographyText keyboard>c</TypographyText>
          </div>
          <div>
            <TypographyText strong>加粗文本</TypographyText> ·{' '}
            <TypographyText italic>斜体文本</TypographyText> ·{' '}
            <TypographyText underline>下划线文本</TypographyText> ·{' '}
            <TypographyText delete>删除线文本</TypographyText>
          </div>
          <div>
            <TypographyText muted>次要文本</TypographyText> ·{' '}
            <TypographyText disabled>禁用文本</TypographyText>
          </div>
        </div>
      </DemoSection>

      <DemoSection code={colorsCode} title="文本颜色">
        <div className="d-flex flex-column gap-2">
          <TypographyText type="primary">primary 主色文本</TypographyText>
          <TypographyText type="success">success 成功文本</TypographyText>
          <TypographyText type="danger">danger 危险文本</TypographyText>
          <TypographyText type="warning">warning 警告文本</TypographyText>
          <TypographyText type="info">info 信息文本</TypographyText>
          <TypographyText type="secondary">secondary 次要文本</TypographyText>
          <TypographyText className="d-inline-block bg-dark px-2" type="light">
            light 浅色文本（深色背景）
          </TypographyText>
          <TypographyText type="dark">dark 深色文本</TypographyText>
        </div>
      </DemoSection>

      <DemoSection code={paragraphCode} title="段落">
        <TypographyParagraph>
          React Bootstrap 是一个基于 Bootstrap 5 的 React 组件库，提供与原生 HTML
          一致的排版体验。段落组件默认渲染为 p 元素，自带段落间距。
        </TypographyParagraph>
        <TypographyParagraph className="mb-0">
          在段落中还可以自由混用其他行内元素：<TypographyText strong>加粗</TypographyText>、{' '}
          <TypographyText mark>高亮</TypographyText> 与{' '}
          <TypographyLink href="#links">链接</TypographyLink>。
        </TypographyParagraph>
      </DemoSection>

      <DemoSection code={linkCode} title="链接">
        <div className="d-flex flex-column gap-2">
          <div>
            <TypographyLink href="#links">默认链接</TypographyLink>
          </div>
          <div>
            <TypographyLink href="#links" underline>
              带下划线的链接
            </TypographyLink>
          </div>
          <div>
            <TypographyLink href="#links" type="success">
              成功色链接
            </TypographyLink>
          </div>
          <div>
            <TypographyLink href="#links" target="_blank">
              新窗口打开
            </TypographyLink>
          </div>
        </div>
      </DemoSection>

      <DemoSection code={copyableCode} title="可复制">
        <div className="d-flex flex-column gap-3">
          <TypographyText copyable>点击图标复制这段文本</TypographyText>
          <TypographyParagraph
            className="mb-0"
            copyable={{
              onCopy: (text) => setCopyFeedback(`已复制：${text}`),
              tooltips: ['点击复制', '复制成功'],
            }}
          >
            通过配置对象自定义复制文本、提示文案与回调。
          </TypographyParagraph>
          {copyFeedback !== '' && (
            <div className="small text-success">
              <strong>复制回调：</strong>
              {copyFeedback}
            </div>
          )}
        </div>
      </DemoSection>

      <DemoSection code={ellipsisCode} title="单行省略">
        <div className="d-flex flex-column gap-3">
          <TypographyText ellipsis style={{ maxWidth: 280 }}>
            这是一段很长的文本，超出一行时会被截断并以省略号结尾。
          </TypographyText>
          <TypographyText ellipsis={{ tooltip: true }} style={{ maxWidth: 280 }}>
            开启 tooltip 后，鼠标悬停在文本上可以查看完整内容。
          </TypographyText>
        </div>
      </DemoSection>

      <DemoSection code={ellipsisExpandableCode} title="多行省略与展开">
        <TypographyParagraph
          ellipsis={{
            expandable: true,
            rows: 2,
            symbol: (expanded) => (expanded ? '收起' : '展开'),
            tooltip: true,
          }}
          style={{ maxWidth: 420 }}
        >
          Bootstrap 由 Twitter 的 Mark Otto 和 Jacob Thornton 开发，最初命名为 Twitter
          Blueprint，后来在 2011 年 8 月作为开源项目发布。它提供了一系列 CSS 类与 JavaScript
          插件，用于快速构建响应式、移动优先的网页界面，是全球最流行的前端框架之一。
        </TypographyParagraph>
      </DemoSection>

      <DemoSection code={editableCode} title="可编辑">
        <div className="d-flex flex-column gap-3">
          <div>
            <TypographyText
              editable={{
                onChange: (value) => setEditableValue(value),
                tooltip: '点击编辑文本',
              }}
            >
              点击这段文本开始编辑
            </TypographyText>
            {editableValue !== '' && (
              <div className="small text-success mt-1">
                <strong>编辑结果：</strong>
                {editableValue}
              </div>
            )}
          </div>
          <TypographyParagraph editable={{ autoSize: { maxRows: 4, minRows: 1 } }}>
            段落也支持编辑，编辑时渲染为 textarea，按 Esc 取消、失焦保存。
          </TypographyParagraph>
        </div>
      </DemoSection>

      <DemoSection code={defaultsCode} title="组合与默认值">
        <Typography mark>
          <TypographyTitle level={4}>整组应用 mark 样式</TypographyTitle>
          <TypographyParagraph>
            通过 Typography 根组件为内部的 Title、Text、Paragraph、Link
            提供统一默认值，子组件仍可通过同名属性覆盖。
          </TypographyParagraph>
          <TypographyText>所有文本都会继承高亮样式。</TypographyText>
        </Typography>
      </DemoSection>

      <DemoSection code={customElementCode} title="自定义元素">
        <div className="d-flex flex-column gap-2 align-items-start">
          <TypographyTitle as="div">使用 div 渲染的标题</TypographyTitle>
          <TypographyText as="label">使用 label 渲染的文本</TypographyText>
          <TypographyParagraph as="blockquote">使用 blockquote 渲染的段落</TypographyParagraph>
          <TypographyLink as="button" onClick={() => setCopyFeedback('点击了按钮元素')}>
            使用 button 渲染的链接样式
          </TypographyLink>
        </div>
      </DemoSection>
    </>
  );

  return (
    <DocTemplate
      componentDescription="基于 Bootstrap 5 的排版组件套件，提供 TypographyTitle、TypographyText、TypographyParagraph 与 TypographyLink 子组件，支持标题层级、行内样式（mark/code/keyboard/strong/italic/underline/delete）、文本颜色、复制、省略截断（多行与展开）、可编辑以及通过根组件统一设置默认值"
      componentName="Typography"
      componentTags={['基础', '排版']}
      demoContent={demoContent}
      props={typographyProps}
      typeDefinitions={typographyTypeDefinitions}
    />
  );
};

export default TypographyDoc;
