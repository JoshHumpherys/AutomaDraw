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
    acceptStates: ['B']
  },
  action) {
  switch (action.type) {
    case actionTypes.FSM_NAME_CHANGED:
      return { ...state, name: action.payload.name };
    case actionTypes.FSM_STATES_CHANGED:
      return { ...state, states: stringToArray(action.payload.states) };
    case actionTypes.FSM_ALPHABET_CHANGED:
      return { ...state, alphabet: stringToArray(action.payload.alphabet) };
    default:
      return state;
  }
}