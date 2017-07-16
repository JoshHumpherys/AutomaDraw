import * as actionTypes from '../constants/actionTypes'

export default function fsm(
  state = {
    name: 'My FSM',
    states: 'A, B, C',
    alphabet: 'a, b'
  },
  action) {
  switch (action.type) {
    case actionTypes.FSM_NAME_CHANGED:
      return { ...state, name: action.payload.name };
    case actionTypes.FSM_STATES_CHANGED:
      return { ...state, states: action.payload.states };
    case actionTypes.FSM_ALPHABET_CHANGED:
      return { ...state, alphabet: action.payload.alphabet };
    default:
      return state;
  }
}