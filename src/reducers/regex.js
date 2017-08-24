import { OrderedSet, Record } from 'immutable'
import * as actionTypes from '../constants/actionTypes'

export const symbolTypes = {
  SYMBOL: 0,
  EMPTY_STRING_SYMBOL: 1,
  ALTERNATION_SYMBOL: 2
};

/*
 * TODO add private keyword to functions that should not be exposed
 * TODO encapsulate symbolTypes in Regex class
 * TODO figure out a better way to get the regex string
 * TODO use arrow functions
 * TODO make static functions static
 */
class Regex extends Record({ regex: new OrderedSet() }) {
  setRegexAction(regex, emptyStringSymbol, alternationSymbol) {
    const symbolArray = [];
    for(const symbol of regex) {
      switch(symbol) {
        case emptyStringSymbol:
          symbolArray.push(this.createEmptyStringSymbol());
          break;
        case alternationSymbol:
          symbolArray.push(this.createAlternationSymbol());
          break;
        default:
          symbolArray.push(this.createSymbol(symbol));
      }
    }
    return this.setRegex(new OrderedSet(symbolArray));
  }

  clearRegexAction() {
    return this.setRegex(new OrderedSet());
  }

  setRegex(orderedSet) {
    return this.set('regex', orderedSet);
  }

  createSymbol(symbol) {
    return { symbolType: symbolTypes.SYMBOL, symbol };
  }

  createEmptyStringSymbol() {
    return { symbolType: symbolTypes.EMPTY_STRING_SYMBOL };
  };

  createAlternationSymbol() {
    return { symbolType: symbolTypes.ALTERNATION_SYMBOL };
  }
}

export default function regex(state = new Regex(), action) {
  switch (action.type) {
    case actionTypes.REGEX_SET: {
      const { regex, emptyStringSymbol, alternationSymbol } = action.payload;
      return state.setRegexAction(regex, emptyStringSymbol, alternationSymbol);
    }
    case actionTypes.REGEX_CLEARED: {
      return state.clearRegexAction();
    }
    default: {
      return state;
    }
  }
}