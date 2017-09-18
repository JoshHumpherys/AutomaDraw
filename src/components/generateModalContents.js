import React, { Component } from 'react'
import { Button, Divider, Dropdown, Form, Icon, Label } from 'semantic-ui-react'
import { removeModal, setModalState } from '../actions/modal'
import * as modalTypes from '../constants/modalTypes'
import * as fsmActions from '../actions/fsm'
import * as pdaActions from '../actions/pda'
import * as tmActions from '../actions/tm'
import * as automatonTypes from '../constants/automatonTypes'
import $ from 'jquery'
import { Set } from 'immutable'

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

export default (automaton, modalState, modalType, automatonType, dispatch, emptyStringSymbol) => {
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
    case modalTypes.RENAME_AUTOMATON_MODAL: {
      const name = getValue('name');
      let automatonTypeName;
      switch(automatonType) {
        case automatonTypes.FSM:
          automatonTypeName = 'FSM';
          break;
        case automatonTypes.PDA:
          automatonTypeName = 'PDA';
          break;
        case automatonTypes.TM:
          automatonTypeName = 'TM';
          break;
      }
      const submit = () => {
        const value = $('#renameAutomatonInput').val();
        if(value.length > 0) {
          dispatch(actions.changeName(value));
        }
        dispatch(removeModal());
      };
      return {
        header: 'Rename ' + automatonTypeName,
        body: (
          <Form>
            <Form.Group>
              {/* Form.Input does not have autocomplete property */}
              <div className="field">
                <div className="ui input">
                  <input
                    type="text"
                    id="renameAutomatonInput"
                    placeholder="Enter a new name"
                    autoComplete="off"
                    autoFocus
                    onKeyDown={e => {
                      if(e.which === 13 || e.keyCode === 13) {
                        submit();
                      }
                    }} /> {/* TODO use refs instead of id attribute */}
                </div>
              </div>
            </Form.Group>
          </Form>
        ),
        actions: [
          <CancelButton
            key="cancel"
            onClick={() => dispatch(removeModal())} />,
          <SubmitButton
            key="submit"
            onClick={submit} />
        ]
      };
    }
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
              onClick={() => dispatch(removeModal())} />,
            <SubmitButton
              key="submit"
              onClick={() => {
                dispatch(actions.setInputAlphabet(getValue('inputAlphabet').toArray().sort(), emptyStringSymbol));
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
                dispatch(actions.setInputAlphabet(value.sort(), emptyStringSymbol));
                dispatch(removeModal());
              }} />
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
    case modalTypes.FSM_TRANSITION_MODAL: {
      const states = getValue('states').toArray().sort();
      const inputAlphabet = getValue('inputAlphabet').toArray().sort();
      inputAlphabet.unshift(emptyStringSymbol);
      const fromState = getValue('fromState') || states[0];
      const inputSymbol = getValue('inputSymbol') || inputAlphabet[0];
      const toState = getValue('toState') || states[0];
      return {
        header: 'Add Transition',
        body: (
          <Form>
            {/*
            <Form.Field>
              <label>
                Transition
              </label>
              {'(' + fromState + ', ' + inputSymbol + ', ' + toState + ')'}
            </Form.Field>
            <Divider />
            */}
            <Form.Group widths="equal">
              <Form.Field>
                <label>From State</label>
                <Dropdown
                  placeholder="Select a from state"
                  defaultValue={fromState}
                  fluid
                  selection
                  options={states.map(state => ({ text: state, value: state, key: state }))}
                  onChange={(e, data) => dispatch(setModalState({ fromState: data.value }))} />
              </Form.Field>
              <Form.Field>
                <label>Input Symbol</label>
                <Dropdown
                  placeholder="Select an input symbol"
                  defaultValue={inputSymbol}
                  fluid
                  selection
                  options={
                    inputAlphabet.map(inputSymbol => ({ text: inputSymbol, value: inputSymbol, key: inputSymbol }))
                  }
                  onChange={(e, data) => dispatch(setModalState({ inputSymbol: data.value }))} />
              </Form.Field>
              <Form.Field>
                <label>To State</label>
                <Dropdown
                  placeholder="Select a to state"
                  defaultValue={toState}
                  fluid
                  selection
                  options={states.map(state => ({ text: state, value: state, key: state }))}
                  onChange={(e, data) => dispatch(setModalState({ toState: data.value }))} />
              </Form.Field>
            </Form.Group>
          </Form>
        ),
        actions: [
          <CancelButton
            key="cancel"
            onClick={() => dispatch(removeModal())} />,
          <SubmitButton
            key="submit"
            onClick={() => {
              if(fromState && inputSymbol && toState &&
                !automaton.transitionFunction.some(transitionObject =>
                  transitionObject.fromState === fromState &&
                  transitionObject.inputSymbol === inputSymbol &&
                  transitionObject.toState === toState
                )) {
                dispatch(actions.addTransition(fromState, inputSymbol, toState, emptyStringSymbol));
              }
              dispatch(removeModal());
            }} />
        ]
      };
    }
    case modalTypes.PDA_TRANSITION_MODAL: {
      const states = getValue('states').toArray().sort();
      const inputAlphabet = getValue('inputAlphabet').toArray().sort();
      inputAlphabet.unshift(emptyStringSymbol);
      const stackAlphabet = getValue('stackAlphabet').toArray().sort(); // Don't add empty string symbol until below
      const fromState = getValue('fromState') || states[0];
      const inputSymbol = getValue('inputSymbol') || emptyStringSymbol;
      const stackSymbol = getValue('stackSymbol') || emptyStringSymbol;
      const toState = getValue('toState') || states[0];
      const pushSymbols = getValue('pushSymbols') || emptyStringSymbol;

      let pushSymbolsOptions =
        (stackSymbol === emptyStringSymbol ? new Set() : new Set(stackAlphabet.map(s => s + stackSymbol)))
          .union(stackAlphabet)
          .toArray()
          .sort((a, b) => (a.length === b.length) ? a - b : a.length - b.length);
      pushSymbolsOptions.unshift(emptyStringSymbol);
      pushSymbolsOptions = pushSymbolsOptions
        .map(pushSymbol => ({ text: pushSymbol, value: pushSymbol, key: pushSymbol }));

      stackAlphabet.unshift(emptyStringSymbol);

      return {
        header: 'Add Transition',
        body: (
          <Form>
            <Form.Group widths="equal">
              <Form.Field>
                <label>From State</label>
                <Dropdown
                  placeholder="Select a from state"
                  defaultValue={fromState}
                  fluid
                  selection
                  options={states.map(state => ({ text: state, value: state, key: state }))}
                  onChange={(e, data) => dispatch(setModalState({ fromState: data.value }))} />
              </Form.Field>
              <Form.Field>
                <label>Input Symbol</label>
                <Dropdown
                  placeholder="Select an input symbol"
                  defaultValue={inputSymbol}
                  fluid
                  selection
                  options={
                    inputAlphabet.map(inputSymbol => ({ text: inputSymbol, value: inputSymbol, key: inputSymbol }))
                  }
                  onChange={(e, data) => dispatch(setModalState({ inputSymbol: data.value }))} />
              </Form.Field>
              <Form.Field>
                <label>Stack Symbol</label>
                <Dropdown
                  placeholder="Select a stack symbol"
                  defaultValue={stackSymbol}
                  fluid
                  selection
                  options={
                    stackAlphabet.map(inputSymbol => ({ text: inputSymbol, value: inputSymbol, key: inputSymbol }))
                  }
                  onChange={(e, data) => {
                    let newPushSymbols = pushSymbols;
                    if(pushSymbols.length === 2 && pushSymbols.charAt(1) !== data.value) {
                      newPushSymbols = null;
                    }
                    dispatch(setModalState({ stackSymbol: data.value, pushSymbols: newPushSymbols }));
                  }} />
              </Form.Field>
              <Form.Field>
                <label>To State</label>
                <Dropdown
                  placeholder="Select a to state"
                  defaultValue={toState}
                  fluid
                  selection
                  options={states.map(state => ({ text: state, value: state, key: state }))}
                  onChange={(e, data) => dispatch(setModalState({ toState: data.value }))} />
              </Form.Field>
              <Form.Field>
                <label>Push Symbols</label>
                {/* TODO figure out if a key is the correct fix for getting the correct default value */}
                <Dropdown
                  key={pushSymbols}
                  placeholder="Select push symbols"
                  defaultValue={pushSymbols}
                  fluid
                  selection
                  options={pushSymbolsOptions}
                  onChange={(e, data) => dispatch(setModalState({ pushSymbols: data.value }))} />
              </Form.Field>
            </Form.Group>
          </Form>
        ),
        actions: [
          <CancelButton
            key="cancel"
            onClick={() => dispatch(removeModal())} />,
          <SubmitButton
            key="submit"
            onClick={() => {
              if(fromState && inputSymbol && stackSymbol && toState && pushSymbols &&
                !automaton.transitionFunction.some(transitionObject =>
                  transitionObject.fromState === fromState &&
                  transitionObject.inputSymbol === inputSymbol &&
                  transitionObject.stackSymbol === stackSymbol &&
                  transitionObject.toState === toState &&
                  transitionObject.pushSymbols === pushSymbols
                )) {
                dispatch(
                  actions.addTransition(fromState, inputSymbol, stackSymbol, toState, pushSymbols, emptyStringSymbol)
                );
              }
              dispatch(removeModal());
            }} />
        ]
      };
    }
    case modalTypes.TM_TRANSITION_MODAL: {
      const states = getValue('states').toArray().sort();
      const blankSymbol = getValue('blankSymbol');
      let tapeAlphabet = getValue('tapeAlphabet').remove(blankSymbol).toArray().sort();
      tapeAlphabet.unshift(blankSymbol);
      const fromState = getValue('fromState') || states[0];
      const inputSymbol = getValue('inputSymbol') || tapeAlphabet[0];
      const toState = getValue('toState') || states[0];
      const writeSymbol = getValue('writeSymbol') || tapeAlphabet[0];
      const moveDirection = getValue('moveDirection') || 'L';

      const moveDirections = ['L', 'R'];

      return {
        header: 'Add Transition',
        body: (
          <Form>
            <Form.Group widths="equal">
              <Form.Field>
                <label>From State</label>
                <Dropdown
                  placeholder="Select a from state"
                  defaultValue={fromState}
                  fluid
                  selection
                  options={states.map(state => ({ text: state, value: state, key: state }))}
                  onChange={(e, data) => dispatch(setModalState({ fromState: data.value }))} />
              </Form.Field>
              <Form.Field>
                <label>Input Symbol</label>
                <Dropdown
                  placeholder="Select an input symbol"
                  defaultValue={inputSymbol}
                  fluid
                  selection
                  options={
                    tapeAlphabet.map(inputSymbol => ({ text: inputSymbol, value: inputSymbol, key: inputSymbol }))
                  }
                  onChange={(e, data) => dispatch(setModalState({ inputSymbol: data.value }))} />
              </Form.Field>
              <Form.Field>
                <label>To State</label>
                <Dropdown
                  placeholder="Select a to state"
                  defaultValue={toState}
                  fluid
                  selection
                  options={states.map(state => ({ text: state, value: state, key: state }))}
                  onChange={(e, data) => dispatch(setModalState({ toState: data.value }))} />
              </Form.Field>
              <Form.Field>
                <label>Write Symbol</label>
                <Dropdown
                  placeholder="Select a write symbol"
                  defaultValue={writeSymbol}
                  fluid
                  selection
                  options={
                    tapeAlphabet.map(writeSymbol => ({ text: writeSymbol, value: writeSymbol, key: writeSymbol }))
                  }
                  onChange={(e, data) => dispatch(setModalState({ writeSymbol: data.value }))} />
              </Form.Field>
              <Form.Field>
                <label>Move Direction</label>
                <Dropdown
                  placeholder="Select move direction"
                  defaultValue={moveDirection}
                  fluid
                  selection
                  options={moveDirections.map(direction => ({ text: direction, value: direction, key: direction }))}
                  onChange={(e, data) => dispatch(setModalState({ moveDirection: data.value }))} />
              </Form.Field>
            </Form.Group>
          </Form>
        ),
        actions: [
          <CancelButton
            key="cancel"
            onClick={() => dispatch(removeModal())} />,
          <SubmitButton
            key="submit"
            onClick={() => {
              if(fromState && inputSymbol && toState && writeSymbol && moveDirection &&
                !automaton.transitionFunction.some(transitionObject =>
                  transitionObject.fromState === fromState &&
                  transitionObject.inputSymbol === inputSymbol &&
                  transitionObject.toState === toState &&
                  transitionObject.writeSymbol === writeSymbol &&
                  transitionObject.moveDirection === moveDirection
                )) {
                dispatch(actions.addTransition(fromState, inputSymbol, toState, writeSymbol, moveDirection));
              }
              dispatch(removeModal());
            }} />
        ]
      };
    }
    case modalTypes.DELETE_TRANSITION_MODAL: {
      return {
        header: 'Delete Transition',
        body: 'Are you sure you want to delete transition ' + getValue('transitionString') + '?',
        actions: [
          <CancelButton
            key="cancel"
            onClick={() => {
              dispatch(removeModal());
            }} />,
          <DeleteButton
            key="delete"
            onClick={() => {
              switch(automatonType) {
                case automatonTypes.FSM: {
                  const fromState = getValue('fromState');
                  const inputSymbol = getValue('inputSymbol');
                  const toState = getValue('toState');
                  dispatch(actions.removeTransition(fromState, inputSymbol, toState));
                  break;
                }
                case automatonTypes.PDA: {
                  const fromState = getValue('fromState');
                  const inputSymbol = getValue('inputSymbol');
                  const stackSymbol = getValue('stackSymbol');
                  const toState = getValue('toState');
                  const pushSymbols = getValue('pushSymbols');
                  dispatch(actions.removeTransition(fromState, inputSymbol, stackSymbol, toState, pushSymbols));
                  break;
                }
                case automatonTypes.TM: {
                  const fromState = getValue('fromState');
                  const inputSymbol = getValue('inputSymbol');
                  const toState = getValue('toState');
                  const writeSymbol = getValue('writeSymbol');
                  const moveDirection = getValue('moveDirection');
                  dispatch(actions.removeTransition(fromState, inputSymbol, toState, writeSymbol, moveDirection));
                  break;
                }
              }
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
    case modalTypes.RENAME_STATE_MODAL: {
      const state = getValue('state');
      const submit = () => {
        const value = $('#renameStateInput').val();
        const states = getValue('states');
        if(!states.includes(value)) {
          dispatch(actions.changeStateName(state, value));
        }
        dispatch(removeModal());
      };
      return {
        header: 'Rename State',
        body: (
          <Form>
            <Form.Group>
              {/* Form.Input does not have autocomplete property */}
              <div className="field">
                <div className="ui input">
                  <input
                    type="text"
                    id="renameStateInput"
                    placeholder="Enter a new name"
                    autoComplete="off"
                    autoFocus
                    onKeyDown={e => {
                      if(e.which === 13 || e.keyCode === 13) {
                        submit();
                      }
                    }} /> {/* TODO use refs instead of id attribute */}
                </div>
              </div>
            </Form.Group>
          </Form>
        ),
        actions: [
          <CancelButton
            key="cancel"
            onClick={() => dispatch(removeModal())} />,
          <SubmitButton
            key="submit"
            onClick={submit} />
        ]
      };
    }
    default: {
      return null;
    }
  }
};