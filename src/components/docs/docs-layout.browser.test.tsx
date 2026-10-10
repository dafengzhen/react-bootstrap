import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, render } from 'vitest-browser-react';
import { page } from 'vitest/browser';

import type { DocConfig } from './types.ts';

import { DocsLayout } from './docs-layout.tsx';
import styles from './docs.module.css';

const DOCS: DocConfig[] = [
  { description: '按钮组件', name: 'Button', path: '/button' },
  { description: '徽章组件', name: 'Badge', path: '/badge' },
];

const getPill = (container: HTMLElement) => container.querySelector(`.${styles.docsLoadingPill}`);
const getBar = (container: HTMLElement) => container.querySelector(`.${styles.docsLoadingBar}`);

afterEach(() => {
  cleanup();
});

describe('DocsLayout loading indicator', () => {
  it('renders no global loading indicator by default', async () => {
    const { container } = await render(<DocsLayout docs={DOCS}>内容</DocsLayout>);

    expect(getBar(container)).toBeNull();
    expect(getPill(container)).toBeNull();
    await expect.element(page.getByRole('main')).not.toHaveAttribute('aria-busy');
  });

  it('renders the global loading indicator when loading outlasts the delay', async () => {
    const { container } = await render(
      <DocsLayout docs={DOCS} loading>
        内容
      </DocsLayout>,
    );

    expect(getPill(container)).toBeNull();

    await vi.waitFor(() => {
      expect(getBar(container)).not.toBeNull();
      expect(getPill(container)).not.toBeNull();
    });

    await expect.element(page.getByRole('main')).toHaveAttribute('aria-busy', 'true');
    await expect.element(page.getByRole('status')).toHaveTextContent('正在加载…');
  });

  it('keeps the indicator visible for a minimum duration to avoid flashing', async () => {
    const { container, rerender } = await render(
      <DocsLayout docs={DOCS} loading>
        内容
      </DocsLayout>,
    );

    // Poll tightly so the minimum duration is asserted from the moment it shows.
    await vi.waitFor(
      () => {
        expect(getPill(container)).not.toBeNull();
      },
      { interval: 10, timeout: 2000 },
    );

    await rerender(<DocsLayout docs={DOCS}>内容</DocsLayout>);

    expect(getPill(container)).not.toBeNull();

    await vi.waitFor(() => {
      expect(getPill(container)).toBeNull();
    });
  });
});
