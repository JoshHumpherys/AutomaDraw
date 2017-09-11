import { Map } from 'immutable'

export const getFsm = state => {
  return {
    ...state.fsm,
    states: state.fsm.states.sort(),
    inputAlphabet: state.fsm.inputAlphabet.sort(),
    acceptStates: state.fsm.acceptStates.sort()
  };
};

export const getSimpleNestedTransitionFunction = transitionFunction => {
  return new Map().withMutations(nestedMap => {
    transitionFunction.forEach(({ fromState, inputSymbol, toState }) => {
      const mapFromState = nestedMap.get(fromState) || new Map();
      nestedMap.set(fromState, mapFromState.set(inputSymbol, toState));
    });
  });
};