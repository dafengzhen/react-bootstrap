import clsx from 'clsx';
import { type FC } from 'react';

import styles from './doc-template.module.css';

export interface NameColorBadgeProps {
  className?: string;
  name: string;
  size?: 'lg' | 'md' | 'sm';
}

const SIZE_CLASSES = {
  lg: styles.nameColorBadgeLg,
  md: styles.nameColorBadgeMd,
  sm: styles.nameColorBadgeSm,
} as const;

export const nameToColor = (name: string): string => {
  let hash = 0;
  for (let index = 0; index < name.length; index += 1) {
    hash = (hash * 31 + name.charCodeAt(index)) >>> 0;
  }
  const hue = hash % 360;
  return `hsl(${hue}, 62%, 45%)`;
};

export const NameColorBadge: FC<NameColorBadgeProps> = ({ className, name, size = 'md' }) => (
  <span
    aria-hidden="true"
    className={clsx(styles.nameColorBadge, SIZE_CLASSES[size], className)}
    style={{ backgroundColor: nameToColor(name) }}
  >
    {name.charAt(0).toUpperCase()}
  </span>
);

export default NameColorBadge;
