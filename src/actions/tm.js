import * as actionTypes from '../constants/actionTypes'

export function changeName(name) {
  return { type: actionTypes.TM_NAME_CHANGED, payload: { name } };
}

export function moveState(state, x, y) {
  return { type: actionTypes.TM_STATE_MOVED, payload: { state, x, y } };
}

export function addState(state, x, y) {
  return { type: actionTypes.TM_STATE_ADDED, payload: { state, x, y } };
}

export function selectState(state) {
  return { type: actionTypes.TM_STATE_SELECTED, payload: { state } };
}

export function changeStateName(state, name) {
  return { type: actionTypes.TM_STATE_NAME_CHANGED, payload: { state, name }};
}

export function deleteState(state) {
  return { type: actionTypes.TM_STATE_DELETED, payload: { state } };
}

export function setStates(states) {
  return { type: actionTypes.TM_STATES_SET, payload: { states } };
}

export function changeInitialState(state) {
  return { type: actionTypes.TM_INITIAL_STATE_CHANGED, payload: { state } };
}

export function removeInitialState() {
  return { type: actionTypes.TM_INITIAL_STATE_REMOVED };
}

export function addAcceptState(state) {
  return { type: actionTypes.TM_ACCEPT_STATE_ADDED, payload: { state } };
}

export function removeAcceptState(state) {
  return { type: actionTypes.TM_ACCEPT_STATE_REMOVED, payload: { state } };
}

export function setAcceptStates(states) {
  return { type: actionTypes.TM_ACCEPT_STATES_SET, payload: { states } };
}

export function addTransition(fromState, inputSymbol, toState, writeSymbol, moveDirection) {
  return {
    type: actionTypes.TM_TRANSITION_ADDED,
    payload: { fromState, inputSymbol, toState, writeSymbol, moveDirection }
  };
}

export function removeTransition(fromState, inputSymbol, toState, writeSymbol, moveDirection) {
  return {
    type: actionTypes.TM_TRANSITION_REMOVED,
    payload: { fromState, inputSymbol, toState, writeSymbol, moveDirection }
  };
}

export function addTapeSymbol(tapeSymbol) {
  return { type: actionTypes.TM_TAPE_SYMBOL_ADDED, payload: { tapeSymbol } };
}

export function setTapeAlphabet(tapeAlphabet) {
  return { type: actionTypes.TM_TAPE_ALPHABET_SET, payload: { tapeAlphabet } };
}

export function addInputSymbol(inputSymbol) {
  return { type: actionTypes.TM_INPUT_SYMBOL_ADDED, payload: { inputSymbol } };
}

export function setInputAlphabet(inputAlphabet) {
  return { type: actionTypes.TM_INPUT_ALPHABET_SET, payload: { inputAlphabet } };
}

export function changeBlankSymbol(blankSymbol) {
  return { type: actionTypes.TM_BLANK_SYMBOL_CHANGED, payload: { blankSymbol } };
}

export function removeBlankSymbol() {
  return { type: actionTypes.TM_BLANK_SYMBOL_REMOVED };
}

export function setInputString(inputString) {
  return { type: actionTypes.TM_INPUT_STRING_SET, payload: { inputString }}
}

export function setExecutionPath(executionPathIndex) {
    return { type: actionTypes.TM_EXECUTION_PATH_SET, payload: { executionPathIndex }}
}

export function stepInput() {
  return { type: actionTypes.TM_STEP_INPUT };
}

export function runInput() {
  return { type: actionTypes.TM_RUN_INPUT };
}

export function restartInput(inputString) {
  return { type: actionTypes.TM_RESTART_INPUT, payload: { inputString } };
}

export function addTestCase(input, expected) {
  return { type: actionTypes.TM_ADD_TEST_CASE, payload: { input, expected } };
}

export function removeTestCase(index) {
  return { type: actionTypes.TM_REMOVE_TEST_CASE, payload: { index } };
}

export function runTestCases() {
  return { type: actionTypes.TM_RUN_TEST_CASES };
}

export function resetTestCases() {
  return { type: actionTypes.TM_RESET_TEST_CASES };
}

export function initializeTestCasesFromCsvString(csvString) {
  return { type: actionTypes.TM_INITIALIZE_TEST_CASES_FROM_CSV_STRING, payload: { csvString } };
}

export function initializeFromJsonString(jsonString) {
  return { type: actionTypes.TM_INITIALIZED_FROM_JSON_STRING, payload: { jsonString } };
}

export function reset() {
  return { type: actionTypes.TM_RESET };
}