import * as actionTypes from '../constants/actionTypes'

export default function fsm(
  state = {
    darkTheme: true
  },
  action) {
  switch (action.type) {
    case actionTypes.SETTINGS_DARK_THEME_SET: {
      return { ...state, darkTheme: action.payload.darkTheme };
    }
    default: {
      return state;
    }
  }
}