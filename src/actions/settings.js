import * as actionTypes from '../constants/actionTypes'

export function setDarkTheme(darkTheme) {
  return { type: actionTypes.SETTINGS_DARK_THEME_SET, payload: { darkTheme } };
}

export function setEmptyStringSymbol(oldEmptyStringSymbol, newEmptyStringSymbol) {
  return {
    type: actionTypes.SETTINGS_EMPTY_STRING_SYMBOL_SET,
    payload: { oldEmptyStringSymbol, newEmptyStringSymbol }
  };
}

export function setAlternationSymbol(oldAlternationSymbol, newAlternationSymbol) {
  return { type: actionTypes.SETTINGS_ALTERNATION_SYMBOL_SET, payload: { oldAlternationSymbol, newAlternationSymbol } };
}