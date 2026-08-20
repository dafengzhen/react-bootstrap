export type CarouselDirection = 'next' | 'prev';

export type CarouselTransitionAction =
  | { direction: CarouselDirection; index: number; type: 'SLIDE_REQUEST' }
  | { index: number; type: 'SLIDE_INSTANT' }
  | { type: 'SLIDE_END' }
  | { type: 'SLIDE_START' };

export interface CarouselTransitionState {
  activeIndex: number;
  direction: CarouselDirection | null;
  pendingIndex: null | number;
  status: CarouselTransitionStatus;
}

export type CarouselTransitionStatus = 'idle' | 'prepared' | 'sliding';

export function carouselTransitionReducer(
  state: CarouselTransitionState,
  action: CarouselTransitionAction,
): CarouselTransitionState {
  switch (action.type) {
    case 'SLIDE_END':
      if (state.pendingIndex === null) {
        return state.status === 'idle' ? state : { ...state, direction: null, status: 'idle' };
      }
      return {
        activeIndex: state.pendingIndex,
        direction: null,
        pendingIndex: null,
        status: 'idle',
      };

    case 'SLIDE_INSTANT':
      if (
        state.activeIndex === action.index &&
        state.pendingIndex === null &&
        state.status === 'idle'
      ) {
        return state;
      }
      return { activeIndex: action.index, direction: null, pendingIndex: null, status: 'idle' };

    case 'SLIDE_REQUEST':
      if (state.status !== 'idle' || action.index === state.activeIndex) {
        return state;
      }
      return {
        ...state,
        direction: action.direction,
        pendingIndex: action.index,
        status: 'prepared',
      };

    case 'SLIDE_START':
      if (state.status !== 'prepared') {
        return state;
      }
      return { ...state, status: 'sliding' };

    default:
      return state;
  }
}
