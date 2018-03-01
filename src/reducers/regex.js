import {Map, OrderedSet, Record, Set} from 'immutable'
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

  changeEmptyStringSymbolAction(emptyStringSymbol) {
    return this.setRegex(this.regex.map(symbol => {
      if(symbol.symbol === emptyStringSymbol) {
        return this.createEmptyStringSymbol();
      } else {
        return symbol;
      }
    }));
  }

  changeAlternationSymbolAction(alternationSymbol) {
    return this.setRegex(this.regex.map(symbol => {
      if(symbol.symbol === alternationSymbol) {
        return this.createAlternationSymbol();
      } else {
        return symbol;
      }
    }));
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
    case actionTypes.SETTINGS_EMPTY_STRING_SYMBOL_SET: {
      const { emptyStringSymbol } = action.payload;
      return state.changeEmptyStringSymbolAction(emptyStringSymbol);
    }
    case actionTypes.SETTINGS_ALTERNATION_SYMBOL_SET: {
      const { alternationSymbol } = action.payload;
      return state.changeAlternationSymbolAction(alternationSymbol);
    }
    case actionTypes.REGEX_INITIALIZED_FROM_JSON_STRING: {
      const { jsonString } = action.payload;
      const { regex, emptyStringSymbol, alternationSymbol } = JSON.parse(jsonString);
      return state.setRegexAction(regex, emptyStringSymbol, alternationSymbol);
    }
    default: {
      return state;
    }
  }
}