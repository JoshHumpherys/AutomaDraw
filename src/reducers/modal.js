import * as actionTypes from '../constants/actionTypes'

export default function modal(
  state = {
    modalType: null
  },
  action) {
  switch (action.type) {
    case actionTypes.MODAL_CREATED: {
      return { ...state, modalType: action.payload.modalType };
    }
    case actionTypes.MODAL_REMOVED: {
      return { ...state, modalType: null };
    }
    default: {
      return state;
    }
  }
}