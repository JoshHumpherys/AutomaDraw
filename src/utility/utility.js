export const arrayToString = array => '{' + array.join(', ') + '}';

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
  const sortedStates = states.sort();
  const sortedAlphabet = alphabet.sort();
  let statesIndexMap = {};
  states.forEach((state, i) => statesIndexMap[state] = i);
  let alphabetIndexMap = {};
  alphabet.forEach((letter, i) => alphabetIndexMap[letter] = i);

  let table = new Array(states.length);
  for(let stateIndex in states) {
    let state = states[stateIndex];
    table[statesIndexMap[state]] = new Array(alphabet.length).fill('');
    for(let letter in transitionFunctions[state]) {
      table[statesIndexMap[state]][alphabetIndexMap[letter]] = transitionFunctions[state][letter];
    }
  }

  console.log(table);

  return table;
};