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

export function addTransition(fromState, inputSymbol, stackSymbol, toState, pushSymbol, emptyStringSymbol) {
  return {
    type: actionTypes.PDA_TRANSITION_ADDED,
    payload: { fromState, inputSymbol, stackSymbol, toState, pushSymbol, emptyStringSymbol }
  };
}

export function removeTransition(fromState, inputSymbol, stackSymbol, toState, pushSymbol) {
  return {
    type: actionTypes.PDA_TRANSITION_REMOVED,
    payload: { fromState, inputSymbol, stackSymbol, toState, pushSymbol }
  };
}

export function addInputSymbol(inputSymbol) {
  return { type: actionTypes.PDA_INPUT_SYMBOL_ADDED, payload: { inputSymbol } };
}

export function setInputAlphabet(inputAlphabet, emptyStringSymbol) {
  return { type: actionTypes.PDA_INPUT_ALPHABET_SET, payload: { inputAlphabet, emptyStringSymbol } };
}

export function addStackSymbol(stackSymbol) {
  return { type: actionTypes.PDA_STACK_SYMBOL_ADDED, payload: { stackSymbol } };
}

export function setStackAlphabet(stackAlphabet) {
  return { type: actionTypes.PDA_STACK_ALPHABET_SET, payload: { stackAlphabet } };
}

export function changeInitialStackSymbol(stackSymbol) {
  return { type: actionTypes.PDA_INITIAL_STACK_SYMBOL_CHANGED, payload: { stackSymbol } };
}

export function removeInitialStackSymbol() {
  return { type: actionTypes.PDA_INITIAL_STACK_SYMBOL_REMOVED };
}

export function setInputString(inputString) {
  return { type: actionTypes.PDA_INPUT_STRING_SET, payload: { inputString }}
}

export function setExecutionPath(executionPathIndex) {
  return { type: actionTypes.PDA_EXECUTION_PATH_SET, payload: { executionPathIndex }}
}

export function stepInput() {
  return { type: actionTypes.PDA_STEP_INPUT };
}

export function runInput() {
  return { type: actionTypes.PDA_RUN_INPUT };
}

export function restartInput() {
  return { type: actionTypes.PDA_RESTART_INPUT };
}

export function addTestCase(input, expected) {
  return { type: actionTypes.PDA_ADD_TEST_CASE, payload: { input, expected } };
}

export function removeTestCase(index) {
  return { type: actionTypes.PDA_REMOVE_TEST_CASE, payload: { index } };
}

export function runTestCases() {
  return { type: actionTypes.PDA_RUN_TEST_CASES };
}

export function resetTestCases() {
  return { type: actionTypes.PDA_RESET_TEST_CASES };
}

export function initializeTestCasesFromCsvString(csvString) {
  return { type: actionTypes.PDA_INITIALIZE_TEST_CASES_FROM_CSV_STRING, payload: { csvString } };
}

export function initializeFromJsonString(jsonString) {
  return { type: actionTypes.PDA_INITIALIZED_FROM_JSON_STRING, payload: { jsonString } };
}

export function reset() {
  return { type: actionTypes.PDA_RESET };
}