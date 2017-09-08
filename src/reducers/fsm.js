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

const createInstruction = (fromState, inputSymbol, toState) => ({ fromState, inputSymbol, toState });

export default function fsm(
  state = {
    name: 'My FSM',
    states: new Set(['A', 'B', 'C']),
    alphabet: new Set(['a', 'b', 'c']),
    transitionFunction: new Set([
      createInstruction('A', 'a', 'B'),
      createInstruction('B', 'b', 'C'),
      createInstruction('C', 'c', 'A')
    ]),
    initialState: 'A',
    acceptStates: new Set(['A']),
    statePositions: new Map({
      'A': { x: 130, y: 200 },
      'B': { x: 250, y: 50 },
      'C': { x: 370, y: 200 }
    }),
    selected: 'A'
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
      return changeInitialState(state, action.payload.state);
    }
    case actionTypes.FSM_INITIAL_STATE_REMOVED: {
      return removeInitialState(state);
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
    case actionTypes.FSM_TRANSITION_ADDED: {
      const { fromState, inputSymbol, toState } = action.payload;
      return {
        ...state,
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
    case actionTypes.FSM_SYMBOL_ADDED: {
      return { ...state, alphabet: state.alphabet.add(action.payload.symbol) };
    }
    case actionTypes.FSM_INITIALIZED_FROM_JSON_STRING: {
      const fsm = JSON.parse(action.payload.jsonString);
      return {
        ...fsm,
        states: new Set(fsm.states),
        alphabet: new Set(fsm.alphabet),
        transitionFunction: new Set(fsm.transitionFunction),
        acceptStates: new Set(fsm.acceptStates),
        statePositions: new Map(fsm.statePositions)
      }
    }
    case actionTypes.FSM_RESET: {
      return {
        name: 'My FSM',
        states: new Set(),
        alphabet: new Set(),
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