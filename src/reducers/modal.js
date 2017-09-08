import * as actionTypes from '../constants/actionTypes'

export default function modal(
  state = {
    modalType: null,
    modalState: {}
  },
  action) {
  switch (action.type) {
    case actionTypes.MODAL_CREATED: {
      return { ...state, modalType: action.payload.modalType };
    }
    case actionTypes.MODAL_REMOVED: {
      return { ...state, modalType: null, modalState: {} };
    }
    case actionTypes.MODAL_STATE_SET: {
      return { ...state, modalState: { ...state.modalState, ...action.payload.modalState } };
    }
    default: {
      return state;
    }
  }
}