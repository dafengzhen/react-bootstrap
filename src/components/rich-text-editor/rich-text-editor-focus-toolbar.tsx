import type { ReactNode } from 'react';

import { Trash2 } from 'lucide-react';
import { useLayoutEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

import type { EditorView } from './rich-text-editor-lib.ts';
import type { RichTextEditorFocusToolbarContext, RichTextEditorProps } from './types';

import { useRichTextEditor } from './rich-text-editor-context';
import { type Node as EditorNode } from './rich-text-editor-lib.ts';
import { ToolbarButton, ToolbarSeparator } from './rich-text-editor-toolbar-button';
import styles from './rich-text-editor.module.css';

export interface FocusToolbarProps {
  anchor: HTMLElement;
  children: ReactNode;
  label?: string;
  placement?: 'bottom' | 'top';
}

/** Persistent attached controls with reserved layout space, outside the editable document. */
export function FocusToolbar({
  anchor,
  children,
  label = 'Focus toolbar',
  placement = 'top',
}: FocusToolbarProps) {
  const toolbar = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(false);
  // Share the editor's scroll coordinate system so scrolling moves both elements in one paint.
  const container = anchor.closest<HTMLElement>('.rbs-rte-content');
  const portalTarget = container ?? anchor.ownerDocument.body;

  useLayoutEffect(() => {
    const document = anchor.ownerDocument;
    const window = document.defaultView;
    if (!window) {
      return;
    }
    const originalStyle = {
      display: anchor.style.display,
      marginBottom: anchor.style.marginBottom,
      marginTop: anchor.style.marginTop,
      minWidth: anchor.style.minWidth,
      paddingBottom: anchor.style.paddingBottom,
      paddingTop: anchor.style.paddingTop,
    };
    const computed = window.getComputedStyle(anchor);
    const inline = computed.display === 'inline' || computed.display === 'inline-block';
    const spaceProperty = inline
      ? placement === 'top'
        ? 'paddingTop'
        : 'paddingBottom'
      : placement === 'top'
        ? 'marginTop'
        : 'marginBottom';
    const initialSpace = Number.parseFloat(computed[spaceProperty]) || 0;
    if (inline) {
      anchor.style.setProperty('display', 'inline-block');
    }
    const place = () => {
      const element = toolbar.current;
      if (!element || !anchor.isConnected) {
        return;
      }
      const height = element.offsetHeight;
      const space = `${initialSpace + height + 6}px`;
      if (anchor.style[spaceProperty] !== space) {
        anchor.style.setProperty(
          spaceProperty === 'paddingTop'
            ? 'padding-top'
            : spaceProperty === 'paddingBottom'
              ? 'padding-bottom'
              : spaceProperty === 'marginTop'
                ? 'margin-top'
                : 'margin-bottom',
          space,
        );
      }
      if (inline) {
        // A tiny image still needs enough horizontal space for its controls.
        const minWidth = `${element.offsetWidth}px`;
        if (anchor.style.minWidth !== minWidth) {
          anchor.style.setProperty('min-width', minWidth);
        }
      }
      const rect = anchor.getBoundingClientRect();
      const x = rect.left;
      const y =
        placement === 'top'
          ? inline
            ? rect.top + initialSpace
            : rect.top - height - 6
          : inline
            ? rect.bottom - height - initialSpace
            : rect.bottom + 6;
      const origin = container?.getBoundingClientRect();
      element.style.setProperty(
        'left',
        `${origin ? x - origin.left - container!.clientLeft + container!.scrollLeft : x}px`,
      );
      element.style.setProperty(
        'top',
        `${origin ? y - origin.top - container!.clientTop + container!.scrollTop : y}px`,
      );
      setReady(true);
    };
    const observer = new window.ResizeObserver(place);
    observer.observe(anchor);
    observer.observe(anchor.closest('.rt-editor') ?? anchor.parentElement ?? anchor);
    if (toolbar.current) {
      observer.observe(toolbar.current);
    }
    place();
    window.addEventListener('resize', place);
    window.addEventListener('scroll', place, true);
    // Other nodes can move this anchor without changing its own dimensions.
    const mutationObserver = new window.MutationObserver(place);
    mutationObserver.observe(anchor.closest('.rt-editor') ?? anchor.parentElement ?? anchor, {
      attributes: true,
      characterData: true,
      childList: true,
      subtree: true,
    });
    return () => {
      observer.disconnect();
      window.removeEventListener('resize', place);
      window.removeEventListener('scroll', place, true);
      mutationObserver.disconnect();
      Object.assign(anchor.style, originalStyle);
    };
  }, [anchor, container, placement]);

  return createPortal(
    <div
      aria-label={label}
      className={`rbs-rte-focus-toolbar ${styles.focusToolbar}`}
      onPointerDown={(event) => {
        if ((event.target as Element).closest('button')) {
          event.preventDefault();
        }
      }}
      ref={toolbar}
      role="toolbar"
      style={{
        position: container ? 'absolute' : 'fixed',
        visibility: ready ? 'visible' : 'hidden',
      }}
    >
      {children}
    </div>,
    portalTarget,
  );
}

/** Connects document leaf nodes to persistent controls, including media and custom cards. */
export function NodeFocusToolbars({
  render,
  view,
}: {
  render?: RichTextEditorProps['focusToolbar'];
  view: EditorView | null;
}) {
  const { editable, editor, state } = useRichTextEditor();
  if (!editable || render === false || !view) {
    return null;
  }
  const toolbars: ReactNode[] = [];
  const visit = (parent: EditorNode, start: number) => {
    parent.forEach((node, offset) => {
      const position = start + offset;
      if (node.isLeaf && node.selectable && !node.isText) {
        toolbars.push(
          <NodeFocusToolbar
            editor={editor}
            key={`${position}-${node.name}`}
            node={node}
            position={position}
            render={render}
            view={view}
          />,
        );
      } else if (!node.isLeaf) {
        visit(node, position + 1);
      }
    });
  };
  visit(state.doc, 0);
  return toolbars;
}

/** Image actions are one consumer of the generic attached toolbar. */
function ImageFocusToolbar({
  context,
  width,
}: {
  context: RichTextEditorFocusToolbarContext;
  width: number;
}) {
  return (
    <>
      {[25, 50, 100].map((percent) => (
        <ToolbarButton
          className={styles.toolText}
          key={percent}
          onClick={() =>
            context.update({ height: null, width: Math.round((width * percent) / 100) })
          }
          title={`Image width ${percent}%`}
        >
          {percent}%
        </ToolbarButton>
      ))}
      <ToolbarButton
        className={styles.toolText}
        onClick={() => context.update({ height: null, width: null })}
        title="Original image size"
      >
        Original
      </ToolbarButton>
      <ToolbarSeparator />
      <ToolbarButton onClick={context.remove} title="Delete image">
        <Trash2 aria-hidden="true" />
      </ToolbarButton>
    </>
  );
}

function MediaFocusToolbar({
  context,
  width,
}: {
  context: RichTextEditorFocusToolbarContext;
  width: number;
}) {
  const resizable = context.node.type === 'video' || context.node.type === 'embed';
  return (
    <>
      {resizable ? (
        <>
          {[25, 50, 100].map((percent) => (
            <ToolbarButton
              className={styles.toolText}
              key={percent}
              onClick={() =>
                context.update({ height: null, width: Math.round((width * percent) / 100) })
              }
              title={`Media width ${percent}%`}
            >
              {percent}%
            </ToolbarButton>
          ))}
          <ToolbarButton
            className={styles.toolText}
            onClick={() => context.update({ height: null, width: null })}
            title="Original media size"
          >
            Original
          </ToolbarButton>
          <ToolbarSeparator />
        </>
      ) : null}
      <ToolbarButton
        onClick={context.remove}
        title={context.node.type === 'custom_block' ? 'Delete card' : 'Delete media'}
      >
        <Trash2 aria-hidden="true" />
      </ToolbarButton>
    </>
  );
}

function NodeFocusToolbar({
  editor,
  node,
  position,
  render,
  view,
}: {
  editor: RichTextEditorFocusToolbarContext['editor'];
  node: EditorNode;
  position: number;
  render?: Exclude<RichTextEditorProps['focusToolbar'], false>;
  view: EditorView;
}) {
  const dom = view.maps.docToDom.get(node);
  if (!dom || dom.nodeType !== 1) {
    return null;
  }
  const anchor = dom as HTMLElement;
  const context: RichTextEditorFocusToolbarContext = {
    editor,
    node: node.toJSON(),
    position,
    remove: () => {
      if (editor.state.doc.nodeStartingAt(position) !== node) {
        return false;
      }
      editor.focus();
      return editor.runNamedCommand('deleteNode', { pos: position });
    },
    update: (attrs) =>
      editor.runCommand((current, dispatch) => {
        // A stale toolbar must never update a different node after an outside edit.
        if (current.doc.nodeStartingAt(position) !== node) {
          return false;
        }
        const tr = current.tr.setNodeAttrs(position, node.type, attrs);
        if (!tr.docChanged) {
          return false;
        }
        // Attribute changes retain the text caret; the toolbar does not need a node selection.
        dispatch?.(tr.setMeta('historyGroup', 'focus-toolbar'));
        editor.focus();
        return true;
      }),
  };
  const controls = render ? (
    render(context)
  ) : node.name === 'image' ? (
    <ImageFocusToolbar context={context} width={view.dom.clientWidth} />
  ) : ['attachment', 'audio', 'custom_block', 'embed', 'video'].includes(node.name) ? (
    <MediaFocusToolbar context={context} width={view.dom.clientWidth} />
  ) : null;
  return controls ? (
    <FocusToolbar anchor={anchor} label={`${node.name} focus toolbar`}>
      {controls}
    </FocusToolbar>
  ) : null;
}
