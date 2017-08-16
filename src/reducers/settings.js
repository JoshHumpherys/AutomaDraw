import * as actionTypes from '../constants/actionTypes'
import * as emptyStringSymbols from '../constants/emptyStringSymbols'
import * as alternationSymbols from '../constants/alternationSymbols'

export default function fsm(
  state = {
    darkTheme: true,
    emptyStringSymbol: emptyStringSymbols.LAMBDA,
    alternationSymbol: alternationSymbols.PIPE
  },
  action) {
  switch (action.type) {
    case actionTypes.SETTINGS_DARK_THEME_SET: {
      return { ...state, darkTheme: action.payload.darkTheme };
    }
    case actionTypes.SETTINGS_EMPTY_STRING_SYMBOL_SET: {
      return { ...state, emptyStringSymbol: action.payload.emptyStringSymbol };
    }
    case actionTypes.SETTINGS_ALTERNATION_SYMBOL_SET: {
      return { ...state, alternationSymbol: action.payload.alternationSymbol };
    }
    default: {
      return state;
    }
  }
}