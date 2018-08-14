import { Set, Map } from 'immutable';
import * as actionTypes from '../constants/actionTypes'
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
  initializeTestCasesFromCsvString
} from './sharedAutomataFunctions'
import * as inputMessageTypes from "../constants/inputMessageTypes";
import * as emptyStringSymbols from "../constants/emptyStringSymbols";
import * as testCaseResultTypes from "../constants/testCaseResultTypes";

const createInstruction = (fromState, inputSymbol, stackSymbol, toState, pushSymbol) =>
  ({ fromState, inputSymbol, stackSymbol, toState, pushSymbol });

const stepInput = state => {
  const determineInputMessage = currentState =>
    state.acceptStates.contains(currentState) ? inputMessageTypes.ACCEPT : inputMessageTypes.REJECT;
  let executionPaths = [];
  return { ...state, executionPaths: [...state.executionPaths.map(executionPath => {
    if(executionPath.inputMessage !== '') {
      return executionPath;
    }
    const getEmptyStringTransitions = (currentState, stackSymbol) =>
      state.transitionFunction.filter(instruction =>
        instruction.fromState === currentState &&
        instruction.inputSymbol === emptyStringSymbols.LAMBDA &&
        (instruction.stackSymbol === stackSymbol || instruction.stackSymbol === emptyStringSymbols.LAMBDA)
      );
    if(executionPath.inputIndex >= state.inputString.length &&
      getEmptyStringTransitions(executionPath.currentState, executionPath.stack.slice(-1)[0]).first() === undefined) {
      return {
        ...executionPath,
        inputMessage: determineInputMessage(state.inputString.length === 0 ? state.initialState : executionPath.currentState)
      };
    }
    const transitions = state.transitionFunction.filter(instruction =>
      instruction.fromState === executionPath.currentState &&
      (instruction.inputSymbol === state.inputString[executionPath.inputIndex] || instruction.inputSymbol === emptyStringSymbols.LAMBDA) &&
      (instruction.stackSymbol === executionPath.stack.slice(-1)[0] || instruction.stackSymbol === emptyStringSymbols.LAMBDA)
    );
    let inputMessage;
    if(transitions.first() === undefined) {
      return { ...executionPath, inputMessage: inputMessageTypes.REJECT };
    }
    const getNewExecutionPath = transition => {
      let stack = [...executionPath.stack];
      if(transition.stackSymbol !== emptyStringSymbols.LAMBDA) {
        stack.pop();
      }
      if(transition.pushSymbol.length > 0 && transition.pushSymbol !== emptyStringSymbols.LAMBDA) {
        stack = [...stack, ...transition.pushSymbol.split('').reverse()];
      }
      const newInputIndex = executionPath.inputIndex + (transition.inputSymbol === emptyStringSymbols.LAMBDA ? 0 : 1);
      if(newInputIndex >= state.inputString.length &&
        getEmptyStringTransitions(transition.toState, stack.slice(-1)[0]).first() === undefined) {
        inputMessage = determineInputMessage(transition.toState);
      } else {
        inputMessage = executionPath.inputMessage;
      }
      return {
        inputIndex: newInputIndex,
        currentState: transition.toState,
        stack,
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
      alert('TODO handle PDAs that have a lot of execution paths. There are currently ' + newState.executionPaths.length + ' execution paths.');
      return newState;
    }
  }
  alert('TODO handle PDAs that have a lot of steps. 500 steps have been executed.');
  return newState;
};

export default function pda(
  state = {
    name: 'Example PDA',
    states: new Set(['A', 'B', 'C']),
    inputAlphabet: new Set(['0', '1']),
    stackAlphabet: new Set(['A', 'Z']),
    transitionFunction: new Set([
      createInstruction('A', '0', 'Z', 'A', 'AZ'),
      createInstruction('A', '0', 'A', 'A', 'AA'),
      createInstruction('A', emptyStringSymbols.LAMBDA, emptyStringSymbols.LAMBDA, 'B', emptyStringSymbols.LAMBDA),
      createInstruction('B', '1', 'A', 'B', emptyStringSymbols.LAMBDA),
      createInstruction('B', emptyStringSymbols.LAMBDA, 'Z', 'C', 'Z'),
    ]),
    initialState: 'A',
    initialStackSymbol: 'Z',
    acceptStates: new Set(['C']),
    statePositions: new Map({
      'A': { x: 130, y: 200 },
      'B': { x: 370, y: 200 },
      'C': { x: 610, y: 200 },
    }),
    selected: 'A',
    inputString: '',
    executionPaths: [
      {
        currentState: 'A',
        inputString: '',
        stack: ['Z'],
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
    case actionTypes.PDA_NAME_CHANGED: {
      return changeName(state, action.payload.name);
    }
    case actionTypes.PDA_STATE_MOVED: {
      const { x, y } = action.payload;
      return moveState(state, action.payload.state, x, y);
    }
    case actionTypes.PDA_STATE_ADDED: {
      const { x, y } = action.payload;
      return addState(state, action.payload.state, x, y);
    }
    case actionTypes.PDA_STATE_SELECTED: {
      return selectState(state, action.payload.state);
    }
    case actionTypes.PDA_STATE_NAME_CHANGED: {
      return renameState(state, action.payload.state, action.payload.name);
    }
    case actionTypes.PDA_STATE_DELETED: {
      return deleteState(state, action.payload.state);
    }
    case actionTypes.PDA_STATES_SET: {
      return setStates(state, action.payload.states);
    }
    case actionTypes.PDA_INITIAL_STATE_CHANGED: {
      return {
        ...changeInitialState(state, action.payload.state),
        executionPaths: [
          {
            currentState: action.payload.state,
            stack: [state.initialStackSymbol],
            inputIndex: 0,
            inputMessage: ''
          }
        ],
      };
    }
    case actionTypes.PDA_INITIAL_STATE_REMOVED: {
      return {
        ...removeInitialState(state),
        executionPaths: [
          {
            currentState: '',
            stack: [state.initialStackSymbol],
            inputIndex: 0,
            inputMessage: ''
          }
        ],
      };
    }
    case actionTypes.PDA_ACCEPT_STATE_ADDED: {
      return addAcceptState(state, action.payload.state);
    }
    case actionTypes.PDA_ACCEPT_STATE_REMOVED: {
      return removeAcceptState(state, action.payload.state);
    }
    case actionTypes.PDA_ACCEPT_STATES_SET: {
      return setAcceptStates(state, action.payload.states);
    }
    case actionTypes.PDA_TRANSITION_ADDED: { // TODO this case doesn't need to modify states or inputAlphabet
      const { fromState, inputSymbol, stackSymbol, toState, pushSymbol, emptyStringSymbol } = action.payload;
      const transition = createInstruction(fromState, inputSymbol, stackSymbol, toState, pushSymbol);
      let { stackAlphabet } = state;
      if(stackSymbol !== emptyStringSymbol) {
        stackAlphabet = stackAlphabet.add(stackSymbol);
      }
      if(pushSymbol !== emptyStringSymbol) {
        stackAlphabet = stackAlphabet.union(pushSymbol);
      }
      return {
        ...state,
        states: state.states.add(fromState).add(toState),
        inputAlphabet: inputSymbol !== emptyStringSymbol ? state.inputAlphabet.add(inputSymbol) : state.inputAlphabet,
        stackAlphabet,
        transitionFunction: state.transitionFunction.add(transition)
      };
    }
    case actionTypes.PDA_TRANSITION_REMOVED: {
      const { fromState, inputSymbol, stackSymbol, toState, pushSymbol } = action.payload;
      return {
        ...state,
        transitionFunction: state.transitionFunction
          .filter(transitionObject => {
            return transitionObject.fromState !== fromState ||
              transitionObject.inputSymbol !== inputSymbol ||
              transitionObject.stackSymbol !== stackSymbol ||
              transitionObject.toState !== toState ||
              transitionObject.pushSymbol !== pushSymbol;
          })
      };
    }
    case actionTypes.PDA_INPUT_SYMBOL_ADDED: { // TODO don't allow user to add empty string symbol
      return {
        ...state,
        inputAlphabet: state.inputAlphabet.add(action.payload.inputSymbol)
      }
    }
    case actionTypes.PDA_INPUT_ALPHABET_SET: { // TODO don't allow user to add empty string symbol
      const { inputAlphabet } = action.payload;
      return {
        ...state,
        inputAlphabet: new Set(inputAlphabet),
        transitionFunction: state.transitionFunction.filter(transitionObject =>
          inputAlphabet.includes(transitionObject.inputSymbol)
        )
      };
    }
    case actionTypes.PDA_STACK_SYMBOL_ADDED: { // TODO don't allow user to add empty string symbol
      return { ...state, stackAlphabet: state.stackAlphabet.add(action.payload.stackSymbol) };
    }
    case actionTypes.PDA_STACK_ALPHABET_SET: { // TODO don't allow user to add empty string symbol
      const { stackAlphabet } = action.payload;
      const forbiddenStackSymbols = state.stackAlphabet.subtract(stackAlphabet);
      return {
        ...state,
        stackAlphabet: new Set(stackAlphabet),
        transitionFunction: state.transitionFunction.filter(transitionObject => {
          transitionObject.pushSymbol.split('').forEach(pushSymbol => {
            if(!stackAlphabet.includes(pushSymbol)) {
              return false;
            }
          });
          return stackAlphabet.includes(transitionObject.stackSymbol);
        }),
        initialStackSymbol: stackAlphabet.includes(state.initialStackSymbol) ? state.initialStackSymbol : null
      };
    }
    case actionTypes.PDA_INITIAL_STACK_SYMBOL_CHANGED: {
      return { ...state, initialStackSymbol: action.payload.stackSymbol };
    }
    case actionTypes.PDA_INITIAL_STACK_SYMBOL_REMOVED: {
      return { ...state, initialStackSymbol: null };
    }
    case actionTypes.SETTINGS_EMPTY_STRING_SYMBOL_SET: {
      const { oldEmptyStringSymbol, newEmptyStringSymbol } = action.payload;
      return {
        ...state,
        inputAlphabet: state.inputAlphabet.map(inputSymbol => {
          if(inputSymbol === oldEmptyStringSymbol) {
            return newEmptyStringSymbol;
          }
          return inputSymbol;
        }),
        stackAlphabet: state.stackAlphabet.map(stackAlphabet => {
          if(stackAlphabet === oldEmptyStringSymbol) {
            return newEmptyStringSymbol;
          }
          return stackAlphabet;
        }),
        transitionFunction: state.transitionFunction.map(transitionObject => {
          return {
            ...transitionObject,
            inputSymbol: transitionObject.inputSymbol === oldEmptyStringSymbol ?
              newEmptyStringSymbol : transitionObject.inputSymbol,
            stackSymbol: transitionObject.stackSymbol === oldEmptyStringSymbol ?
              newEmptyStringSymbol : transitionObject.stackSymbol,
            pushSymbol: transitionObject.pushSymbol === oldEmptyStringSymbol ?
              newEmptyStringSymbol : transitionObject.pushSymbol
          };
        })
      };
    }
    case actionTypes.PDA_INPUT_STRING_SET: {
      return {
        ...state,
        inputString: action.payload.inputString,
        executionPaths: [
          {
            currentState: state.initialState || '',
            stack: [state.initialStackSymbol],
            inputIndex: 0,
            inputMessage: '',
          }
        ],
        executionPathIndex: 0,
      };
    }
    case actionTypes.PDA_EXECUTION_PATH_SET: {
      return setExecutionPath(state, action.payload.executionPathIndex);
    }
    case actionTypes.PDA_STEP_INPUT: {
      return stepInput(state);
    }
    case actionTypes.PDA_RUN_INPUT: {
      return runInput(state);
    }
    case actionTypes.PDA_RESTART_INPUT: {
      return {
        ...state,
        executionPaths: [
          {
            currentState: state.initialState || '',
            stack: [state.initialStackSymbol],
            inputIndex: 0,
            inputMessage: ''
          }
        ],
        executionPathIndex: 0,
      };
    }
    case actionTypes.PDA_RUN_TEST_CASES: {
      const initialExecutionPath = { currentState: state.initialState || '', inputIndex: 0, inputMessage: '', stack: [state.initialStackSymbol] };
      return runTestCases(state, initialExecutionPath, runInput);
    }
    case actionTypes.PDA_RESET_TEST_CASES: {
      return resetTestCases(state);
    }
    case actionTypes.PDA_ADD_TEST_CASE: {
      return addTestCase(state, action.payload.input, action.payload.expected);
    }
    case actionTypes.PDA_REMOVE_TEST_CASE: {
      return removeTestCase(state, action.payload.index);
    }
    case actionTypes.PDA_INITIALIZE_TEST_CASES_FROM_CSV_STRING: {
      return initializeTestCasesFromCsvString(state, action.payload.csvString);
    }
    case actionTypes.PDA_INITIALIZED_FROM_JSON_STRING: {
      const pda = JSON.parse(action.payload.jsonString);
      return {
        ...pda,
        states: new Set(pda.states),
        inputAlphabet: new Set(pda.inputAlphabet),
        stackAlphabet: new Set(pda.stackAlphabet),
        transitionFunction: new Set(pda.transitionFunction),
        acceptStates: new Set(pda.acceptStates),
        statePositions: new Map(pda.statePositions),
        selected: null,
        inputString: '',
        executionPaths: [
          {
            currentState: pda.initialState || '',
            inputString: '',
            stack: [pda.initialStackSymbol],
            inputIndex: 0,
            inputMessage: '',
          },
        ],
        executionPathIndex: 0,
        testCases: state.testCases,
      }
    }
    case actionTypes.PDA_RESET: {
      return {
        name: 'My PDA',
        states: new Set(),
        inputAlphabet: new Set(),
        stackAlphabet: new Set(),
        transitionFunction: new Set(),
        initialState: null,
        initialStackSymbol: '',
        acceptStates: new Set(),
        statePositions: new Map(),
        selected: null,
        inputString: '',
        executionPaths: [
          {
            currentState: '',
            inputString: '',
            stack: [],
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