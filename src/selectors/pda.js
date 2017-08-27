export const getPda = state => {
  return {
    ...state.pda,
    states: state.pda.states.sort(),
    inputAlphabet: state.pda.inputAlphabet.sort(),
    stackAlphabet: state.pda.stackAlphabet.sort(),
    acceptStates: state.pda.acceptStates.sort()
  };
};