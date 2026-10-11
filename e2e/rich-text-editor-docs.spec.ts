import { expect, type Locator, type Page, test } from '@playwright/test';

/**
 * End-to-end checks of the rich text editor on the documentation page.
 *
 * The component tests in `src/components/rich-text-editor/*.browser.test.tsx` run against a single
 * editor in a blank page; this spec is the other half — the editor as a *user* meets it: inside the
 * documentation layout, several editors on one page, real clicks, and the dev bundle rather than the
 * source module.
 */

/** The demo section titled `title`. */
const demo = (page: Page, title: string): Locator =>
  page.locator('section').filter({ has: page.getByRole('heading', { exact: true, name: title }) });

/** The editor of a demo, which is what these checks drive. */
const editorOf = (page: Page, title: string): Locator =>
  demo(page, title).locator('.rbs-rte').first();

/** The editable area of an editor. */
const editable = (scope: Locator): Locator => scope.locator('.rt-editor').first();

/** The toolbar of an editor. */
const toolbar = (scope: Locator): Locator => scope.locator('.rbs-rte-toolbar').first();

/**
 * Selects `needle` inside an editable area, the way a user drags over it.
 *
 * The editor is focused first: a toolbar control only acts on the editor the keyboard is talking to,
 * which is what keeps one editor's buttons from writing into another editor's document on a page
 * that shows several of them.
 */
const selectText = async (root: Locator, needle: string): Promise<void> => {
  await root.click();

  await root.evaluate((element, text) => {
    const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT);
    let node = walker.nextNode();

    while (node) {
      const index = (node.textContent ?? '').indexOf(text);

      if (index >= 0) {
        const range = document.createRange();

        range.setStart(node, index);
        range.setEnd(node, index + text.length);

        const selection = window.getSelection();

        selection?.removeAllRanges();
        selection?.addRange(range);
        document.dispatchEvent(new Event('selectionchange'));

        return;
      }

      node = walker.nextNode();
    }

    throw new Error(`the text "${text}" is not in the editor`);
  }, needle);
};

/** Puts the caret at the end of an editable area and leaves the editor focused. */
const caretAtEnd = async (root: Locator): Promise<void> => {
  await root.click();
  await root.page().keyboard.press('Control+End');
};

test.describe('rich text editor documentation', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/components/rich-text-editor');
    await expect(page.locator('.rt-editor').first()).toBeVisible();
  });

  test('renders the documented sections and every editor the page promises', async ({ page }) => {
    await expect(page.getByRole('heading', { level: 2, name: 'RichTextEditor' })).toBeVisible();

    // Seven editors in the demos: the hero, four demo editors, and the two of the state demo.
    // Four of them show the toolbar this spec drives; the others hide it on purpose.
    await expect(page.locator('.rt-editor')).toHaveCount(7);
    await expect(page.locator('.rbs-rte:has(.rbs-rte-toolbar)')).toHaveCount(4);

    for (const title of [
      '基础用法',
      '文本格式与段落',
      '插入内容',
      '编辑操作',
      '受控与命令式调用',
    ]) {
      await expect(demo(page, title)).toBeVisible();
    }

    // The first demo hides the toolbar, so its editor is the plain one.
    await expect(editable(editorOf(page, '基础用法'))).toHaveAttribute('contenteditable', 'true');
    await expect(editable(editorOf(page, '基础用法'))).toContainText('Hello');
    await expect(editorOf(page, '基础用法').locator('.rbs-rte-toolbar')).toHaveCount(0);
  });

  test('opens one find dialog for the focused editor instead of one per editor', async ({
    page,
  }) => {
    expect(await page.locator('.rbs-rte:has(.rbs-rte-toolbar)').count()).toBeGreaterThan(1);

    // The hero editor has no toolbar at all, so its own find dialog is rendered but never opened;
    // the count below is what tells a dialog apart from a control that merely exists.
    const dialogs = page.locator('dialog[open]');

    await expect(dialogs).toHaveCount(0);

    // `blur()` is what a click on the page background does to an element that cannot hold the focus.
    await page.evaluate(() => (document.activeElement as HTMLElement | null)?.blur());
    expect(await page.evaluate(() => document.activeElement?.tagName)).toBe('BODY');
    await page.keyboard.press('Control+f');

    // Nothing is focused, so the shortcut belongs to no editor: on a page with several of them,
    // "which editor should open" has no answer and none of them does.
    await expect(dialogs).toHaveCount(0);

    await editable(editorOf(page, '文本格式与段落')).click();
    await page.keyboard.press('Control+f');

    await expect(dialogs).toHaveCount(1);
    await expect(dialogs.getByText('Find and replace')).toBeVisible();

    // The dialog's own close control, which is what a user reaches for; the Escape key belongs to
    // whichever layer has the focus, and a modal keeps the focus inside itself.
    await dialogs.getByRole('button', { name: 'Close' }).first().click();
    await expect(dialogs).toHaveCount(0);
  });
  test('renders the full toolbar, grouped by what it does', async ({ page }) => {
    const first = toolbar(editorOf(page, '文本格式与段落'));

    await expect(first).toBeVisible();
    await expect(first.locator('.rbs-rte-tool-group')).toHaveCount(7);
    await expect(first.locator('button')).toHaveCount(42);

    for (const label of [
      'History',
      'Clipboard',
      'Text style',
      'Typography',
      'Paragraph',
      'Insert',
      'Tools',
    ]) {
      await expect(first.locator(`[aria-label="${label}"]`)).toBeVisible();
    }
  });

  test('offers every documented control', async ({ page }) => {
    const first = toolbar(editorOf(page, '文本格式与段落'));

    for (const name of [
      'Undo',
      'Redo',
      'Cut',
      'Copy',
      'Paste',
      'Paste as plain text',
      'Select all',
      'Bold',
      'Italic',
      'Underline',
      'Strikethrough',
      'Inline code',
      'Superscript',
      'Subscript',
      'Clear formatting',
      'Font family',
      'Font size',
      'Text color',
      'Highlight color',
      'Paragraph style',
      'Align left',
      'Align center',
      'Align right',
      'Justify',
      'Bulleted list',
      'Numbered list',
      'Checklist',
      'Increase indent',
      'Decrease indent',
      'Line height and spacing',
      'Blockquote',
      'Code block',
      'Horizontal rule',
      'Table',
      'Link',
      'Image',
      'Emoji',
      'Special symbol',
      'Date and time',
      'More insert options',
      'Find and replace',
      'Format painter',
    ]) {
      await expect(first.getByRole('button', { exact: true, name })).toBeVisible();
    }
  });

  test('writes what is typed into the document', async ({ page }) => {
    const scope = editorOf(page, '插入内容');
    const target = editable(scope);

    await caretAtEnd(target);
    await page.keyboard.type(' typed by playwright');

    await expect(target).toContainText('typed by playwright');
  });

  test('applies and removes a mark through the toolbar', async ({ page }) => {
    const scope = editorOf(page, '文本格式与段落');
    const target = editable(scope);
    const bold = toolbar(scope).getByRole('button', { exact: true, name: 'Bold' });

    // "斜体" sits inside an <em>, so the strong element the check looks for is the one this adds.
    await selectText(target, '斜体');
    await bold.click();

    await expect(target.locator('em > strong')).toHaveCount(1);
    await expect(bold).toHaveAttribute('aria-pressed', 'true');

    await selectText(target, '斜体');
    await bold.click();

    await expect(target.locator('em > strong')).toHaveCount(0);
  });

  test('keeps the selection when a panel is used', async ({ page }) => {
    const scope = editorOf(page, '文本格式与段落');
    const target = editable(scope);

    await selectText(target, '加粗');

    await toolbar(scope).getByRole('button', { name: 'Highlight color' }).click();

    const panel = page.locator('.rbs-rte-panel').first();

    await expect(panel).toBeVisible();
    await panel.getByRole('button', { name: 'Light Light yellow' }).click();

    await expect(target.locator('p').first().locator('mark')).toHaveText('加粗');
  });

  test('sets the font family from the typography panel', async ({ page }) => {
    const scope = editorOf(page, '文本格式与段落');
    const target = editable(scope);

    await selectText(target, '加粗');
    await toolbar(scope).getByRole('button', { name: 'Font family' }).click();

    const panel = page.locator('.rbs-rte-panel').first();

    await expect(panel.getByText('Font family')).toBeVisible();

    // Every row of the panel previews its own family, so the row is found by the family it names.
    const georgia = panel.locator('button').filter({ hasText: 'Georgia' }).first();

    await georgia.click();

    await expect(target.locator('span[style*="Georgia"]').first()).toHaveText('加粗');
  });

  test('switches the block type from the paragraph picker', async ({ page }) => {
    const scope = editorOf(page, '文本格式与段落');
    const target = editable(scope);
    const picker = toolbar(scope).getByRole('button', { name: 'Paragraph style' });

    await target.locator('p').first().click();

    await picker.click();

    const panel = page.locator('.rbs-rte-panel').first();

    await expect(panel.getByRole('button', { exact: true, name: 'Normal text' })).toHaveAttribute(
      'aria-pressed',
      'true',
    );

    // Choosing a block type applies it and dismisses the picker, so the second choice reopens it.
    await panel.getByRole('button', { exact: true, name: 'Heading 3' }).click();
    await expect(target.locator('h3').first()).toBeVisible();

    await picker.click();
    await panel.getByRole('button', { name: 'Normal text' }).click();
    await expect(target.locator('h3')).toHaveCount(0);
  });

  test('links the selection and removes the link again', async ({ page }) => {
    const scope = editorOf(page, '文本格式与段落');
    const target = editable(scope);
    const linkButton = toolbar(scope).getByRole('button', { exact: true, name: 'Link' });

    await selectText(target, '背景高亮');
    await linkButton.click();

    const dialog = page.getByRole('dialog', { name: 'Insert link' });

    await expect(dialog).toBeVisible();
    await dialog.getByLabel('Destination').fill('https://example.com/docs');
    await dialog.getByRole('button', { name: 'Insert' }).click();

    const anchor = target.locator('a');

    await expect(anchor.first()).toHaveText('背景高亮');
    await expect(anchor.first()).toHaveAttribute('href', 'https://example.com/docs');
    await expect(anchor.first()).toHaveAttribute('rel', /noopener/);

    await selectText(target, '背景高亮');
    await linkButton.click();

    const edit = page.getByRole('dialog', { name: 'Edit link' });

    await expect(edit).toBeVisible();
    await edit.getByRole('button', { name: 'Remove link' }).click();

    await expect(target.locator('a')).toHaveCount(0);
  });

  test('refuses a link destination the editor will not store', async ({ page }) => {
    const scope = editorOf(page, '文本格式与段落');
    const target = editable(scope);

    await selectText(target, '背景高亮');
    await toolbar(scope).getByRole('button', { exact: true, name: 'Link' }).click();

    const dialog = page.getByRole('dialog', { name: 'Insert link' });

    await dialog.getByLabel('Destination').fill('javascript:alert(1)');
    await dialog.getByRole('button', { name: 'Insert' }).click();

    await expect(target.locator('a')).toHaveCount(0);
  });

  test('finds and replaces text with the dialog', async ({ page }) => {
    const scope = editorOf(page, '编辑操作');
    const target = editable(scope);

    await caretAtEnd(target);
    await toolbar(scope).getByRole('button', { name: 'Find and replace' }).click();

    const dialog = page.getByRole('dialog', { name: 'Find and replace' });

    await expect(dialog).toBeVisible();

    await dialog.getByLabel('Find').fill('查找替换');
    await expect(dialog.getByText('1 match in the document')).toBeVisible();

    await dialog.getByLabel('Replace with').fill('搜索');
    await dialog.getByRole('button', { name: 'Replace all' }).click();

    await expect(dialog.getByText('Replaced 1 match')).toBeVisible();
    await expect(target).toContainText('搜索');
    await expect(target).not.toContainText('查找替换');
  });

  test('undoes and redoes an edit from the keyboard and from the toolbar', async ({ page }) => {
    const scope = editorOf(page, '插入内容');
    const target = editable(scope);
    const undo = toolbar(scope).getByRole('button', { exact: true, name: 'Undo' });
    const redo = toolbar(scope).getByRole('button', { exact: true, name: 'Redo' });

    await target.locator('p').first().click();
    await page.keyboard.type('abcdef');

    await expect(target).toContainText('abcdef');

    await page.keyboard.press('Control+z');
    await expect(target).not.toContainText('abcdef');

    await page.keyboard.press('Control+Shift+z');
    await expect(target).toContainText('abcdef');

    await undo.click();
    await expect(target).not.toContainText('abcdef');

    await redo.click();
    await expect(target).toContainText('abcdef');
  });

  test('inserts an emoji, a symbol and a date stamp from the pickers', async ({ page }) => {
    // The pickers insert an atom at the caret, so the caret is put inside a paragraph with text: an
    // atom replaces the selection it lands on, and an empty block has nothing to replace.
    const scope = editorOf(page, '文本格式与段落');
    const target = editable(scope);
    const first = toolbar(scope);

    await target.locator('p').first().click();

    await first.getByRole('button', { name: 'Emoji' }).click();
    await page.getByPlaceholder('Search emoji').fill('grinning face with smiling eyes');
    await page.getByRole('button', { name: 'Emoji grinning face with smiling eyes' }).click();
    await expect(target.locator('[data-emoji="😄"]')).toHaveCount(1);

    await target.locator('p').first().click();
    await first.getByRole('button', { name: 'Special symbol' }).click();
    await page.getByPlaceholder('Search symbols').fill('multiplication sign');
    await page.getByRole('button', { name: 'Symbol multiplication sign' }).click();
    await expect(target.locator('[data-symbol="×"]')).toHaveCount(1);

    await target.locator('p').first().click();
    await first.getByRole('button', { name: 'Date and time' }).click();
    await page.getByRole('button', { exact: true, name: '2024-05-06' }).click();
    await expect(target.locator('[data-node="date"]').last()).toHaveAttribute('data-datetime', /T/);
  });

  test('changes a table when the caret is inside one', async ({ page }) => {
    const scope = editorOf(page, '插入内容');
    const target = editable(scope);
    const tableButton = toolbar(scope).getByRole('button', { name: 'Table' });
    const rowPanel = page.locator('.rbs-rte-panel').filter({ hasText: 'Add row below' });

    await expect(target.locator('tr')).toHaveCount(1);

    /* An action re-renders the editor, so the caret is put back in the cell and the panel reopened. */
    const openTablePanel = async () => {
      await target.locator('td p').first().click();
      await tableButton.click();
      await expect(rowPanel).toBeVisible();
    };

    await openTablePanel();
    await expect(rowPanel.getByText(/Row 1 of 1/)).toBeVisible();

    await rowPanel.getByRole('button', { name: 'Add row below' }).click();
    await expect(target.locator('tr')).toHaveCount(2);

    await openTablePanel();
    await rowPanel.getByRole('button', { name: 'Add column after' }).click();
    await expect(target.locator('tr').first().locator('td')).toHaveCount(3);

    await openTablePanel();
    await rowPanel.getByRole('button', { name: 'Merge with the cell on the right' }).click();
    await expect(target.locator('td[colspan="2"]')).toHaveCount(1);

    await openTablePanel();
    await rowPanel.getByRole('button', { name: 'Delete the table' }).click();
    await expect(target.locator('table')).toHaveCount(0);
  });

  test('grows a merged table and keeps the merge', async ({ page }) => {
    const scope = editorOf(page, '插入内容');
    const target = editable(scope);
    const tableButton = toolbar(scope).getByRole('button', { name: 'Table' });
    const rowPanel = page.locator('.rbs-rte-panel').filter({ hasText: 'Add row below' });

    await target.locator('td p').first().click();
    await tableButton.click();
    await expect(rowPanel).toBeVisible();

    await rowPanel.getByRole('button', { name: 'Merge with the cell on the right' }).click();
    await expect(target.locator('td[colspan="2"]')).toHaveCount(1);

    // A table with a horizontal merge is still structurally sound, so the panel keeps offering the
    // edit rather than refusing it the way it refuses a table with a vertical span.
    await target.locator('td p').first().click();
    await tableButton.click();
    await expect(rowPanel).toBeVisible();
    await expect(rowPanel.getByRole('button', { name: 'Add row below' })).toBeEnabled();

    await rowPanel.getByRole('button', { name: 'Add row below' }).click();
    await expect(target.locator('tr')).toHaveCount(2);

    // Adding a row adds a row of the table's width; the row already there keeps its merged cell.
    await expect(target.locator('td[colspan="2"]')).toHaveCount(1);
    await expect(target.locator('table')).toHaveCount(1);
  });

  test('keeps a wide toolbar inside its column instead of widening the page', async ({ page }) => {
    const box = await editorOf(page, '文本格式与段落').boundingBox();

    expect(box).not.toBeNull();
    expect(box!.width).toBeLessThan(1200);

    const documentWidth = await page.evaluate(() => document.documentElement.scrollWidth);
    const viewportWidth = await page.evaluate(() => window.innerWidth);

    expect(documentWidth).toBeLessThanOrEqual(viewportWidth + 1);
  });

  test('renders a read-only editor and an editor without a toolbar', async ({ page }) => {
    const scope = demo(page, '只读与无工具栏');
    const editors = scope.locator('.rt-editor');

    await expect(editors).toHaveCount(2);
    await expect(editors.first()).toHaveAttribute('contenteditable', 'false');
    await expect(editors.first()).toHaveAttribute('aria-readonly', 'true');
    await expect(scope.locator('.rbs-rte-toolbar')).toHaveCount(1);

    const readOnlyToolbar = scope.locator('.rbs-rte-toolbar');

    await expect(readOnlyToolbar.getByRole('button', { exact: true, name: 'Bold' })).toBeDisabled();
    await expect(readOnlyToolbar.getByRole('button', { exact: true, name: 'Redo' })).toBeDisabled();
    await expect(readOnlyToolbar.getByRole('button', { name: 'Find and replace' })).toBeEnabled();

    await expect(editors.nth(1)).toHaveAttribute('contenteditable', 'true');
    await expect(editors.nth(1)).toHaveAttribute('data-placeholder', '请输入内容');
  });

  test('shows the placeholder while the document is empty and hides it after typing', async ({
    page,
  }) => {
    const scope = demo(page, '只读与无工具栏');
    const target = scope.locator('.rt-editor').nth(1);

    await expect(target).toHaveAttribute('data-placeholder', '请输入内容');

    await target.click();
    await page.keyboard.type('内容');

    await expect(target).not.toHaveAttribute('data-placeholder', /./);
    await expect(target).toContainText('内容');
  });

  test('survives a reload of the documentation route', async ({ page }) => {
    await page.reload();

    await expect(editable(editorOf(page, '基础用法'))).toContainText('Hello');
    await expect(toolbar(editorOf(page, '文本格式与段落'))).toBeVisible();
  });
});
