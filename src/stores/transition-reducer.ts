export type TransitionAction =
  | { type: 'ANIMATION_END' }
  | { type: 'ANIMATION_START' }
  | { type: 'CLOSE' }
  | { type: 'INSTANT_OPEN' }
  | { type: 'OPEN' }
  | { type: 'UNMOUNT' };

export interface TransitionState {
  mounted: boolean;
  status: TransitionStatus;
}

export type TransitionStatus = 'closed' | 'closing' | 'opened' | 'opening';

export function transitionReducer(
  state: TransitionState,
  action: TransitionAction,
): TransitionState {
  switch (action.type) {
    case 'ANIMATION_END':
      if (state.status === 'opening') {
        return { ...state, status: 'opened' };
      }
      if (state.status === 'closing') {
        return { mounted: false, status: 'closed' };
      }
      return state;

    case 'ANIMATION_START':
      if (state.status === 'closed' && state.mounted) {
        return { ...state, status: 'opening' };
      }
      return state;

    case 'CLOSE':
      if (!state.mounted) {
        return state;
      }
      if (state.status === 'opened' || state.status === 'opening') {
        return { ...state, status: 'closing' };
      }
      return state;

    case 'INSTANT_OPEN':
      return { mounted: true, status: 'opened' };

    case 'OPEN':
      return { mounted: true, status: 'closed' };

    case 'UNMOUNT':
      return { mounted: false, status: 'closed' };

    default:
      return state;
  }
}
