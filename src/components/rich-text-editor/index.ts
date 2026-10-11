export { RichTextEditor } from './rich-text-editor';
export { ColorPicker } from './rich-text-editor-color-picker';
export type { ColorPickerProps } from './rich-text-editor-color-picker';
export { contrastColor, isColorValue, normalizeColor, rgbOf } from './rich-text-editor-color-utils';

export {
  editorCommands,
  editorKit,
  setCodeBlockLanguage,
  setLineHeight,
  setParagraphSpacing,
} from './rich-text-editor-commands';
export {
  RichTextEditorContext,
  useRichTextEditor,
  useRichTextEditorContext,
} from './rich-text-editor-context';

export {
  BLOCK_TYPE_CHOICES,
  CODE_LANGUAGE_CHOICES,
  DATE_FORMAT_CHOICES,
  EMOJI_GROUPS,
  FONT_FAMILY_CHOICES,
  FONT_SIZE_CHOICES,
  HIGHLIGHT_COLOR_GROUPS,
  LINE_HEIGHT_CHOICES,
  SPACING_CHOICES,
  SYMBOL_GROUPS,
  TEXT_COLOR_GROUPS,
} from './rich-text-editor-data';

export type {
  RichTextEditorChoice,
  RichTextEditorColorGroup,
  RichTextEditorEmojiGroup,
  RichTextEditorSpacingChoice,
  RichTextEditorSymbolGroup,
} from './rich-text-editor-data';
export { DateTimePanel } from './rich-text-editor-datetime';
export { RichTextEditorDialogs } from './rich-text-editor-dialogs';

export type { RichTextEditorDialogsProps } from './rich-text-editor-dialogs';
export {
  customBlockNode,
  dateNode,
  embedNode,
  emojiNode,
  EXTENDED_NODE_NAMES,
  extendedCommands,
  extendedDOMRules,
  extendedKit,
  extendedNodes,
  extendedNodeText,
  symbolNode,
} from './rich-text-editor-extensions';

export type { CustomBlockAttrs, EmojiAttrs, SymbolAttrs } from './rich-text-editor-extensions';
export { FocusToolbar } from './rich-text-editor-focus-toolbar';
export type { FocusToolbarProps } from './rich-text-editor-focus-toolbar';
export {
  defaultDOMRules,
  Editor,
  isSafeUrl,
  mediaDOMRules,
  MediaKit,
  mergeDOMRules,
  StarterKit,
  TableKit,
  uploadsOf,
} from './rich-text-editor-lib.ts';
export type {
  Attrs,
  EditorEvent,
  EditorLocale,
  EditorOptions,
  EditorState,
  EditorView,
  Extension,
  FileUploader,
  NodeJSON,
  UploadResult,
  UploadStatus,
  UploadTask,
} from './rich-text-editor-lib.ts';
export { EmojiPicker, SymbolPicker } from './rich-text-editor-pickers';
export { CommandButton, RichTextEditorToolbar } from './rich-text-editor-toolbar';
export type {
  RichTextEditorDialog,
  RichTextEditorToolbarAction,
  RichTextEditorToolbarActions,
} from './rich-text-editor-toolbar';
export { ToolbarButton, ToolbarGroup, ToolbarSeparator } from './rich-text-editor-toolbar-button';
export type { ToolbarButtonProps } from './rich-text-editor-toolbar-button';
export { ToolbarDropdown, ToolbarMenuItem } from './rich-text-editor-toolbar-dropdown';
export type {
  ToolbarDropdownProps,
  ToolbarMenuItemProps,
} from './rich-text-editor-toolbar-dropdown';

export { ToolbarPanelTrigger } from './rich-text-editor-toolbar-panel';
export type {
  RichTextEditorPanelBody,
  ToolbarPanelTriggerProps,
} from './rich-text-editor-toolbar-panel';

export {
  blockAt,
  findMatches,
  indentLevelOf,
  isEmptyDocument,
  lineHeightOf,
  marksAtSelection,
  nextMatchIndex,
  painterFrom,
  replaceAll,
  replaceMatch,
  selectedText,
  selectMatch,
  spacingOf,
} from './rich-text-editor-utils';
export type { BlockEntry, SearchMatch, SearchMode } from './rich-text-editor-utils';

export {
  formatDateTime,
  formatFileSize,
  isSafeMediaUrl,
  parseAudioUrl,
  parseVideoUrl,
} from './rich-text-editor-video.ts';
export type { RichTextEditorVideoProvider, VideoSource } from './rich-text-editor-video.ts';

export type {
  RichTextEditorContextValue,
  RichTextEditorFocusToolbarContext,
  RichTextEditorFormatPainter,
  RichTextEditorGalleryGroup,
  RichTextEditorHandle,
  RichTextEditorImage,
  RichTextEditorPanel,
  RichTextEditorProps,
} from './types';
