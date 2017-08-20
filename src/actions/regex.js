import * as actionTypes from '../constants/actionTypes'

export function setRegex(regex) {
  return { type: actionTypes.REGEX_SET, payload: { regex } };
}