import type { Placement } from '../../utils';
import type { PopoverTriggerType } from './types';

export const DEFAULT_OFFSET: readonly [number, number] = [0, 8];

export const DEFAULT_PADDING = 2;

export const DEFAULT_PLACEMENT: Placement = 'right';

export const DEFAULT_TRIGGERS: PopoverTriggerType[] = ['click'];

export const FADE_DURATION = 150;

export const OPEN_ANIMATION_START_FALLBACK = 80;

export const TRANSITION_END_BUFFER = 50;
