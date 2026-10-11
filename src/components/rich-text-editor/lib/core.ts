/**
 * Public API of the editor core.
 *
 * It is headless — no DOM, no framework, no third-party dependency — so the same code runs in the
 * browser, in Node, in an SSR pass and in a unit test. Sections are grouped by *what a caller is
 * trying to do*, not by the folder an implementation lives in:
 *
 * | Section | Answers |
 * | --- | --- |
 * | Editor | "How do I put an editor on screen?" |
 * | Extensions | "How do I add a node, a mark or a command?" |
 * | Document model | "How do I read or build a document?" |
 * | Schema | "How do I describe which documents are legal?" |
 * | Positions and selections | "Where in the document?" |
 * | Transform | "How do I describe a change?" |
 * | State and plugins | "How do I wire behaviour into the state?" |
 * | Commands | "What can be done to a document?" |
 * | History | "How is undo tracked?" |
 * | Serialization | "How do documents cross a boundary?" |
 * | Errors | "What went wrong?" |
 * | Utilities | "What small helper does a consumer get?" |
 *
 * The DOM half is the separate entry point `@dafengzhen/editor/view`, which registers itself with
 * the core when imported; only its type `EditorLocale` is taken here, so a headless build loads no
 * DOM code. Three rules keep the file readable: an exported name stays exported, since deprecation
 * is a documented alias with a removal version; no *value* is re-exported from `src/view`, which
 * lets a headless build import the core alone; and a type travels with its value.
 *
 * `@internal` on a value means it exists for the editor itself and may change.
 */

// ---------------------------------------------------------------------------
// Editor — the top level API a host application uses
// ---------------------------------------------------------------------------

export { setBlockType, setHeading, setParagraph, setTextAlign } from './command/block-commands.ts';
export { CommandManager, defineCommands } from './command/command-manager.ts';
export { chainCommands, commandGuard, commandWithDispatch } from './command/command.ts';

// ---------------------------------------------------------------------------
// Extensions — how a feature is packaged and registered
// ---------------------------------------------------------------------------

export type { Command, CommandMap } from './command/command.ts';
export { keyName } from './command/key-name.ts';
export {
  indent,
  insertHorizontalRule,
  outdent,
  toggleBlockquote,
  toggleBulletList,
  toggleCodeBlock,
  toggleOrderedList,
  toggleTaskList,
  wrapInList,
} from './command/list-commands.ts';
export {
  insertLink,
  markActive,
  marksInSelection,
  setMark,
  toggleMark,
  unsetLink,
  unsetMark,
} from './command/mark-commands.ts';
export {
  deleteNode,
  insertBlock,
  moveToNodeEdge,
  replaceNode,
  selectNode,
  updateNode,
} from './command/node-commands.ts';
export { Editor, hasViewModule, registerViewModule } from './editor.ts';
export type {
  EditorEvent,
  EditorEventHandler,
  EditorEventMap,
  EditorEvents,
  EditorOptions,
  EditorViewLike,
  ViewModule,
} from './editor.ts';

// ---------------------------------------------------------------------------
// Document model — nodes, marks, fragments and slices
// ---------------------------------------------------------------------------

export { compileExtensions, compileSchemaSpecs } from './extension/compiler.ts';
export type {
  CompiledExtensions,
  CompiledSchemaSpecs,
  ExtensionDiagnostic,
} from './extension/compiler.ts';
export {
  configureExtension,
  createExtensionContext,
  defineExtension,
  ExtensionManager,
} from './extension/extension.ts';
export type {
  AnyPlugin,
  BoundExtensionContext,
  CommandExtension,
  Extension,
  ExtensionContext,
  InputRule,
  Keymap,
  MarkExtension,
  NodeExtension,
  RuntimeExtensionContext,
  SchemaExtensionContext,
} from './extension/extension.ts';
export {
  setNamedMark,
  StarterKit,
  starterKit,
  toggleNamedMark,
  unsetNamedMark,
} from './extensions/starter-kit.ts';
export { createTable, TableKit } from './extensions/table.ts';
export type { TableTarget } from './extensions/table.ts';
export {
  canRedo,
  canUndo,
  GROUP_META,
  history,
  historyKey,
  REDO_META,
  RESTORE_META,
  setHistoryGroup,
  UNDO_META,
} from './history/history-plugin.ts';
export type { HistoryItem, HistoryOptions, HistoryState } from './history/history-plugin.ts';
export { BlockNode } from './model/block-node.ts';
export { findDiffStart, Fragment } from './model/fragment.ts';
export { MarkType } from './model/mark-type.ts';
export { isMarkInSet, Mark, markSetEqual, normalizeMarkSet } from './model/mark.ts';
export type { MarkJSON } from './model/mark.ts';

// ---------------------------------------------------------------------------
// Schema — which documents are legal
// ---------------------------------------------------------------------------

export { NodeRange } from './model/node-range.ts';
export { NODE_CONTAINER_SIZE, NodeStyle } from './model/node-size.ts';
export { NodeType, TEXT_NODE_NAME } from './model/node-type.ts';
export type { NodeContent } from './model/node-type.ts';
export { Node } from './model/node.ts';
export type { NodeJSON } from './model/node.ts';
export { Slice } from './model/slice.ts';
export type { SliceJSON } from './model/slice.ts';
export { isTextNode, TextNode } from './model/text-node.ts';
export { IteratorAction, NodeIterator } from './position/node-iterator.ts';

// ---------------------------------------------------------------------------
// Positions and selections — where in the document
// ---------------------------------------------------------------------------

export { resolveRange, sharedDepth } from './position/node-range.ts';
export { ResolvedPos, resolvePosition } from './position/resolved-pos.ts';
export { createAttrComputer } from './schema/attrs.ts';
export type { AttrSpec, AttrSpecs } from './schema/attrs.ts';
export { checkDocument, checkNode, isValidNode } from './schema/check.ts';
export type { ValidationCode, ValidationError } from './schema/check.ts';
export {
  ContentExpression,
  ContentMatch,
  parseContentExpression,
  quantifierRange,
} from './schema/content-expression.ts';
export type { Quantifier, TermSpec } from './schema/content-expression.ts';

// ---------------------------------------------------------------------------
// Transform — how a change is described
// ---------------------------------------------------------------------------

export type { MarkSpec } from './schema/mark-spec.ts';
export type { NodeSpec } from './schema/node-spec.ts';
export { Schema } from './schema/schema.ts';
export type { SchemaSpec } from './schema/schema.ts';
export { AllSelection } from './selection/all-selection.ts';
export { NodeSelection } from './selection/node-selection.ts';
export { resolveCautiously, Selection } from './selection/selection.ts';
export type { SelectionJSON } from './selection/selection.ts';
export { TextSelection } from './selection/text-selection.ts';
export { isAllowedUrl, linkAttrsFrom, parseHtml } from './serialization/html-parser.ts';
export {
  escapeAttribute,
  escapeText,
  serializeDocument,
  serializeNode,
} from './serialization/html-serializer.ts';
export type { SerializeOptions } from './serialization/html-serializer.ts';

// ---------------------------------------------------------------------------
// State and plugins — the state machine the editor runs on
// ---------------------------------------------------------------------------

export type {
  AttachmentAttrs,
  AudioAttrs,
  CodeBlockAttrs,
  CropInfo,
  DateAttrs,
  EmbedAttrs,
  EmbedProvider,
  FormulaAttrs,
  FormulaDisplay,
  FormulaFormat,
  HeadingAttrs,
  ImageAttrs,
  LinkAttrs,
  MentionAttrs,
  ParagraphAttrs,
  TableCellAttrs,
  TaskItemAttrs,
  VideoAttrs,
  VideoProvider,
} from './serialization/link.ts';
export { serializeMarkdown } from './serialization/markdown.ts';
export { LEAF_PLACEHOLDER, toPlainText } from './serialization/plain-text.ts';
export {
  ALLOWED_DATA_MIME_TYPES,
  attributePolicy,
  dataUrlPolicy,
  htmlPolicy,
  isSafeAttribute,
  isSafeDataUrl,
  isSafeUrl,
  sanitizeHtml,
  sanitizeMediaUrl,
  sanitizeUrl,
  SVG_DATA_MIME_TYPES,
  urlPolicy,
} from './serialization/sanitize.ts';
export type { UrlPolicyOptions } from './serialization/sanitize.ts';
export type { FileUploader, UploadResult, UploadStatus } from './serialization/types.ts';
export { EditorState } from './state/editor-state.ts';
export type { EditorStateConfig } from './state/editor-state.ts';

// ---------------------------------------------------------------------------
// Commands — what can be done to a document
// ---------------------------------------------------------------------------

export {
  assertStateInvariants,
  checkStateInvariants,
  documentProblems,
  isValidState,
} from './state/invariants.ts';
export type { StateInvariantProblem } from './state/invariants.ts';
export { PluginKey } from './state/plugin-key.ts';
export { createPlugin, isUserOrigin, Plugin, USER_ORIGIN } from './state/plugin.ts';
export type {
  EditorProps,
  KeyEventLike,
  PluginApplyContext,
  PluginSpec,
  PluginStateSpec,
  TransactionKind,
  TransactionOrigin,
} from './state/plugin.ts';
export { createTransaction, Transaction } from './state/transaction.ts';
export {
  deleteBackward,
  deleteForward,
  deleteSelection,
  insertText,
  joinBackward,
  joinForward,
  splitBlock,
} from './transform-commands/basic-editing.ts';
export { invertMap, Mapping } from './transform/mapping.ts';
export { applyMark } from './transform/mark-apply.ts';

// ---------------------------------------------------------------------------
// History — undo and redo
// ---------------------------------------------------------------------------

export { contentAsSlice, replaceStep } from './transform/replace.ts';
export type { ReplaceContent, ReplaceResult } from './transform/replace.ts';

// ---------------------------------------------------------------------------
// Serialization — how a document crosses a boundary
// ---------------------------------------------------------------------------

export { sliceBetween } from './transform/slice-building.ts';
export { StepMap } from './transform/step-map.ts';
export type { MapResult } from './transform/step-map.ts';
export { StepResult } from './transform/step-result.ts';
export type { StepFailure } from './transform/step-result.ts';
export {
  AddMarkStep,
  AttrStep,
  RemoveMarkStep,
  ReplaceStep,
  Step,
  textSlice,
} from './transform/step.ts';
export type { StepJSON } from './transform/step.ts';
export { Transform } from './transform/transform.ts';
export {
  CommandError,
  ConfigError,
  EditorError,
  ErrorCode,
  InvariantError,
  isEditorError,
  SchemaError,
  SerializationError,
  ViewError,
} from './util/errors.ts';

// ---------------------------------------------------------------------------
// Errors — how a caller tells what went wrong
// ---------------------------------------------------------------------------

export type { ErrorDetails } from './util/errors.ts';
export { deepEqual, matchesAttrs, stableStringify } from './util/object.ts';

// ---------------------------------------------------------------------------
// Utilities — small helpers that come with the model
// ---------------------------------------------------------------------------

export type { Attrs } from './util/object.ts';
export type { EditorLocale } from './view/locale.ts';
