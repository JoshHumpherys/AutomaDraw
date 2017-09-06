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
  addTapeSymbol,
  initializeFromJsonString,
  reset
} from '../actions/tm'
import { getTm, getSimpleNestedTransitionFunction } from '../selectors/tm'
import { arrayToString } from '../utility/utility'
import AutomataPage from './AutomataPage'
import * as modalTypes from '../constants/modalTypes'

export class TmPage extends Component {
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
    this.addTapeSymbol = this.addTapeSymbol.bind(this);
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
    const transitionPrompt = message => {
      // TODO make something better than a prompt
      const response = prompt(message);
      if(response !== null && response.length !== 1) {
        return transitionPrompt(message);
      }
      return response;
    };
    const tapeSymbol = transitionPrompt('What tape symbol should be used for this transition?');
    if(tapeSymbol === null) {
      return;
    }
    const writeSymbol = transitionPrompt('What tape symbol should be written as a result of this transition?');
    if(writeSymbol === null) {
      return;
    }
    const moveDirection = transitionPrompt('Which direction should the head move as a result of this transition?');
    if(moveDirection === null) {
      return;
    }
    if(!this.props.tm.tapeAlphabet.contains(tapeSymbol)) {
      this.addTapeSymbol(tapeSymbol);
    }
    if(tapeSymbol !== writeSymbol && !this.props.tm.tapeAlphabet.contains(writeSymbol)) {
      this.addTapeSymbol(writeSymbol);
    }
    this.props.dispatch(addTransition(fromState, tapeSymbol, toState, writeSymbol, moveDirection));
  }

  addTapeSymbol(symbol) {
    this.props.dispatch(addTapeSymbol(symbol));
  }

  initializeFromJsonString(jsonString) {
    this.props.dispatch(initializeFromJsonString(jsonString));
  }

  reset() {
    this.props.dispatch(reset());
  }

  stringifyAutomaton() {
    return JSON.stringify(this.props.tm);
  }

  render() {
    const {
      name,
      states,
      tapeAlphabet,
      blankSymbol,
      inputAlphabet,
      transitionFunction,
      initialState,
      acceptStates,
      statePositions,
      selected
    } = this.props.tm;

    const simpleNestedTransitionFunction = getSimpleNestedTransitionFunction(transitionFunction);

    const arrayToTuple = array => '(' + array.join(', ') + ')';
    const transitionFunctionDiv = transitionFunction.size > 0 ? (
      <div>
        {
          transitionFunction.map(transitionObject => {
            const instruction = arrayToTuple(
              [
                transitionObject.fromState,
                transitionObject.tapeSymbol,
                transitionObject.toState,
                transitionObject.writeSymbol,
                transitionObject.moveDirection
              ]
            );
            return <div key={instruction}>{instruction}</div>;
          })
        }
      </div>
    ) : '\u2205';

    const formalProperties = [
      { name: 'Q', value: arrayToString(states.toArray()) },
      { name: '\u0393', value: arrayToString(tapeAlphabet.toArray()) },
      { name: 'b', value: blankSymbol },
      { name: '\u03A3', value: arrayToString(inputAlphabet.toArray()) },
      { name: '\u03B4', value: transitionFunctionDiv },
      { name: 'q\u2080', value: initialState, modalType: modalTypes.INITIAL_STATE_MODAL },
      { name: 'F', value: arrayToString(acceptStates.toArray()), modalType: modalTypes.ACCEPT_STATES_MODAL },
    ];

    return <AutomataPage
      name={name}
      states={states}
      simpleNestedTransitionFunction={simpleNestedTransitionFunction}
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
    tm: getTm(state)
  })
)(TmPage);