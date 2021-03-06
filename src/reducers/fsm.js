import * as actionTypes from '../constants/actionTypes'
import { Set, Map } from 'immutable'
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
  addTestCase,
  removeTestCase,
  resetTestCases,
  initializeTestCasesFromCsvString,
} from './sharedAutomataFunctions'
import * as inputMessageTypes from '../constants/inputMessageTypes'
import * as emptyStringSymbols from '../constants/emptyStringSymbols'
import * as testCaseResultTypes from '../constants/testCaseResultTypes'

const createInstruction = (fromState, inputSymbol, toState) => ({ fromState, inputSymbol, toState });

const stepInput = state => {
  const determineInputMessage = currentState =>
    state.acceptStates.contains(currentState) ? inputMessageTypes.ACCEPT : inputMessageTypes.REJECT;
  let executionPaths = [];
  return { ...state, executionPaths: [...state.executionPaths.map(executionPath => {
    const getEmptyStringTransitions = currentState =>
      state.transitionFunction.filter(instruction =>
        instruction.fromState === currentState && instruction.inputSymbol === emptyStringSymbols.LAMBDA
      );
    if(executionPath.inputIndex >= state.inputString.length &&
      (getEmptyStringTransitions(executionPath.currentState).first() === undefined ||
      state.acceptStates.contains(executionPath.currentState)
      )) {
      return {
        ...executionPath,
        inputMessage: determineInputMessage(state.inputString.length === 0 ? state.initialState : executionPath.currentState)
      };
    }
    const transitions = state.transitionFunction.filter(instruction =>
      instruction.fromState === executionPath.currentState &&
      (instruction.inputSymbol === state.inputString[executionPath.inputIndex] || instruction.inputSymbol === emptyStringSymbols.LAMBDA)
    );
    let inputMessage;
    if(transitions.first() === undefined) {
      return { ...executionPath, inputMessage: inputMessageTypes.REJECT };
    }
    const getNewExecutionPath = transition => {
      const newInputIndex = executionPath.inputIndex + (transition.inputSymbol === emptyStringSymbols.LAMBDA ? 0 : 1);
      if(newInputIndex >= state.inputString.length &&
        (getEmptyStringTransitions(transition.toState).first() === undefined ||
        state.acceptStates.contains(transition.toState)
        )) {
        inputMessage = determineInputMessage(transition.toState);
      } else {
        inputMessage = executionPath.inputMessage;
      }
      return {
        inputIndex: newInputIndex,
        currentState: transition.toState,
        inputMessage
      };
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
      alert('TODO handle NFAs that have a lot of execution paths. There are currently ' + newState.executionPaths.length + ' execution paths.');
      return newState;
    }
  }
  alert('TODO handle NFAs that have a lot of steps. 500 steps have been executed.');
  return newState;
};

export default function fsm(
  state = {
    name: 'Example FSM',
    states: new Set(['A', 'B', 'C', 'D', 'E']),
    inputAlphabet: new Set(['0', '1']),
    transitionFunction: new Set([
      createInstruction('A', '0', 'B'),
      createInstruction('A', '1', 'C'),
      createInstruction('B', '0', 'B'),
      createInstruction('B', '1', 'D'),
      createInstruction('C', '0', 'E'),
      createInstruction('C', '1', 'C'),
      createInstruction('D', '0', 'B'),
      createInstruction('D', '1', 'D'),
      createInstruction('E', '0', 'E'),
      createInstruction('E', '1', 'C')
    ]),
    initialState: 'A',
    acceptStates: new Set(['A', 'B', 'C']),
    statePositions: new Map({
      'A': { x: 175, y: 250 },
      'B': { x: 300, y: 170 },
      'C': { x: 300, y: 330 },
      'D': { x: 500, y: 170 },
      'E': { x: 500, y: 330 }
    }),
    selected: '',
    inputString: '',
    executionPaths: [
      {
        currentState: 'A',
        inputIndex: 0,
        inputMessage: '',
      },
    ],
    executionPathIndex: 0,
    testCases: [
      {
        input: emptyStringSymbols.LAMBDA,
        expected: testCaseResultTypes.PASS,
        actual: testCaseResultTypes.NA,
        result: testCaseResultTypes.NA,
      },
      {
        input: '101',
        expected: testCaseResultTypes.PASS,
        actual: testCaseResultTypes.NA,
        result: testCaseResultTypes.NA,
      },
      {
        input: '0110',
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
        input: '00010',
        expected: testCaseResultTypes.PASS,
        actual: testCaseResultTypes.NA,
        result: testCaseResultTypes.NA,
      },
    ]
  },
  action) {
  switch (action.type) {
    case actionTypes.FSM_NAME_CHANGED: {
      return changeName(state, action.payload.name);
    }
    case actionTypes.FSM_STATE_MOVED: {
      const { x, y } = action.payload;
      return moveState(state, action.payload.state, x, y);
    }
    case actionTypes.FSM_STATE_ADDED: {
      const { x, y } = action.payload;
      return addState(state, action.payload.state, x, y);
    }
    case actionTypes.FSM_STATE_SELECTED: {
      return selectState(state, action.payload.state);
    }
    case actionTypes.FSM_STATE_NAME_CHANGED: {
      return renameState(state, action.payload.state, action.payload.name);
    }
    case actionTypes.FSM_STATE_DELETED: {
      return deleteState(state, action.payload.state, action.payload.name);
    }
    case actionTypes.FSM_STATES_SET: {
      return setStates(state, action.payload.states);
    }
    case actionTypes.FSM_INITIAL_STATE_CHANGED: {
      return {
        ...changeInitialState(state, action.payload.state),
        executionPaths: [
          {
            currentState: action.payload.state,
            inputIndex: 0,
            inputMessage: '',
          }
        ],
      };
    }
    case actionTypes.FSM_INITIAL_STATE_REMOVED: {
      return {
        ...removeInitialState(state),
        executionPaths: [
          {
            currentState: '',
            inputIndex: 0,
            inputMessage: '',
          }
        ],
      };
    }
    case actionTypes.FSM_ACCEPT_STATE_ADDED: {
      return addAcceptState(state, action.payload.state);
    }
    case actionTypes.FSM_ACCEPT_STATE_REMOVED: {
      return removeAcceptState(state, action.payload.state);
    }
    case actionTypes.FSM_ACCEPT_STATES_SET: {
      return setAcceptStates(state, action.payload.states);
    }
    case actionTypes.FSM_TRANSITION_ADDED: { // TODO this case doesn't need to modify states or inputAlphabet
      const { fromState, inputSymbol, toState, emptyStringSymbol } = action.payload;
      return {
        ...state,
        states: state.states.add(fromState).add(toState),
        inputAlphabet: inputSymbol !== emptyStringSymbol ? state.inputAlphabet.add(inputSymbol) : state.inputAlphabet,
        transitionFunction: state.transitionFunction.add(createInstruction(fromState, inputSymbol, toState))
      };
    }
    case actionTypes.FSM_TRANSITION_REMOVED: {
      const { fromState, inputSymbol, toState } = action.payload;
      return {
        ...state,
        transitionFunction: state.transitionFunction
          .filter(transitionObject => {
            return transitionObject.fromState !== fromState ||
              transitionObject.inputSymbol !== inputSymbol ||
              transitionObject.toState !== toState;
          })
      };
    }
    case actionTypes.FSM_INPUT_SYMBOL_ADDED: { // TODO don't allow user to add empty string symbol
      return { ...state, inputAlphabet: state.inputAlphabet.add(action.payload.symbol) };
    }
    case actionTypes.FSM_INPUT_ALPHABET_SET: { // TODO don't allow user to add empty string symbol
      const { inputAlphabet, emptyStringSymbol } = action.payload;
      return {
        ...state,
        inputAlphabet: new Set(inputAlphabet),
        transitionFunction: state.transitionFunction.filter(transitionObject =>
          inputAlphabet.includes(transitionObject.inputSymbol) || transitionObject.inputSymbol === emptyStringSymbol
        )
      };
    }
    case actionTypes.SETTINGS_EMPTY_STRING_SYMBOL_SET: {
      return {
        ...state,
        inputAlphabet: state.inputAlphabet.map(inputSymbol => {
          if(inputSymbol === action.payload.oldEmptyStringSymbol) {
            return action.payload.newEmptyStringSymbol;
          }
          return inputSymbol;
        }),
        transitionFunction: state.transitionFunction.map(transitionObject => {
          if(transitionObject.inputSymbol === action.payload.oldEmptyStringSymbol) {
            return { ...transitionObject, inputSymbol: action.payload.newEmptyStringSymbol };
          }
          return transitionObject;
        })
      };
    }
    case actionTypes.FSM_INPUT_STRING_SET: {
      return {
        ...state,
        inputString: action.payload.inputString,
        executionPaths: [
          {
            currentState: state.initialState || '',
            inputIndex: 0,
            inputMessage: '',
          }
        ],
        executionPathIndex: 0,
      };
    }
    case actionTypes.FSM_EXECUTION_PATH_SET: {
      return setExecutionPath(state, action.payload.executionPathIndex);
    }
    case actionTypes.FSM_STEP_INPUT: {
      return stepInput(state);
    }
    case actionTypes.FSM_RUN_INPUT: {
      return runInput(state);
    }
    case actionTypes.FSM_RESTART_INPUT: {
      return {
        ...state,
        executionPaths: [
          {
            currentState: state.initialState || '',
            inputIndex: 0,
            inputMessage: ''
          }
        ],
        executionPathIndex: 0,
      };
    }
    case actionTypes.FSM_RUN_TEST_CASES: {
      const initialExecutionPath = { inputIndex: 0, inputMessage: '' };
      return runTestCases(state, initialExecutionPath, runInput);
    }
    case actionTypes.FSM_RESET_TEST_CASES: {
      return resetTestCases(state);
    }
    case actionTypes.FSM_ADD_TEST_CASE: {
      return addTestCase(state, action.payload.input, action.payload.expected);
    }
    case actionTypes.FSM_REMOVE_TEST_CASE: {
      return removeTestCase(state, action.payload.index);
    }
    case actionTypes.FSM_INITIALIZE_TEST_CASES_FROM_CSV_STRING: {
      return initializeTestCasesFromCsvString(state, action.payload.csvString);
    }
    case actionTypes.FSM_INITIALIZED_FROM_JSON_STRING: { // TODO load fsm with correct empty string symbol
      const { jsonString } = action.payload;
      const fsm = JSON.parse(jsonString);
      return {
        ...fsm,
        states: new Set(fsm.states),
        inputAlphabet: new Set(fsm.inputAlphabet),
        transitionFunction: new Set(fsm.transitionFunction),
        acceptStates: new Set(fsm.acceptStates),
        statePositions: new Map(fsm.statePositions),
        selected: null,
        inputString: '',
        executionPaths: [
          {
            currentState: fsm.initialState || '',
            inputIndex: 0,
            inputMessage: '',
          },
        ],
        executionPathIndex: 0,
        testCases: state.testCases,
      }
    }
    case actionTypes.FSM_RESET: {
      return {
        name: 'My FSM',
        states: new Set(),
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