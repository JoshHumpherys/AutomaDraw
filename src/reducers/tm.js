import * as actionTypes from '../constants/actionTypes'
import { Set, Map } from 'immutable';
import {
  changeName,
  moveState,
  addState,
  selectState,
  renameState,
  deleteState,
  setStates,
  changeInitialState,
  removeInitialState,
  addAcceptState,
  removeAcceptState,
  setAcceptStates,
  setExecutionPath,
  runTestCases,
  resetTestCases,
  addTestCase,
  removeTestCase,
  initializeTestCasesFromCsvString,
} from './sharedAutomataFunctions'
import * as inputMessageTypes from '../constants/inputMessageTypes'
import * as emptyStringSymbols from '../constants/emptyStringSymbols'
import * as testCaseResultTypes from '../constants/testCaseResultTypes'

const createInstruction = (fromState, inputSymbol, toState, writeSymbol, moveDirection) =>
  ({ fromState, inputSymbol, toState, writeSymbol, moveDirection });

const stepInput = state => {
  let executionPaths = [];
  return { ...state, executionPaths: [...state.executionPaths.map(executionPath => {
    console.log(executionPath.currentState);
    if(state.acceptStates.contains(executionPath.currentState)) {
      return { ...executionPath, inputMessage: inputMessageTypes.ACCEPT };
    }
    if(executionPath.inputMessage !== '') {
      return executionPath;
    }
    const currentSymbol = executionPath.inputIndex >= 0 && executionPath.inputIndex < executionPath.inputString.length ?
      executionPath.inputString[executionPath.inputIndex] : state.blankSymbol;
    const transitions = state.transitionFunction.filter(instruction =>
      instruction.fromState === executionPath.currentState && instruction.inputSymbol === currentSymbol
    );
    if(transitions.first() === undefined) {
      return { ...executionPath, inputMessage: inputMessageTypes.REJECT };
    }
    const getNewExecutionPath = transition => {
      const currentState = transition.toState;
      let inputString;
      if(executionPath.inputIndex >= 0 && executionPath.inputIndex < executionPath.inputString.length) {
        inputString = executionPath.inputString.substring(0, executionPath.inputIndex) +
          transition.writeSymbol +
          executionPath.inputString.substring(executionPath.inputIndex + 1);
      } else {
        const generateBlankSymbols = numBlankSymbols => {
          let blankSymbolsString = '';
          for(let i = 0; i < numBlankSymbols; i++) {
            blankSymbolsString += state.blankSymbol;
          }
          return blankSymbolsString;
        };
        if(executionPath.inputIndex < 0) {
          let blankSymbols = generateBlankSymbols(executionPath.inputIndex + 1);
          inputString = transition.writeSymbol + blankSymbols + executionPath.inputString;
        } else {
          let blankSymbols = generateBlankSymbols(executionPath.inputIndex - executionPath.inputString.length);
          inputString = executionPath.inputString + blankSymbols + transition.writeSymbol;
        }
      }
      const inputIndex = executionPath.inputIndex + (transition.moveDirection === 'L' ? -1 : 1); // TODO make direction enum
      const inputMessage = state.acceptStates.contains(currentState) ? inputMessageTypes.ACCEPT : executionPath.inputMessage;
      return { ...executionPath, inputString, inputIndex, currentState, inputMessage };
    };
    executionPaths = [...executionPaths, ...transitions.rest().map(transition => getNewExecutionPath(transition)).toArray()];
    return getNewExecutionPath(transitions.first());
  }), ...executionPaths]};
};

const runInput = state => {
  let newState = state;
  for(let i = 0; i < 500; i++) {
    newState = stepInput(newState);
    if(newState.executionPaths.every(executionPath => executionPath.inputMessage !== '')) {
      return newState;
    }
    if(newState.executionPaths.length > 500) {
      alert('TODO handle TMs that have a lot of execution paths. There are currently ' + newState.executionPaths.length + ' execution paths.');
      return newState;
    }
  }
  alert('TODO not all paths have completed and 500 steps have executed.');
  return newState;
};

export default function tm(
  state = {
    name: 'Example TM',
    states: new Set(['A', 'B', 'C', 'D', 'E']),
    tapeAlphabet: new Set(['\u0394', '0', '1', 'X', 'Y']),
    blankSymbol: '\u0394',
    inputAlphabet: new Set(['0', '1']),
    transitionFunction: new Set([
      createInstruction('A', '0', 'B', 'X', 'R'),
      createInstruction('A', 'Y', 'D', 'Y', 'R'),
      createInstruction('B', '0', 'B', '0', 'R'),
      createInstruction('B', '1', 'C', 'Y', 'L'),
      createInstruction('B', 'Y', 'B', 'Y', 'R'),
      createInstruction('C', '0', 'C', '0', 'L'),
      createInstruction('C', 'X', 'A', 'X', 'R'),
      createInstruction('C', 'Y', 'C', 'Y', 'L'),
      createInstruction('D', 'Y', 'D', 'Y', 'R'),
      createInstruction('D', '\u0394', 'E', '\u0394', 'R'),
    ]),
    initialState: 'A',
    acceptStates: new Set(['E']),
    statePositions: new Map({
      'A': { x: 200, y: 250 },
      'B': { x: 425, y: 150 },
      'C': { x: 650, y: 250 },
      'D': { x: 350, y: 375 },
      'E': { x: 500, y: 375 },

    }),
    selected: '',
    inputString: '',
    executionPaths: [
      {
        currentState: 'A',
        inputString: '',
        inputIndex: 0,
        inputMessage: '',
      },
    ],
    executionPathIndex: 0,
    testCases: [
      {
        input: emptyStringSymbols.LAMBDA,
        expected: testCaseResultTypes.FAIL,
        actual: testCaseResultTypes.NA,
        result: testCaseResultTypes.NA,
      },
      {
        input: '01',
        expected: testCaseResultTypes.PASS,
        actual: testCaseResultTypes.NA,
        result: testCaseResultTypes.NA,
      },
      {
        input: '1010',
        expected: testCaseResultTypes.FAIL,
        actual: testCaseResultTypes.NA,
        result: testCaseResultTypes.NA,
      },
      {
        input: '0011',
        expected: testCaseResultTypes.PASS,
        actual: testCaseResultTypes.NA,
        result: testCaseResultTypes.NA,
      },
      {
        input: '00011',
        expected: testCaseResultTypes.FAIL,
        actual: testCaseResultTypes.NA,
        result: testCaseResultTypes.NA,
      },
      {
        input: '000111',
        expected: testCaseResultTypes.PASS,
        actual: testCaseResultTypes.NA,
        result: testCaseResultTypes.NA,
      },
    ],
  },
  action) {
  switch(action.type) {
    case actionTypes.TM_NAME_CHANGED: {
      return changeName(state, action.payload.name);
    }
    case actionTypes.TM_STATE_MOVED: {
      const { x, y } = action.payload;
      return moveState(state, action.payload.state, x, y);
    }
    case actionTypes.TM_STATE_ADDED: {
      const { x, y } = action.payload;
      return addState(state, action.payload.state, x, y);
    }
    case actionTypes.TM_STATE_SELECTED: {
      return selectState(state, action.payload.state);
    }
    case actionTypes.TM_STATE_NAME_CHANGED: {
      return renameState(state, action.payload.state, action.payload.name);
    }
    case actionTypes.TM_STATE_DELETED: {
      return deleteState(state, action.payload.state, action.payload.name);
    }
    case actionTypes.TM_STATES_SET: {
      return setStates(state, action.payload.states);
    }
    case actionTypes.TM_INITIAL_STATE_CHANGED: {
      return {
        ...changeInitialState(state, action.payload.state),
        executionPaths: [
          {
            currentState: action.payload.state,
            inputString: '',
            inputIndex: 0,
            inputMessage: '',
          }
        ],
      };
    }
    case actionTypes.TM_INITIAL_STATE_REMOVED: {
      return {
        ...removeInitialState(state),
        executionPaths: [
          {
            currentState: '',
            inputString: state.inputString,
            inputIndex: 0,
            inputMessage: ''
          }
        ],
      };
    }
    case actionTypes.TM_ACCEPT_STATE_ADDED: {
      return addAcceptState(state, action.payload.state);
    }
    case actionTypes.TM_ACCEPT_STATE_REMOVED: {
      return removeAcceptState(state, action.payload.state);
    }
    case actionTypes.TM_ACCEPT_STATES_SET: {
      return setAcceptStates(state, action.payload.states);
    }
    case actionTypes.TM_TRANSITION_ADDED: {
      const { fromState, inputSymbol, toState, writeSymbol, moveDirection } = action.payload;
      const transition = createInstruction(fromState, inputSymbol, toState, writeSymbol, moveDirection);
      return {
        ...state,
        states: state.states.add(toState).add(fromState),
        tapeAlphabet: state.tapeAlphabet.add(inputSymbol).add(writeSymbol),
        inputAlphabet: state.inputAlphabet.add(inputSymbol).add(writeSymbol),
        transitionFunction: state.transitionFunction.add(transition)
      };
    }
    case actionTypes.TM_TRANSITION_REMOVED: {
      const { fromState, inputSymbol, toState, writeSymbol, moveDirection } = action.payload;
      return {
        ...state,
        transitionFunction: state.transitionFunction
          .filter(transitionObject => {
            return transitionObject.fromState !== fromState ||
              transitionObject.inputSymbol !== inputSymbol ||
              transitionObject.toState !== toState ||
              transitionObject.writeSymbol !== writeSymbol ||
              transitionObject.moveDirection !== moveDirection;
          })
      };
    }
    case actionTypes.TM_TAPE_SYMBOL_ADDED: {
      return {
        ...state,
        tapeAlphabet: state.tapeAlphabet.add(action.payload.tapeSymbol)
      }
    }
    case actionTypes.TM_TAPE_ALPHABET_SET: {
      const { tapeAlphabet } = action.payload;
      const inputAlphabet = state.inputAlphabet.filter(inputSymbol => tapeAlphabet.includes(inputSymbol));
      return {
        ...state,
        tapeAlphabet: new Set(tapeAlphabet),
        blankSymbol: tapeAlphabet.includes(state.blankSymbol) ? state.blankSymbol : null,
        inputAlphabet,
        transitionFunction: state.transitionFunction.filter(transitionObject => {
          return tapeAlphabet.includes(transitionObject.inputSymbol) &&
            tapeAlphabet.includes(transitionObject.writeSymbol);
        })
      };
    }
    case actionTypes.TM_INPUT_SYMBOL_ADDED: {
      return {
        ...state,
        inputAlphabet: state.inputAlphabet.add(action.payload.inputSymbol)
      }
    }
    case actionTypes.TM_INPUT_ALPHABET_SET: {
      const { inputAlphabet } = action.payload;
      return {
        ...state,
        inputAlphabet: new Set(inputAlphabet)
      };
    }
    case actionTypes.TM_BLANK_SYMBOL_CHANGED: {
      const { blankSymbol } = action.payload;
      return {
        ...state,
        blankSymbol,
        inputAlphabet: state.inputAlphabet.remove(blankSymbol)
      };
    }
    case actionTypes.TM_BLANK_SYMBOL_REMOVED: {
      return { ...state, blankSymbol: null };
    }
    case actionTypes.TM_INPUT_STRING_SET: {
      return {
        ...state,
        inputString: action.payload.inputString,
        executionPaths: [
          {
            currentState: action.payload.inputString.length !== 0 ? state.initialState : null,
            inputString: action.payload.inputString,
            inputIndex: 0,
            inputMessage: '',
          }
        ],
        executionPathIndex: 0,
      };
    }
    case actionTypes.TM_EXECUTION_PATH_SET: {
      return setExecutionPath(state, action.payload.executionPathIndex);
    }
    case actionTypes.TM_STEP_INPUT: {
      return stepInput(state);
    }
    case actionTypes.TM_RUN_INPUT: {
      return runInput(state);
    }
    case actionTypes.TM_RESTART_INPUT: {
      return {
        ...state,
        executionPaths: [
          {
            currentState: state.inputString.length !== 0 ? state.initialState : null,
            inputString: state.inputString,
            inputIndex: 0,
            inputMessage: ''
          }
        ],
        executionPathIndex: 0,
      };
    }
    case actionTypes.TM_RUN_TEST_CASES: {
      const initialExecutionPath = {
        inputIndex: 0,
        inputMessage: '',
        inputString: state.inputString,
        currentState: state.initialState
      };
      return runTestCases(state, initialExecutionPath, runInput, true);
    }
    case actionTypes.TM_RESET_TEST_CASES: {
      return resetTestCases(state);
    }
    case actionTypes.TM_ADD_TEST_CASE: {
      return addTestCase(state, action.payload.input, action.payload.expected);
    }
    case actionTypes.TM_REMOVE_TEST_CASE: {
      return removeTestCase(state, action.payload.index);
    }
    case actionTypes.TM_INITIALIZE_TEST_CASES_FROM_CSV_STRING: {
      return initializeTestCasesFromCsvString(state, action.payload.csvString);
    }
    case actionTypes.TM_INITIALIZED_FROM_JSON_STRING: {
      const tm = JSON.parse(action.payload.jsonString);
      return {
        ...tm,
        states: new Set(tm.states),
        tapeAlphabet: new Set(tm.tapeAlphabet),
        inputAlphabet: new Set(tm.inputAlphabet),
        transitionFunction: new Set(tm.transitionFunction),
        acceptStates: new Set(tm.acceptStates),
        statePositions: new Map(tm.statePositions),
        selected: null,
        inputString: '',
        executionPaths: [
          {
            currentState: '',
            inputString: '',
            inputIndex: 0,
            inputMessage: '',
          },
        ],
        executionPathIndex: 0,
        testCases: state.testCases,
      }
    }
    case actionTypes.TM_RESET: {
      return {
        name: 'My TM',
        states: new Set(),
        tapeAlphabet: new Set(),
        blankSymbol: null,
        inputAlphabet: new Set(),
        transitionFunction: new Set(),
        initialState: null,
        acceptStates: new Set(),
        statePositions: new Map(),
        selected: null,
        inputString: '',
        executionPaths: [
          {
            currentState: '',
            inputString: '',
            inputIndex: 0,
            inputMessage: '',
          },
        ],
        executionPathIndex: 0,
        testCases: state.testCases.map(testCase => ({
          ...testCase,
          actual: testCaseResultTypes.NA,
          result: testCaseResultTypes.NA
        })),
      }
    }
    default: {
      return state;
    }
  }
}