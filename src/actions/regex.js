import * as actionTypes from '../constants/actionTypes'

export function setRegex(regex, emptyStringSymbol, alternationSymbol) {
  return { type: actionTypes.REGEX_SET, payload: { regex, emptyStringSymbol, alternationSymbol } };
}

export function clearRegex() {
  return { type: actionTypes.REGEX_CLEARED };
}

export function initializeFromJsonString(jsonString) {
  return { type: actionTypes.REGEX_INITIALIZED_FROM_JSON_STRING, payload: { jsonString } };
}