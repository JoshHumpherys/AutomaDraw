import * as actionTypes from '../constants/actionTypes'

export function setDarkTheme(darkTheme) {
  return { type: actionTypes.SETTINGS_DARK_THEME_SET, payload: { darkTheme } };
}