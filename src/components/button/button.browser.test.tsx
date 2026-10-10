import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, render } from 'vitest-browser-react';
import { page, userEvent } from 'vitest/browser';

import styles from './button.module.css';
import { Button } from './button.tsx';

afterEach(() => {
  cleanup();
});

describe('Button', () => {
  it('renders a native button with the base class by default', async () => {
    render(<Button>保存</Button>);

    const button = page.getByRole('button', { name: '保存' });

    await expect.element(button).toBeInTheDocument();
    await expect.element(button).toHaveAttribute('type', 'button');
    expect(button.element().classList.contains('btn')).toBe(true);
  });

  it('applies variant, size, block, active and custom classes', async () => {
    render(
      <Button active block className="shadow-sm" size="lg" variant="outline-primary">
        主要
      </Button>,
    );

    const button = await page.getByRole('button', { name: '主要' }).findElement();

    expect(button.className).toBe('btn btn-outline-primary btn-lg active w-100 shadow-sm');
  });

  it('renders an anchor and keeps focus out of the tab order when disabled', async () => {
    render(
      <Button disabled href="/docs" variant="primary">
        禁用链接
      </Button>,
    );

    const link = await page.getByRole('link', { name: '禁用链接' }).findElement();

    expect(link.tagName).toBe('A');
    expect(link.getAttribute('href')).toBe('/docs');
    expect(link.getAttribute('aria-disabled')).toBe('true');
    expect(link.getAttribute('tabindex')).toBe('-1');
    expect(link.classList.contains('disabled')).toBe(true);
    expect(link.classList.contains('btn-primary')).toBe(true);
  });

  it('calls onClick when pressed', async () => {
    const onClick = vi.fn<(event: unknown) => void>();
    render(<Button onClick={onClick}>点击</Button>);

    await page.getByRole('button', { name: '点击' }).click();

    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('does not call onClick while loading', async () => {
    const onClick = vi.fn<(event: unknown) => void>();
    render(
      <Button loading loadingText="提交中..." onClick={onClick} variant="primary">
        提交
      </Button>,
    );

    const button = page.getByRole('button', { name: '提交中...' });

    await expect.element(button).toBeDisabled();
    await expect.element(button).toHaveAttribute('aria-busy', 'true');
    await expect.element(button).toHaveClass(styles.loading);

    await button.click({ force: true });

    expect(onClick).not.toHaveBeenCalled();
  });

  it('toggles aria-pressed in uncontrolled toggle mode', async () => {
    render(<Button toggle>切换</Button>);

    const button = page.getByRole('button', { name: '切换' });

    await expect.element(button).toHaveAttribute('aria-pressed', 'false');
    await button.click();
    await expect.element(button).toHaveAttribute('aria-pressed', 'true');
    await expect.element(button).toHaveClass(/active/);
    await button.click();
    await expect.element(button).toHaveAttribute('aria-pressed', 'false');
  });

  it('keeps the pressed state controlled when active is provided', async () => {
    const onClick = vi.fn<(event: unknown) => void>();
    render(
      <Button active={false} onClick={onClick} toggle variant="info">
        受控切换
      </Button>,
    );

    const button = page.getByRole('button', { name: '受控切换' });

    await button.click();

    expect(onClick).toHaveBeenCalledTimes(1);
    await expect.element(button).toHaveAttribute('aria-pressed', 'false');
  });

  it('supports keyboard activation', async () => {
    const onClick = vi.fn<(event: unknown) => void>();
    render(<Button onClick={onClick}>键盘</Button>);

    const button = await page.getByRole('button', { name: '键盘' }).findElement();
    button.focus();
    await userEvent.keyboard('{Enter}');

    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('renders as an input element when as="input" is set', async () => {
    render(<Button as="input" type="submit" value="提交" variant="success" />);

    const input = await page.getByRole('button', { name: '提交' }).findElement();

    expect(input.tagName).toBe('INPUT');
    expect(input.getAttribute('type')).toBe('submit');
    expect(input.classList.contains('btn-success')).toBe(true);
  });
});
