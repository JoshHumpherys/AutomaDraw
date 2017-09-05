import React, { Component } from 'react'
import { connect } from 'react-redux'
import {
  changeName,
  addState,
  selectState,
  moveState,
  changeStateName,
  deleteState,
  changeInitialState,
  removeInitialState,
  addAcceptState,
  removeAcceptState,
  addTransition,
  addInputSymbol,
  addStackSymbol,
  initializeFromJsonString,
  reset
} from '../actions/pda'
import { getPda } from '../selectors/pda'
import { arrayToString } from '../utility/utility'
import AutomataPage from './AutomataPage'
import { Map } from 'immutable'

export class PdaPage extends Component {
  constructor(props) {
    super(props);

    this.changeName = this.changeName.bind(this);
    this.addState = this.addState.bind(this);
    this.selectState = this.selectState.bind(this);
    this.moveState = this.moveState.bind(this);
    this.changeStateName = this.changeStateName.bind(this);
    this.deleteState = this.deleteState.bind(this);
    this.changeInitialState = this.changeInitialState.bind(this);
    this.removeInitialState = this.removeInitialState.bind(this);
    this.addAcceptState = this.addAcceptState.bind(this);
    this.removeAcceptState = this.removeAcceptState.bind(this);
    this.addTransition = this.addTransition.bind(this);
    this.addInputSymbol = this.addInputSymbol.bind(this);
    this.addStackSymbol = this.addStackSymbol.bind(this);
    this.initializeFromJsonString = this.initializeFromJsonString.bind(this);
    this.reset = this.reset.bind(this);
    this.stringifyAutomaton = this.stringifyAutomaton.bind(this);
  }

  changeName(name) {
    this.props.dispatch(changeName(name))
  }

  addState(name, statePosition) {
    this.props.dispatch(addState(name, statePosition.x, statePosition.y));
  }

  selectState(name) {
    this.props.dispatch(selectState(name));
  }

  moveState(state, x, y) {
    this.props.dispatch(moveState(state, x, y));
  }

  changeStateName(state, name) {
    this.props.dispatch(changeStateName(state, name));
  }

  deleteState(state) {
    this.props.dispatch(deleteState(state));
  }

  changeInitialState(state) {
    this.props.dispatch(changeInitialState(state));
  }

  removeInitialState() {
    this.props.dispatch(removeInitialState());
  }

  addAcceptState(state) {
    this.props.dispatch(addAcceptState(state));
  }

  removeAcceptState(state) {
    this.props.dispatch(removeAcceptState(state));
  }

  addTransition(fromState, toState) {
    const transitionPrompt = (message, numCharactersMin, numCharactersMax) => {
      // TODO make something better than a prompt
      const response = prompt(message);
      if(response !== null && (response.length < numCharactersMin || response.length > numCharactersMax)) {
        return transitionPrompt(message, numCharactersMin, numCharactersMax);
      }
      return response;
    };
    const inputSymbol = transitionPrompt('What input symbol should be used for this transition?', 1, 1);
    if(inputSymbol === null) {
      return;
    }
    const stackSymbol = transitionPrompt('What stack symbol should be used for this transition?', 1, 1);
    if(stackSymbol === null) {
      return;
    }
    const pushSymbolsMessage = 'What symbol(s) should be pushed to the stack as a result of this transition?';
    const pushSymbols = transitionPrompt(pushSymbolsMessage, 1, 2);
    if(pushSymbols === null) {
      return;
    }
    if(!this.props.pda.inputAlphabet.contains(inputSymbol)) {
      this.addInputSymbol(inputSymbol);
    }
    if(!this.props.pda.stackAlphabet.contains(stackSymbol)) {
      this.addStackSymbol(stackSymbol);
    }
    for(const pushSymbol of pushSymbols.split('')) {
      if(pushSymbol !== stackSymbol && !this.props.pda.stackAlphabet.contains(pushSymbol)) {
        this.addStackSymbol(pushSymbol);
      }
    }
    this.props.dispatch(addTransition(fromState, inputSymbol, stackSymbol, toState, pushSymbols));
  }

  addInputSymbol(inputSymbol) {
    this.props.dispatch(addInputSymbol(inputSymbol));
  }

  addStackSymbol(stackSymbol) {
    this.props.dispatch(addStackSymbol(stackSymbol));
  }

  initializeFromJsonString(jsonString) {
    this.props.dispatch(initializeFromJsonString(jsonString));
  }

  reset() {
    this.props.dispatch(reset());
  }

  stringifyAutomaton() {
    return JSON.stringify(this.props.pda);
  }

  render() {
    const {
      name,
      states,
      inputAlphabet,
      stackAlphabet,
      transitionFunction,
      initialState,
      initialStackSymbol,
      acceptStates,
      statePositions,
      selected
    } = this.props.pda;

    const instructions = [];
    const simplifiedTransitionFunction = transitionFunction.map((fromStateMap, fromState) => {
      if(fromStateMap !== undefined) {
        return new Map().withMutations(map => {
          fromStateMap.forEach((onInputSymbolMap, inputSymbol) => {
            onInputSymbolMap.forEach(({ toState, pushSymbols }, stackSymbol) => {
              instructions.push('(' + [fromState, inputSymbol, stackSymbol, toState, pushSymbols].join(', ') + ')');
              map.set(inputSymbol + '; ' + stackSymbol + '/' + pushSymbols, toState);
            })
          });
        });
      }
      return fromStateMap;
    });

    const transitionFunctionDiv = instructions.length > 0 ? (
      <div>
        {instructions.map(instruction => <div key={instruction}>{instruction}</div>)}
      </div>
    ) : '\u2205';

    const formalProperties = [
      { name: 'Q', value: arrayToString(states.toArray()) },
      { name: '\u03A3', value: arrayToString(inputAlphabet.toArray()) },
      { name: '\u0393', value: arrayToString(stackAlphabet.toArray()) },
      { name: '\u03B4', value: transitionFunctionDiv },
      { name: 'q\u2080', value: initialState },
      { name: 'Z', value: initialStackSymbol },
      { name: 'F', value: arrayToString(acceptStates.toArray()) },
    ];

    return <AutomataPage
      name={name}
      states={states}
      simplifiedTransitionFunction={simplifiedTransitionFunction}
      initialState={initialState}
      acceptStates={acceptStates}
      statePositions={statePositions}
      selected={selected}
      changeName={this.changeName}
      addState={this.addState}
      selectState={this.selectState}
      moveState={this.moveState}
      changeStateName={this.changeStateName}
      deleteState={this.deleteState}
      changeInitialState={this.changeInitialState}
      removeInitialState={this.removeInitialState}
      addAcceptState={this.addAcceptState}
      removeAcceptState={this.removeAcceptState}
      addTransition={this.addTransition}
      initializeFromJsonString={this.initializeFromJsonString}
      reset={this.reset}
      stringifyAutomaton={this.stringifyAutomaton}
      formalProperties={formalProperties}
    />;
  }
}

export default connect(
  state => ({
    pda: getPda(state)
  })
)(PdaPage);