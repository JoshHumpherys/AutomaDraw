import * as actionTypes from '../constants/actionTypes'

export function setRegex(regex, emptyStringSymbol, alternationSymbol) {
  return { type: actionTypes.REGEX_SET, payload: { regex, emptyStringSymbol, alternationSymbol } };
}

export function clearRegex() {
  return { type: actionTypes.REGEX_CLEARED };
}