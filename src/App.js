import React, { Component } from 'react'
import { connect } from 'react-redux'
import logo from './logo.svg'
import './index.css'
import { getSettings } from './selectors/settings'
import { isMobileBrowser, getPageType } from './utility/utility'
import MobileSite from './components/MobileSite'
import { browserHistory } from 'react-router'
import { Button, Dropdown, Icon, Menu, Modal, Popup } from 'semantic-ui-react'
import SettingsPopup from './components/SettingsPopup'
import * as modalTypes from './constants/modalTypes'
import { removeModal } from './actions/modal'
import { getModalType } from './selectors/modal'
import { getAutomaton } from './selectors/automaton'
import * as fsmActions from './actions/fsm'
import * as pdaActions from './actions/pda'
import * as tmActions from './actions/tm'
import * as automatonTypes from './constants/automatonTypes'
import * as pageTypes from './constants/pageTypes'

export class App extends Component {
  render() {
    if(!isMobileBrowser()) {
      let modalContents = null;
      let actions;
      switch(this.props.automatonType) {
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
      switch(this.props.modalType) {
        case modalTypes.INITIAL_STATE_MODAL: {
          const states = this.props.automaton.states.toArray().sort();
          modalContents = {
            header: 'Initial State',
            body: <Dropdown
              placeholder="Select an initial state"
              defaultValue={this.props.automaton.initialState}
              fluid
              selection
              options={states.map(state => ({ text: state, value: state, key: state }))}
              ref={dropdown => this.modalDropdown = dropdown} />,
            actions: [
              <Button
                key="delete"
                negative
                icon="trash"
                labelPosition="right"
                content="Delete"
                onClick={() => {
                  this.props.dispatch(actions.removeInitialState());
                  this.props.dispatch(removeModal());
                }} />,
              <Button
                key="submit"
                positive
                icon="checkmark"
                labelPosition="right"
                content="Submit"
                onClick={() => {
                  const { value } = this.modalDropdown.state;
                  if(this.props.automaton.states.contains(value)) {
                    this.props.dispatch(actions.changeInitialState(value));
                  }
                  this.props.dispatch(removeModal());
                }} />,
            ]
          };
          break;
        }
        case modalTypes.INITIAL_STACK_SYMBOL_MODAL: {
          const stackAlphabet = this.props.automaton.stackAlphabet.toArray().sort();
          const { initialStackSymbol } = this.props.automaton;
          modalContents = {
            header: 'Initial Stack Symbol',
            body: <Dropdown
              placeholder="Select an initial stack symbol"
              defaultValue={initialStackSymbol}
              fluid
              selection
              options={stackAlphabet.map(stackSymbol => ({ text: stackSymbol, value: stackSymbol, key: stackSymbol }))}
              ref={dropdown => this.modalDropdown = dropdown} />,
            actions: [
              <Button
                key="delete"
                negative
                icon="trash"
                labelPosition="right"
                content="Delete"
                onClick={() => {
                  this.props.dispatch(actions.removeInitialStackSymbol());
                  this.props.dispatch(removeModal());
                }} />,
              <Button
                key="submit"
                positive
                icon="checkmark"
                labelPosition="right"
                content="Submit"
                onClick={() => {
                  const { value } = this.modalDropdown.state;
                  this.props.dispatch(actions.changeInitialStackSymbol(value));
                  this.props.dispatch(removeModal());
                }}/>,
            ]
          };
          break;
        }
        case modalTypes.BLANK_SYMBOL_MODAL: {
          const tapeAlphabet = this.props.automaton.tapeAlphabet.toArray().sort();
          const { blankSymbol } = this.props.automaton;
          modalContents = {
            header: 'Blank Symbol',
            body: <Dropdown
              placeholder="Select a blank symbol"
              defaultValue={blankSymbol}
              fluid
              selection
              options={tapeAlphabet.map(tapeSymbol => ({ text: tapeSymbol, value: tapeSymbol, key: tapeSymbol }))}
              ref={dropdown => this.modalDropdown = dropdown} />,
            actions: [
              <Button
                key="delete"
                negative
                icon="trash"
                labelPosition="right"
                content="Delete"
                onClick={() => {
                  this.props.dispatch(actions.removeBlankSymbol());
                  this.props.dispatch(removeModal());
                }} />,
              <Button
                key="submit"
                positive
                icon="checkmark"
                labelPosition="right"
                content="Submit"
                onClick={() => {
                  const { value } = this.modalDropdown.state;
                  this.props.dispatch(actions.changeBlankSymbol(value));
                  this.props.dispatch(removeModal());
                }}/>,
            ]
          };
          break;
        }
        case modalTypes.ACCEPT_STATES_MODAL: {
          const states = this.props.automaton.states.toArray().sort();
          const acceptStates = this.props.automaton.acceptStates.toArray().sort();
          modalContents = {
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
              <Button
                key="cancel"
                content="Cancel"
                onClick={() => this.props.dispatch(removeModal())}/>,
              <Button
                key="submit"
                positive
                icon="checkmark"
                labelPosition="right"
                content="Submit"
                onClick={() => {
                  const value = this.modalDropdown.state.value;
                  this.props.dispatch(actions.setAcceptStates(value.sort()));
                  this.props.dispatch(removeModal());
                }}/>,
            ]
          };
          break;
        }
        case modalTypes.INPUT_ALPHABET_MODAL: {
          const inputAlphabet = this.props.automaton.inputAlphabet.toArray().sort();
          const inputAlphabetOptions = this.props.automaton.tapeAlphabet
            .remove(this.props.automaton.blankSymbol)
            .toArray()
            .sort();
          modalContents = {
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
              <Button
                key="cancel"
                content="Cancel"
                onClick={() => this.props.dispatch(removeModal())}/>,
              <Button
                key="submit"
                positive
                icon="checkmark"
                labelPosition="right"
                content="Submit"
                onClick={() => {
                  const value = this.modalDropdown.state.value;
                  this.props.dispatch(actions.setInputAlphabet(value.sort()));
                  this.props.dispatch(removeModal());
                }} />,
            ]
          };
        }
      }
      return (
        <div className={'main-container' + (this.props.settings.darkTheme ? ' main-container-dark-theme' : '')}>
          <div id="navbar" className="ui fixed inverted menu">
            <div className="ui container">
              <a onClick={() => browserHistory.push('/' + pageTypes.HOME_PAGE)} className="header item">
                <img className="logo" src={logo} alt="logo" />
                AutomaDraw
              </a>
              <Menu.Item name="FSM" onClick={() => browserHistory.push('/' + pageTypes.FSM_PAGE)} />
              <Menu.Item name="PDA" onClick={() => browserHistory.push('/' + pageTypes.PDA_PAGE)} />
              <Menu.Item name="TM" onClick={() => browserHistory.push('/' + pageTypes.TM_PAGE)} />
              <Menu.Item name="Regular Expression" onClick={() => browserHistory.push('/' + pageTypes.REGEX_PAGE)} />
              <Menu.Item className="ui simple dropdown item">
                Grammar <i className="dropdown icon"/>
                <div className="menu">
                  <a onClick={() => browserHistory.push('/' + pageTypes.UNRESTRICTED_PAGE)} className="item">
                    Recursively Enumerable
                  </a>
                  <a onClick={() => browserHistory.push('/' + pageTypes.CONTEXT_SENSITIVE_PAGE)} className="item">
                    Context-Sensitive
                  </a>
                  <a onClick={() => browserHistory.push('/' + pageTypes.CONTEXT_FREE_PAGE)} className="item">
                    Context-Free
                  </a>
                  <a onClick={() => browserHistory.push('/' + pageTypes.REGULAR_PAGE)} className="item">
                    Regular
                  </a>
                </div>
              </Menu.Item>
              <Menu.Menu position='right'>
                <Popup hoverable trigger={
                  <Menu.Item>
                    <Icon name="help circle"/> Help
                  </Menu.Item>
                }>
                  {this.props.popupText}
                </Popup>
                <Popup hoverable trigger={
                  <Menu.Item>
                    <Icon name="setting"/> Settings
                  </Menu.Item>
                }>
                  <SettingsPopup />
                </Popup>
              </Menu.Menu>
            </div>
          </div>

          {this.props.children}

          <Modal size='small' open={this.props.modalType !== null} onClose={() => this.props.dispatch(removeModal())}>
            <Modal.Header>
              {this.props.modalType ? modalContents.header : null}
            </Modal.Header>
            <Modal.Content>
              {this.props.modalType ? modalContents.body : null}
            </Modal.Content>
            <Modal.Actions>
              {this.props.modalType ? modalContents.actions : null}
            </Modal.Actions>
          </Modal>

        </div>
      );
    } else {
      return <MobileSite />;
    }
  }
}

export default connect(
  state => {
    const pageType = getPageType();
    return {
      automaton: getAutomaton(state, pageType),
      automatonType: pageType,
      modalType: getModalType(state),
      settings: getSettings(state)
    };
  }
)(App);