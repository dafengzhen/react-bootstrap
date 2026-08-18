import type { ModalAction, ModalState } from './types';

export function modalReducer(state: ModalState, action: ModalAction): ModalState {
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
      if (state.mounted && state.status !== 'closed') {
        return { ...state, status: 'closed' };
      }
      return { mounted: true, status: 'closed' };

    default:
      return state;
  }
}
