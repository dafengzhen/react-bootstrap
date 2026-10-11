import {
  type ApiProp,
  type ApiTypeDefinition,
  Blockquote,
  Code,
  DemoSection,
  DocTemplate,
  Kbd,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from '../..';
import basicCode from './demos/basic.md?raw';
import controlledCode from './demos/controlled.md?raw';
import customCode from './demos/custom.md?raw';
import editingCode from './demos/editing.md?raw';
import formattingCode from './demos/formatting.md?raw';
import insertCode from './demos/insert.md?raw';
import statesCode from './demos/states.md?raw';
import { RichTextEditor } from './rich-text-editor';
import contextValueTypeCode from './types/rich-text-editor-context-value.md?raw';
import galleryGroupTypeCode from './types/rich-text-editor-gallery-group.md?raw';
import handleTypeCode from './types/rich-text-editor-handle.md?raw';
import panelTypeCode from './types/rich-text-editor-panel.md?raw';
import propsTypeCode from './types/rich-text-editor-props.md?raw';

const richTextEditorProps: ApiProp[] = [
  {
    component: 'RichTextEditor',
    defaultValue: '-',
    description: '自定义类名，作用于编辑器根元素',
    name: 'className',
    type: 'string',
  },
  {
    component: 'RichTextEditor',
    defaultValue: '-',
    description:
      '初始文档，支持 HTML 字符串或 JSON 文档；挂载后修改该属性会替换整篇文档，未修改时不会干扰用户输入',
    name: 'content',
    type: 'NodeJSON | string',
  },
  {
    component: 'RichTextEditor',
    defaultValue: 'true',
    description: '是否可编辑；设为 `false` 时正文只读，工具栏按钮全部禁用',
    name: 'editable',
    type: 'boolean',
  },
  {
    component: 'RichTextEditor',
    defaultValue: 'StarterKit + MediaKit + TableKit + extendedKit',
    description: '编辑器扩展列表，传入后完全覆盖默认组合；节点、命令与快捷键都由该列表决定',
    name: 'extensions',
    type: 'Extension[]',
  },
  {
    component: 'RichTextEditor',
    defaultValue: '[]',
    description: '图片弹窗「图库」页签展示的图片分组',
    name: 'gallery',
    type: 'RichTextEditorGalleryGroup[]',
  },
  {
    component: 'RichTextEditor',
    defaultValue: 'false',
    description: '是否隐藏工具栏，仅保留可编辑正文',
    name: 'hideToolbar',
    type: 'boolean',
  },
  {
    component: 'RichTextEditor',
    defaultValue: '-',
    description: '写入 DOM 的文案（编辑区无障碍名称、`translate` 等）',
    name: 'locale',
    type: 'EditorLocale',
  },
  {
    component: 'RichTextEditor',
    defaultValue: '-',
    description: '文档变化后触发，入参为编辑器实例',
    name: 'onChange',
    type: '(editor: Editor) => void',
  },
  {
    component: 'RichTextEditor',
    defaultValue: '-',
    description: '文档变化后触发，入参为 HTML 字符串，便于受控表单直接保存',
    name: 'onHTMLChange',
    type: '(html: string) => void',
  },
  {
    component: 'RichTextEditor',
    defaultValue: '-',
    description: '空文档时展示的占位文案',
    name: 'placeholder',
    type: 'string',
  },
  {
    component: 'RichTextEditor',
    defaultValue: '-',
    description: '追加到工具栏末尾的额外控件',
    name: 'toolbarExtra',
    type: 'ReactNode',
  },
  {
    component: 'RichTextEditor',
    defaultValue: '-',
    description:
      '上传适配器，`image` 用于插入图片、`file` 用于插入附件；未提供时上传按钮不产生任何插入',
    name: 'upload',
    type: '{ file?: FileUploader; image?: FileUploader }',
  },
  {
    component: 'RichTextEditor',
    defaultValue: '-',
    description: '根元素的所有原生属性（如 `style`、`aria-*` 等）',
    name: '...rest',
    type: 'HTMLAttributes',
  },
  {
    component: 'ref',
    defaultValue: '-',
    description: '通过 `useRef<RichTextEditorHandle>` 读取文档、替换文档、撤销重做与聚焦',
    name: 'ref',
    type: 'Ref<RichTextEditorHandle>',
  },
  {
    component: 'ToolbarButton',
    defaultValue: '-',
    description: '无障碍名称，同时作为 tooltip 文本',
    name: 'title',
    type: 'string',
  },
  {
    component: 'ToolbarButton',
    defaultValue: 'false',
    description: '是否为激活态，对应 `aria-pressed` 与 Bootstrap 的 `active` 类',
    name: 'active',
    type: 'boolean',
  },
  {
    component: 'ToolbarButton',
    defaultValue: 'true',
    description:
      '按下时是否保持编辑器选区；默认 `true`，控件会取消 `pointerdown` 默认行为以免光标丢失',
    name: 'keepFocus',
    type: 'boolean',
  },
  {
    component: 'ToolbarButton',
    defaultValue: '-',
    description: 'tooltip 中追加的快捷键提示',
    name: 'shortcut',
    type: 'string',
  },
  {
    component: 'ToolbarDropdown',
    defaultValue: '-',
    description: '面板是否展开，组件为受控模式',
    name: 'open',
    type: 'boolean',
  },
  {
    component: 'ToolbarDropdown',
    defaultValue: '-',
    description: '面板开合回调',
    name: 'onOpenChange',
    type: '(open: boolean) => void',
  },
  {
    component: 'ToolbarDropdown',
    defaultValue: "'bottom-start'",
    description: '面板优先出现的位置；超出视口时自动翻转',
    name: 'placement',
    type: "'bottom-start' | 'bottom-end' | 'top-start'",
  },
  {
    component: 'ToolbarDropdown',
    defaultValue: '-',
    description: '面板宽度，数字按像素处理',
    name: 'width',
    type: 'number | string',
  },
  {
    component: 'ToolbarMenuItem',
    defaultValue: '-',
    description: '行标题内容',
    name: 'label',
    type: 'ReactNode',
  },
  {
    component: 'ToolbarMenuItem',
    defaultValue: 'false',
    description: '是否为当前值',
    name: 'active',
    type: 'boolean',
  },
  {
    component: 'ToolbarMenuItem',
    defaultValue: '-',
    description: '点击回调',
    name: 'onSelect',
    type: '() => void',
  },
  {
    component: 'ToolbarMenuItem',
    defaultValue: '-',
    description: '行首图标',
    name: 'icon',
    type: 'ReactNode',
  },
  {
    component: 'ToolbarMenuItem',
    defaultValue: '-',
    description: '行尾提示，例如快捷键或当前值',
    name: 'hint',
    type: 'ReactNode',
  },
  {
    component: 'ColorPicker',
    defaultValue: '-',
    description: '色板分组，来自 `TEXT_COLOR_GROUPS` / `HIGHLIGHT_COLOR_GROUPS` 或自定义',
    name: 'groups',
    type: 'RichTextEditorColorGroup[]',
  },
  {
    component: 'ColorPicker',
    defaultValue: '-',
    description: '选择颜色回调；传入空字符串表示清除该格式',
    name: 'onChange',
    type: '(color: string) => void',
  },
  {
    component: 'ColorPicker',
    defaultValue: '-',
    description: '当前颜色，用于高亮选中的色块',
    name: 'value',
    type: 'null | string',
  },
];

const richTextEditorTypeDefinitions: ApiTypeDefinition[] = [
  {
    code: propsTypeCode,
    description: '富文本编辑器组件属性接口',
    name: 'RichTextEditorProps',
  },
  {
    code: handleTypeCode,
    description: '通过 `ref` 暴露的命令式句柄',
    name: 'RichTextEditorHandle',
  },
  {
    code: contextValueTypeCode,
    description: '上下文值，可通过 `useRichTextEditor` 读取，自定义工具条按钮依赖它',
    name: 'RichTextEditorContextValue',
  },
  {
    code: galleryGroupTypeCode,
    description: '图库分组与图片描述',
    name: 'RichTextEditorGalleryGroup',
  },
  {
    code: panelTypeCode,
    description: '工具栏同时只会展开一个面板，面板标识即为此类型',
    name: 'RichTextEditorPanel',
  },
];

const shortcutRows: [string, string][] = [
  ['加粗', 'Ctrl + B'],
  ['斜体', 'Ctrl + I'],
  ['下划线', 'Ctrl + U'],
  ['删除线', 'Ctrl + Shift + X'],
  ['行内代码', 'Ctrl + E'],
  ['撤销 / 重做', 'Ctrl + Z / Ctrl + Shift + Z'],
  ['全选', 'Ctrl + A'],
  ['插入链接', 'Ctrl + K'],
  ['查找替换', 'Ctrl + F'],
  ['粘贴为纯文本', 'Ctrl + Shift + V'],
  ['格式刷', 'Ctrl + Shift + C'],
  ['换行不分段', 'Shift + Enter'],
];

export const RichTextEditorDoc = () => {
  const demoContent = (
    <>
      <DemoSection code={basicCode} title="基础用法">
        <RichTextEditor
          content="<p>Hello <strong>world</strong>，在这里开始写作…</p>"
          hideToolbar
          placeholder="请输入内容"
        />
        <p className="mb-0 mt-3 text-muted small">
          展示用示例隐藏了工具栏以便阅读；实际使用时工具栏默认渲染在正文上方，包含文本格式、
          段落对齐、缩进、行高、引用、代码块、分割线、插入与编辑操作共 40 余项功能
        </p>
      </DemoSection>

      <DemoSection code={formattingCode} title="文本格式与段落">
        <RichTextEditor
          content='<h2 style="text-align: center">文本格式与段落</h2><p>选中文字后使用工具栏：<strong>加粗</strong>、<em>斜体</em>、<u>下划线</u>、<s>删除线</s>、<code>行内代码</code>、<sup>上标</sup>、<sub>下标</sub>，以及字体、字号、文字颜色与背景高亮。</p><p style="text-align: right">这一段右对齐，工具栏还可以设置左对齐、居中与两端对齐。</p><blockquote><p>引用块用于强调他人的观点。</p></blockquote><ul><li><p>无序列表</p></li><li><p>第二条</p></li></ul><hr />'
          placeholder="请输入内容"
        />
        <p className="mb-0 mt-3 text-muted small">
          区块类型下拉可在正文与 H1–H6 之间切换，行高与段间距面板同时提供代码块语言选择；
          工具栏的每一项都是图标，名称与快捷键显示在悬浮提示中，选中面板里的选项后面板随即收起
        </p>
      </DemoSection>

      <DemoSection code={insertCode} title="插入内容">
        <RichTextEditor
          content="<p>使用工具栏的插入区域添加链接、图片、视频、音频、附件、表格、表情、符号、日期时间、代码片段与自定义卡片。</p><table><tr><td><p>把光标放进单元格</p></td><td><p>表格面板可以加行加列、合并与删除</p></td></tr></table>"
          gallery={[
            {
              images: [
                {
                  alt: '示例图一',
                  id: 'one',
                  src: 'https://picsum.photos/seed/one/640/360',
                  title: '图库图片一',
                },
                {
                  alt: '示例图二',
                  id: 'two',
                  src: 'https://picsum.photos/seed/two/640/360',
                  title: '图库图片二',
                },
              ],
              label: '示例图库',
            },
          ]}
          placeholder="请输入内容"
        />
        <p className="mb-0 mt-3 text-muted small">
          图片支持 URL、本地上传与图库三种来源；表情、符号、日期以原子节点写入文档，
          保留名称与时间戳以便检索与再次格式化
        </p>
      </DemoSection>

      <DemoSection code={editingCode} title="编辑操作">
        <RichTextEditor
          content="<p>试试 Ctrl+Z 撤销、Ctrl+Shift+Z 重做、Ctrl+F 查找替换、Ctrl+K 插入链接、Ctrl+Shift+C 格式刷。</p>"
          placeholder="请输入内容"
        />
        <p className="mb-0 mt-3 text-muted small">
          查找替换支持区分大小写、逐个替换与全部替换；格式刷先取样当前选区格式，再刷到目标选区
        </p>
      </DemoSection>

      <DemoSection code={controlledCode} title="受控与命令式调用">
        <RichTextEditor
          content="<h2>受控文档</h2><p>通过 ref 可以读取 HTML、JSON、Markdown 与纯文本，也可以整篇替换文档、撤销重做与聚焦。</p>"
          hideToolbar
        />
        <p className="mb-0 mt-3 text-muted small">
          组件内部持有唯一的编辑器实例，重复渲染不会丢失文档、撤销历史与光标位置
        </p>
      </DemoSection>

      <DemoSection code={statesCode} title="只读与无工具栏">
        <RichTextEditor
          content="<p>只读模式下工具栏按钮全部禁用，正文不可编辑，但仍可选中与复制。</p>"
          editable={false}
        />
        <RichTextEditor className="mt-3" hideToolbar placeholder="请输入内容" />
      </DemoSection>

      <DemoSection code={customCode} title="自定义与内核直用">
        <p className="mb-2 small">
          组件内部按 <Code>StarterKit + MediaKit + TableKit + extendedKit</Code> 组合扩展； 传入{' '}
          <Code>extensions</Code> 即可完全接管节点、命令与快捷键。需要自定义视图规则、
          节点视图或嵌入非 React 宿主页面时，可以直接使用无框架的内核。
        </p>
        <Blockquote className="mb-0">
          内置扩展节点包含 <Code>emoji</Code>、<Code>symbol</Code>、<Code>date</Code>、
          <Code>embed</Code> 与 <Code>custom_block</Code>，并导出对应的命令、DOM 规则与节点名。
        </Blockquote>
      </DemoSection>

      <h2 className="h5 mb-3 mt-4">快捷键</h2>
      <Table className="mb-0" size="sm" striped>
        <TableHead>
          <TableRow>
            <TableCell scope="col">功能</TableCell>
            <TableCell scope="col">快捷键</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {shortcutRows.map(([label, keys]) => (
            <TableRow key={label}>
              <TableCell>{label}</TableCell>
              <TableCell>
                <Kbd>{keys}</Kbd>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <p className="mb-0 mt-3 text-muted small">
        工具栏控件在按下时会取消 <Code>pointerdown</Code> 默认行为，因此命令始终作用于用户选中的
        区间；弹窗打开时记录选区，确认后恢复选区再执行命令，一次操作对应一步撤销
      </p>
    </>
  );

  return (
    <DocTemplate
      componentDescription="基于 Bootstrap 5 与内置无框架富文本内核的编辑器组件，提供文本格式、段落与对齐、缩进与行高、引用与代码块、链接与图片、媒体与表格、表情与符号、日期与自定义卡片等 40 余项功能，支持撤销重做、剪切复制粘贴、粘贴为纯文本、全选、查找替换与格式刷，并提供完整快捷键、受控用法、命令式句柄与扩展机制"
      componentName="RichTextEditor"
      componentTags={['基础', '表单', '编辑器']}
      demoContent={demoContent}
      props={richTextEditorProps}
      typeDefinitions={richTextEditorTypeDefinitions}
    />
  );
};

export default RichTextEditorDoc;
