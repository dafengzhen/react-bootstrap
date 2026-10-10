import { expect, type Locator, test } from '@playwright/test';

const clickStable = async (locator: Locator): Promise<void> => {
  await locator.scrollIntoViewIfNeeded();
  await locator.click();
};

test.describe('button documentation demos', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/components/button');
  });

  test('renders every demo variant with the expected bootstrap classes', async ({ page }) => {
    await expect(page.getByRole('button', { exact: true, name: '主要' }).first()).toHaveClass(
      /btn-primary/,
    );

    for (const label of ['主要', '次要', '成功', '危险', '警告', '信息', '亮色', '暗色', '链接']) {
      await expect(page.getByRole('button', { exact: true, name: label }).first()).toBeVisible();
    }

    await expect(page.getByRole('button', { name: '小按钮 (sm)' })).toHaveClass(/btn-sm/);
    await expect(page.getByRole('button', { name: '大按钮 (lg)' })).toHaveClass(/btn-lg/);
    await expect(page.getByRole('button', { name: '块级按钮' })).toHaveClass(/w-100/);
  });

  test('reflects disabled and loading states', async ({ page }) => {
    await expect(page.getByRole('button', { name: '禁用按钮' })).toBeDisabled();
    await expect(page.getByRole('button', { name: '禁用轮廓按钮' })).toBeDisabled();

    const loading = page.getByRole('button', { exact: true, name: '加载中' });
    await expect(loading).toHaveAttribute('aria-busy', 'true');
    await expect(loading.locator('.spinner-border')).toBeVisible();
  });

  test('increments the interactive counter when clicked', async ({ page }) => {
    const counter = page.getByRole('button', { name: /^点击计数/ });

    await expect(counter).toHaveText('点击计数: 0');
    await clickStable(counter);
    await expect(counter).toHaveText('点击计数: 1');
    await clickStable(counter);
    await expect(counter).toHaveText('点击计数: 2');
  });

  test('toggles pressed state of a controlled toggle button', async ({ page }) => {
    const toggle = page.getByRole('button', { name: /^受控切换/ });

    await expect(toggle).toHaveAttribute('aria-pressed', 'false');

    await clickStable(toggle);

    expect(await toggle.evaluate((element) => element.getAttribute('aria-pressed'))).toBe('true');
    expect(await toggle.evaluate((element) => element.textContent)).toContain('已激活');
    expect(await toggle.evaluate((element) => element.classList.contains('active'))).toBe(true);
  });

  test('copies a demo code block to the clipboard', async ({ context, page }) => {
    await context.grantPermissions(['clipboard-read', 'clipboard-write']);

    const section = page.locator('section', { has: page.getByRole('heading', { name: '基础类' }) });
    await section.getByRole('button', { name: '查看代码' }).click();
    await section.getByRole('button', { name: '复制代码' }).click();

    const clipboard = await page.evaluate(() => navigator.clipboard.readText());
    expect(clipboard).toContain('<Button>');
  });
});
