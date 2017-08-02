import * as actionTypes from '../constants/actionTypes'
import { stringToArray } from '../utility/utility'

export default function fsm(
  state = {
    name: 'My FSM',
    states: ['A', 'B'],
    alphabet: ['a', 'b'],
    transitionFunctions: {
      'A': {
        a: 'B'
      },
      'B': {
        b: 'B'
      }
    },
    initialState: 'A',
    acceptStates: ['B'],
    statePositions: {
      'A': { x: 0, y: 0},
      'B': { x: 200, y: 100 }
    },
    selected: 'A'
  },
  action) {
  switch (action.type) {
    case actionTypes.FSM_NAME_CHANGED: {
      return { ...state, name: action.payload.name };
    }
    case actionTypes.FSM_STATES_CHANGED: {
      return { ...state, states: stringToArray(action.payload.states) };
    }
    case actionTypes.FSM_ALPHABET_CHANGED: {
      return { ...state, alphabet: stringToArray(action.payload.alphabet) };
    }
    case actionTypes.FSM_STATE_MOVED: {
      return {
        ...state,
        statePositions: {
          ...state.statePositions,
          [action.payload.state]: { x: action.payload.x, y: action.payload.y }
        }
      };
    }
    case actionTypes.FSM_STATE_ADDED: {
      return {
        ...state,
        states: [...state.states, action.payload.state],
        statePositions: {
          ...state.statePositions,
          [action.payload.state]: { x: action.payload.x, y: action.payload.y }
        }
      };
    }
    case actionTypes.FSM_STATE_SELECTED: {
      return { ...state, selected: action.payload.state };
    }
    case actionTypes.FSM_STATE_NAME_CHANGED: {
      const states = [...state.states];
      states[states.indexOf(action.payload.state)] = action.payload.name;
      const acceptStates = [...state.acceptStates];
      const indexOfStateInAcceptStates = acceptStates.indexOf(action.payload.state);
      if (indexOfStateInAcceptStates !== -1) {
        acceptStates[indexOfStateInAcceptStates] = action.payload.name;
      }
      return {
        ...state,
        states,
        transitionFunctions: {
          ...state.transitionFunctions,
          [action.payload.state]: undefined,
          [action.payload.name]: state.transitionFunctions[action.payload.state]
        },
        initialState: state.initialState === action.payload.state ? action.payload.name : state.initialState,
        acceptStates,
        statePositions: {
          ...state.statePositions,
          [action.payload.state]: undefined,
          [action.payload.name]: state.statePositions[action.payload.state]
        },
        selected: state.selected === action.payload.state ? action.payload.name : state.selected
      };
    }
    case actionTypes.FSM_STATE_DELETED: {
      const states = [...state.states];
      states.splice(states.indexOf(action.payload.state), 1);
      const acceptStates = [...state.acceptStates];
      const indexOfStateInAcceptStates = acceptStates.indexOf(action.payload.state);
      if (indexOfStateInAcceptStates !== -1) {
        acceptStates.splice(acceptStates.indexOf(action.payload.state), 1);
      }
      return {
        ...state,
        states,
        transitionFunctions: {
          ...state.transitionFunctions,
          [action.payload.state]: undefined
        },
        initialState: state.initialState === action.payload.state ? null : state.initialState,
        acceptStates,
        statePositions: {
          ...state.statePositions,
          [action.payload.state]: undefined
        },
        selected: state.selected === action.payload.state ? null : state.selected
      };
    }
    case actionTypes.FSM_INITIAL_STATE_CHANGED:
      return { ...state, initialState: action.payload.state };
    case actionTypes.FSM_INITIAL_STATE_REMOVED:
      return { ...state, initialState: null };
    default:
      return state;
  }
}