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
      return { ...state, emptyStringSymbol: action.payload.newEmptyStringSymbol };
    }
    case actionTypes.SETTINGS_ALTERNATION_SYMBOL_SET: {
      return { ...state, alternationSymbol: action.payload.newAlternationSymbol };
    }
    case actionTypes.REGEX_INITIALIZED_FROM_JSON_STRING: {
      const { emptyStringSymbol, alternationSymbol } = JSON.parse(action.payload.jsonString);
      return { ...state, emptyStringSymbol, alternationSymbol };
    }
    default: {
      return state;
    }
  }
}