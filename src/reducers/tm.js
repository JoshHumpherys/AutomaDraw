import * as actionTypes from '../constants/actionTypes'
import { Set, Map } from 'immutable';
import {
  changeName,
  moveState,
  addState,
  selectState,
  renameState,
  deleteState,
  changeInitialState,
  removeInitialState,
  addAcceptState,
  removeAcceptState,
  setAcceptStates
} from './sharedAutomataFunctions'

const createInstruction = (fromState, tapeSymbol, toState, writeSymbol, moveDirection) =>
  ({ fromState, tapeSymbol, toState, writeSymbol, moveDirection });

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
      const { fromState, tapeSymbol, toState, writeSymbol, moveDirection } = action.payload;
      const transition = createInstruction(fromState, tapeSymbol, toState, writeSymbol, moveDirection);
      return {
        ...state,
        transitionFunction: state.transitionFunction.add(transition)
      };
    }
    case actionTypes.TM_TRANSITION_REMOVED: {
      const { fromState, tapeSymbol, toState, writeSymbol, moveDirection } = action.payload;
      return {
        ...state,
        transitionFunction: state.transitionFunction
          .filter(transitionObject => {
            return transitionObject.fromState !== fromState ||
              transitionObject.tapeSymbol !== tapeSymbol ||
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
    case actionTypes.TM_INPUT_SYMBOL_ADDED: {
      return {
        ...state,
        inputAlphabet: state.inputAlphabet.add(action.payload.inputSymbol)
      }
    }
    case actionTypes.TM_BLANK_SYMBOL_CHANGED: {
      return { ...state, blankSymbol: action.payload.blankSymbol };
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