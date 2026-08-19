import clsx from 'clsx';
import { type FC } from 'react';

export interface NameColorBadgeProps {
  className?: string;
  name: string;
  size?: 'lg' | 'md' | 'sm';
}

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
    className={clsx('name-color-badge', `name-color-badge-${size}`, className)}
    style={{ backgroundColor: nameToColor(name) }}
  >
    {name.charAt(0).toUpperCase()}
  </span>
);

export default NameColorBadge;
