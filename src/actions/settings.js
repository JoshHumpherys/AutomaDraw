import * as actionTypes from '../constants/actionTypes'

export function setDarkTheme(darkTheme) {
  return { type: actionTypes.SETTINGS_DARK_THEME_SET, payload: { darkTheme } };
}

export function setEmptyStringSymbol(emptyStringSymbol) {
  return { type: actionTypes.SETTINGS_EMPTY_STRING_SYMBOL_SET, payload: { emptyStringSymbol } };
}

export function setAlternationSymbol(alternationSymbol) {
  return { type: actionTypes.SETTINGS_ALTERNATION_SYMBOL_SET, payload: { alternationSymbol } };
}