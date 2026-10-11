```tsx
import { RichTextEditor } from '@dafengzhen/react-bootstrap/rich-text-editor';

const content = `
  <h2 style="text-align: center">文本格式与段落</h2>
  <p>
    选中文字后使用工具栏：<strong>加粗</strong>、<em>斜体</em>、<u>下划线</u>、<s>删除线</s>、
    <code>行内代码</code>、<sup>上标</sup>、<sub>下标</sub>，以及字体、字号、文字颜色与背景高亮。
  </p>
  <p style="text-align: right">这一段右对齐，工具栏还可以设置左对齐、居中与两端对齐。</p>
  <blockquote><p>引用块用于强调他人的观点。</p></blockquote>
  <pre data-language="typescript"><code>const editor = new Editor({ extensions: [StarterKit] });</code></pre>
  <ul><li><p>无序列表</p></li><li><p>第二条</p></li></ul>
  <ol><li><p>有序列表</p></li><li><p>第二条</p></li></ol>
  <hr />
`;

export const Example = () => <RichTextEditor content={content} placeholder="请输入内容" />;
```
