```typescript
export interface RichTextEditorFocusToolbarContext {
  editor: Editor;
  node: NodeJSON;
  position: number;
  remove: () => boolean;
  update: (attrs: Attrs) => boolean;
}
```

`focusToolbar` 可为不同叶子节点返回控件，工具栏常驻在内容上方并独立占位，不依赖选中状态。
`update` 和 `remove` 通过编辑器事务执行，支持撤销。通用 `FocusToolbar` 的 `placement` 支持 `top` 和 `bottom`。
默认图片、视频及 iframe 工具栏支持调整宽度、恢复尺寸与删除；音频、附件和自定义卡片提供删除操作。
返回 `null` 可忽略某种节点；将 `focusToolbar` 设为 `false` 可关闭焦点工具栏。
