import { Map } from 'immutable'

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
  return transitionFunction.map(({ fromState, inputSymbol, toState, writeSymbol, moveDirection }) => {
    return { fromState, transitionText: inputSymbol + '/' + writeSymbol + ',' + moveDirection, toState };
  });
};