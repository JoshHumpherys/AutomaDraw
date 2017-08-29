import { symbolTypes } from '../reducers/regex'
import { Set } from 'immutable'

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

export const getRegexSymbols = state => {
  const metaSymbols = new Set(['(', ')', '*']); // TODO refactor so values aren't hardcoded
  return new Set().withMutations(set => {
    for(const symbol of state.regex.regex) {
      if(symbol.symbolType === 0 && !metaSymbols.contains(symbol.symbol)) {
        set.add(symbol.symbol);
      }
    }
  }).toArray();
};