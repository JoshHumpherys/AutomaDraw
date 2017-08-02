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

export function addState(state, x, y) {
  return { type: actionTypes.FSM_STATE_ADDED, payload: { state, x, y } };
}

export function selectState(state) {
  return { type: actionTypes.FSM_STATE_SELECTED, payload: { state } };
}

export function changeStateName(state, name) {
  return { type: actionTypes.FSM_STATE_NAME_CHANGED, payload: { state, name }};
}

export function deleteState(state) {
  return { type: actionTypes.FSM_STATE_DELETED, payload: { state } };
}

export function changeInitialState(state) {
  return { type: actionTypes.FSM_INITIAL_STATE_CHANGED, payload: { state } };
}

export function removeInitialState() {
  return { type: actionTypes.FSM_INITIAL_STATE_REMOVED };
}