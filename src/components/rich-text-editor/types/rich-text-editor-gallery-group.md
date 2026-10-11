```typescript
export interface RichTextEditorGalleryGroup {
  images: RichTextEditorImage[];
  label: string;
}

export interface RichTextEditorImage {
  alt?: string;
  height?: number;
  id: string;
  src: string;
  title?: string;
  width?: number;
}
```
