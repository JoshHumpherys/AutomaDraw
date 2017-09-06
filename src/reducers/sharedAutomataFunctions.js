import { Set } from 'immutable'

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

export function renameState(automaton, oldName, newName) {
  const { states, transitionFunction, initialState, acceptStates, statePositions, selected } = automaton;
  return {
    ...automaton,
    states: states.remove(oldName).add(newName),
    transitionFunction: transitionFunction
      .map(transitionObject => {
        const fromStateRenamed = transitionObject.fromState === oldName;
        const toStateRenamed = transitionObject.toState === oldName;
        if(!fromStateRenamed && !toStateRenamed) {
          return transitionObject;
        }
        return {
          ...transitionObject,
          fromState: fromStateRenamed ? newName : transitionObject.fromState,
          toState: toStateRenamed ? newName : transitionObject.toState
        };
      }),
    initialState: initialState === oldName ? newName : initialState,
    acceptStates: acceptStates.contains(oldName) ? acceptStates.remove(oldName).add(newName) : acceptStates,
    statePositions: statePositions.set(newName, statePositions.get(oldName)).remove(oldName),
    selected: selected === oldName ? newName : selected
  };
}

export function deleteState(automaton, name) {
  const { states, transitionFunction, initialState, acceptStates, statePositions, selected } = automaton;
  return {
    ...automaton,
    states: states.remove(name),
    transitionFunction: transitionFunction
      .filter(transitionObject =>
        transitionObject.fromState !== name && transitionObject.toState !== name
      ),
    initialState: initialState === name ? null : initialState,
    acceptStates: acceptStates.remove(name),
    statePositions: statePositions.remove(name),
    selected: selected === name ? null : selected
  };
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

export function setAcceptStates(automaton, states) {
  return { ...automaton, acceptStates: new Set(states) };
}