import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, render } from 'vitest-browser-react';
import { page } from 'vitest/browser';

import { ImageGroup } from './image-group.tsx';
import { Image } from './image.tsx';

afterEach(() => {
  cleanup();
});

const renderGroup = () =>
  render(
    <ImageGroup>
      <Image alt="第一张" src="/first.png" />
      <Image alt="第二张" src="/second.png" />
    </ImageGroup>,
  );

describe('ImageGroup', () => {
  it('registers child images without looping through updates', async () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});

    await renderGroup();

    const updateLoopErrors = () =>
      consoleError.mock.calls.filter((call) => String(call[0]).includes('Maximum update depth'));

    await vi.waitFor(() => {
      expect(page.getByRole('button', { name: 'Preview 第二张' })).toBeInTheDocument();
    });

    expect(updateLoopErrors()).toHaveLength(0);
    consoleError.mockRestore();
  });

  it('opens the viewer on the image that was clicked', async () => {
    await renderGroup();

    await page.getByRole('button', { name: 'Preview 第二张' }).click();

    await expect.element(page.getByRole('dialog', { name: 'Image viewer' })).toBeVisible();
    await expect.element(page.getByText('2 / 2')).toBeVisible();
  });
});
