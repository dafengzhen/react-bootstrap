import { describe, expect, it } from 'vitest';

import {
  type TransitionAction,
  transitionReducer,
  type TransitionState,
} from './transition-reducer.ts';

const closed: TransitionState = { mounted: false, status: 'closed' };
const openTriggered: TransitionState = { mounted: true, status: 'closed' };
const opening: TransitionState = { mounted: true, status: 'opening' };
const opened: TransitionState = { mounted: true, status: 'opened' };
const closing: TransitionState = { mounted: true, status: 'closing' };

describe('transitionReducer', () => {
  it('mounts the element when opening is requested', () => {
    expect(transitionReducer(closed, { type: 'OPEN' })).toEqual(openTriggered);
  });

  it('opens instantly without waiting for an animation', () => {
    expect(transitionReducer(closed, { type: 'INSTANT_OPEN' })).toEqual(opened);
  });

  it('starts the enter animation only for mounted but closed elements', () => {
    expect(transitionReducer(openTriggered, { type: 'ANIMATION_START' })).toEqual(opening);
    expect(transitionReducer(closed, { type: 'ANIMATION_START' })).toEqual(closed);
    expect(transitionReducer(opened, { type: 'ANIMATION_START' })).toEqual(opened);
  });

  it('settles into the opened status when the enter animation ends', () => {
    expect(transitionReducer(opening, { type: 'ANIMATION_END' })).toEqual(opened);
  });

  it('unmounts the element when the leave animation ends', () => {
    expect(transitionReducer(closing, { type: 'ANIMATION_END' })).toEqual(closed);
  });

  it('ignores animation end events in stable states', () => {
    expect(transitionReducer(closed, { type: 'ANIMATION_END' })).toEqual(closed);
    expect(transitionReducer(opened, { type: 'ANIMATION_END' })).toEqual(opened);
  });

  it('only closes mounted elements that are visible', () => {
    expect(transitionReducer(opened, { type: 'CLOSE' })).toEqual(closing);
    expect(transitionReducer(opening, { type: 'CLOSE' })).toEqual(closing);
    expect(transitionReducer(closed, { type: 'CLOSE' })).toEqual(closed);
    expect(transitionReducer(closing, { type: 'CLOSE' })).toEqual(closing);
  });

  it('unmounts the element on request', () => {
    expect(transitionReducer(opened, { type: 'UNMOUNT' })).toEqual(closed);
  });

  it('returns the same state object for unknown actions', () => {
    const unknownAction = { type: 'UNKNOWN' } as unknown as TransitionAction;
    expect(transitionReducer(opened, unknownAction)).toBe(opened);
  });
});
