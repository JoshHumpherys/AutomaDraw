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
  setInputString,
  restartInput
} from './sharedAutomataFunctions'
import * as inputMessageTypes from '../constants/inputMessageTypes'

const createInstruction = (fromState, inputSymbol, toState, writeSymbol, moveDirection) =>
  ({ fromState, inputSymbol, toState, writeSymbol, moveDirection });

const stepInput = state => {
  if(state.acceptStates.contains(state.currentState)) {
    return { ...state, inputMessage: inputMessageTypes.ACCEPT };
  }
  const currentSymbol = state.inputIndex >= 0 && state.inputIndex < state.inputString.length ?
    state.inputString[state.inputIndex] : state.blankSymbol;
  const transition = state.transitionFunction.find(instruction => // TODO nondeterminism
    instruction.fromState === state.currentState && instruction.inputSymbol === currentSymbol
  );
  if(transition === undefined) {
    return { ...state, inputMessage: inputMessageTypes.REJECT };
  }
  const currentState = transition.toState;
  let inputString;
  if(state.inputIndex >= 0 && state.inputIndex < state.inputString.length) {
    inputString = state.inputString.substring(0, state.inputIndex) +
      transition.writeSymbol +
      state.inputString.substring(state.inputIndex + 1);
  } else {
    const generateBlankSymbols = numBlankSymbols => {
      let blankSymbolsString = '';
      for(let i = 0; i < numBlankSymbols; i++) {
        blankSymbolsString += state.blankSymbol;
      }
      return blankSymbolsString;
    };
    if(state.inputIndex < 0) {
      let blankSymbols = generateBlankSymbols(state.inputIndex + 1);
      inputString = transition.writeSymbol + blankSymbols + state.inputString;
    } else {
      let blankSymbols = generateBlankSymbols(state.inputIndex - state.inputString.length);
      inputString = state.inputString + blankSymbols + transition.writeSymbol;
    }
  }
  const inputIndex = state.inputIndex + (transition.moveDirection === 'L' ? -1 : 1); // TODO make direction enum
  const inputMessage = state.acceptStates.contains(currentState) ? inputMessageTypes.ACCEPT : state.inputMessage;
  return { ...state, inputString, inputIndex, currentState, inputMessage };
};

export default function tm(
  state = {
    name: 'My TM',
    states: new Set(['A', 'B']),
    tapeAlphabet: new Set(['\u0394', 'a']),
    blankSymbol: '\u0394',
    inputAlphabet: new Set(['a']),
    transitionFunction: new Set([
      createInstruction('A', 'a', 'B', 'a', 'R')
    ]),
    initialState: 'A',
    acceptStates: new Set(['A']),
    statePositions: new Map({
      'A': { x: 130, y: 200 },
      'B': { x: 370, y: 200 }
    }),
    selected: '',
    currentState: '',
    inputString: '',
    inputIndex: 0,
    inputMessage: ''
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
      return changeInitialState(state, action.payload.state);
    }
    case actionTypes.TM_INITIAL_STATE_REMOVED: {
      return removeInitialState(state);
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
      return setInputString(state, action.payload.inputString);
    }
    case actionTypes.TM_STEP_INPUT: {
      return stepInput(state);
    }
    case actionTypes.TM_RUN_INPUT: {
      let newState = state;
      for(let i = 0; i < 500; i++) {
        newState = stepInput(newState);
        if(newState.inputMessage !== '') {
          return newState;
        }
      }
      alert('TODO handle TMs that don\'t always halt. 500 steps have been executed.');
      return newState;
    }
    case actionTypes.TM_RESTART_INPUT: {
      return restartInput(state, action.payload.inputString);
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
        inputIndex: 0,
        inputMessage: ''
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
        inputIndex: 0,
        inputMessage: ''
      }
    }
    default: {
      return state;
    }
  }
}