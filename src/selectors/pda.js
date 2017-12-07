import { Set } from 'immutable'

export const getPda = state => {
  return {
    ...state.pda,
    states: state.pda.states.sort(),
    inputAlphabet: state.pda.inputAlphabet.sort(),
    stackAlphabet: state.pda.stackAlphabet.sort(),
    acceptStates: state.pda.acceptStates.sort()
  };
};

export const getSimplifiedTransitionFunction = transitionFunction => {
  let newTransitionFunction;

  new Set().withMutations(keys => {
    const find = key => {
      for(const k of keys.toArray()) {
        if(k.fromState === key.fromState && k.toState === key.toState) {
          return k;
        }
      }
      keys = keys.add(key);
      return key;
    };

    newTransitionFunction = transitionFunction
      .map(({ fromState, inputSymbol, stackSymbol, toState, pushSymbols }) =>
        ({ fromState, transitionText: inputSymbol + '; ' + stackSymbol + '/' + pushSymbols, toState }))
      .groupBy(x => find({ fromState: x.fromState, toState: x.toState }))
      .map(x => ({ ...x.first(), transitionText: x.map(y => y.transitionText).sort().join(', ') }));
  });

  return newTransitionFunction;
};