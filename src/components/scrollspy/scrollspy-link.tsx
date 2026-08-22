import clsx from 'clsx';
import { forwardRef, type MouseEvent, useCallback, useEffect } from 'react';

import type { ScrollSpyLinkProps } from './types';

import { useReducedMotion } from '../../hooks';
import { useScrollSpy } from './scrollspy-context';
import { getHashTargetId } from './scrollspy-utils';

export const ScrollSpyLink = forwardRef<HTMLElement, ScrollSpyLinkProps>(
  (
    { as: Component = 'a', children, className, href, onClick, smoothScroll, targetId, ...rest },
    ref,
  ) => {
    const context = useScrollSpy();
    const activeId = context?.activeId;
    const contextSmoothScroll = context?.smoothScroll ?? false;
    const registerLink = context?.registerLink;
    const requestScroll = context?.requestScroll;
    const reducedMotion = useReducedMotion();

    const id = targetId ?? (href ? getHashTargetId(href) : null);
    const resolvedHref = href ?? (id !== null ? `#${id}` : undefined);
    const isActive = id !== null && activeId === id;
    const effectiveSmooth = (smoothScroll ?? contextSmoothScroll) && !reducedMotion;

    useEffect(() => {
      if (!registerLink || id === null) {
        return;
      }
      return registerLink(id);
    }, [id, registerLink]);

    const handleClick = useCallback(
      (event: MouseEvent<HTMLElement>) => {
        onClick?.(event);
        if (event.defaultPrevented) {
          return;
        }
        if (id === null || !requestScroll) {
          if (resolvedHref === '#') {
            event.preventDefault();
          }
          return;
        }
        event.preventDefault();
        requestScroll(id, effectiveSmooth);
      },
      [effectiveSmooth, id, onClick, requestScroll, resolvedHref],
    );

    return (
      <Component
        className={clsx(className, isActive && 'active')}
        onClick={handleClick}
        ref={ref}
        {...(Component === 'a' && resolvedHref !== undefined ? { href: resolvedHref } : {})}
        {...rest}
      >
        {children}
      </Component>
    );
  },
);

ScrollSpyLink.displayName = 'ScrollSpyLink';

export default ScrollSpyLink;
