import { expect, test } from '@playwright/test';

test.describe('docs site', () => {
  test('renders the landing page with navigation and sidebar links', async ({ page }) => {
    await page.goto('/');

    await expect(page).toHaveTitle('React Bootstrap');

    const mainNav = page.getByRole('navigation', { name: '主导航' });
    await expect(mainNav.getByRole('link', { name: 'Getting Started' })).toHaveAttribute(
      'href',
      '/getting-started',
    );
    await expect(mainNav.getByRole('link', { name: 'Components' })).toHaveAttribute(
      'href',
      '/components',
    );

    await expect(page.getByRole('heading', { level: 1, name: 'Getting Started' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Installation' })).toBeVisible();
    await expect(
      page.getByText('npm install @dafengzhen/react-bootstrap bootstrap clsx react react-dom'),
    ).toBeVisible();

    const sidebar = page.getByRole('complementary', { name: 'Components' });
    await expect(sidebar.getByRole('link', { name: 'Accordion' })).toBeVisible();
    await expect(sidebar.getByRole('link', { exact: true, name: 'Button' })).toBeVisible();
  });

  test('navigates between pages through the main navigation', async ({ page }) => {
    await page.goto('/');

    const mainNav = page.getByRole('navigation', { name: '主导航' });
    await mainNav.getByRole('link', { name: 'Components' }).click();

    await expect(page).toHaveURL(/\/components$/);
    await expect(page.getByRole('heading', { level: 1, name: 'React Bootstrap' })).toBeVisible();
    await expect(
      page.getByRole('heading', { exact: true, level: 2, name: 'Button' }),
    ).toBeVisible();

    await mainNav.getByRole('link', { name: 'Blog' }).click();

    await expect(page).toHaveURL(/\/blog$/);
  });

  test('opens a component page directly through its url', async ({ page }) => {
    await page.goto('/components/button');

    await expect(page).toHaveTitle('Button · React Bootstrap');
    await expect(page.getByRole('heading', { level: 2, name: 'Button' })).toBeVisible();
    await expect(page.getByRole('heading', { name: '基础变体' })).toBeVisible();
    await expect(
      page
        .getByRole('complementary', { name: 'Components' })
        .getByRole('link', { exact: true, name: 'Button' }),
    ).toBeVisible();
  });

  test('shows a global loading indicator while a component page is loading', async ({ page }) => {
    await page.goto('/components/button');

    const sidebar = page.getByRole('complementary', { name: 'Components' });
    await expect(sidebar.getByRole('link', { exact: true, name: 'Menu' })).toBeVisible();

    // Keep the target route module in flight so the loading state is observable.
    await page.route(/\/(components\/menu\/|menu\.doc[^/]*\.js)/, async (route) => {
      await new Promise((resolve) => {
        setTimeout(resolve, 1000);
      });
      await route.continue();
    });

    await sidebar.getByRole('link', { exact: true, name: 'Menu' }).click();

    const loadingMain = page.locator('main[aria-busy="true"]');

    await expect(loadingMain).toHaveCount(1);
    await expect(page.getByRole('main').getByText('正在加载…')).toBeVisible();

    await expect(page.getByRole('heading', { level: 2, name: 'Menu' })).toBeVisible();
    await expect(loadingMain).toHaveCount(0);
  });
});
