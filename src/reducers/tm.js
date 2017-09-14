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
  setAcceptStates
} from './sharedAutomataFunctions'

const createInstruction = (fromState, inputSymbol, toState, writeSymbol, moveDirection) =>
  ({ fromState, inputSymbol, toState, writeSymbol, moveDirection });

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
    selected: 'A'
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
          return inputAlphabet.includes(transitionObject.inputSymbol) &&
            inputAlphabet.includes(transitionObject.writeSymbol);
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
        inputAlphabet: new Set(inputAlphabet),
        transitionFunction: state.transitionFunction.filter(transitionObject => {
          return inputAlphabet.includes(transitionObject.inputSymbol) &&
            inputAlphabet.includes(transitionObject.writeSymbol);
        })
      };
    }
    case actionTypes.TM_BLANK_SYMBOL_CHANGED: {
      const { blankSymbol } = action.payload;
      return {
        ...state,
        blankSymbol,
        inputAlphabet: state.inputAlphabet.remove(blankSymbol),
        transitionFunction: state.transitionFunction.filter(transitionObject => {
          return blankSymbol !== transitionObject.inputSymbol && blankSymbol !== transitionObject.writeSymbol;
        })
      };
    }
    case actionTypes.TM_BLANK_SYMBOL_REMOVED: {
      return { ...state, blankSymbol: null };
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
        statePositions: new Map(tm.statePositions)
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
        selected: null
      }
    }
    default: {
      return state;
    }
  }
}