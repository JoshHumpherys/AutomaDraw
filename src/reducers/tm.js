import * as actionTypes from '../constants/actionTypes'
import { Set, Map, fromJS } from 'immutable';
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

export default function tm(
  state = {
    name: 'My TM',
    states: new Set(['A', 'B']),
    tapeAlphabet: new Set(['a']),
    blankSymbol: '\u0394',
    inputAlphabet: new Set(['a']),
    transitionFunction: new Map({
      'A': new Map({
        a: { toState: 'B', writeSymbol: 'a', moveDirection: 'R' }
      })
    }),
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
      return {
        ...state,
        states: state.states.remove(action.payload.state).add(action.payload.name),
        transitionFunction: state.transitionFunction
          .set(action.payload.name, state.transitionFunction.get(action.payload.state))
          .remove(action.payload.state)
          .map(tapeSymbolMap => {
            if(tapeSymbolMap !== undefined) {
              return tapeSymbolMap.map(transitionObject => {
                if (transitionObject.toState === action.payload.state) {
                  return { ...transitionObject, toState: action.payload.name };
                }
                return transitionObject;
              });
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
    case actionTypes.TM_STATE_DELETED: {
      return {
        ...state,
        states: state.states.remove(action.payload.state),
        transitionFunction: state.transitionFunction.size !== 0 ?
          state.transitionFunction.map(tapeSymbolMap => {
            if (tapeSymbolMap !== undefined) {
              return tapeSymbolMap.filter(({ toState }) => {
                return toState !== action.payload.state;
              });
            }
          }).remove(action.payload.state) :
          new Map(),
        initialState: state.initialState === action.payload.state ? null : state.initialState,
        acceptStates: state.acceptStates.remove(action.payload.state),
        statePositions: state.statePositions.remove(action.payload.state),
        selected: state.selected === action.payload.state ? null : state.selected
      };
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
    case actionTypes.TM_TRANSITION_ADDED: {
      const { fromState, tapeSymbol, toState, writeSymbol, moveDirection } = action.payload;
      const { transitionFunction } = state;
      const tapeSymbolMap = transitionFunction.get(fromState) || new Map();
      return {
        ...state,
        transitionFunction: transitionFunction
          .set(fromState, tapeSymbolMap.set(tapeSymbol, { toState, writeSymbol, moveDirection }))
      };
    }
    case actionTypes.TM_TRANSITION_REMOVED: { // TODO fix this
      const {fromState, letter} = action.payload;
      return {
        ...state,
        transitionFunction: state.transitionFunction
          .set(fromState, state.transitionFunction.get(fromState).remove(letter))
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
      const TM = JSON.parse(action.payload.jsonString);
      return {
        ...TM,
        states: new Set(TM.states),
        tapeAlphabet: new Set(TM.tapeAlphabet),
        inputAlphabet: new Set(TM.inputAlphabet),
        transitionFunction: fromJS(TM.transitionFunction).map(tapeSymbolMap =>
          tapeSymbolMap.map(transitionObject =>
            transitionObject.toObject()
          )
        ),
        acceptStates: new Set(TM.acceptStates),
        statePositions: new Map(TM.statePositions)
      }
    }
    case actionTypes.TM_RESET: {
      return {
        name: 'My TM',
        states: new Set(),
        tapeAlphabet: new Set(),
        blankSymbol: null,
        inputAlphabet: new Set(),
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