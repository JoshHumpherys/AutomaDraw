import React, { Component } from 'react'
import { Button, Divider, Dropdown, Form, Icon, Label } from 'semantic-ui-react'
import { removeModal, setModalState } from '../actions/modal'
import * as modalTypes from '../constants/modalTypes'
import * as fsmActions from '../actions/fsm'
import * as pdaActions from '../actions/pda'
import * as tmActions from '../actions/tm'
import * as automatonTypes from '../constants/automatonTypes'
import $ from 'jquery'

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

export default (automaton, modalState, modalType, automatonType, dispatch) => {
  const getValue = key => modalState[key] || automaton[key];

  const createMultiSelectWithAdditionModalBody =
    (valuesPropertyName, placeholder, buttonText, additionalValueButtons = []) => {
    return (
      <div>
        {
          getValue(valuesPropertyName).map(value =>
            <Label>
              {value}
              <Icon name='delete' onClick={() => {
                dispatch(setModalState({ [valuesPropertyName]: getValue(valuesPropertyName).remove(value) }));
              }} />
            </Label>
          )
        }
        <Divider />
        <Form>
          <Form.Group>
            {/* Form.Input does not have autocomplete property */}
            <div className="field">
              <div className="ui input">
                <input
                  type="text"
                  id="multiSelectModalInput"
                  placeholder={placeholder}
                  autoComplete="off"
                  autoFocus /> {/* TODO use refs instead of id attribute */}
              </div>
            </div>
            <Form.Button onClick={() => {
              const multiSelectModalInput = $('#multiSelectModalInput');
              const value = multiSelectModalInput.val();
              if(value.length > 0) {
                dispatch(setModalState({ [valuesPropertyName]: getValue(valuesPropertyName).add(value) }));
              }
              multiSelectModalInput.val('');
            }}>{buttonText}</Form.Button>
            {
              additionalValueButtons.map(additionalValueButton =>
                <Form.Button onClick={() => {
                  const newValues = getValue(valuesPropertyName).add(additionalValueButton);
                  dispatch(setModalState({ [valuesPropertyName]: newValues }));
                }}>{additionalValueButton}</Form.Button>
              )
            }
          </Form.Group>
        </Form>
      </div>
    );
  };

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
    case modalTypes.STATES_MODAL: {
      const states = getValue('states').toArray().sort();
      return {
        header: 'States',
        body: createMultiSelectWithAdditionModalBody('states', 'Add a new state', 'Add state'),
        actions: [
          <CancelButton
            key="cancel"
            onClick={() => dispatch(removeModal())} />,
          <SubmitButton
            key="submit"
            onClick={() => {
              dispatch(actions.setStates(states));
              dispatch(removeModal());
            }} />
        ]
      }
    }
    case modalTypes.TAPE_ALPHABET_MODAL: {
      const tapeAlphabet = getValue('tapeAlphabet').toArray().sort();
      return {
        header: 'Tape Alphabet',
        body: (
          createMultiSelectWithAdditionModalBody('tapeAlphabet', 'Add a new tape symbol', 'Add tape symbol', ['\u0394'])
        ),
        actions: [
          <CancelButton
            key="cancel"
            onClick={() => dispatch(removeModal())} />,
          <SubmitButton
            key="submit"
            onClick={() => {
              dispatch(actions.setTapeAlphabet(tapeAlphabet));
              dispatch(removeModal());
            }} />
        ]
      }
    }
    case modalTypes.BLANK_SYMBOL_MODAL: {
      const tapeAlphabet = getValue('tapeAlphabet').toArray().sort();
      const blankSymbol = getValue('blankSymbol');
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
            }} />
        ]
      };
    }
    case modalTypes.INPUT_ALPHABET_MODAL: {
      if (automatonType !== automatonTypes.TM) {
        return {
          header: 'Input Alphabet',
          body: createMultiSelectWithAdditionModalBody('inputAlphabet', 'Add a new input symbol', 'Add input symbol'),
          actions: [
            <CancelButton
              key="cancel"
              onClick={() => dispatch(removeModal())}/>,
            <SubmitButton
              key="submit"
              onClick={() => {
                dispatch(actions.setInputAlphabet(getValue('inputAlphabet').toArray().sort()));
                dispatch(removeModal());
              }}/>
          ]
        };
      } else {
        const inputAlphabet = getValue('inputAlphabet').toArray().sort();
        const inputAlphabetOptions = getValue('tapeAlphabet')
          .remove(getValue('blankSymbol'))
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
                inputAlphabetOptions.map(inputSymbol => ({text: inputSymbol, value: inputSymbol, key: inputSymbol}))
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
              }}/>
          ]
        };
      }
    }
    case modalTypes.STACK_ALPHABET_MODAL: {
      return {
        header: 'Stack Alphabet',
        body: createMultiSelectWithAdditionModalBody('stackAlphabet', 'Add a new stack symbol', 'Add stack symbol'),
        actions: [
          <CancelButton
            key="cancel"
            onClick={() => dispatch(removeModal())} />,
          <SubmitButton
            key="submit"
            onClick={() => {
              dispatch(actions.setStackAlphabet(getValue('stackAlphabet').toArray().sort()));
              dispatch(removeModal());
            }} />
        ]
      };
    }
    case modalTypes.INITIAL_STACK_SYMBOL_MODAL: {
      const stackAlphabet = getValue('stackAlphabet').toArray().sort();
      const initialStackSymbol = getValue('initialStackSymbol');
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
            }} />
        ]
      };
    }
    case modalTypes.INITIAL_STATE_MODAL: {
      const states = getValue('states').toArray().sort();
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
            }} />
        ]
      };
    }
    case modalTypes.ACCEPT_STATES_MODAL: {
      const states = getValue('states').toArray().sort();
      const acceptStates = getValue('acceptStates').toArray().sort();
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
            }} />
        ]
      };
    }
    default: {
      return null;
    }
  }
};