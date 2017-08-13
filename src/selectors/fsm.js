export const getFsm = state => {
  return {
    ...state.fsm,
    states: state.fsm.states.sort(),
    alphabet: state.fsm.alphabet.sort(),
    acceptStates: state.fsm.acceptStates.sort()
  };
};