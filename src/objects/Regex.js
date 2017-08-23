import { OrderedSet } from 'immutable'

const symbolTypes = {
  SYMBOL: 0,
  EMPTY_STRING_SYMBOL: 1,
  ALTERNATION_SYMBOL: 2
};

const createSymbol = symbol => {
  return { symbolType: symbolTypes.SYMBOL, symbol };
};

const createEmptyStringSymbol = () => {
  return { symbolType: symbolTypes.EMPTY_STRING_SYMBOL };
};

const createAlternationSymbol = () => {
  return { symbolType: symbolTypes.ALTERNATION_SYMBOL };
};

const CreateRegex = () => {
  const protoObject = Object.create({
    setRegex(regex, emptyStringSymbol, alternationSymbol) {
      const newRegex = CreateRegex();
      const symbolArray = [];
      for(const symbol of regex) {
        switch(symbol) {
          case emptyStringSymbol:
            symbolArray.push(createEmptyStringSymbol());
            break;
          case alternationSymbol:
            symbolArray.push(createAlternationSymbol());
            break;
          default:
            symbolArray.push(createSymbol(symbol));
        }
      }
      newRegex.regex = new OrderedSet(symbolArray);
      return newRegex;
    },

    clearRegex() {
      return CreateRegex();
    },

    getRegexString(emptyStringSymbol, alternationSymbol) {
      let regexString = '';
      for(const symbol of this.regex) {
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
    }
  });

  protoObject.regex = new OrderedSet();

  return protoObject;
};

export default CreateRegex;