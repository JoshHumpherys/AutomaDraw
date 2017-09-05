import * as actionTypes from '../constants/actionTypes'
import { Set, Map } from 'immutable';
import {
  changeName,
  moveState,
  addState,
  selectState,
  changeInitialState,
  removeInitialState,
  addAcceptState,
  removeAcceptState
} from './sharedAutomataFunctions'

export default function fsm(
  state = {
    name: 'My FSM',
    states: new Set(['A', 'B', 'C']),
    alphabet: new Set(['a', 'b', 'c']),
    transitionFunction: new Map({
      'A': new Map({ a: 'B' }),
      'B': new Map({ b: 'C' }),
      'C': new Map({ c: 'A' })
    }),
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
      return {
        ...state,
        states: state.states.remove(action.payload.state).add(action.payload.name),
        transitionFunction: state.transitionFunction
          .set(action.payload.name, state.transitionFunction.get(action.payload.state))
          .remove(action.payload.state)
          .mapEntries(([ fromState, transitions ]) => {
            if(transitions !== undefined) {
              return [fromState, transitions.mapEntries(([ symbol, toState ]) => {
                if (toState === action.payload.state) {
                  return [symbol, action.payload.name];
                }
                return [symbol, toState];
              })];
            }
          }),
        initialState: state.initialState === action.payload.state ? action.payload.name : state.initialState,
        acceptStates: state.acceptStates.contains(action.payload.state) ?
          state.acceptStates.remove(action.payload.state).add(action.payload.name) :
          state.acceptStates,
        statePositions: state.statePositions
          .set(action.payload.name, state.statePositions.get(action.payload.state))
          .remove(action.payload.state),
        selected: state.selected === action.payload.state ? action.payload.name : state.selected
      };
    }
    case actionTypes.FSM_STATE_DELETED: {
      return {
        ...state,
        states: state.states.remove(action.payload.state),
        transitionFunction: state.transitionFunction.size !== 0 ?
          state.transitionFunction.mapEntries(([ key, value ]) => {
            if(key !== undefined) {
              if(key !== action.payload.state) {
                return [key, value.filter(value => value !== action.payload.state)];
              }
            }
            return [key, value];
          }).remove(action.payload.state) :
          new Map(),
        initialState: state.initialState === action.payload.state ? null : state.initialState,
        acceptStates: state.acceptStates.remove(action.payload.state),
        statePositions: state.statePositions.remove(action.payload.state),
        selected: state.selected === action.payload.state ? null : state.selected
      };
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
    case actionTypes.FSM_TRANSITION_ADDED: {
      const { fromState, letter, toState } = action.payload;
      const transitionsFromState = state.transitionFunction.get(fromState) || new Map();
      return {
        ...state,
        transitionFunction: state.transitionFunction
          .set(fromState, transitionsFromState.set(letter, toState)),
      };
    }
    case actionTypes.FSM_TRANSITION_REMOVED: {
      const { fromState, letter } = action.payload;
      return {
        ...state,
        transitionFunction: state.transitionFunction
          .set(fromState, state.transitionFunction.get(fromState).remove(letter))
      };
    }
    case actionTypes.FSM_LETTER_ADDED: {
      return {
        ...state,
        alphabet: state.alphabet.add(action.payload.letter)
      }
    }
    case actionTypes.FSM_INITIALIZED_FROM_JSON_STRING: {
      const fsm = JSON.parse(action.payload.jsonString);
      return {
        ...fsm,
        states: new Set(fsm.states),
        alphabet: new Set(fsm.alphabet),
        transitionFunction: new Map(fsm.transitionFunction)
          .mapEntries(([ fromState, transitions ]) => {
            if(transitions !== undefined) {
              return [fromState, new Map(transitions)];
            }
          }),
        acceptStates: new Set(fsm.acceptStates),
        statePositions: new Map(fsm.statePositions)
      }
    }
    case actionTypes.FSM_RESET: {
      return {
        name: 'My FSM',
        states: new Set(),
        alphabet: new Set(),
        transitionFunction: new Map(),
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