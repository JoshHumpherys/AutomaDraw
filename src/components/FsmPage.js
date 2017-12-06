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
  addInputSymbol,
  setInputString,
  stepInput,
  runInput,
  restartInput,
  initializeFromJsonString,
  reset
} from '../actions/fsm'
import { createModal, setModalState } from '../actions/modal'
import { getFsm, getSimplifiedTransitionFunction } from '../selectors/fsm'
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
    this.setInputString = this.setInputString.bind(this);
    this.stepInput = this.stepInput.bind(this);
    this.runInput = this.runInput.bind(this);
    this.restartInput = this.restartInput.bind(this);
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
    this.props.dispatch(createModal(modalTypes.FSM_TRANSITION_MODAL));
    this.props.dispatch(setModalState({ fromState, toState }));
  }

  addSymbol(symbol) {
    this.props.dispatch(addInputSymbol(symbol));
  }

  setInputString(inputString) {
    this.props.dispatch(setInputString(inputString));
  }

  stepInput() {
    this.props.dispatch(stepInput());
  }

  runInput() {
    this.props.dispatch(runInput());
  }

  restartInput() {
    this.props.dispatch(restartInput());
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
    const {
      name, states, inputAlphabet, transitionFunction, initialState, acceptStates, statePositions, selected,
      currentState, inputString, inputIndex, inputMessage
    } = this.props.fsm;

    const simplifiedTransitionFunction = getSimplifiedTransitionFunction(transitionFunction);

    const arrayToTuple = array => '(' + array.join(', ') + ')';
    const transitionFunctionSorted = transitionFunction.map(transitionObject => {
      const { fromState, inputSymbol, toState } = transitionObject;
      return { transitionString: arrayToTuple([fromState, inputSymbol, toState]), transitionObject };
    }).toArray().sort((a, b) => {
      return a.transitionString > b.transitionString ? 1 : -1;
    });

    const transitionFunctionDiv = transitionFunction.size > 0 ? (
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        {
          transitionFunctionSorted.map(({ transitionString, transitionObject }) => {
            return (
              <div key={transitionString}>
                <span onClick={() => {
                  this.props.dispatch(setModalState({ ...transitionObject, transitionString }));
                  this.props.dispatch(createModal(modalTypes.DELETE_TRANSITION_MODAL));
                }} className="clickable">
                  {transitionString}
                </span>
              </div>
            );
          })
        }
      </div>
    ) : '\u2205';

    const formalProperties = [
      { name: 'Q', value: arrayToString(states.toArray()), modalType: modalTypes.STATES_MODAL },
      { name: '\u03A3', value: arrayToString(inputAlphabet.toArray()), modalType: modalTypes.INPUT_ALPHABET_MODAL },
      { name: '\u03B4', value: transitionFunctionDiv, modalType: modalTypes.FSM_TRANSITION_MODAL },
      { name: 'q\u2080', value: initialState, modalType: modalTypes.INITIAL_STATE_MODAL },
      { name: 'F', value: arrayToString(acceptStates.toArray()), modalType: modalTypes.ACCEPT_STATES_MODAL }
    ];

    return <AutomataPage
      name={name}
      states={states}
      simplifiedTransitionFunction={simplifiedTransitionFunction}
      initialState={initialState}
      acceptStates={acceptStates}
      statePositions={statePositions}
      selected={selected}
      currentState={currentState}
      inputString={inputString}
      inputIndex={inputIndex}
      inputMessage={inputMessage}
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
      setInputString={this.setInputString}
      stepInput={this.stepInput}
      runInput={this.runInput}
      restartInput={this.restartInput}
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