import { Set, Map } from 'immutable';

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
  return state;
}