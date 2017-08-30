import { Set, Map } from 'immutable';
import * as actionTypes from '../constants/actionTypes'

export default function pda(
  state = {
    name: 'My PDA',
    states: new Set(['A', 'B', 'C']),
    inputAlphabet: new Set(['a', 'b', 'c']),
    stackAlphabet: new Set(['#']),
    transitionFunction: new Map({
      'A': new Map({
        a: new Map({
          '#': { toState: 'B', pushSymbols: '#' }
        })
      })
    }),
    initialState: 'A',
    initialStackSymbol: '#',
    acceptStates: new Set(['A']),
    statePositions: new Map({
      'A': { x: 130, y: 200 },
      'B': { x: 250, y: 50 },
      'C': { x: 370, y: 200 }
    }),
    selected: 'A'
  },
  action) {
  switch(action.type) {
    case actionTypes.PDA_NAME_CHANGED: {
      return { ...state, name: action.payload.name };
    }
    case actionTypes.PDA_STATE_MOVED: {
      return {
        ...state,
        statePositions: state.statePositions.set(action.payload.state, { x: action.payload.x, y: action.payload.y })
      };
    }
    case actionTypes.PDA_STATE_ADDED: {
      return {
        ...state,
        states: state.states.add(action.payload.state),
        statePositions: state.statePositions.set(action.payload.state, { x: action.payload.x, y: action.payload.y })
      };
    }
    case actionTypes.PDA_STATE_SELECTED: {
      return { ...state, selected: action.payload.state };
    }
    case actionTypes.PDA_STATE_NAME_CHANGED: { // TODO fix this
      return {
        ...state,
        states: state.states.remove(action.payload.state).add(action.payload.name),
        transitionFunction: state.transitionFunction
          .set(action.payload.name, state.transitionFunction.get(action.payload.state))
          .remove(action.payload.state)
          .mapEntries(([fromState, transitions]) => {
            if(transitions !== undefined) {
              return [fromState, transitions.mapEntries(([ letter, toState ]) => {
                if(toState === action.payload.state) {
                  return [letter, action.payload.name];
                }
                return [letter, toState];
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
    case actionTypes.PDA_STATE_DELETED: { // TODO fix this
      return {
        ...state,
        states: state.states.remove(action.payload.state),
        transitionFunction: state.transitionFunction.size !== 0 ?
          state.transitionFunction.mapEntries(([key, value]) => {
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
    case actionTypes.PDA_INITIAL_STATE_CHANGED: {
      return {...state, initialState: action.payload.state};
    }
    case actionTypes.PDA_INITIAL_STATE_REMOVED: {
      return {...state, initialState: null};
    }
    case actionTypes.PDA_ACCEPT_STATE_ADDED: {
      return {...state, acceptStates: state.acceptStates.add(action.payload.state)};
    }
    case actionTypes.PDA_ACCEPT_STATE_REMOVED: {
      return {...state, acceptStates: state.acceptStates.remove(action.payload.state)};
    }
    case actionTypes.PDA_TRANSITION_ADDED: { // TODO fix this
      const { fromState, letter, toState } = action.payload;
      const transitionsFromState = state.transitionFunction.get(fromState) || new Map();
      return {
        ...state,
        transitionFunction: state.transitionFunction
          .set(fromState, transitionsFromState.set(letter, toState)),
      };
    }
    case actionTypes.PDA_TRANSITION_REMOVED: { // TODO fix this
      const { fromState, letter } = action.payload;
      return {
        ...state,
        transitionFunction: state.transitionFunction
          .set(fromState, state.transitionFunction.get(fromState).remove(letter))
      };
    }
    case actionTypes.PDA_INPUT_SYMBOL_ADDED: {
      return {
        ...state,
        inputAlphabet: state.inputAlphabet.add(action.payload.inputSymbol)
      }
    }
    case actionTypes.PDA_STACK_SYMBOL_ADDED: {
      return {
        ...state,
        stackAlphabet: state.stackAlphabet.add(action.payload.inputSymbol)
      }
    }
    case actionTypes.PDA_INITIAL_STACK_SYMBOL_CHANGED: {
      return { ...state, initialStackSymbol: action.payload.stackSymbol };
    }
    case actionTypes.PDA_INITIAL_STACK_SYMBOL_REMOVED: {
      return { ...state, initialStackSymbol: null };
    }
    case actionTypes.PDA_INITIALIZED_FROM_JSON_STRING: { // TODO fix this
      const pda = JSON.parse(action.payload.jsonString);
      return {
        ...pda,
        states: new Set(pda.states),
        inputAlphabet: new Set(pda.inputAlphabet),
        stackAlphabet: new Set(pda.stackAlphabet),
        transitionFunction: new Map(pda.transitionFunction)
          .mapEntries(([ fromState, transitions ]) => {
            if(transitions !== undefined) {
              return [fromState, new Map(transitions)];
            }
          }),
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
        transitionFunction: new Map(),
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