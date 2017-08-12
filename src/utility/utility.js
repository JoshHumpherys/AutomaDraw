export const arrayToString = array => array.length > 0 ? '{' + array.join(', ') + '}' : '\u2205';

export const stringToArray = string => string.split(' ').join('').split(',');

export const transitionFunctionsToString = transitionFunctions => {
  let transitionFunctionsShallow = [];
  for(let fromKey in transitionFunctions) {
    for(let letterKey in transitionFunctions[fromKey]) {
      transitionFunctionsShallow.push(fromKey + '--(' + letterKey + ')-->' + transitionFunctions[fromKey][letterKey]);
    }
  }
  return arrayToString(transitionFunctionsShallow);
};

export const transitionFunctionsToTable = (states, alphabet, transitionFunctions) => {
  if(states.size === 0) {
    return new Array(0);
  }

  let table = new Array(states.length);
  let i = 0;
  for(const state of states) {
    const transitions = transitionFunctions.get(state);
    table[i] = new Array(alphabet.length);
    let j = 0;
    for(const letter of alphabet) {
      table[i][j] = (transitions ? transitions.get(letter) : '') || '';
      j++;
    }
    i++;
  }
  return table;
};