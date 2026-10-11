```typescript
export interface RichTextEditorHandle {
  focus: () => void;
  getEditor: () => Editor;
  getHTML: () => string;
  getJSON: () => NodeJSON;
  getMarkdown: () => string;
  getText: () => string;
  getView: () => EditorView | null;
  redo: () => void;
  setHTML: (html: string) => void;
  setJSON: (content: NodeJSON) => void;
  undo: () => void;
}
```
