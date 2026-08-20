import type { Placement } from '../../utils';

export const getBasePlacement = (placement: Placement): string => placement.split('-')[0];
