import React, { Component } from 'react'
import { Button, Dropdown } from 'semantic-ui-react'
import { removeModal } from '../actions/modal'
import * as modalTypes from '../constants/modalTypes'
import * as fsmActions from '../actions/fsm'
import * as pdaActions from '../actions/pda'
import * as tmActions from '../actions/tm'
import * as automatonTypes from '../constants/automatonTypes'

class CancelButton extends Component {
  render() {
    return (
      <Button
        key="cancel"
        content="Cancel"
        onClick={this.props.onClick} />
    );
  }
}

class DeleteButton extends Component {
  render() {
    return (
      <Button
        negative
        icon="trash"
        labelPosition="right"
        content="Delete"
        onClick={this.props.onClick} />
    );
  }
}

class SubmitButton extends Component {
  render() {
    return (
      <Button
        key="submit"
        positive
        icon="checkmark"
        labelPosition="right"
        content="Submit"
        onClick={this.props.onClick} />
    );
  }
}

export default (automaton, automatonType, modalType, dispatch) => {
  let actions;
  switch(automatonType) {
    case automatonTypes.FSM:
      actions = fsmActions;
      break;
    case automatonTypes.PDA:
      actions = pdaActions;
      break;
    case automatonTypes.TM:
      actions = tmActions;
      break;
  }
  switch(modalType) {
    case modalTypes.INITIAL_STATE_MODAL: {
      const states = automaton.states.toArray().sort();
      return {
        header: 'Initial State',
        body: <Dropdown
          placeholder="Select an initial state"
          defaultValue={automaton.initialState}
          fluid
          selection
          options={states.map(state => ({ text: state, value: state, key: state }))}
          ref={dropdown => this.modalDropdown = dropdown} />,
        actions: [
          <DeleteButton
            key="delete"
            onClick={() => {
              dispatch(actions.removeInitialState());
              dispatch(removeModal());
            }} />,
          <SubmitButton
            key="submit"
            onClick={() => {
              const { value } = this.modalDropdown.state;
              if(automaton.states.contains(value)) {
                dispatch(actions.changeInitialState(value));
              }
              dispatch(removeModal());
            }} />,
        ]
      };
    }
    case modalTypes.INITIAL_STACK_SYMBOL_MODAL: {
      const stackAlphabet = automaton.stackAlphabet.toArray().sort();
      const { initialStackSymbol } = automaton;
      return {
        header: 'Initial Stack Symbol',
        body: <Dropdown
          placeholder="Select an initial stack symbol"
          defaultValue={initialStackSymbol}
          fluid
          selection
          options={stackAlphabet.map(stackSymbol => ({ text: stackSymbol, value: stackSymbol, key: stackSymbol }))}
          ref={dropdown => this.modalDropdown = dropdown} />,
        actions: [
          <DeleteButton
            key="delete"
            onClick={() => {
              dispatch(actions.removeInitialStackSymbol());
              dispatch(removeModal());
            }} />,
          <SubmitButton
            key="submit"
            onClick={() => {
              const { value } = this.modalDropdown.state;
              dispatch(actions.changeInitialStackSymbol(value));
              dispatch(removeModal());
            }}/>,
        ]
      };
    }
    case modalTypes.BLANK_SYMBOL_MODAL: {
      const tapeAlphabet = automaton.tapeAlphabet.toArray().sort();
      const { blankSymbol } = automaton;
      return {
        header: 'Blank Symbol',
        body: <Dropdown
          placeholder="Select a blank symbol"
          defaultValue={blankSymbol}
          fluid
          selection
          options={tapeAlphabet.map(tapeSymbol => ({ text: tapeSymbol, value: tapeSymbol, key: tapeSymbol }))}
          ref={dropdown => this.modalDropdown = dropdown} />,
        actions: [
          <DeleteButton
            key="delete"
            onClick={() => {
              dispatch(actions.removeBlankSymbol());
              dispatch(removeModal());
            }} />,
          <SubmitButton
            key="submit"
            onClick={() => {
              const { value } = this.modalDropdown.state;
              dispatch(actions.changeBlankSymbol(value));
              dispatch(removeModal());
            }}/>,
        ]
      };
    }
    case modalTypes.ACCEPT_STATES_MODAL: {
      const states = automaton.states.toArray().sort();
      const acceptStates = automaton.acceptStates.toArray().sort();
      return {
        header: 'Accept States',
        body: <Dropdown
          placeholder="Select accept states"
          defaultValue={acceptStates}
          fluid
          multiple
          selection
          options={states.map(state => ({ text: state, value: state, key: state }))}
          ref={dropdown => this.modalDropdown = dropdown} />,
        actions: [
          <CancelButton
            key="cancel"
            onClick={() => dispatch(removeModal())} />,
          <SubmitButton
            key="submit"
            onClick={() => {
              const value = this.modalDropdown.state.value;
              dispatch(actions.setAcceptStates(value.sort()));
              dispatch(removeModal());
            }} />,
        ]
      };
    }
    case modalTypes.INPUT_ALPHABET_MODAL: {
      const inputAlphabet = automaton.inputAlphabet.toArray().sort();
      const inputAlphabetOptions = automaton.tapeAlphabet
        .remove(automaton.blankSymbol)
        .toArray()
        .sort();
      return {
        header: 'Input Alphabet',
        body: <Dropdown
          placeholder="Select input alphabet symbols"
          defaultValue={inputAlphabet}
          fluid
          multiple
          selection
          options={
            inputAlphabetOptions.map(inputSymbol => ({ text: inputSymbol, value: inputSymbol, key: inputSymbol }))
          }
          ref={dropdown => this.modalDropdown = dropdown} />,
        actions: [
          <CancelButton
            key="cancel"
            onClick={() => dispatch(removeModal())} />,
          <SubmitButton
            key="submit"
            onClick={() => {
              const value = this.modalDropdown.state.value;
              dispatch(actions.setInputAlphabet(value.sort()));
              dispatch(removeModal());
            }} />,
        ]
      };
    }
    default: {
      return null;
    }
  }
};