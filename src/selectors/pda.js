import { Map } from 'immutable'

export const getPda = state => {
  return {
    ...state.pda,
    states: state.pda.states.sort(),
    inputAlphabet: state.pda.inputAlphabet.sort(),
    stackAlphabet: state.pda.stackAlphabet.sort(),
    acceptStates: state.pda.acceptStates.sort()
  };
};

export const getSimpleNestedTransitionFunction = transitionFunction => {
  return new Map().withMutations(nestedMap => {
    transitionFunction.forEach(({ fromState, inputSymbol, stackSymbol, toState, pushSymbols }) => {
      const transitionText = inputSymbol + '; ' + stackSymbol + '/' + pushSymbols;
      const mapFromState = nestedMap.get(fromState) || new Map();
      nestedMap.set(fromState, mapFromState.set(transitionText, toState));
    })
  });
};