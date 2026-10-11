```tsx
import { useEffect, useRef } from 'react';
import {
  createEditorView,
  defaultDOMRules,
  Editor,
  extendedDOMRules,
  extendedKit,
  MediaKit,
  mediaDOMRules,
  mergeDOMRules,
  StarterKit,
  TableKit,
} from '@dafengzhen/react-bootstrap/rich-text-editor';

/**
 * 脱离 React 组件直接使用内核。
 *
 * `RichTextEditor` 已经封装了这些步骤；需要自定义节点、视图规则或把编辑器嵌入到
 * 非 React 的宿主页面时，可以像下面这样手动挂载。
 */
export const Example = () => {
  const hostRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const host = hostRef.current;

    if (!host) {
      return;
    }

    const editor = new Editor({
      content: {
        content: [{ content: [{ text: '手动挂载的编辑器', type: 'text' }], type: 'paragraph' }],
        type: 'doc',
      },
      extensions: [StarterKit, MediaKit, TableKit, extendedKit()],
    });
    const view = createEditorView(editor, {
      element: host,
      nodeViews: MediaKit.nodeViews,
      rules: mergeDOMRules(mergeDOMRules(defaultDOMRules(), mediaDOMRules()), extendedDOMRules()),
    });

    return () => {
      view.destroy();
      editor.destroy();
    };
  }, []);

  return <div ref={hostRef} style={{ border: '1px solid var(--bs-border-color)' }} />;
};
```
