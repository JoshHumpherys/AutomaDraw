import * as actionTypes from '../constants/actionTypes'

export default function grid(state = { count: 0 }, action) {
  switch (action.type) {
    case actionTypes.COUNT_INCREASED:
      return { ...state, count: state.count + 1 };
    default:
      return state;
  }
}