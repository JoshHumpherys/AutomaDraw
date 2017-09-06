import * as actionTypes from '../constants/actionTypes'

export function createModal(modalType) {
  return { type: actionTypes.MODAL_CREATED, payload: { modalType } };
}

export function removeModal() {
  return { type: actionTypes.MODAL_REMOVED };
}