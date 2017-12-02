import * as actionTypes from '../constants/actionTypes'
import { Set, Map } from 'immutable'
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

const createInstruction = (fromState, inputSymbol, toState) => ({ fromState, inputSymbol, toState });

export default function fsm(
  state = {
    name: 'My FSM',
    states: new Set(['A', 'B', 'C']),
    inputAlphabet: new Set(['a', 'b', 'c']),
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
    selected: null,
    inputString: '',
    inputIndex: 0,
    inputMessage: ''
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
    case actionTypes.FSM_TRANSITION_ADDED: { // TODO this case doesn't need to modify states or inputAlphabet
      const { fromState, inputSymbol, toState, emptyStringSymbol } = action.payload;
      return {
        ...state,
        states: state.states.add(fromState).add(toState),
        inputAlphabet: inputSymbol !== emptyStringSymbol ? state.inputAlphabet.add(inputSymbol) : state.inputAlphabet,
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
    case actionTypes.FSM_INPUT_SYMBOL_ADDED: { // TODO don't allow user to add empty string symbol
      return { ...state, inputAlphabet: state.inputAlphabet.add(action.payload.symbol) };
    }
    case actionTypes.FSM_INPUT_ALPHABET_SET: { // TODO don't allow user to add empty string symbol
      const { inputAlphabet, emptyStringSymbol } = action.payload;
      return {
        ...state,
        inputAlphabet: new Set(inputAlphabet),
        transitionFunction: state.transitionFunction.filter(transitionObject =>
          inputAlphabet.includes(transitionObject.inputSymbol) || transitionObject.inputSymbol === emptyStringSymbol
        )
      };
    }
    case actionTypes.SETTINGS_EMPTY_STRING_SYMBOL_SET: {
      return {
        ...state,
        inputAlphabet: state.inputAlphabet.map(inputSymbol => {
          if(inputSymbol === action.payload.oldEmptyStringSymbol) {
            return action.payload.newEmptyStringSymbol;
          }
          return inputSymbol;
        }),
        transitionFunction: state.transitionFunction.map(transitionObject => {
          if(transitionObject.inputSymbol === action.payload.oldEmptyStringSymbol) {
            return { ...transitionObject, inputSymbol: action.payload.newEmptyStringSymbol };
          }
          return transitionObject;
        })
      };
    }
    case actionTypes.FSM_INPUT_STRING_SET: {
      return setInputString(state, action.payload.inputString);
    }
    case actionTypes.FSM_STEP_INPUT: {
      const determineInputMessage = selected => state.acceptStates.contains(selected) ? 'Accept!' : 'Reject!';
      if(state.inputIndex >= state.inputString.length) {
        return {
          ...state,
          inputMessage: determineInputMessage(state.inputString.length === 0 ? state.initialState : state.selected)
        };
      }
      const transition = state.transitionFunction.find(instruction => // TODO nondeterminism
        instruction.fromState === state.selected && instruction.inputSymbol === state.inputString[state.inputIndex]
      );
      let inputMessage;
      if(transition === undefined) {
        return { ...state, inputMessage: 'Reject!' };
      } else if(state.inputIndex + 1 >= state.inputString.length) {
        inputMessage = determineInputMessage(transition.toState);
      } else {
        inputMessage = state.inputMessage;
      }
      return {
        ...state,
        inputIndex: state.inputIndex + (transition === undefined ? 0 : 1),
        selected: transition.toState,
        inputMessage
      };
    }
    case actionTypes.FSM_RUN_INPUT: {
      return { ...state, inputIndex: state.inputString.length }; // TODO
    }
    case actionTypes.FSM_RESTART_INPUT: {
      return restartInput(state);
    }
    case actionTypes.FSM_INITIALIZED_FROM_JSON_STRING: { // TODO load fsm with correct empty string symbol
      const { jsonString } = action.payload;
      const fsm = JSON.parse(jsonString);
      return {
        ...fsm,
        states: new Set(fsm.states),
        inputAlphabet: new Set(fsm.inputAlphabet),
        transitionFunction: new Set(fsm.transitionFunction),
        acceptStates: new Set(fsm.acceptStates),
        statePositions: new Map(fsm.statePositions),
        selected: null,
        inputString: '',
        inputIndex: 0,
        inputMessage: ''
      }
    }
    case actionTypes.FSM_RESET: {
      return {
        name: 'My FSM',
        states: new Set(),
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