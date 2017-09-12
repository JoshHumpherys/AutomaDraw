export const getFsm = state => {
  return {
    ...state.fsm,
    states: state.fsm.states.sort(),
    inputAlphabet: state.fsm.inputAlphabet.sort(),
    acceptStates: state.fsm.acceptStates.sort()
  };
};

export const getSimplifiedTransitionFunction = transitionFunction => {
  return transitionFunction.map(({ fromState, inputSymbol, toState }) => {
    return { fromState, transitionText: inputSymbol, toState };
  })
};