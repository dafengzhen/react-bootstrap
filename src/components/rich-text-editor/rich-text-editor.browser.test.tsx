import { afterEach, describe, expect, it } from 'vitest';
import { cleanup, render } from 'vitest-browser-react';
import { page, userEvent } from 'vitest/browser';

import { RichTextEditor } from './rich-text-editor';
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
