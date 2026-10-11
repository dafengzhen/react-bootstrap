import { expect, type Locator, type Page, test } from '@playwright/test';

/**
 * A sweep over the rich text editor's controls, plus the layout and styling the toolbar promises.
 *
 * The other spec drives the editor the way a reader does; this one is the inventory: every control is
 * pressed once and its effect on the document is checked, so a control that renders but does nothing —
 * or does the wrong thing — fails here rather than being noticed by a user.
 *
 * Two stable hooks make that possible without depending on generated class names: a toolbar control
 * carries `data-command` with the command it runs, and a row of a panel carries `data-panel-item`.
 */

/** The demo section titled `title`. */
const demo = (page: Page, title: string): Locator =>
  page.locator('section').filter({ has: page.getByRole('heading', { exact: true, name: title }) });

/** The editor of a demo. */
const editorOf = (page: Page, title: string): Locator =>
  demo(page, title).locator('.rbs-rte').first();

/** The editable area of an editor. */
const editable = (scope: Locator): Locator => scope.locator('.rt-editor').first();

/** The toolbar of an editor. */
const toolbar = (scope: Locator): Locator => scope.locator('.rbs-rte-toolbar').first();

/** The toolbar of the demo the checks drive, which is the one every panel belongs to. */
const mainToolbar = (page: Page): Locator => toolbar(editorOf(page, '文本格式与段落'));

/** The editor the checks drive: the one the toolbar above it belongs to. */
const mainEditor = (page: Page): Locator => editable(editorOf(page, '文本格式与段落'));

/** The open panel, whichever trigger opened it. */
const openPanel = (page: Page): Locator => page.locator('.rbs-rte-panel').first();

/**
 * Puts the caret at the start of a block, by building the range rather than by clicking at it.
 *
 * A click lands wherever the layout puts the coordinates, and these checks run in a document earlier
 * ones have changed, so a block is addressed by a selector or by text and the range is built from it:
 * the caret is then inside the block the check is about whatever the block has become.
 */
const caretIn = async (root: Locator, selector: string): Promise<void> => {
  const block = root.locator(selector).first();

  await expect(block, `a block matching ${selector}`).toHaveCount(1);

  await block.evaluate((element) => {
    const target = element as HTMLElement;

    target.focus();

    const text = document.createTreeWalker(target, NodeFilter.SHOW_TEXT).nextNode();
    const range = document.createRange();

    if (text) {
      range.setStart(text, 0);
      range.collapse(true);
    } else {
      range.selectNodeContents(target);
      range.collapse(true);
    }

    const selection = window.getSelection();

    selection?.removeAllRanges();
    selection?.addRange(range);
    document.dispatchEvent(new Event('selectionchange'));
  });
};

/** The caret in the editor's own paragraph, which the demo's heading is not. */
const caretInParagraph = (root: Locator): Promise<void> => caretIn(root, ':scope > p');

/**
 * Empties the editor and leaves one paragraph holding `text`.
 *
 * These checks run in sequence against one page, and a check that turns a paragraph into a heading
 * leaves a document the next one has to describe. Starting from a paragraph of its own makes each
 * check readable on its own, which is what a failure has to be.
 */
const resetToParagraph = async (target: Locator, text = '段落'): Promise<void> => {
  await target.click();
  await target.page().keyboard.press('Control+a');
  await target.page().keyboard.press('Backspace');
  await target.page().keyboard.type(text);
  await expect(target.locator(':scope > p')).toHaveCount(1);
};

/** Selects everything in the editor and leaves it focused. */
const selectAll = async (root: Locator): Promise<void> => {
  await root.click();
  await root.page().keyboard.press('Control+a');
};

test.describe('rich text editor toolbar sweep', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/components/rich-text-editor');
    await expect(page.locator('.rt-editor').first()).toBeVisible();
  });

  test('renders every toolbar control as an icon, with its name and shortcut on the tooltip', async ({
    page,
  }) => {
    const first = toolbar(editorOf(page, '文本格式与段落'));

    // A control that shows its own name is a button this library failed to give an icon.
    const textButtons = await first
      .locator('button')
      .evaluateAll((nodes) =>
        nodes
          .filter((node) => node.querySelector('.rbs-rte-tool-text') !== null)
          .map((node) => node.getAttribute('aria-label') ?? '(unnamed)'),
      );

    expect(textButtons).toEqual([]);

    for (const [name, shortcut] of [
      ['Select all', 'Ctrl+A'],
      ['Clear formatting', null],
      ['Horizontal rule', null],
    ] as const) {
      const button = first.getByRole('button', { exact: true, name });

      await expect(button).toBeVisible();
      await expect(button.locator('svg')).toHaveCount(1);
      await expect(button).toHaveAttribute('title', shortcut ? `${name} (${shortcut})` : name);
    }
  });

  test('gives the controls a reader has to tell apart their own icon', async ({ page }) => {
    const first = toolbar(editorOf(page, '文本格式与段落'));
    const icons = await first.locator('button').evaluateAll((nodes) =>
      nodes.map((node) => ({
        label: node.getAttribute('aria-label') ?? '?',
        shapes: (node.querySelector('svg')?.innerHTML ?? '').replace(/></g, '>\n<'),
      })),
    );

    expect(icons).toHaveLength(43);
    expect(icons.filter((icon) => icon.shapes.length === 0)).toEqual([]);

    // Every control has a picture of its own: a pair that shares one is a pair a reader cannot tell
    // apart, whatever their accessible names say.
    const seen = new Map<string, string[]>();

    for (const icon of icons) {
      const key = String(icon.shapes);

      seen.set(key, [...(seen.get(key) ?? []), icon.label]);
    }

    const shared = Array.from(seen.values()).filter((labels) => labels.length > 1);

    // Two disclosure carets are both disclosure; every *other* control carries a picture of its own.
    expect(shared).toEqual([['Font size', 'More insert options']]);
  });

  test('shows a hover state on the rows of every panel', async ({ page }) => {
    const scope = editorOf(page, '文本格式与段落');

    /*
     * Each panel is opened by the trigger that owns it and a row inside it is hovered. A colour
     * swatch is the exception: its own fill *is* its background, so what a pointer adds is the ring
     * around it — the check looks for a ring instead.
     */
    const panels: [string, string, 'fill' | 'ring'][] = [
      ['Paragraph style', 'Normal text', 'fill'],
      ['Font family', 'System default', 'fill'],
      ['Font size', '12 px', 'fill'],
      ['Text color', 'Cool Light blue', 'ring'],
      ['Highlight color', 'Light Light yellow', 'ring'],
      ['Line height', '1.5', 'fill'],
      ['Paragraph spacing', 'Compact', 'fill'],
      ['Code block', 'JavaScript', 'fill'],
      ['Emoji', 'Emoji soccer ball', 'fill'],
      ['Special symbol', 'Symbol rightwards arrow', 'fill'],
      ['Date and time', '2024-05-06', 'fill'],
      ['More insert options', 'Horizontal rule', 'fill'],
    ];

    for (const [label, rowName, kind] of panels) {
      await toolbar(scope).getByRole('button', { name: label }).click();

      const panel = openPanel(page);

      await expect(panel, `${label} opens a panel`).toBeVisible();

      const row = panel.getByRole('button', { exact: true, name: rowName });

      await expect(row, `${label} has a row named ${rowName}`).toHaveCount(1);
      // A resized panel can open underneath the pointer; measure its unhovered state first.
      await page.mouse.move(0, 0);

      const read = () =>
        row.evaluate((node) => {
          const style = getComputedStyle(node);

          return {
            background: style.backgroundColor,
            outline: style.outlineWidth,
            outlineColor: style.outlineColor,
            outlineStyle: style.outlineStyle,
          };
        });

      const before = await read();

      await row.hover();

      const after = await read();

      if (kind === 'fill') {
        expect(after.background, `${label}: the row reacts to the pointer`).not.toBe(
          before.background,
        );
        expect(after.background, `${label}: the row is painted`).not.toBe('rgba(0, 0, 0, 0)');
      } else {
        // A swatch cannot change its fill: it is the colour it applies.
        expect(after.outlineStyle, `${label}: the swatch gains a ring`).toBe('solid');
        expect(after.outline, `${label}: the ring is thick enough to see`).not.toBe('0px');
        expect(after.background, `${label}: the swatch keeps its colour`).toBe(before.background);
      }

      await page.keyboard.press('Escape');
      await expect(page.locator('.rbs-rte-panel')).toHaveCount(0);
    }
  });

  test('keeps the examples clear of the API reference', async ({ page }) => {
    const lastDemo = demo(page, '自定义与内核直用');
    const api = page
      .locator('section')
      .filter({ has: page.getByRole('heading', { level: 2, name: 'API Documentation' }) });

    const demoBox = await lastDemo.boundingBox();
    const apiBox = await api.boundingBox();

    expect(demoBox).not.toBeNull();
    expect(apiBox).not.toBeNull();

    expect(apiBox!.y - (demoBox!.y + demoBox!.height)).toBeGreaterThan(40);
  });

  test('breaks a line when Enter is pressed', async ({ page }) => {
    const target = mainEditor(page);

    await caretInParagraph(target);

    const before = await target.locator(':scope > p').count();

    await page.keyboard.press('Enter');
    await page.keyboard.type('第二段');
    await page.waitForTimeout(150);

    expect(await target.locator(':scope > p').count()).toBe(before + 1);
    await expect(target.getByText('第二段')).toBeVisible();
  });

  test('creates a visible paragraph after the terminal rule using native End and Enter', async ({
    page,
  }) => {
    const target = mainEditor(page);

    await target.locator(':scope > hr').click();
    await page.keyboard.press('End');
    await page.keyboard.press('Enter');
    await page.keyboard.type('after rule');
    await expect(target.locator(':scope > hr + p')).toHaveText('after rule');
  });

  test('keeps Enter stable at heading and horizontal-rule boundaries', async ({ page }) => {
    const target = mainEditor(page);
    const heading = target.locator(':scope > h2').first();

    await heading.evaluate((element) => {
      const range = document.createRange();

      range.setStart(element.firstChild ?? element, 0);
      range.collapse(true);

      const selection = window.getSelection();

      selection?.removeAllRanges();
      selection?.addRange(range);
      document.dispatchEvent(new Event('selectionchange'));
    });
    await page.keyboard.press('Enter');
    await page.keyboard.type('标题前');

    await expect(target.locator(':scope > p').first()).toHaveText('标题前');
    await expect(heading).toContainText('文本格式与段落');

    const placeBesideRule = async (side: 'after' | 'before'): Promise<void> => {
      await target.locator(':scope > hr').evaluate((element, edge) => {
        const root = element.parentNode;

        if (!root) {
          throw new Error('the horizontal rule has no editable parent');
        }

        const index = Array.from(root.childNodes).indexOf(element);
        const range = document.createRange();

        range.setStart(root, index + (edge === 'after' ? 1 : 0));
        range.collapse(true);

        const selection = window.getSelection();

        selection?.removeAllRanges();
        selection?.addRange(range);
        document.dispatchEvent(new Event('selectionchange'));
      }, side);
    };

    await placeBesideRule('before');
    await page.keyboard.press('Enter');
    await page.keyboard.type('分割线前');
    await expect(target.locator(':scope > hr').locator('xpath=preceding-sibling::*[1]')).toHaveText(
      '分割线前',
    );

    await placeBesideRule('after');
    await page.keyboard.press('Enter');
    await page.keyboard.type('分割线后');
    await expect(target.locator(':scope > hr').locator('xpath=following-sibling::*[1]')).toHaveText(
      '分割线后',
    );
  });

  test('keeps every mark toggle working, on and off', async ({ page }) => {
    const target = mainEditor(page);
    const first = mainToolbar(page);

    const marks: [string, string][] = [
      ['Bold', 'strong'],
      ['Italic', 'em'],
      ['Underline', 'u'],
      ['Strikethrough', 's'],
      ['Inline code', 'code'],
      ['Superscript', 'sup'],
      ['Subscript', 'sub'],
    ];

    for (const [label, tag] of marks) {
      const button = first.getByRole('button', { exact: true, name: label });

      await selectAll(target);
      await expect(button, `${label} is enabled with a selection`).toBeEnabled();
      await button.click();

      expect(await target.locator(tag).count(), `${label} applies`).toBeGreaterThan(0);

      await selectAll(target);
      await button.click();

      await expect(target.locator(tag), `${label} removes`).toHaveCount(0);
    }
  });

  test('applies every block structure from the paragraph picker', async ({ page }) => {
    const target = mainEditor(page);
    const style = mainToolbar(page).getByRole('button', { name: 'Paragraph style' });

    for (const [label, tag] of [
      ['Heading 1', 'h1'],
      ['Heading 2', 'h2'],
      ['Heading 6', 'h6'],
    ] as const) {
      // A heading is not a paragraph, so each level starts from a paragraph of its own.
      await resetToParagraph(target);
      await caretIn(target, ':scope > p');
      await expect(style, 'the picker is enabled in a paragraph').toBeEnabled();
      await style.click();
      await openPanel(page).getByRole('button', { name: label }).click();

      await expect(target.locator(tag), label).toHaveCount(1);
    }

    // And the picker turns a heading back into a paragraph.
    await caretIn(target, ':scope > h6');
    await style.click();
    await openPanel(page).getByRole('button', { name: 'Normal text' }).click();

    await expect(target.locator('h1, h2, h6')).toHaveCount(0);
    await expect(target.locator(':scope > p')).toHaveCount(1);
  });

  test('applies every alignment', async ({ page }) => {
    const target = mainEditor(page);
    const first = mainToolbar(page);

    for (const [label, align] of [
      ['Align center', 'center'],
      ['Align right', 'right'],
      ['Justify', 'justify'],
    ] as const) {
      await caretInParagraph(target);

      const button = first.getByRole('button', { exact: true, name: label });

      await expect(button, `${label} is enabled in a paragraph`).toBeEnabled();
      await button.click();

      await expect(target.locator('p').first()).toHaveAttribute(
        'style',
        new RegExp(`text-align: ${align}`),
      );
    }

    await caretInParagraph(target);
    await first.getByRole('button', { exact: true, name: 'Align left' }).click();

    // `left` is what a block already renders as, so it is not written at all.
    await expect(target.locator('p').first()).not.toHaveAttribute('style', /text-align/);
  });

  test('shows a new code line after a single Enter even before typing text', async ({ page }) => {
    const target = mainEditor(page);
    await resetToParagraph(target, 'const x = 1;');
    await mainToolbar(page).getByRole('button', { exact: true, name: 'Code block' }).click();
    await openPanel(page).getByRole('button', { exact: true, name: 'JavaScript' }).click();
    await page.keyboard.press('End');
    const before = (await target.locator('pre').boundingBox())!.height;
    await page.keyboard.press('Enter');
    await expect(target.locator('pre')).toHaveCount(1);
    await expect(target.locator('pre')).toHaveText('const x = 1;\n');
    expect((await target.locator('pre').boundingBox())!.height).toBeGreaterThan(before);
    await page.keyboard.type('x++;');
    await expect(target.locator('pre')).toHaveText('const x = 1;\nx++;');
  });

  test('shows selected link text and edits a whole link from an interior caret', async ({
    page,
  }) => {
    const target = mainEditor(page);
    const first = mainToolbar(page);
    await resetToParagraph(target, 'alpha beta omega');
    await target.locator('p').evaluate((element) => {
      const range = document.createRange();
      range.setStart(element.firstChild!, 6);
      range.setEnd(element.firstChild!, 10);
      window.getSelection()?.removeAllRanges();
      window.getSelection()?.addRange(range);
      document.dispatchEvent(new Event('selectionchange'));
    });
    await first.getByRole('button', { exact: true, name: 'Link' }).click();
    let dialog = page.getByRole('dialog');
    await expect(dialog.getByLabel('Link text')).toHaveValue('beta');
    await dialog.getByLabel('Destination').fill('https://example.com');
    await dialog.getByRole('button', { exact: true, name: 'Insert' }).click();
    await target.locator('a').evaluate((element) => {
      const range = document.createRange();
      range.setStart(element.firstChild!, 2);
      range.collapse(true);
      window.getSelection()?.removeAllRanges();
      window.getSelection()?.addRange(range);
      document.dispatchEvent(new Event('selectionchange'));
    });
    await first.getByRole('button', { exact: true, name: 'Link' }).click();
    dialog = page.getByRole('dialog');
    await expect(dialog.getByLabel('Link text')).toHaveValue('beta');
    await expect(dialog.getByLabel('Destination')).toHaveValue('https://example.com');
    await dialog.getByLabel('Link text').fill('BETTER');
    await dialog.getByRole('button', { exact: true, name: 'Update' }).click();
    await expect(target.locator('p').first()).toHaveText('alpha BETTER omega');
    await expect(target.locator('a')).toHaveCount(1);
  });

  test('selects and inserts a local image without a server upload adapter', async ({ page }) => {
    const target = mainEditor(page);
    await resetToParagraph(target, 'image here');
    await mainToolbar(page).getByRole('button', { exact: true, name: 'Image' }).click();
    const dialog = page.getByRole('dialog');
    await dialog.getByRole('button', { exact: true, name: 'Upload' }).click();
    await dialog.locator('input[type="file"]').setInputFiles({
      buffer: Buffer.from(
        'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+a0xkAAAAASUVORK5CYII=',
        'base64',
      ),
      mimeType: 'image/png',
      name: 'pixel.png',
    });
    await expect(dialog).toHaveCount(0);
    await expect(target.locator('img')).toHaveCount(1);
    await expect(target.locator('img')).toHaveAttribute('src', /^data:image\/png;base64,/);
    await expect(editorOf(page, '文本格式与段落').locator('.rbs-rte-upload-status')).toHaveCount(0);
    await expect
      .poll(() => target.locator('img').evaluate((image: HTMLImageElement) => image.naturalWidth))
      .toBe(1);
  });

  test('keeps an attached image toolbar visible without overlapping content', async ({ page }) => {
    const target = mainEditor(page);
    await resetToParagraph(target, 'image');
    await mainToolbar(page).getByRole('button', { exact: true, name: 'Image' }).click();
    const dialog = page.getByRole('dialog');
    await dialog
      .getByLabel('Image URL')
      .fill(
        'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+a0xkAAAAASUVORK5CYII=',
      );
    await dialog.getByRole('button', { exact: true, name: 'Insert image' }).click();
    const focus = page.getByRole('toolbar', { name: 'image focus toolbar' });
    await expect(focus).toBeVisible();
    await target.locator('img').click();
    await expect.poll(() => page.evaluate(() => window.getSelection()?.isCollapsed)).toBe(true);
    const toolbarStyle = await focus.evaluate((element) => {
      const style = getComputedStyle(element);
      return { gap: Number.parseFloat(style.columnGap), shadow: style.boxShadow };
    });
    expect(toolbarStyle.gap).toBeGreaterThanOrEqual(6);
    expect(toolbarStyle.shadow).toBe('none');
    for (const name of [
      'Image width 25%',
      'Image width 50%',
      'Image width 100%',
      'Original image size',
    ]) {
      const button = focus.getByRole('button', { name });
      expect(await button.evaluate((element) => element.scrollWidth <= element.clientWidth)).toBe(
        true,
      );
    }
    await expect
      .poll(async () => {
        const toolbarRect = await focus.boundingBox();
        const imageRect = await target.locator('img').boundingBox();
        return Boolean(
          toolbarRect && imageRect && toolbarRect.y + toolbarRect.height <= imageRect.y,
        );
      })
      .toBe(true);
    await focus.getByRole('button', { name: 'Image width 50%' }).click();
    const width = Number(await target.locator('img').getAttribute('width'));
    expect(width).toBeGreaterThan(1);
    await expect(focus).toBeVisible();
    await focus.getByRole('button', { name: 'Original image size' }).click();
    await expect(target.locator('img')).not.toHaveAttribute('width');
    await page.keyboard.press('Escape');
    await page.getByRole('heading', { exact: true, name: '文本格式与段落' }).click();
    await expect(focus).toBeVisible();
    // The attached toolbar scrolls with its content, rather than pinning itself to the viewport.
    await target.scrollIntoViewIfNeeded();
    await focus.getByRole('button', { name: 'Delete image' }).click();
    await expect(target.locator('img')).toHaveCount(0);
    await expect(focus).toHaveCount(0);
    await mainToolbar(page).getByRole('button', { exact: true, name: 'Undo' }).click();
    await expect(target.locator('img')).toHaveCount(1);
    await expect(focus).toBeVisible();
  });

  test('inserts iframe media with safe permissions and attached size/delete controls', async ({
    page,
  }) => {
    await page.route('https://example.test/player', (route) =>
      route.fulfill({ body: '<p>Test player</p>', contentType: 'text/html' }),
    );
    const target = mainEditor(page);
    await resetToParagraph(target, 'media');
    await mainToolbar(page)
      .getByRole('button', { exact: true, name: 'More insert options' })
      .click();
    await openPanel(page).getByRole('button', { exact: true, name: 'Video' }).click();
    const dialog = page.getByRole('dialog');
    await dialog.getByRole('button', { exact: true, name: 'Iframe' }).click();
    const input = dialog.getByLabel('Iframe URL or embed code');
    await input.fill('javascript:alert(1)');
    await expect(dialog.getByRole('button', { exact: true, name: 'Insert' })).toBeDisabled();
    await input.fill(
      '<iframe src="https://example.test/player" title="Test player" width="400" height="225" allow="camera" onload="alert(1)"></iframe>',
    );
    await dialog.getByRole('button', { exact: true, name: 'Insert' }).click();
    const frame = target.locator('iframe');
    await expect(frame).toHaveAttribute('src', 'https://example.test/player');
    await expect(frame).toHaveAttribute('sandbox', 'allow-scripts allow-presentation');
    await expect(frame).not.toHaveAttribute('onload');
    const focus = page.getByRole('toolbar', { name: 'embed focus toolbar' });
    await expect(focus).toBeVisible();
    await expect
      .poll(async () => {
        const controls = await focus.boundingBox();
        const media = await frame.boundingBox();
        return Boolean(controls && media && controls.y + controls.height <= media.y);
      })
      .toBe(true);
    await focus.getByRole('button', { name: 'Media width 50%' }).click();
    await expect(frame).not.toHaveAttribute('width', '400');
    await focus.getByRole('button', { name: 'Original media size' }).click();
    await expect(frame).toHaveAttribute('width', '560');
    await focus.getByRole('button', { name: 'Delete media' }).click();
    await expect(frame).toHaveCount(0);
    await mainToolbar(page).getByRole('button', { exact: true, name: 'Undo' }).click();
    await expect(frame).toHaveCount(1);
    await expect(focus).toBeVisible();
  });

  test('allows the Bilibili iframe to read its own cookies without accessing the editor', async ({
    page,
  }) => {
    const errors: string[] = [];
    const warnings: string[] = [];
    page.on('pageerror', (error) => errors.push(error.message));
    page.on('console', (message) => {
      if (message.type() === 'warning') {
        warnings.push(message.text());
      }
    });
    await page.route('https://player.bilibili.com/player.html**', (route) =>
      route.fulfill({
        body: `<body><script>
          document.cookie;
          document.body.dataset.cookieReadable = 'true';
          try { parent.document.body; } catch (error) {
            document.body.dataset.parentBlocked = String(error.name === 'SecurityError');
          }
        </script></body>`,
        contentType: 'text/html',
      }),
    );
    const target = mainEditor(page);
    await resetToParagraph(target, 'media');
    await mainToolbar(page)
      .getByRole('button', { exact: true, name: 'More insert options' })
      .click();
    await openPanel(page).getByRole('button', { exact: true, name: 'Video' }).click();
    const dialog = page.getByRole('dialog');
    await dialog.getByRole('button', { exact: true, name: 'Iframe' }).click();
    await dialog
      .getByLabel('Iframe URL or embed code')
      .fill(
        '<iframe src="//player.bilibili.com/player.html?isOutside=true&aid=117409105053246&bvid=BV1MWps6VEWW&cid=42566225415&p=1" scrolling="no" border="0" frameborder="no" framespacing="0" allowfullscreen="true"></iframe>',
      );
    await dialog.getByRole('button', { exact: true, name: 'Insert' }).click();
    const frame = target.locator('iframe');
    await expect(frame).toHaveAttribute(
      'sandbox',
      'allow-scripts allow-presentation allow-same-origin',
    );
    await expect(frame).toHaveAttribute('allowfullscreen', '');
    await expect(frame).toHaveAttribute('allow', 'autoplay; encrypted-media; picture-in-picture');
    await expect(target.frameLocator('iframe').locator('body')).toHaveAttribute(
      'data-cookie-readable',
      'true',
    );
    await expect(target.frameLocator('iframe').locator('body')).toHaveAttribute(
      'data-parent-blocked',
      'true',
    );
    expect(
      errors.filter((message) => message.includes('cookie') || message.includes('sandbox')),
    ).toEqual([]);
    expect(warnings.filter((message) => message.includes('allowfullscreen'))).toEqual([]);
  });

  test('renders a platform video URL as an iframe rather than a native video tag', async ({
    page,
  }) => {
    let referer: string | undefined;
    await page.route('https://www.youtube-nocookie.com/**', async (route) => {
      referer = (await route.request().allHeaders()).referer;
      await route.fulfill({ body: '<p>Test video player</p>', contentType: 'text/html' });
    });
    const target = mainEditor(page);
    await resetToParagraph(target, 'video');
    await mainToolbar(page)
      .getByRole('button', { exact: true, name: 'More insert options' })
      .click();
    await openPanel(page).getByRole('button', { exact: true, name: 'Video' }).click();
    const dialog = page.getByRole('dialog');
    await dialog.getByLabel('Video URL').fill('https://youtu.be/zpOULjyy-n8?si=eRWkH0K8V4PrDRA8');
    await dialog.getByRole('button', { exact: true, name: 'Insert' }).click();
    await expect(target.locator('iframe')).toHaveAttribute(
      'src',
      'https://www.youtube-nocookie.com/embed/zpOULjyy-n8',
    );
    await expect(target.locator('iframe')).toHaveAttribute(
      'referrerpolicy',
      'strict-origin-when-cross-origin',
    );
    await expect.poll(() => referer).toBe(`${new URL(page.url()).origin}/`);
    await expect(target.locator('video')).toHaveCount(0);
    await expect(page.getByRole('toolbar', { name: 'video focus toolbar' })).toBeVisible();
  });

  test('toggles every list, the quote and the code block', async ({ page }) => {
    const target = mainEditor(page);
    const first = mainToolbar(page);

    await resetToParagraph(target);

    const blocks: [string, string][] = [
      ['Bulleted list', 'ul'],
      ['Numbered list', 'ol'],
      ['Checklist', 'ul[data-task-list]'],
      ['Blockquote', 'blockquote'],
      ['Code block', 'pre'],
    ];

    for (const [label, selector] of blocks) {
      // Each toggle converts the block it is used in, so each starts from a paragraph of its own.
      await resetToParagraph(target);
      await caretIn(target, ':scope > p');

      const toggle = first.getByRole('button', { exact: true, name: label });

      await expect(toggle, `${label} is enabled in a paragraph`).toBeEnabled();
      await toggle.click();
      if (label === 'Code block') {
        await openPanel(page).getByRole('button', { exact: true, name: 'Plain text' }).click();
      }

      expect(await target.locator(selector).count(), `${label} applies`).toBeGreaterThan(0);
    }

    // A toggle undoes itself: the list goes away and the paragraph underneath comes back.
    await resetToParagraph(target);
    await caretIn(target, ':scope > p');
    await first.getByRole('button', { exact: true, name: 'Bulleted list' }).click();
    expect(await target.locator('ul').count()).toBe(1);

    await caretIn(target, ':scope > li, :scope > ul li');
    await first.getByRole('button', { exact: true, name: 'Bulleted list' }).click();
    expect(await target.locator('ul').count()).toBe(0);
  });

  test('indents, outdents and rules a line', async ({ page }) => {
    const target = mainEditor(page);
    const first = mainToolbar(page);

    await caretInParagraph(target);

    const indent = first.getByRole('button', { name: 'Increase indent' });

    await expect(indent).toBeEnabled();
    await indent.click();
    expect(await target.locator('[data-indent="1"]').count()).toBeGreaterThan(0);

    await first.getByRole('button', { name: 'Decrease indent' }).click();
    await expect(target.locator('[data-indent]')).toHaveCount(0);

    const rules = await target.locator('hr').count();

    await first.getByRole('button', { name: 'Horizontal rule' }).click();
    expect(await target.locator('hr').count()).toBe(rules + 1);
  });

  test('sets a line height and a paragraph spacing from the panel', async ({ page }) => {
    const target = mainEditor(page);

    await caretInParagraph(target);
    await mainToolbar(page).getByRole('button', { exact: true, name: 'Line height' }).click();

    await openPanel(page).locator('[data-panel-item]').filter({ hasText: '1.5' }).first().click();
    await expect(target.locator('p').first()).toHaveAttribute('style', /line-height: 1\.5/);

    await mainToolbar(page).getByRole('button', { exact: true, name: 'Paragraph spacing' }).click();
    await openPanel(page)
      .locator('[data-panel-item]')
      .filter({ hasText: 'Compact' })
      .first()
      .click();
    await expect(target.locator('p').first()).toHaveAttribute('style', /margin-bottom: 4px/);
  });

  test('sets a font family and a font size from the panels', async ({ page }) => {
    const target = mainEditor(page);
    const first = mainToolbar(page);

    await selectAll(target);

    await first.getByRole('button', { name: 'Font family' }).click();
    await openPanel(page)
      .locator('[data-panel-item]')
      .filter({ hasText: 'Georgia' })
      .first()
      .click();
    expect(await target.locator('span[style*="font-family"]').count()).toBeGreaterThan(0);

    await first.getByRole('button', { name: 'Font size' }).click();
    await openPanel(page).locator('[data-panel-item]').filter({ hasText: '24 px' }).first().click();
    expect(await target.locator('span[style*="font-size"]').count()).toBeGreaterThan(0);
  });

  test('applies a text color and a highlight, and clears both', async ({ page }) => {
    const target = mainEditor(page);
    const first = mainToolbar(page);

    await selectAll(target);
    await expect(first.getByRole('button', { name: 'Text color' })).toBeEnabled();
    await first.getByRole('button', { name: 'Text color' }).click();
    await openPanel(page).locator('[data-color="#e7f5ff"]').click();
    expect(await target.locator('span[style*="color"]').count()).toBeGreaterThan(0);

    await selectAll(target);
    await first.getByRole('button', { name: 'Highlight color' }).click();
    await openPanel(page).locator('[data-color="#fff3bf"]').click();
    expect(await target.locator('mark').count()).toBeGreaterThan(0);

    await selectAll(target);
    await first.getByRole('button', { name: 'Clear formatting' }).click();

    await expect(target.locator('mark')).toHaveCount(0);
    await expect(target.locator('span[style*="color"]')).toHaveCount(0);
  });

  test('selects the whole document from the toolbar', async ({ page }) => {
    await mainEditor(page).click();

    const selectAllButton = mainToolbar(page).getByRole('button', { name: 'Select all' });

    await expect(selectAllButton).toBeEnabled();
    await selectAllButton.click();

    expect(await page.evaluate(() => String(window.getSelection()).length)).toBeGreaterThan(10);
  });

  test('inserts a link and an image from the dialogs', async ({ page }) => {
    const target = mainEditor(page);
    const first = mainToolbar(page);

    await selectAll(target);
    await first.getByRole('button', { exact: true, name: 'Link' }).click();

    const link = page.getByRole('dialog', { name: 'Insert link' });

    await link.getByLabel('Destination').fill('https://example.com');
    await link.getByRole('button', { name: 'Insert' }).click();

    expect(await target.locator('a[href="https://example.com"]').count()).toBeGreaterThan(0);

    // An image needs a caret, and the paragraph just linked is not one; an empty block is.
    await target.click();
    await page.keyboard.press('Control+a');
    await page.keyboard.press('Backspace');

    await first.getByRole('button', { exact: true, name: 'Image' }).click();

    const image = page.getByRole('dialog', { name: 'Insert image' });

    await image.getByLabel('Image URL').fill('https://example.com/a.png');
    await image.getByRole('button', { name: 'Insert image' }).click();

    await expect(target.locator('img[src="https://example.com/a.png"]')).toHaveCount(1);
  });

  test('inserts a table from the insert panel', async ({ page }) => {
    const target = mainEditor(page);

    await caretInParagraph(target);
    await mainToolbar(page).getByRole('button', { name: 'More insert options' }).click();
    await openPanel(page).getByRole('button', { exact: true, name: 'Table' }).click();

    const dialog = page.getByRole('dialog', { name: 'Insert table' });

    await dialog.getByLabel('Rows').fill('2');
    await dialog.getByLabel('Columns').fill('2');
    await dialog.getByRole('button', { name: 'Insert table' }).click();

    await expect(target.locator('table')).toHaveCount(1);
    await expect(target.locator('tr')).toHaveCount(2);
    await expect(target.locator('td')).toHaveCount(4);
  });

  test('inserts an emoji, a symbol and a date from the panels', async ({ page }) => {
    const scope = editorOf(page, '文本格式与段落');
    const target = editable(scope);
    const first = toolbar(scope);

    await caretInParagraph(target);
    await first.getByRole('button', { name: 'Emoji' }).click();
    await page.getByPlaceholder('Search emoji').fill('grinning face with smiling eyes');
    await page.getByRole('button', { name: 'Emoji grinning face with smiling eyes' }).click();
    await expect(target.locator('[data-emoji="😄"]')).toHaveCount(1);
    await expect(target.locator('[data-emoji="😄"]')).toHaveText('😄');

    await caretInParagraph(target);
    await first.getByRole('button', { name: 'Special symbol' }).click();
    await page.getByPlaceholder('Search symbols').fill('multiplication sign');
    await page.getByRole('button', { name: 'Symbol multiplication sign' }).click();
    await expect(target.locator('[data-symbol="×"]')).toHaveCount(1);
    await expect(target.locator('[data-symbol="×"]')).toHaveText('×');

    await caretInParagraph(target);
    await first.getByRole('button', { name: 'Date and time' }).click();
    await page.getByRole('button', { exact: true, name: '2024-05-06' }).click();
    expect(await target.locator('[data-node="date"]').count()).toBeGreaterThan(0);
  });

  test('keeps code language separate from line height and spacing', async ({ page }) => {
    const target = mainEditor(page);
    const first = mainToolbar(page);
    await caretInParagraph(target);
    await first.getByRole('button', { exact: true, name: 'Line height' }).click();
    await expect(openPanel(page)).not.toContainText('Code block language');
    await expect(openPanel(page)).not.toContainText('Paragraph spacing');
    await first.getByRole('button', { exact: true, name: 'Paragraph spacing' }).click();
    await expect(openPanel(page)).toContainText('Paragraph spacing');
    await expect(openPanel(page)).not.toContainText('Line height');
    await first.getByRole('button', { exact: true, name: 'Code block' }).click();
    await expect(openPanel(page)).not.toContainText('Line height');
    await openPanel(page).getByRole('button', { exact: true, name: 'JavaScript' }).click();
    await expect(target.locator('pre').first()).toHaveAttribute('data-language', 'javascript');
    await expect(page.locator('.rbs-rte-panel')).toHaveCount(0);
    await first.getByRole('button', { exact: true, name: 'Code block' }).click();
    await openPanel(page).getByRole('button', { exact: true, name: 'Normal text' }).click();
    await expect(target.locator('pre')).toHaveCount(0);
  });

  test('keeps Enter inside one highlighted code block and preserves typing positions', async ({
    page,
  }) => {
    const target = mainEditor(page);
    const first = mainToolbar(page);
    await resetToParagraph(target, 'const answer = 42;');
    await first.getByRole('button', { exact: true, name: 'Code block' }).click();
    await openPanel(page).getByRole('button', { exact: true, name: 'JavaScript' }).click();
    const code = target.locator('pre');
    await expect(code.locator('.hljs-keyword')).toHaveText('const');
    await expect(code.locator('.hljs-number')).toHaveText('42');
    const colors = await code.evaluate((element) => ({
      keyword: getComputedStyle(element.querySelector('.hljs-keyword')!).color,
      normal: getComputedStyle(element).color,
    }));
    expect(colors.keyword).not.toBe(colors.normal);
    await page.keyboard.press('End');
    await page.keyboard.press('Enter');
    await page.keyboard.type('return answer;');
    await page.keyboard.press('Shift+Enter');
    await page.keyboard.type('// done');
    await expect(code).toHaveCount(1);
    await expect(code).toHaveText('const answer = 42;\nreturn answer;\n// done');
    await expect(code.locator('.hljs-comment')).toHaveText('// done');
    await first.getByRole('button', { exact: true, name: 'Code block' }).click();
    await openPanel(page).getByRole('button', { exact: true, name: 'Plain text' }).click();
    await expect(code.locator('[class*="hljs-"]')).toHaveCount(0);
    await expect(code).toHaveText('const answer = 42;\nreturn answer;\n// done');
  });

  test('inserts emoji through more insert options into an empty paragraph', async ({ page }) => {
    const target = mainEditor(page);
    const first = mainToolbar(page);
    await resetToParagraph(target, '');
    await first.getByRole('button', { name: 'More insert options' }).click();
    await openPanel(page).getByRole('button', { exact: true, name: 'Emoji' }).click();
    await page.getByPlaceholder('Search emoji').fill('grinning face with smiling eyes');
    await page.getByRole('button', { name: 'Emoji grinning face with smiling eyes' }).click();
    await expect(target.locator('[data-emoji="😄"]')).toHaveCount(1);
    await expect(page.locator('.rbs-rte-panel')).toHaveCount(0);
    await target.press('a');
    await expect(target.locator('p').first()).toHaveText('😄a');
  });

  test('inserts a visible emoji at a native text caret and continues typing after it', async ({
    page,
  }) => {
    const target = mainEditor(page);
    await resetToParagraph(target, 'abcd');
    await page.keyboard.press('Home');
    await page.keyboard.press('ArrowRight');
    await page.keyboard.press('ArrowRight');
    await mainToolbar(page).getByRole('button', { exact: true, name: 'Emoji' }).click();
    await page.getByPlaceholder('Search emoji').fill('grinning face with smiling eyes');
    await page.getByRole('button', { name: 'Emoji grinning face with smiling eyes' }).click();
    await expect(page.locator('.rbs-rte-panel')).toHaveCount(0);
    await page.keyboard.type('X');
    await expect(target.locator('p').first()).toHaveText('ab😄Xcd');
  });

  test('undoes and redoes from the toolbar', async ({ page }) => {
    const target = mainEditor(page);
    const first = mainToolbar(page);

    await selectAll(target);

    // The document is emptied first, so the mark count is about this edit and nothing else; a
    // character is typed so there is text for a mark to cover.
    await target.click();
    await page.keyboard.press('Control+a');
    await page.keyboard.press('Backspace');
    await page.keyboard.type('可撤销的文本');

    const before = await target.locator('strong').count();
    const bold = first.getByRole('button', { exact: true, name: 'Bold' });

    await selectAll(target);
    await expect(bold).toBeEnabled();
    await bold.click();

    const bolded = await target.locator('strong').count();

    expect(bolded).toBeGreaterThan(before);

    await first.getByRole('button', { exact: true, name: 'Undo' }).click();
    expect(await target.locator('strong').count()).toBe(before);

    await first.getByRole('button', { exact: true, name: 'Redo' }).click();
    expect(await target.locator('strong').count()).toBe(bolded);
  });

  test('finds and replaces from the dialog', async ({ page }) => {
    const scope = editorOf(page, '编辑操作');
    const target = editable(scope);

    await target.click();
    await toolbar(scope).getByRole('button', { name: 'Find and replace' }).click();

    const dialog = page.getByRole('dialog', { name: 'Find and replace' });

    await dialog.getByLabel('Find').fill('查找替换');
    await expect(dialog.getByText('1 match in the document')).toBeVisible();

    await dialog.getByLabel('Replace with').fill('搜索');
    await dialog.getByRole('button', { name: 'Replace all' }).click();

    await expect(target).toContainText('搜索');
  });

  test('copies and pastes through the clipboard controls', async ({ context, page }) => {
    await context.grantPermissions(['clipboard-read', 'clipboard-write']);

    const target = mainEditor(page);
    const first = mainToolbar(page);

    const copy = first.getByRole('button', { exact: true, name: 'Copy' });
    const paste = first.getByRole('button', { exact: true, name: 'Paste' });

    await selectAll(target);
    await expect(copy).toBeEnabled();
    await copy.click();

    await expect
      .poll(async () => (await page.evaluate(() => navigator.clipboard.readText())).length)
      .toBeGreaterThan(0);

    await page.evaluate(() => navigator.clipboard.writeText('pasted by the toolbar'));
    await target.click();
    await expect(paste).toBeEnabled();
    await paste.click();

    await expect(target).toContainText('pasted by the toolbar');
  });
});
