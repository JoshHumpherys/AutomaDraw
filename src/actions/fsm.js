import * as actionTypes from '../constants/actionTypes'

export function changeFsmName(name) {
  return { type: actionTypes.FSM_NAME_CHANGED, payload: { name } };
}

export function changeFsmStates(states) {
  return { type: actionTypes.FSM_STATES_CHANGED, payload: { states } };
}

export function changeFsmAlphabet(alphabet) {
  return { type: actionTypes.FSM_ALPHABET_CHANGED, payload: { alphabet } };
}

export function moveStatePosition(state, x, y) {
  return { type: actionTypes.FSM_STATE_MOVED, payload: { state, x, y } };
}