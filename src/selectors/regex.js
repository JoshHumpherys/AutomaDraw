import { getEmptyStringSymbol, getAlternationSymbol } from '../utility/utility'

export const getRegexString = state => {
  return state.regex.regex.getRegexString(
    getEmptyStringSymbol(state.settings.emptyStringSymbol),
    getAlternationSymbol(state.settings.alternationSymbol)
  );
};