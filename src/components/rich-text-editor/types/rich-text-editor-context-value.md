```typescript
export interface RichTextEditorContextValue {
  can: (name: string, options?: Attrs) => boolean;
  editable: boolean;
  editor: Editor;
  getAttributes: (name: string) => Attrs;
  isActive: (name: string, attrs?: Attrs) => boolean;
  run: (name: string, options?: Attrs) => boolean;
  state: EditorState;
}
```
