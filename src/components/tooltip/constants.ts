import type { Placement } from '../../utils';
import type { TooltipTriggerType } from './types';

export const DEFAULT_OFFSET: readonly [number, number] = [0, 6];

export const DEFAULT_PADDING = 2;

export const DEFAULT_PLACEMENT: Placement = 'top';

export const DEFAULT_TRIGGERS: TooltipTriggerType[] = ['focus', 'hover'];

export const FADE_DURATION = 150;

export const OPEN_ANIMATION_START_FALLBACK = 80;

export const TRANSITION_END_BUFFER = 50;
