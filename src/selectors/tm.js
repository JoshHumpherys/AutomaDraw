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

export const getSimpleNestedTransitionFunction = transitionFunction => {
  return new Map().withMutations(nestedMap => {
    transitionFunction.forEach(({ fromState, inputSymbol, toState, writeSymbol, moveDirection }) => {
      const transitionText = inputSymbol + '/' + writeSymbol + ',' + moveDirection;
      const mapFromState = nestedMap.get(fromState) || new Map();
      nestedMap.set(fromState, mapFromState.set(transitionText, toState));
    })
  });
};