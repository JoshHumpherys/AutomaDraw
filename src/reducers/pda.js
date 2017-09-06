import { Set, Map } from 'immutable';
import * as actionTypes from '../constants/actionTypes'
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
  removeAcceptState
} from './sharedAutomataFunctions'

const createInstruction = (fromState, inputSymbol, stackSymbol, toState, pushSymbols) =>
  ({ fromState, inputSymbol, stackSymbol, toState, pushSymbols });

export default function pda(
  state = {
    name: 'My PDA',
    states: new Set(['A', 'B']),
    inputAlphabet: new Set(['a']),
    stackAlphabet: new Set(['#']),
    transitionFunction: new Set([
      createInstruction('A', 'a', '#', 'B', '#')
    ]),
    initialState: 'A',
    initialStackSymbol: '#',
    acceptStates: new Set(['A']),
    statePositions: new Map({
      'A': { x: 130, y: 200 },
      'B': { x: 370, y: 200 }
    }),
    selected: 'A'
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
    case actionTypes.PDA_INITIAL_STATE_CHANGED: {
      return changeInitialState(state, action.payload.state);
    }
    case actionTypes.PDA_INITIAL_STATE_REMOVED: {
      return removeInitialState(state);
    }
    case actionTypes.PDA_ACCEPT_STATE_ADDED: {
      return addAcceptState(state, action.payload.state);
    }
    case actionTypes.PDA_ACCEPT_STATE_REMOVED: {
      return removeAcceptState(state, action.payload.state);
    }
    case actionTypes.PDA_TRANSITION_ADDED: {
      const { fromState, inputSymbol, stackSymbol, toState, pushSymbols } = action.payload;
      const transition = createInstruction(fromState, inputSymbol, stackSymbol, toState, pushSymbols);
      return {
        ...state,
        transitionFunction: state.transitionFunction.add(transition)
      };
    }
    case actionTypes.PDA_TRANSITION_REMOVED: {
      const { fromState, inputSymbol, stackSymbol, toState, pushSymbols } = action.payload;
      return {
        ...state,
        transitionFunction: state.transitionFunction
          .filter(transitionObject => {
            return transitionObject.fromState !== fromState ||
              transitionObject.inputSymbol !== inputSymbol ||
              transitionObject.stackSymbol !== stackSymbol ||
              transitionObject.toState !== toState ||
              transitionObject.pushSymbols !== pushSymbols;
          })
      };
    }
    case actionTypes.PDA_INPUT_SYMBOL_ADDED: {
      return {
        ...state,
        inputAlphabet: state.inputAlphabet.add(action.payload.inputSymbol)
      }
    }
    case actionTypes.PDA_STACK_SYMBOL_ADDED: {
      return { ...state, stackAlphabet: state.stackAlphabet.add(action.payload.stackSymbol) };
    }
    case actionTypes.PDA_INITIAL_STACK_SYMBOL_CHANGED: {
      return { ...state, initialStackSymbol: action.payload.stackSymbol };
    }
    case actionTypes.PDA_INITIAL_STACK_SYMBOL_REMOVED: {
      return { ...state, initialStackSymbol: null };
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
        statePositions: new Map(pda.statePositions)
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
        selected: null
      }
    }
    default: {
      return state;
    }
  }
}