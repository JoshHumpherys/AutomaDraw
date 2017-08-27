export const getTm = state => {
  return {
    ...state.tm,
    states: state.tm.states.sort(),
    tapeAlphabet: state.tm.tapeAlphabet.sort(),
    inputAlphabet: state.tm.inputAlphabet.sort(),
    acceptStates: state.tm.acceptStates.sort()
  };
};