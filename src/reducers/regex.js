import * as actionTypes from '../constants/actionTypes'
import CreateRegex from '../objects/Regex'

export default function regex(
  state = {
    regex: CreateRegex()
  },
  action) {
  switch (action.type) {
    case actionTypes.REGEX_SET: {
      const { regex, emptyStringSymbol, alternationSymbol } = action.payload;
      return { ...state, regex: state.regex.setRegex(regex, emptyStringSymbol, alternationSymbol) };
    }
    case actionTypes.REGEX_CLEARED: {
      return { ...state, regex: state.regex.clearRegex() };
    }
    default: {
      return state;
    }
  }
}