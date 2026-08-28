import type { MouseEvent as ReactMouseEvent, ReactNode, Ref } from 'react';

import clsx from 'clsx';
import { forwardRef } from 'react';

import type { SidebarButtonProps, SidebarItemProps, SidebarLinkProps } from './types';

import { useSidebarRequired } from './sidebar-context';
import styles from './sidebar.module.css';

interface SidebarItemContentProps {
  badge?: ReactNode;
  children?: ReactNode;
  icon?: ReactNode;
}

interface UseSidebarItemOptions<T extends HTMLElement> {
  active: boolean;
  disabled: boolean;
  hasIcon: boolean;
  onClick?: (event: ReactMouseEvent<T>) => void;
}

const getInitial = (children: ReactNode): string | undefined => {
  if (typeof children === 'string') {
    return children.trim().slice(0, 1) || undefined;
  }
  if (typeof children === 'number') {
    return String(children).slice(0, 1);
  }
  return undefined;
};

const SidebarItemContent = ({ badge, children, icon }: SidebarItemContentProps) => {
  const initial = icon == null ? getInitial(children) : undefined;

  return (
    <>
      {icon != null ? (
        <span className={styles.itemIcon}>{icon}</span>
      ) : initial ? (
        <span aria-hidden="true" className={clsx(styles.itemIcon, styles.itemInitial)}>
          {initial}
        </span>
      ) : null}
      <span className={styles.itemLabel}>{children}</span>
      {badge != null && <span className={styles.itemBadge}>{badge}</span>}
    </>
  );
};

const useSidebarItem = <T extends HTMLElement>({
  active,
  disabled,
  hasIcon,
  onClick,
}: UseSidebarItemOptions<T>) => {
  const { collapseOnSelect, isMobile, onItemSelect, setMobileOpen } = useSidebarRequired();

  const handleClick = (event: ReactMouseEvent<T>) => {
    onClick?.(event);
    if (event.defaultPrevented || disabled) {
      return;
    }
    if (collapseOnSelect && isMobile) {
      setMobileOpen(false);
    }
    onItemSelect?.();
  };

  return {
    handleClick,
    itemClassName: clsx(
      styles.item,
      !hasIcon && styles.itemNoIcon,
      active && styles.itemActive,
      disabled && styles.itemDisabled,
    ),
    itemProps: {
      'aria-current': active ? ('page' as const) : undefined,
      'aria-disabled': disabled || undefined,
      tabIndex: disabled ? -1 : undefined,
    },
  };
};

export const SidebarItem = forwardRef<HTMLElement, SidebarItemProps>(({ href, ...rest }, ref) => {
  if (href !== undefined) {
    return <SidebarLink href={href} ref={ref as Ref<HTMLAnchorElement>} {...rest} />;
  }

  return <SidebarButton ref={ref as Ref<HTMLButtonElement>} {...rest} />;
});

SidebarItem.displayName = 'SidebarItem';

export const SidebarLink = forwardRef<HTMLAnchorElement, SidebarLinkProps>(
  (
    { active = false, badge, children, className, disabled = false, href, icon, onClick, ...rest },
    ref,
  ) => {
    const { handleClick, itemClassName, itemProps } = useSidebarItem<HTMLAnchorElement>({
      active,
      disabled,
      hasIcon: icon != null,
      onClick,
    });

    return (
      <a
        className={clsx(itemClassName, className)}
        href={href}
        onClick={handleClick}
        ref={ref}
        {...itemProps}
        {...rest}
      >
        <SidebarItemContent badge={badge} icon={icon}>
          {children}
        </SidebarItemContent>
      </a>
    );
  },
);

SidebarLink.displayName = 'SidebarLink';

export const SidebarButton = forwardRef<HTMLButtonElement, SidebarButtonProps>(
  (
    {
      active = false,
      badge,
      children,
      className,
      disabled = false,
      icon,
      onClick,
      type = 'button',
      ...rest
    },
    ref,
  ) => {
    const { handleClick, itemClassName, itemProps } = useSidebarItem<HTMLButtonElement>({
      active,
      disabled,
      hasIcon: icon != null,
      onClick,
    });

    return (
      <button
        className={clsx(itemClassName, className)}
        onClick={handleClick}
        ref={ref}
        type={type}
        {...itemProps}
        {...rest}
      >
        <SidebarItemContent badge={badge} icon={icon}>
          {children}
        </SidebarItemContent>
      </button>
    );
  },
);

SidebarButton.displayName = 'SidebarButton';
