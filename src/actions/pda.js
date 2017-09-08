import * as actionTypes from '../constants/actionTypes'

export function changeName(name) {
  return { type: actionTypes.PDA_NAME_CHANGED, payload: { name } };
}

export function moveState(state, x, y) {
  return { type: actionTypes.PDA_STATE_MOVED, payload: { state, x, y } };
}

export function addState(state, x, y) {
  return { type: actionTypes.PDA_STATE_ADDED, payload: { state, x, y } };
}

export function selectState(state) {
  return { type: actionTypes.PDA_STATE_SELECTED, payload: { state } };
}

export function changeStateName(state, name) {
  return { type: actionTypes.PDA_STATE_NAME_CHANGED, payload: { state, name }};
}

export function deleteState(state) {
  return { type: actionTypes.PDA_STATE_DELETED, payload: { state } };
}

export function setStates(states) {
  return { type: actionTypes.PDA_STATES_SET, payload: { states } };
}

export function changeInitialState(state) {
  return { type: actionTypes.PDA_INITIAL_STATE_CHANGED, payload: { state } };
}

export function removeInitialState() {
  return { type: actionTypes.PDA_INITIAL_STATE_REMOVED };
}

export function addAcceptState(state) {
  return { type: actionTypes.PDA_ACCEPT_STATE_ADDED, payload: { state } };
}

export function removeAcceptState(state) {
  return { type: actionTypes.PDA_ACCEPT_STATE_REMOVED, payload: { state } };
}

export function setAcceptStates(states) {
  return { type: actionTypes.PDA_ACCEPT_STATES_SET, payload: { states } };
}

export function addTransition(fromState, inputSymbol, stackSymbol, toState, pushSymbols) {
  return {
    type: actionTypes.PDA_TRANSITION_ADDED,
    payload: { fromState, inputSymbol, stackSymbol, toState, pushSymbols }
  };
}

export function removeTransition(fromState, inputSymbol, stackSymbol, toState, pushSymbols) {
  return {
    type: actionTypes.PDA_TRANSITION_REMOVED,
    payload: { fromState, inputSymbol, stackSymbol, toState, pushSymbols }
  };
}

export function addInputSymbol(inputSymbol) {
  return { type: actionTypes.PDA_INPUT_SYMBOL_ADDED, payload: { inputSymbol } };
}

export function addStackSymbol(stackSymbol) {
  return { type: actionTypes.PDA_STACK_SYMBOL_ADDED, payload: { stackSymbol } };
}

export function changeInitialStackSymbol(stackSymbol) {
  return { type: actionTypes.PDA_INITIAL_STACK_SYMBOL_CHANGED, payload: { stackSymbol } };
}

export function removeInitialStackSymbol() {
  return { type: actionTypes.PDA_INITIAL_STACK_SYMBOL_REMOVED };
}

export function initializeFromJsonString(jsonString) {
  return { type: actionTypes.PDA_INITIALIZED_FROM_JSON_STRING, payload: { jsonString } };
}

export function reset() {
  return { type: actionTypes.PDA_RESET };
}