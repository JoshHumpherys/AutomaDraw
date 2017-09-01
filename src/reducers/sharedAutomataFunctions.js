export function changeName(automaton, name) {
  return { ...automaton, name };
}

export function moveState(automaton, state, x, y) {
  return {
    ...automaton,
    statePositions: automaton.statePositions.set(state, { x, y })
  };
}

export function addState(automaton, state, x, y) {
  return {
    ...automaton,
    states: automaton.states.add(state),
    statePositions: automaton.statePositions.set(state, { x, y })
  };
}

export function selectState(automaton, selected) {
  return { ...automaton, selected };
}

export function changeInitialState(automaton, initialState) {
  return { ...automaton, initialState };
}

export function removeInitialState(automaton) {
  return { ...automaton, initialState: null };
}

export function addAcceptState(automaton, state) {
  return { ...automaton, acceptStates: automaton.acceptStates.add(state) };
}

export function removeAcceptState(automaton, state) {
  return { ...automaton, acceptStates: automaton.acceptStates.remove(state)};
}
