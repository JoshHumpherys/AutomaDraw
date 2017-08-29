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
  addLetter,
  initializeFromJsonString,
  reset
} from '../actions/fsm'
import { getFsm } from '../selectors/fsm'
import { arrayToString } from '../utility/utility'
import AutomataPage from './AutomataPage'

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
    this.addLetter = this.addLetter.bind(this);
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
    const getLetter = () => {
      // TODO make something better than a prompt
      const letter = prompt('What letter should be used for this transition?');
      if(letter !== null && letter.length !== 1) {
        return getLetter();
      }
      return letter;
    };
    const letter = getLetter();
    if(letter !== null) { // user didn't click cancel
      if(!this.props.fsm.alphabet.contains(letter)) {
        this.addLetter(letter);
      }
      this.props.dispatch(addTransition(fromState, letter, toState));
    }
  }

  addLetter(letter) {
    this.props.dispatch(addLetter(letter));
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
      name,
      states,
      alphabet,
      transitionFunction,
      initialState,
      acceptStates,
      statePositions,
      selected
    } = this.props.fsm;

    const transitionFunctionToTable = () => {
      if(states.size === 0) {
        return new Array(0);
      }

      let table = new Array(states.length);
      let i = 0;
      for(const state of states) {
        const transitions = transitionFunction.get(state);
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

    const transitionTable = transitionFunctionToTable();

    const createTransitionTable = () => {
      if(transitionTable.length === 0) {
        return '\u2205';
      }

      const rows = [];
      for(const fromState of states.keys()) {
        const cols = [];
        cols.push(<td key="0">{fromState}</td>);
        for(const letter of alphabet.keys()) {
          const toState = transitionTable[rows.length][cols.length - 1];
          cols.push(
            transitionTable[rows.length] ? (
              <td key={cols.length} onClick={() => this.setState({
                transitionPopup: true,
                transitionPopupToState: toState,
                transitionPopupLetter: letter,
                transitionPopupFromState: fromState
              })}>{toState}</td>
            ) : (
              <td />
            )
          );
        }
        rows.push(
          <tr key={rows.length}>
            {cols}
          </tr>
        );
      }

      return (
        <table className="transition-table">
          <thead>
          <tr>
            <td>Q x &Sigma;</td>
            {alphabet.map(letter => <td key={letter}>{letter}</td>)}
          </tr>
          </thead>
          <tbody>
            {rows}
          </tbody>
        </table>
      );
    };

    const formalProperties = [
      { name: 'Q', value: arrayToString(states.toArray()) },
      { name: '\u03A3', value: arrayToString(alphabet.toArray()) },
      { name: '\u03B4', value: createTransitionTable() },
      { name: 'q\u2080', value: initialState },
      { name: 'F', value: arrayToString(acceptStates.toArray()) },
    ];

    /* TODO fix popups
    const popupContents = this.state.transitionPopup ? (
      <TransitionPopup
        fromState={this.state.transitionPopupFromState}
        letter={this.state.transitionPopupLetter}
        toState={this.state.transitionPopupToState}
        closePopup={() => this.setState({
          transitionPopup: false,
          transitionPopupFromState: null,
          transitionPopupLetter: null,
          transitionPopupToState: null
        })}
        className={this.state.transitionPopup ? '' : 'popup-hidden'} />
    ) : null;
    */

    return <AutomataPage
      name={name}
      states={states}
      alphabet={alphabet}
      simplifiedTransitionFunction={transitionFunction}
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
      addLetter={this.addLetter}
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