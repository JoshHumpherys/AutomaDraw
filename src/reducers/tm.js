import { Set, Map } from 'immutable';

export default function tm(
  state = {
    name: 'My TM',
    states: new Set(['A', 'B', 'C']),
    tapeAlphabet: new Set(['a', 'b', 'c']),
    blankSymbol: '\u0394',
    inputAlphabet: new Set(['a', 'b', 'c']),
    transitionFunction: new Map({
      'A': new Map({
        a: { toState: 'B', writeSymbol: 'a', moveDirection: 'R' }
      })
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
  return state;
}