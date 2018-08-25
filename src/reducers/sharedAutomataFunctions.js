import { Map, Set } from 'immutable'
import * as actionTypes from '../constants/actionTypes'
import * as emptyStringSymbols from '../constants/emptyStringSymbols'
import * as inputMessageTypes from '../constants/inputMessageTypes'
import * as testCaseResultTypes from '../constants/testCaseResultTypes'

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

export function setStates(automaton, states) {
  const newStates = states.filter(state => !automaton.states.includes(state));
  const deletedStates = automaton.states.filter(state => !states.includes(state));
  const newStatePositionsObject = newStates.reduce((newStatePositions, newState) => {
    newStatePositions[newState] = { x: 20, y: 20 };
    return newStatePositions;
  }, {});
  const newStatePositions = new Map(newStatePositionsObject);
  return {
    ...automaton,
    states: automaton.states.subtract(deletedStates).union(newStates),
    transitionFunction: automaton.transitionFunction
      .filter(transitionObject =>
        !deletedStates.includes(transitionObject.fromState) && !deletedStates.includes(transitionObject.toState)
      ),
    initialState: deletedStates.includes(automaton.initialState) ? null : automaton.initialState,
    acceptStates: automaton.acceptStates.subtract(deletedStates),
    statePositions: deletedStates
      .reduce((statePositions, key) => statePositions.delete(key), automaton.statePositions)
      .merge(newStatePositions),
    selected: deletedStates.includes(automaton.selected) ? null : automaton.selected,
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

export function setExecutionPath(automaton, executionPathIndex) {
  return { ...automaton, executionPathIndex };
}

export function runTestCases(automaton, initialExecutionPath, runInput, setInputStringInInitialExecutionPath = false) {
  return {
    ...automaton,
    testCases: automaton.testCases.map(testCase => {
      const inputString = testCase.input === emptyStringSymbols.LAMBDA ? '' : testCase.input;
      const newState = runInput({
        ...automaton,
        inputString,
        inputMessage: '',
        executionPaths: [
          {
            ...initialExecutionPath,
            inputString: setInputStringInInitialExecutionPath ? inputString : undefined,
            currentState: testCase.input.length !== 0 ? automaton.initialState : null
          }
        ],
        executionPathIndex: 0,
      });
      let actual;
      if(newState.executionPaths.find(executionPath => executionPath.inputMessage === inputMessageTypes.ACCEPT)) {
        actual = testCaseResultTypes.PASS;
      } else if(newState.executionPaths.find(executionPath => executionPath.inputMessage === '')) {
        actual = testCaseResultTypes.INDETERMINATE;
      } else {
        actual = testCaseResultTypes.FAIL;
      }
      let result;
      if(testCase.expected === actual) {
        result = testCaseResultTypes.PASS;
      } else if(actual === testCaseResultTypes.INDETERMINATE) {
        result = testCaseResultTypes.INDETERMINATE;
      } else {
        result = testCaseResultTypes.FAIL;
      }
      return { ...testCase, actual, result };
    }),
  };
}

export function addTestCase(automaton, input, expected) {
  return { ...automaton, testCases: [...automaton.testCases, {
    input,
    expected,
    actual: testCaseResultTypes.NA,
    result: testCaseResultTypes.NA,
  }]};
}

export function removeTestCase(automaton, index) {
  const testCases = automaton.testCases;
  testCases.splice(index, 1);
  return { ...automaton, testCases };
}

export function resetTestCases(automaton) {
  return {
    ...automaton,
    testCases: [],
  };
}

export function initializeTestCasesFromCsvString(automaton, csvString) {
  return {
    ...automaton,
    testCases: csvString.replace(/(\r\n|\n|\r)/gm, '\n').split('\n').filter(s => s !== '').map(testCaseString => {
      const [ input, expected ] = testCaseString.split(',');
      const expectedFail = expected === '0' || expected.toLocaleLowerCase() === 'fail';
      return {
        input,
        expected: expectedFail ? testCaseResultTypes.FAIL : testCaseResultTypes.PASS,
        actual: testCaseResultTypes.NA,
        result: testCaseResultTypes.NA,
      }
    })
  }
}
