import type {
  AnchorHTMLAttributes,
  ButtonHTMLAttributes,
  ElementType,
  HTMLAttributes,
  ReactNode,
} from 'react';

export type SidebarBackdropProps = HTMLAttributes<HTMLDivElement>;

export type SidebarBreakpoint = 'lg' | 'md' | 'sm' | 'xl' | 'xxl';

export type SidebarButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & SidebarItemBaseProps;

export interface SidebarContextValue {
  breakpoint: null | SidebarBreakpoint;
  collapsed: boolean;
  collapseOnSelect: boolean;
  isMobile: boolean;
  mobileOpen: boolean;
  onItemSelect?: () => void;
  placement: SidebarPlacement;
  setMobileOpen: (open: boolean) => void;
  toggleCollapsed: () => void;
  variant: SidebarVariant;
}

export type SidebarDividerProps = HTMLAttributes<HTMLHRElement>;

export type SidebarGroupContentProps = SidebarRegionProps;

export type SidebarGroupLabelProps = SidebarRegionProps;

export type SidebarGroupProps = SidebarRegionProps;

export interface SidebarItemBaseProps {
  active?: boolean;
  badge?: ReactNode;
  disabled?: boolean;
  icon?: ReactNode;
}

export interface SidebarItemProps extends HTMLAttributes<HTMLElement>, SidebarItemBaseProps {
  href?: string;
}

export interface SidebarLinkProps
  extends AnchorHTMLAttributes<HTMLAnchorElement>, SidebarItemBaseProps {
  href: string;
}

export type SidebarPlacement = 'end' | 'start';

export interface SidebarProps
  extends Omit<HTMLAttributes<HTMLElement>, 'title'>, SidebarStateProps {
  as?: ElementType;
  collapsedWidth?: number | string;
  width?: number | string;
}

export interface SidebarProviderProps extends SidebarStateProps {
  children?: ReactNode;
}

export interface SidebarRegionProps extends HTMLAttributes<HTMLElement> {
  as?: ElementType;
  children?: ReactNode;
  className?: string;
}

export interface SidebarStateProps {
  breakpoint?: null | SidebarBreakpoint;
  collapsed?: boolean;
  collapseOnSelect?: boolean;
  defaultCollapsed?: boolean;
  defaultOpen?: boolean;
  onCollapsedChange?: (collapsed: boolean) => void;
  onItemSelect?: () => void;
  onOpenChange?: (open: boolean) => void;
  open?: boolean;
  placement?: SidebarPlacement;
  variant?: SidebarVariant;
}

export interface SidebarTriggerProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  as?: ElementType;
}

export type SidebarVariant = 'dark' | 'light';
