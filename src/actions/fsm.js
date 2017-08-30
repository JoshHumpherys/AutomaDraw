import * as actionTypes from '../constants/actionTypes'

export function changeName(name) {
  return { type: actionTypes.FSM_NAME_CHANGED, payload: { name } };
}

export function moveState(state, x, y) {
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

export function addAcceptState(state) {
  return { type: actionTypes.FSM_ACCEPT_STATE_ADDED, payload: { state } };
}

export function removeAcceptState(state) {
  return { type: actionTypes.FSM_ACCEPT_STATE_REMOVED, payload: { state } };
}

export function addTransition(fromState, letter, toState) {
  return { type: actionTypes.FSM_TRANSITION_ADDED, payload: { fromState, letter, toState } };
}

export function removeTransition(fromState, letter, toState) {
  return { type: actionTypes.FSM_TRANSITION_REMOVED, payload: { fromState, letter, toState } };
}

export function addSymbol(letter) {
  return { type: actionTypes.FSM_LETTER_ADDED, payload: { letter } };
}

export function initializeFromJsonString(jsonString) {
  return { type: actionTypes.FSM_INITIALIZED_FROM_JSON_STRING, payload: { jsonString } };
}

export function reset() {
  return { type: actionTypes.FSM_RESET };
}