import { Set } from 'immutable'

export const getTm = state => {
  return {
    ...state.tm,
    states: state.tm.states.sort(),
    tapeAlphabet: state.tm.tapeAlphabet.sort(),
    inputAlphabet: state.tm.inputAlphabet.sort(),
    acceptStates: state.tm.acceptStates.sort()
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
      .map(({ fromState, inputSymbol, toState, writeSymbol, moveDirection }) =>
        ({ fromState, transitionText: inputSymbol + '/' + writeSymbol + ',' + moveDirection, toState }))
      .groupBy(x => find({ fromState: x.fromState, toState: x.toState }))
      .map(x => ({ ...x.first(), transitionText: x.map(y => y.transitionText).sort().join(', ') }));
  });

  return newTransitionFunction;
};