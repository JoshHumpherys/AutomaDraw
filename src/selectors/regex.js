import { symbolTypes } from '../reducers/regex'

export const getRegexString = state => {
  const { emptyStringSymbol, alternationSymbol } = state.settings;
  let regexString = '';
  for(const symbol of state.regex.regex) {
    switch(symbol.symbolType) {
      case symbolTypes.EMPTY_STRING_SYMBOL:
        regexString += emptyStringSymbol;
        break;
      case symbolTypes.ALTERNATION_SYMBOL:
        regexString += alternationSymbol;
        break;
      case symbolTypes.SYMBOL:
      default:
        regexString += symbol.symbol;
    }
  }
  return regexString;
};