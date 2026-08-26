import type { TimelineAlign } from './types';

export type TimelineSide = 'left' | 'right';

export const resolveTimelineSide = (align: TimelineAlign, index: number): null | TimelineSide => {
  if (align !== 'alternate') {
    return null;
  }
  return index % 2 === 0 ? 'left' : 'right';
};
