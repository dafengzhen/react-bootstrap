```tsx
import { RichTextEditor } from '@dafengzhen/react-bootstrap/rich-text-editor';

export const Example = () => (
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
    upload={{
      file: {
        upload: async (file) => ({ name: file.name, url: URL.createObjectURL(file) }),
      },
      image: {
        upload: async (file) => ({ url: URL.createObjectURL(file) }),
      },
    }}
  />
);
```
