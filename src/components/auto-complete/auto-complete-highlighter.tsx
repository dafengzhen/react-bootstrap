import type { ReactNode } from 'react';

import clsx from 'clsx';
import { Fragment } from 'react';

import type { AutoCompleteHighlighterProps } from './types';

import { getMatchBounds } from './auto-complete-utils';
import styles from './auto-complete.module.css';

export const AutoCompleteHighlighter = ({
  children,
  className,
  search,
}: AutoCompleteHighlighterProps) => {
  if (!search || !children) {
    return <Fragment>{children}</Fragment>;
  }

  const highlighterChildren: ReactNode[] = [];
  let matchCount = 0;
  let remaining = children;

  while (remaining) {
    const bounds = getMatchBounds(remaining, search);
    if (!bounds) {
      highlighterChildren.push(remaining);
      break;
    }

    const nonMatch = remaining.slice(0, bounds.start);
    if (nonMatch) {
      highlighterChildren.push(nonMatch);
    }

    const match = remaining.slice(bounds.start, bounds.end);
    highlighterChildren.push(
      <mark className={clsx(styles.highlightText, className)} key={matchCount}>
        {match}
      </mark>,
    );
    matchCount += 1;
    remaining = remaining.slice(bounds.end);
  }

  return <Fragment>{highlighterChildren}</Fragment>;
};

AutoCompleteHighlighter.displayName = 'AutoCompleteHighlighter';

export default AutoCompleteHighlighter;
