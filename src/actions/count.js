import * as actionTypes from '../constants/actionTypes'

export function increaseCount() {
  return { type: actionTypes.COUNT_INCREASED };
}