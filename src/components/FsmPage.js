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
  addSymbol,
  initializeFromJsonString,
  reset
} from '../actions/fsm'
import { getFsm, getSimpleNestedTransitionFunction } from '../selectors/fsm'
import { arrayToString } from '../utility/utility'
import AutomataPage from './AutomataPage'
import * as modalTypes from '../constants/modalTypes'

export class FsmPage extends Component {
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
    this.addSymbol = this.addSymbol.bind(this);
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
    const getSymbol = () => {
      // TODO make something better than a prompt
      const symbol = prompt('What symbol should be used for this transition?');
      if(symbol !== null && symbol.length !== 1) {
        return getSymbol();
      }
      return symbol;
    };
    const symbol = getSymbol();
    if(symbol !== null) { // user didn't click cancel
      if(!this.props.fsm.alphabet.contains(symbol)) {
        this.addSymbol(symbol);
      }
      this.props.dispatch(addTransition(fromState, symbol, toState));
    }
  }

  addSymbol(symbol) {
    this.props.dispatch(addSymbol(symbol));
  }

  initializeFromJsonString(jsonString) {
    this.props.dispatch(initializeFromJsonString(jsonString));
  }

  reset() {
    this.props.dispatch(reset());
  }

  stringifyAutomaton() {
    return JSON.stringify(this.props.fsm);
  }

  render() {
    const { name, states, alphabet, transitionFunction, initialState, acceptStates, statePositions, selected }
      = this.props.fsm;

    const simpleNestedTransitionFunction = getSimpleNestedTransitionFunction(transitionFunction);

    const arrayToTuple = array => '(' + array.join(', ') + ')';
    const transitionFunctionDiv = transitionFunction.size > 0 ? (
      <div>
        {
          transitionFunction.map(transitionObject => {
            const instruction = arrayToTuple(
              [transitionObject.fromState, transitionObject.inputSymbol, transitionObject.toState]
            );
            return <div key={instruction}>{instruction}</div>;
          })
        }
      </div>
    ) : '\u2205';

    const formalProperties = [
      { name: 'Q', value: arrayToString(states.toArray()) },
      { name: '\u03A3', value: arrayToString(alphabet.toArray()) },
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
    fsm: getFsm(state)
  })
)(FsmPage);