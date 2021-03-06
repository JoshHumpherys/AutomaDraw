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

export function setStates(states) {
  return { type: actionTypes.FSM_STATES_SET, payload: { states } };
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

export function setAcceptStates(states) {
  return { type: actionTypes.FSM_ACCEPT_STATES_SET, payload: { states } };
}

export function addTransition(fromState, inputSymbol, toState, emptyStringSymbol) {
  return { type: actionTypes.FSM_TRANSITION_ADDED, payload: { fromState, inputSymbol, toState, emptyStringSymbol } };
}

export function removeTransition(fromState, inputSymbol, toState) {
  return { type: actionTypes.FSM_TRANSITION_REMOVED, payload: { fromState, inputSymbol, toState } };
}

export function addInputSymbol(symbol) {
  return { type: actionTypes.FSM_INPUT_SYMBOL_ADDED, payload: { symbol } };
}

export function setInputAlphabet(inputAlphabet, emptyStringSymbol) {
  return { type: actionTypes.FSM_INPUT_ALPHABET_SET, payload: { inputAlphabet, emptyStringSymbol } };
}

export function setInputString(inputString) {
  return { type: actionTypes.FSM_INPUT_STRING_SET, payload: { inputString }}
}

export function setExecutionPath(executionPathIndex) {
  return { type: actionTypes.FSM_EXECUTION_PATH_SET, payload: { executionPathIndex }}
}

export function stepInput() {
  return { type: actionTypes.FSM_STEP_INPUT };
}

export function runInput() {
  return { type: actionTypes.FSM_RUN_INPUT };
}

export function restartInput() {
  return { type: actionTypes.FSM_RESTART_INPUT };
}

export function addTestCase(input, expected) {
  return { type: actionTypes.FSM_ADD_TEST_CASE, payload: { input, expected } };
}

export function removeTestCase(index) {
  return { type: actionTypes.FSM_REMOVE_TEST_CASE, payload: { index } };
}

export function runTestCases() {
  return { type: actionTypes.FSM_RUN_TEST_CASES };
}

export function resetTestCases() {
  return { type: actionTypes.FSM_RESET_TEST_CASES };
}

export function initializeTestCasesFromCsvString(csvString) {
  return { type: actionTypes.FSM_INITIALIZE_TEST_CASES_FROM_CSV_STRING, payload: { csvString } };
}

export function initializeFromJsonString(jsonString) {
  return { type: actionTypes.FSM_INITIALIZED_FROM_JSON_STRING, payload: { jsonString } };
}

export function reset() {
  return { type: actionTypes.FSM_RESET };
}