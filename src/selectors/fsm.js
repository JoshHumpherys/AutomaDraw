import { Set } from 'immutable'

export const getFsm = state => {
  return {
    ...state.fsm,
    states: state.fsm.states.sort(),
    inputAlphabet: state.fsm.inputAlphabet.sort(),
    acceptStates: state.fsm.acceptStates.sort()
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
      .map(({ fromState, inputSymbol, toState }) => ({ fromState, transitionText: inputSymbol, toState }))
      .groupBy(x => find({ fromState: x.fromState, toState: x.toState }))
      .map(x => ({ ...x.first(), transitionText: x.map(y => y.transitionText).sort().join(', ') }));
  });

  return newTransitionFunction;
};