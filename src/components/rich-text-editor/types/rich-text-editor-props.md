```typescript
export interface RichTextEditorProps extends Omit<
  HTMLAttributes<HTMLDivElement>,
  'content' | 'defaultValue' | 'onChange'
> {
  className?: string;
  content?: NodeJSON | string;
  editable?: boolean;
  extensions?: Extension[];
  gallery?: RichTextEditorGalleryGroup[];
  hideToolbar?: boolean;
  locale?: EditorLocale;
  onChange?: (editor: Editor) => void;
  onHTMLChange?: (html: string) => void;
  placeholder?: string;
  toolbarExtra?: ReactNode;
  focusToolbar?: false | ((context: RichTextEditorFocusToolbarContext) => ReactNode);
  upload?: { file?: FileUploader; image?: FileUploader };
}
```
