import * as actionTypes from '../constants/actionTypes'

function formatSetString(string) {
  const list = string.split(' ').join('').split(',').join('').split('');
  const duplicatesRemoved = Array.from(new Set(list));
  const sortedList = duplicatesRemoved.sort();
  return '{' + sortedList.join(', ') + '}';
}

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
      return { ...state, states: formatSetString(action.payload.states.toUpperCase()) };
    case actionTypes.FSM_ALPHABET_CHANGED:
      return { ...state, alphabet: formatSetString(action.payload.alphabet.toLowerCase()) };
    default:
      return state;
  }
}