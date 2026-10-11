import type { EditorView } from './editor-view.ts';
import type { NodeView, NodeViewContext } from './node-view.ts';

export interface ExternalToolbarAction {
  destructive?: boolean;
  label: string;
  run: () => void;
}

/** Host styling and accessible copy for attached controls. */
export interface ExternalToolbarOptions {
  ariaLabel?: string;
  gap?: number;
  zIndex?: number;
}

/** Attach controls outside the editable DOM, reserving space above the node for them. */
export function attachExternalToolbar(
  base: NodeView,
  context: NodeViewContext,
  label: string,
  actions: ({ element: HTMLElement } | ExternalToolbarAction)[],
  options: ExternalToolbarOptions = {},
): NodeView {
  const view = context.view as EditorView;
  const { document } = context;
  const window = document.defaultView!;
  const dom = base.dom;
  if (!view || !window) {
    return base;
  }
  dom.classList.add('rt-external-focus');
  dom.style.boxSizing = 'border-box';
  dom.setAttribute('data-node-selection', 'controls');
  const toolbar = document.createElement('div');
  toolbar.className = 'rt-external-toolbar';
  toolbar.style.position = 'fixed';
  toolbar.style.zIndex = String(options.zIndex ?? 90);
  toolbar.setAttribute('role', 'toolbar');
  toolbar.setAttribute('aria-label', options.ariaLabel ?? label);
  toolbar.hidden = true;
  const caption = document.createElement('span');
  caption.textContent = label;
  toolbar.append(caption);
  for (const action of actions) {
    if ('element' in action) {
      toolbar.append(action.element);
      continue;
    }
    const button = document.createElement('button');
    button.type = 'button';
    button.textContent = action.label;
    button.classList.toggle('toolbar-delete', action.destructive ?? false);
    button.addEventListener('click', action.run);
    toolbar.append(button);
  }
  document.body.append(toolbar);
  toolbar.addEventListener('pointerdown', (event) => {
    if ((event.target as Element).closest('button')) {
      event.preventDefault();
    }
  });
  const sync = () => {
    if (!dom.isConnected) {
      toolbar.hidden = true;
      return;
    }
    const rect = dom.getBoundingClientRect();
    toolbar.hidden = rect.bottom <= 0 || rect.top >= window.innerHeight;
    if (toolbar.hidden) {
      return;
    }
    toolbar.style.width = `${rect.width}px`;
    const height = toolbar.offsetHeight;
    dom.style.setProperty('--external-toolbar-space', `${height + (options.gap ?? 8)}px`);
    dom.style.paddingTop = `var(--external-toolbar-space)`;
    toolbar.style.left = `${rect.left}px`;
    toolbar.style.top = `${rect.top}px`;
  };
  const observer = new window.ResizeObserver(sync);
  observer.observe(dom);
  observer.observe(toolbar);
  window.addEventListener('scroll', sync, true);
  window.addEventListener('resize', sync);
  const offUpdate = view.editor.on('update', sync);
  const frame = window.requestAnimationFrame(() => {
    observer.observe(view.dom);
    sync();
  });
  return {
    ...base,
    destroy: () => {
      window.cancelAnimationFrame(frame);
      observer.disconnect();
      offUpdate();
      window.removeEventListener('scroll', sync, true);
      window.removeEventListener('resize', sync);
      toolbar.remove();
      base.destroy?.();
    },
  };
}
