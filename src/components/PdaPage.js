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
  addStackSymbol,
  initializeFromJsonString,
  reset
} from '../actions/pda'
import { createModal, setModalState } from '../actions/modal'
import { getPda, getSimplifiedTransitionFunction } from '../selectors/pda'
import { arrayToString } from '../utility/utility'
import AutomataPage from './AutomataPage'
import * as modalTypes from '../constants/modalTypes'

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
    this.props.dispatch(createModal(modalTypes.PDA_TRANSITION_MODAL));
    this.props.dispatch(setModalState({ fromState, toState }));
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

    const simplifiedTransitionFunction = getSimplifiedTransitionFunction(transitionFunction);

    const arrayToTuple = array => '(' + array.join(', ') + ')';
    const transitionFunctionSorted = transitionFunction.map(transitionObject => {
      const { fromState, inputSymbol, stackSymbol, toState, pushSymbols } = transitionObject;
      return {
        transitionString: arrayToTuple([fromState, inputSymbol, stackSymbol, toState, pushSymbols]),
        transitionObject
      };
    }).toArray().sort((a, b) => {
      return a.stringValue > b.stringValue ? 1 : -1;
    });

    const transitionFunctionDiv = transitionFunction.size > 0 ? (
      <div>
        {
          transitionFunctionSorted.map(({ transitionString, transitionObject }) => {
            return (
              <div>
                <span key={transitionString} onClick={() => {
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
      { name: '\u0393', value: arrayToString(stackAlphabet.toArray()), modalType: modalTypes.STACK_ALPHABET_MODAL },
      { name: '\u03B4', value: transitionFunctionDiv, modalType: modalTypes.PDA_TRANSITION_MODAL },
      { name: 'q\u2080', value: initialState, modalType: modalTypes.INITIAL_STATE_MODAL },
      { name: 'Z', value: initialStackSymbol, modalType: modalTypes.INITIAL_STACK_SYMBOL_MODAL },
      { name: 'F', value: arrayToString(acceptStates.toArray()), modalType: modalTypes.ACCEPT_STATES_MODAL },
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