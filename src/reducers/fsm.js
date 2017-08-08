import * as actionTypes from '../constants/actionTypes'
import { stringToArray } from '../utility/utility'
import { OrderedSet, OrderedMap } from 'immutable';

export default function fsm(
  state = {
    name: 'My FSM',
    states: new OrderedSet(['A', 'B']),
    alphabet: new OrderedSet(['a', 'b']),
    transitionFunctions: new OrderedMap({
      'A': new OrderedMap({ a: 'B' }),
      'B': new OrderedMap({ b: 'B' })
    }),
    initialState: 'A',
    acceptStates: new OrderedSet(['B']),
    statePositions: new OrderedMap({
      'A': { x: 0, y: 0 },
      'B': { x: 200, y: 100 }
    }),
    selected: 'A'
  },
  action) {
  switch (action.type) {
    case actionTypes.FSM_NAME_CHANGED: {
      return { ...state, name: action.payload.name };
    }
    case actionTypes.FSM_STATES_CHANGED: {
      return { ...state, states: new OrderedSet(stringToArray(action.payload.states)) };
    }
    case actionTypes.FSM_ALPHABET_CHANGED: {
      return { ...state, alphabet: new OrderedSet(stringToArray(action.payload.alphabet)) };
    }
    case actionTypes.FSM_STATE_MOVED: {
      return {
        ...state,
        statePositions: state.statePositions.set(action.payload.state, { x: action.payload.x, y: action.payload.y })
      };
    }
    case actionTypes.FSM_STATE_ADDED: {
      return {
        ...state,
        states: state.states.add(action.payload.state),
        statePositions: state.statePositions.set(action.payload.state, { x: action.payload.x, y: action.payload.y })
      };
    }
    case actionTypes.FSM_STATE_SELECTED: {
      return { ...state, selected: action.payload.state };
    }
    case actionTypes.FSM_STATE_NAME_CHANGED: {
      return {
        ...state,
        states: state.states.remove(action.payload.state).add(action.payload.name),
        transitionFunctions: state.transitionFunctions
          .set(action.payload.name, state.transitionFunctions.get(action.payload.state))
          .remove(action.payload.state)
          .map(transitionFunction => console.log(transitionFunction)), // TODO remove all transitions to this state
        initialState: state.initialState === action.payload.state ? action.payload.name : state.initialState,
        acceptStates: state.acceptStates.subtract(action.payload.state).add(action.payload.name),
        statePositions: state.statePositions
          .set(action.payload.name, state.statePositions.get(action.payload.state))
          .remove(action.payload.state),
        selected: state.selected === action.payload.state ? action.payload.name : state.selected
      };
    }
    case actionTypes.FSM_STATE_DELETED: {
      return {
        ...state,
        states: state.state.remove(action.payload.state),
        transitionFunctions: state.transitionFunctions.mapEntries(([ key, value ]) => {
          if(key !== action.payload.state) {
            return value.filter(value => {
              return value !== action.payload.state;
            });
          }
          return value;
        }).remove(action.payload.state),
        initialState: state.initialState === action.payload.state ? null : state.initialState,
        acceptStates: state.acceptStates.remove(action.payload.state),
        statePositions: state.statePositions.remove(action.payload.state),
        selected: state.selected === action.payload.state ? null : state.selected
      };
    }
    case actionTypes.FSM_INITIAL_STATE_CHANGED: {
      return { ...state, initialState: action.payload.state };
    }
    case actionTypes.FSM_INITIAL_STATE_REMOVED: {
      return { ...state, initialState: null };
    }
    case actionTypes.FSM_ACCEPT_STATE_ADDED: {
      return { ...state, acceptStates: state.acceptStates.add(action.payload.state) };
    }
    case actionTypes.FSM_ACCEPT_STATE_REMOVED: {
      return { ...state, acceptStates: state.acceptStates.remove(action.payload.state) };
    }
    case actionTypes.FSM_TRANSITION_ADDED: {
      const { fromState, letter, toState } = action.payload;
      const transitionsFromState = state.transitionFunctions.get(fromState) || new OrderedMap();
      return {
        ...state,
        transitionFunctions: state.transitionFunctions
          .set(fromState, transitionsFromState.set(letter, toState)),
      };
    }
    case actionTypes.FSM_TRANSITION_REMOVED: {
      const transition = state.transitionFunctions[action.payload.state];
      delete transition[action.payload.letter];
      return {
        ...state,
        transitionFunctions: state.transitionFunctions
          .set(action.payload.state, state.transitionFunctions.get(action.payload.state).remove(action.payload.letter))
      };
    }
    default: {
      return state;
    }
  }
}