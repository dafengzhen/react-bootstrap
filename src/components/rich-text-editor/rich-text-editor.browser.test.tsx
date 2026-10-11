import { createRef } from 'react';
import { afterEach, describe, expect, it } from 'vitest';
import { cleanup, render } from 'vitest-browser-react';
import { page, userEvent } from 'vitest/browser';

import type { RichTextEditorHandle } from './types';

import { serializeRange } from './lib/view/clipboard.ts';
import { parseDOMElement } from './lib/view/dom-parser.ts';
import { defaultDOMRules, mergeDOMRules } from './lib/view/dom-rules.ts';
import { mediaDOMRules } from './lib/view/media-rules.ts';
import { RichTextEditor } from './rich-text-editor';
import { useRichTextEditor } from './rich-text-editor-context';
import { extendedDOMRules } from './rich-text-editor-extensions';
import { FocusToolbar } from './rich-text-editor-focus-toolbar';
import { parseIframeInput } from './rich-text-editor-iframe';
import { Editor as EditorClass, StarterKit } from './rich-text-editor-lib.ts';
import { ToolbarButton } from './rich-text-editor-toolbar-button';

afterEach(() => {
  cleanup();
});

/** The editable element the engine renders inside the component's content host. */
function editable(container: HTMLElement): HTMLElement {
  const element = container.querySelector('.rt-editor');

  if (!element) {
    throw new Error('the editor did not render an editable element');
  }

  return element as HTMLElement;
}

/**
 * Selects the whole text of the first block, the way a user dragging over it does.
 *
 * The editor is focused first: a control acts on the editor the keyboard is talking to, so a
 * selection that was made without putting the caret in the edit area is one no toolbar button will
 * act on.
 */
function selectFirstBlockText(container: HTMLElement, from = 0, to?: number): void {
  const element = editable(container);
  const range = document.createRange();
  const block = element.firstElementChild ?? element;

  element.focus();
  range.setStart(block.firstChild ?? block, from);
  range.setEnd(block.firstChild ?? block, to ?? (block.textContent ?? '').length);

  const selection = window.getSelection();

  selection?.removeAllRanges();
  selection?.addRange(range);
  document.dispatchEvent(new Event('selectionchange'));
}

describe('RichTextEditor', () => {
  it('attaches persistent controls above inserted custom cards and supports delete/undo', async () => {
    const ref = createRef<RichTextEditorHandle>();
    const screen = await render(<RichTextEditor content="<p>before</p>" ref={ref} />);
    selectFirstBlockText(screen.container as HTMLElement, 6, 6);
    await page.getByRole('button', { name: 'More insert options' }).click();
    await page.getByRole('button', { exact: true, name: 'Custom card' }).click();
    await page
      .getByRole('dialog')
      .getByRole('button', { exact: true, name: 'Custom card' })
      .click();
    await page.getByLabelText('Card title').fill('Poll');
    await page.getByLabelText('Card markup').fill('<div>Choose an option</div>');
    await page.getByRole('button', { exact: true, name: 'Insert' }).click();
    const root = editable(screen.container as HTMLElement);
    const card = root.querySelector<HTMLElement>('.rt-custom-block')!;
    const focus = page.getByRole('toolbar', { name: 'custom_block focus toolbar' });
    await expect.element(focus).toBeVisible();
    expect(card.getAttribute('data-card-title')).toBe('Poll');
    expect(card.getAttribute('data-html')).toBe('<div>Choose an option</div>');
    expect(root.querySelector('[role="toolbar"]')).toBeNull();
    expect(
      document.querySelector('.rbs-rte-focus-toolbar')!.getBoundingClientRect().bottom,
    ).toBeLessThanOrEqual(card.getBoundingClientRect().top);
    await focus.getByRole('button', { name: 'Delete card' }).click();
    expect(root.querySelector('.rt-custom-block')).toBeNull();
    expect(root.textContent).toBe('before');
    ref.current!.undo();
    await expect.element(focus).toBeVisible();
    expect(root.querySelector('.rt-custom-block')?.getAttribute('data-card-title')).toBe('Poll');
    ref.current!.redo();
    await expect.element(focus).not.toBeInTheDocument();
    expect(root.querySelector('.rt-custom-block')).toBeNull();
  });

  it.each([false, 'readonly'] as const)(
    'can disable custom card controls with %s',
    async (mode) => {
      const screen = await render(
        <RichTextEditor
          content={{
            content: [{ attrs: { html: '<p>Card</p>', title: 'Card' }, type: 'custom_block' }],
            type: 'doc',
          }}
          editable={mode !== 'readonly'}
          focusToolbar={mode === false ? false : undefined}
        />,
      );
      await expect
        .poll(() => editable(screen.container as HTMLElement).querySelector('.rt-custom-block'))
        .not.toBeNull();
      expect(
        screen.container.querySelector('[aria-label="custom_block focus toolbar"]'),
      ).toBeNull();
    },
  );

  it('keeps Bilibili iframe embed code as an iframe through insertion and HTML reload', async () => {
    const ref = createRef<RichTextEditorHandle>();
    const screen = await render(<RichTextEditor content="<p>media</p>" ref={ref} />);
    selectFirstBlockText(screen.container as HTMLElement, 5, 5);
    await page.getByRole('button', { name: 'More insert options' }).click();
    await page.getByRole('button', { exact: true, name: 'Video' }).click();
    await page.getByRole('button', { exact: true, name: 'Iframe' }).click();
    const source =
      'https://player.bilibili.com/player.html?isOutside=true&aid=117409105053246&bvid=BV1MWps6VEWW&cid=42566225415&p=1';
    await page
      .getByLabelText('Iframe URL or embed code')
      .fill(
        `<iframe src="${source.replace('https:', '')}" scrolling="no" border="0" frameborder="no" framespacing="0" allowfullscreen="true"></iframe>`,
      );
    await page.getByRole('button', { exact: true, name: 'Insert' }).click();
    const root = editable(screen.container as HTMLElement);
    await expect.poll(() => root.querySelector('iframe')?.getAttribute('src')).toBe(source);
    expect(root.querySelector('video')).toBeNull();
    const html = ref.current!.getHTML();
    expect(root.querySelector('iframe')?.getAttribute('sandbox')).toContain('allow-same-origin');
    expect(
      root
        .querySelector('iframe')
        ?.getAttribute('allow')
        ?.split(';')
        .map((value) => value.trim()),
    ).not.toContain('fullscreen');
    expect(html).toContain('sandbox="allow-scripts allow-presentation allow-same-origin"');
    expect(html).toContain('<iframe');
    expect(html).not.toContain('<video');
    const editor = ref.current!.getEditor();
    const clipboardHTML = serializeRange(editor.state.doc, 0, editor.state.doc.content.size, {
      document,
      rules: mergeDOMRules(mergeDOMRules(defaultDOMRules(), mediaDOMRules()), extendedDOMRules()),
      schema: editor.schema,
    });
    expect(clipboardHTML).toContain('<iframe');
    expect(clipboardHTML).not.toContain('<video');
    ref.current!.setHTML(clipboardHTML);
    await expect.poll(() => root.querySelector('iframe')?.getAttribute('src')).toBe(source);
    ref.current!.setHTML(html);
    await expect.poll(() => root.querySelector('iframe')?.getAttribute('src')).toBe(source);
    expect(root.querySelector('video')).toBeNull();
  });

  it('does not turn a Bilibili player into a video when copying its HTML', async () => {
    const ref = createRef<RichTextEditorHandle>();
    const screen = await render(<RichTextEditor content="<p>media</p>" ref={ref} />);
    const editor = ref.current!.getEditor();
    const source =
      'https://player.bilibili.com/player.html?isOutside=true&aid=117409105053246&bvid=BV1MWps6VEWW&cid=42566225415&p=1';
    editor.runNamedCommand('insertVideo', { provider: 'bilibili', url: source });
    const html = serializeRange(editor.state.doc, 0, editor.state.doc.content.size, {
      document,
      rules: mergeDOMRules(mergeDOMRules(defaultDOMRules(), mediaDOMRules()), extendedDOMRules()),
      schema: editor.schema,
    });
    expect(html).toContain('<iframe');
    expect(html).not.toContain('<video');
    ref.current!.setHTML(html);
    const root = editable(screen.container as HTMLElement);
    await expect.poll(() => root.querySelector('iframe')?.getAttribute('src')).toBe(source);
    expect(root.querySelector('video')).toBeNull();
  });
  it('inserts a safe iframe from embed code and attaches persistent media controls', async () => {
    const ref = createRef<RichTextEditorHandle>();
    const screen = await render(<RichTextEditor content="<p>media</p>" ref={ref} />);
    selectFirstBlockText(screen.container as HTMLElement, 5, 5);
    await page.getByRole('button', { name: 'More insert options' }).click();
    await page.getByRole('button', { exact: true, name: 'Video' }).click();
    await page.getByRole('button', { exact: true, name: 'Iframe' }).click();
    const source = `${window.location.origin}/__media_frame_fixture__`;
    await page
      .getByLabelText('Iframe URL or embed code')
      .fill(
        `<iframe src="${source}" width="400" height="225" title="Player" onload="alert(1)" allow="camera"></iframe>`,
      );
    await page.getByRole('button', { exact: true, name: 'Insert' }).click();
    const root = editable(screen.container as HTMLElement);
    const frame = root.querySelector('iframe')!;
    expect(frame.getAttribute('src')).toBe(source);
    expect(frame.getAttribute('title')).toBe('Player');
    expect(frame.hasAttribute('onload')).toBe(false);
    expect(frame.getAttribute('allow')).not.toContain('camera');
    expect(frame.getAttribute('sandbox')).toBe('allow-scripts allow-presentation');
    const focus = page.getByRole('toolbar', { name: 'embed focus toolbar' });
    await expect.element(focus).toBeVisible();
    expect(
      document.querySelector('.rbs-rte-focus-toolbar')!.getBoundingClientRect().bottom,
    ).toBeLessThanOrEqual(frame.getBoundingClientRect().top);
    await focus.getByRole('button', { name: 'Media width 50%' }).click();
    expect(Number(frame.getAttribute('width'))).toBeGreaterThan(0);
    const html = ref.current!.getHTML();
    expect(html).toContain('<iframe');
    expect(html).not.toContain('onload');
    ref.current!.setHTML(html);
    await expect.poll(() => root.querySelector('iframe')?.getAttribute('src')).toBe(source);
    await focus.getByRole('button', { name: 'Delete media' }).click();
    expect(root.querySelector('iframe')).toBeNull();
    ref.current!.undo();
    await expect.poll(() => root.querySelector('iframe')?.getAttribute('src')).toBe(source);
  });

  it('renders native video with attached controls and preserves its source on save/reload', async () => {
    const ref = createRef<RichTextEditorHandle>();
    const source = `${window.location.origin}/__media_fixture__.mp4`;
    const screen = await render(
      <RichTextEditor
        content={`<p>video</p><video src="${source}" width="400" height="225"></video><p>after</p>`}
        ref={ref}
      />,
    );
    const root = editable(screen.container as HTMLElement);
    expect(root.querySelector('video')?.getAttribute('src')).toBe(source);
    const focus = page.getByRole('toolbar', { name: 'video focus toolbar' });
    await expect.element(focus).toBeVisible();
    await focus.getByRole('button', { name: 'Media width 50%' }).click();
    const html = ref.current!.getHTML();
    ref.current!.setHTML(html);
    await expect.poll(() => root.querySelector('video')?.getAttribute('src')).toBe(source);
    expect(root.lastElementChild?.textContent).toBe('after');
  });

  it('imports iframe markup as safe metadata and drops unsafe frame sources', async () => {
    const source = `${window.location.origin}/__media_frame_fixture__`;
    const screen = await render(
      <RichTextEditor
        content={`<p>before</p><iframe src="${source}" title="Imported"></iframe><iframe src="javascript:alert(1)"></iframe><iframe src="${source}" srcdoc="unsafe"></iframe><p>after</p>`}
      />,
    );
    const root = editable(screen.container as HTMLElement);
    expect(root.querySelectorAll('iframe').length).toBe(1);
    expect(root.querySelector('iframe')?.getAttribute('title')).toBe('Imported');
    expect(root.lastElementChild?.textContent).toBe('after');
  });

  it.each([
    'javascript:alert(1)',
    'data:text/html,unsafe',
    'blob:https://example.com/id',
    '<iframe src="https://example.com" srcdoc="unsafe"></iframe>',
  ])('refuses unsafe iframe input %s', (source) => {
    expect(parseIframeInput(source, document)).toBeNull();
  });
  it('does not treat attached toolbar input as document editing', async () => {
    const screen = await render(
      <RichTextEditor
        content="<p>before</p><hr><p>after</p>"
        focusToolbar={() => <input aria-label="Node settings" />}
      />,
    );
    const root = editable(screen.container as HTMLElement);
    selectFirstBlockText(screen.container as HTMLElement, 0, 0);
    await page.getByRole('textbox', { name: 'Node settings' }).click();
    await userEvent.keyboard('settings{Enter}');
    expect(root.textContent).toBe('beforeafter');
    expect(root.children.length).toBe(3);
  });
  it('keeps image controls aligned during editor scrolling and centers their labels', async () => {
    const image =
      '<p><img width="120" height="100" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+a0xkAAAAASUVORK5CYII="></p>';
    const screen = await render(
      <RichTextEditor content={`${'<p>line</p>'.repeat(6)}${image}${'<p>line</p>'.repeat(10)}`} />,
    );
    const host = screen.container.querySelector<HTMLElement>('.rbs-rte-content')!;
    host.style.maxHeight = '180px';
    const toolbar = host.querySelector<HTMLElement>('.rbs-rte-focus-toolbar')!;
    const img = host.querySelector('img')!;
    expect(toolbar.style.position).toBe('absolute');
    const distance = img.getBoundingClientRect().top - toolbar.getBoundingClientRect().bottom;
    for (const offset of [20, 80, 40, 0]) {
      host.scrollTop = offset;
      // Check in the same task, before any scroll handler or React render can catch up.
      expect(img.getBoundingClientRect().top - toolbar.getBoundingClientRect().bottom).toBeCloseTo(
        distance,
        4,
      );
    }
    const button = toolbar.querySelector('button')!;
    const range = document.createRange();
    range.selectNodeContents(button);
    const textRect = range.getBoundingClientRect();
    const buttonRect = button.getBoundingClientRect();
    expect(
      Math.abs((textRect.top + textRect.bottom - buttonRect.top - buttonRect.bottom) / 2),
    ).toBeLessThan(2);
  });

  it('places the caret on neighbouring text lines when clicking or moving across an image', async () => {
    const screen = await render(
      <RichTextEditor content='<p>before</p><p><img width="120" height="100" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+a0xkAAAAASUVORK5CYII="></p><p>after</p>' />,
    );
    const root = editable(screen.container as HTMLElement);
    const img = root.querySelector('img')!;
    const paragraph = () => {
      const node = window.getSelection()?.focusNode;
      return (node?.nodeType === 1 ? (node as Element) : node?.parentElement)?.closest('p');
    };
    const rect = img.getBoundingClientRect();
    img.dispatchEvent(
      new MouseEvent('mousedown', { bubbles: true, cancelable: true, clientY: rect.top + 1 }),
    );
    expect(paragraph()?.textContent).toBe('before');
    await userEvent.keyboard('{ArrowDown}');
    await expect.poll(() => paragraph()?.textContent).toBe('after');
    await userEvent.keyboard('{ArrowUp}');
    await expect.poll(() => paragraph()?.textContent).toBe('before');
    img.dispatchEvent(
      new MouseEvent('mousedown', { bubbles: true, cancelable: true, clientY: rect.bottom - 1 }),
    );
    expect(paragraph()?.textContent).toBe('after');
    await userEvent.keyboard('X');
    expect(root.querySelector('img')).not.toBeNull();
    expect(root.lastElementChild?.textContent).toBe('Xafter');
  });

  it('provides visible empty caret lines on either side of a standalone image', async () => {
    const screen = await render(
      <RichTextEditor content='<p><img width="120" height="100" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+a0xkAAAAASUVORK5CYII="></p>' />,
    );
    const root = editable(screen.container as HTMLElement);
    const img = root.querySelector('img')!;
    img.dispatchEvent(
      new MouseEvent('mousedown', {
        bubbles: true,
        cancelable: true,
        clientY: img.getBoundingClientRect().top + 1,
      }),
    );
    expect(root.children.length).toBe(2);
    expect(root.firstElementChild?.querySelector('br[data-rt-filler]')).not.toBeNull();
    img.dispatchEvent(
      new MouseEvent('mousedown', {
        bubbles: true,
        cancelable: true,
        clientY: img.getBoundingClientRect().bottom - 1,
      }),
    );
    expect(root.children.length).toBe(3);
    expect(root.lastElementChild?.querySelector('br[data-rt-filler]')).not.toBeNull();
    await userEvent.keyboard('after');
    expect(root.lastElementChild?.textContent).toBe('after');
  });

  it('reuses the focus toolbar for custom node controls', async () => {
    const screen = await render(
      <RichTextEditor
        content="<p>before</p><hr><p>after</p>"
        focusToolbar={(context) => (
          <ToolbarButton onClick={context.remove} title="Remove focused node">
            {context.node.type}
          </ToolbarButton>
        )}
      />,
    );
    const root = editable(screen.container as HTMLElement);
    await expect
      .element(page.getByRole('toolbar', { name: 'horizontal_rule focus toolbar' }))
      .toBeVisible();
    await page.getByRole('button', { name: 'Remove focused node' }).click();
    expect(root.querySelector('hr')).toBeNull();
  });

  it('keeps separate toolbars attached to all images without selecting them', async () => {
    const screen = await render(
      <RichTextEditor content='<p><img width="40" height="40" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+a0xkAAAAASUVORK5CYII="> between <img width="40" height="40" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+a0xkAAAAASUVORK5CYII="></p>' />,
    );
    const root = editable(screen.container as HTMLElement);
    await expect
      .element(page.getByRole('toolbar', { name: 'image focus toolbar' }).first())
      .toBeVisible();
    await expect
      .element(page.getByRole('toolbar', { name: 'image focus toolbar' }).last())
      .toBeVisible();
    const images = root.querySelectorAll('img');
    const toolbars = document.querySelectorAll('.rbs-rte-focus-toolbar');
    expect(toolbars.length).toBe(2);
    images.forEach((image, index) => {
      const imageRect = image.getBoundingClientRect();
      const toolbarRect = toolbars[index]!.getBoundingClientRect();
      expect(toolbarRect.bottom).toBeLessThanOrEqual(imageRect.top);
    });
    // The second image's action must target that image, even with the caret elsewhere.
    await page
      .getByRole('toolbar', { name: 'image focus toolbar' })
      .last()
      .getByRole('button', { name: 'Delete image' })
      .click();
    expect(root.querySelectorAll('img').length).toBe(1);
  });

  it('reserves space below content and restores styles when detached', async () => {
    const host = document.createElement('div');
    const anchor = document.createElement('span');
    anchor.textContent = 'Attached content';
    host.append(anchor);
    document.body.append(host);
    try {
      const screen = await render(
        <FocusToolbar anchor={anchor} label="Bottom controls" placement="bottom">
          <button type="button">Action</button>
        </FocusToolbar>,
      );
      await expect.element(page.getByRole('toolbar', { name: 'Bottom controls' })).toBeVisible();
      const range = document.createRange();
      range.selectNodeContents(anchor);
      const toolbarRect = document.querySelector('.rbs-rte-focus-toolbar')!.getBoundingClientRect();
      expect(toolbarRect.top).toBeGreaterThanOrEqual(range.getBoundingClientRect().bottom);
      expect(Number.parseFloat(anchor.style.paddingBottom)).toBeGreaterThan(toolbarRect.height);
      await screen.unmount();
      expect(anchor.style.display).toBe('');
      expect(anchor.style.paddingBottom).toBe('');
      expect(anchor.style.minWidth).toBe('');
    } finally {
      host.remove();
    }
  });

  it('allows the attached toolbar to be disabled', async () => {
    const screen = await render(
      <RichTextEditor
        content='<p><img src="https://example.com/photo.png"></p>'
        focusToolbar={false}
      />,
    );
    const root = editable(screen.container as HTMLElement);
    root
      .querySelector('img')!
      .dispatchEvent(new MouseEvent('mousedown', { bubbles: true, cancelable: true }));
    expect(document.querySelector('.rbs-rte-focus-toolbar')).toBeNull();
  });

  it('shows pending upload status below the editor and removes completed status', async () => {
    let finish = () => {};
    function UploadTrigger() {
      const { run } = useRichTextEditor();
      return (
        <ToolbarButton
          onClick={() =>
            run('uploadAndInsert', {
              file: new File(['test'], 'photo.png', { type: 'image/png' }),
              kind: 'image',
            })
          }
          title="Start test upload"
        >
          Upload
        </ToolbarButton>
      );
    }
    const screen = await render(
      <RichTextEditor
        content="<p>here</p>"
        toolbarExtra={<UploadTrigger />}
        upload={{
          image: {
            upload: () =>
              new Promise((resolve) => {
                finish = () => resolve({ url: 'https://example.com/photo.png' });
              }),
          },
        }}
      />,
    );
    await page.getByRole('button', { name: 'Start test upload' }).click();
    const container = screen.container as HTMLElement;
    const content = container.querySelector('.rbs-rte-content')!;
    const status = container.querySelector('.rbs-rte-upload-status')!;
    expect(status).not.toBeNull();
    expect(content.compareDocumentPosition(status) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    finish();
    await expect.element(page.getByText('photo.png', { exact: true })).not.toBeInTheDocument();
    expect(container.querySelector('.rbs-rte-upload-status')).toBeNull();
  });

  it('normalizes a document-end caret into the last table cell before typing', async () => {
    const screen = await render(
      <RichTextEditor content="<p>lead</p><table><tr><td><p>a</p></td><td><p>second</p></td></tr></table>" />,
    );
    const root = editable(screen.container as HTMLElement);
    root.focus();
    const range = document.createRange();
    range.setStart(root, root.childNodes.length);
    range.collapse(true);
    window.getSelection()?.removeAllRanges();
    window.getSelection()?.addRange(range);
    document.dispatchEvent(new Event('selectionchange'));
    for (const data of ['X', 'Y']) {
      root.dispatchEvent(
        new InputEvent('beforeinput', {
          bubbles: true,
          cancelable: true,
          data,
          inputType: 'insertText',
        }),
      );
    }
    expect(root.querySelector('td:last-child p')?.textContent).toBe('secondXY');
  });
  it('renders the toolbar and an editable area', async () => {
    const screen = await render(<RichTextEditor content="<p>Hello</p>" />);
    const container = screen.container as HTMLElement;

    expect(container.querySelector('.rt-editor')).not.toBeNull();
    expect(editable(container).getAttribute('contenteditable')).toBe('true');
    await expect.element(page.getByRole('toolbar', { name: 'Editor toolbar' })).toBeVisible();
    await expect.element(page.getByRole('button', { name: 'Bold' })).toBeVisible();
  });

  it('shows the document it was given', async () => {
    const screen = await render(<RichTextEditor content="<p>Hello <strong>world</strong></p>" />);

    expect(editable(screen.container as HTMLElement).innerHTML).toContain('<strong>world</strong>');
  });

  it('applies a mark when its toolbar button is pressed', async () => {
    const screen = await render(<RichTextEditor content="<p>Hello</p>" />);
    const container = screen.container as HTMLElement;

    selectFirstBlockText(container);

    await page.getByRole('button', { name: 'Bold' }).click();

    expect(editable(container).innerHTML).toContain('<strong>Hello</strong>');
  });

  it('keeps the document when it re-renders', async () => {
    const screen = await render(<RichTextEditor content="<p>First</p>" />);
    const container = screen.container as HTMLElement;

    await screen.rerender(<RichTextEditor content="<p>First</p>" />);

    expect(editable(container).textContent).toBe('First');
  });

  it('reports an empty document as the placeholder target', async () => {
    const screen = await render(<RichTextEditor placeholder="Write something…" />);
    const element = editable(screen.container as HTMLElement);

    expect(element.getAttribute('data-placeholder')).toBe('Write something…');
  });

  it('renders empty textblocks with a line box without adding document hard breaks', async () => {
    const screen = await render(
      <RichTextEditor content="<p></p><h2></h2><pre></pre>" hideToolbar />,
    );
    const root = editable(screen.container as HTMLElement);
    const editor = new EditorClass({ extensions: [StarterKit] });

    for (const block of Array.from(root.children)) {
      expect(block.getBoundingClientRect().height).toBeGreaterThan(10);
      expect(block.querySelector('br[data-rt-filler="true"]')).not.toBeNull();
      const parsed = parseDOMElement(block, editor.schema).maybeChild(0);

      expect(parsed?.textContent).toBe('');
      expect(parsed?.childCount).toBe(0);
    }

    // Real hard breaks remain document content.
    const paragraph = document.createElement('p');

    paragraph.innerHTML = 'before<br>after';
    expect(parseDOMElement(paragraph, editor.schema).maybeChild(0)?.textContent).toBe(
      'before\nafter',
    );
    editor.destroy();
  });

  it('opens the find dialog and reports how many matches there are', async () => {
    await render(<RichTextEditor content="<p>alpha beta beta</p>" />);

    await page.getByRole('button', { name: 'Find and replace' }).click();
    await expect.element(page.getByRole('dialog', { name: 'Find and replace' })).toBeVisible();

    const input = page.getByLabelText('Find');

    await userEvent.fill(input, 'beta');

    await expect.element(page.getByText('2 matches in the document')).toBeVisible();
  });

  it('opens the link dialog from the toolbar', async () => {
    await render(<RichTextEditor content="<p>alpha</p>" />);

    await page.getByRole('button', { name: 'Link' }).click();

    await expect.element(page.getByRole('dialog', { name: 'Insert link' })).toBeVisible();
    await expect.element(page.getByLabelText('Destination')).toBeVisible();
  });

  it('leaves out the toolbar when it is asked to', async () => {
    const screen = await render(<RichTextEditor content="<p>Hello</p>" hideToolbar />);

    expect((screen.container as HTMLElement).querySelector('.rt-editor')).not.toBeNull();
    expect((screen.container as HTMLElement).querySelector('.rbs-rte-toolbar')).toBeNull();
  });

  it('turns the editable area read-only without a toolbar press', async () => {
    const screen = await render(<RichTextEditor content="<p>Hello</p>" editable={false} />);
    const element = editable(screen.container as HTMLElement);

    expect(element.getAttribute('contenteditable')).toBe('false');
    expect(element.getAttribute('aria-readonly')).toBe('true');
  });

  it('uses the live caret when Enter arrives before selectionchange', async () => {
    const screen = await render(
      <RichTextEditor content="<p>First</p><h2>Title</h2>" hideToolbar />,
    );
    const root = editable(screen.container as HTMLElement);
    const title = root.querySelector('h2');

    if (!title?.firstChild) {
      throw new Error('the heading did not render its text');
    }

    root.focus();

    const range = document.createRange();

    range.setStart(title.firstChild, 0);
    range.collapse(true);
    window.getSelection()?.removeAllRanges();
    window.getSelection()?.addRange(range);

    // Do not dispatch `selectionchange`: a real browser queues it, so the keydown can win the race.
    root.dispatchEvent(
      new KeyboardEvent('keydown', { bubbles: true, cancelable: true, key: 'Enter' }),
    );

    expect(Array.from(root.children).map((node) => node.tagName)).toEqual(['P', 'P', 'H2']);
    expect(root.children[0]?.textContent).toBe('First');
    expect(root.children[2]?.textContent).toBe('Title');
    expect(window.getSelection()?.focusNode).toBe(root.children[1]);
  });

  it('opens the emoji panel and inserts the chosen emoji', async () => {
    const screen = await render(<RichTextEditor content="<p>hi </p>" />);
    const container = screen.container as HTMLElement;

    await page.getByRole('button', { name: 'Emoji' }).click();
    await expect.element(page.getByPlaceholder('Search emoji')).toBeVisible();

    await userEvent.fill(page.getByPlaceholder('Search emoji'), 'grinning face');

    const emoji = page.getByRole('button', { name: 'Emoji grinning face with smiling eyes' });

    await expect.element(emoji).toBeVisible();
    await emoji.click();

    expect(editable(container).innerHTML).toContain('data-emoji="😄"');
  });

  it('offers table controls when the caret is inside a table', async () => {
    const screen = await render(
      <RichTextEditor content="<table><tr><td><p>cell</p></td><td><p>two</p></td></tr></table>" />,
    );
    const container = screen.container as HTMLElement;
    const cell = container.querySelector('td p');

    if (!cell) {
      throw new Error('the table did not render');
    }

    const range = document.createRange();

    range.setStart(cell.firstChild ?? cell, 1);
    range.collapse(true);

    const selection = window.getSelection();

    selection?.removeAllRanges();
    selection?.addRange(range);
    document.dispatchEvent(new Event('selectionchange'));

    await page.getByRole('button', { name: 'Table' }).click();
    await expect.element(page.getByText(/Row 1 of 1/)).toBeVisible();

    await page.getByRole('button', { name: 'Add row below' }).click();

    expect(container.querySelectorAll('tr').length).toBe(2);
  });

  it('adds a column when the table panel is used', async () => {
    const screen = await render(
      <RichTextEditor content="<table><tr><td><p>a</p></td><td><p>b</p></td></tr></table>" />,
    );
    const container = screen.container as HTMLElement;
    const cell = container.querySelector('td p');

    if (!cell) {
      throw new Error('the table did not render');
    }

    const range = document.createRange();

    range.setStart(cell.firstChild ?? cell, 1);
    range.collapse(true);

    const selection = window.getSelection();

    selection?.removeAllRanges();
    selection?.addRange(range);
    document.dispatchEvent(new Event('selectionchange'));

    await page.getByRole('button', { name: 'Table' }).click();
    await page.getByRole('button', { name: 'Add column after' }).click();

    expect(container.querySelectorAll('tr')[0]?.querySelectorAll('td').length).toBe(3);
  });

  it('merges a cell with the one on its right', async () => {
    const screen = await render(
      <RichTextEditor content="<table><tr><td><p>a</p></td><td><p>b</p></td></tr></table>" />,
    );
    const container = screen.container as HTMLElement;
    const cell = container.querySelector('td p');

    if (!cell) {
      throw new Error('the table did not render');
    }

    const range = document.createRange();

    range.setStart(cell.firstChild ?? cell, 1);
    range.collapse(true);

    const selection = window.getSelection();

    selection?.removeAllRanges();
    selection?.addRange(range);
    document.dispatchEvent(new Event('selectionchange'));

    await page.getByRole('button', { name: 'Table' }).click();
    await page.getByRole('button', { name: 'Merge with the cell on the right' }).click();

    expect(container.querySelectorAll('td').length).toBe(1);
    expect(container.querySelector('td')?.getAttribute('colspan')).toBe('2');
  });

  it('closes a panel as soon as a row in it is chosen', async () => {
    await render(<RichTextEditor content="<p>Hello</p>" />);

    await page.getByRole('button', { name: 'Paragraph style' }).click();
    await expect.element(page.getByRole('button', { name: 'Heading 2' })).toBeVisible();

    await page.getByRole('button', { name: 'Heading 2' }).click();

    // The choice is applied and the panel goes away, so the next press opens it again rather than
    // closing a panel that is still there.
    await expect.element(page.getByRole('button', { name: 'Heading 2' })).not.toBeInTheDocument();
    await expect.element(page.getByRole('button', { name: 'Paragraph style' })).toBeVisible();
  });

  it('shows the name of a command it has no icon for', async () => {
    await render(
      <RichTextEditor
        content="<p>Hello</p>"
        toolbarExtra={
          <ToolbarButton onClick={() => {}} title="Shout">
            Shout
          </ToolbarButton>
        }
      />,
    );
    // `toolbarExtra` is rendered in a group of its own at the end of the toolbar, and a control a host
    // added without a picture falls back to its name — the built-in controls never do.
    const extra = document.querySelector('[aria-label="Extra"] button');
    const builtIn = document.querySelector('[aria-label="Text style"] button');

    expect(extra?.textContent).toBe('Shout');
    expect(extra?.querySelector('svg')).toBeNull();
    expect(builtIn?.textContent).toBe('');

    await expect.element(page.getByRole('button', { name: 'Shout' })).toBeVisible();
  });
});
