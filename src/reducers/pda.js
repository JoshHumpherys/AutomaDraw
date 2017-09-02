import { Set, Map, fromJS } from 'immutable';
import * as actionTypes from '../constants/actionTypes'
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
      return {
        ...state,
        states: state.states.remove(action.payload.state).add(action.payload.name),
        transitionFunction: state.transitionFunction
          .set(action.payload.name, state.transitionFunction.get(action.payload.state))
          .remove(action.payload.state)
          .mapEntries(([ fromState, inputSymbolMap ]) => {
            if (inputSymbolMap !== undefined) {
              return [fromState, inputSymbolMap.mapEntries(([ inputSymbol, stackSymbolMap ]) => {
                return [inputSymbol, stackSymbolMap.mapEntries(([ stackSymbol, transitionObject ]) => {
                  if(transitionObject.toState === action.payload.state) {
                    return [stackSymbol, { ...transitionObject, toState: action.payload.name }];
                  }
                  return [stackSymbol, transitionObject];
                })];
              })];
            }
            return [ fromState, inputSymbolMap ];
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
    case actionTypes.PDA_STATE_DELETED: {
      return {
        ...state,
        states: state.states.remove(action.payload.state),
        transitionFunction: state.transitionFunction.size !== 0 ?
          state.transitionFunction.mapEntries(([ fromState, inputSymbolMap ]) => {
            if(inputSymbolMap !== undefined) {
              return [fromState, inputSymbolMap.mapEntries(([ inputSymbol, stackSymbolMap ]) => {
                return [inputSymbol, stackSymbolMap.filter(({ toState }) => {
                  return toState !== action.payload.state;
                })];
              })];
            }
            return [ fromState, inputSymbolMap ];
          }).remove(action.payload.state) :
          new Map(),
        initialState: state.initialState === action.payload.state ? null : state.initialState,
        acceptStates: state.acceptStates.remove(action.payload.state),
        statePositions: state.statePositions.remove(action.payload.state),
        selected: state.selected === action.payload.state ? null : state.selected
      };
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
    case actionTypes.PDA_INITIALIZED_FROM_JSON_STRING: {
      const pda = JSON.parse(action.payload.jsonString);
      return {
        ...pda,
        states: new Set(pda.states),
        inputAlphabet: new Set(pda.inputAlphabet),
        stackAlphabet: new Set(pda.stackAlphabet),
        transitionFunction: fromJS(pda.transitionFunction).map(inputSymbolMap =>
          inputSymbolMap.map(stackSymbolMap =>
            stackSymbolMap.map(transitionObject =>
              transitionObject.toObject()
            )
          )
        ),
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