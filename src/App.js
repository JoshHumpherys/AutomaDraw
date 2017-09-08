import React, { Component } from 'react'
import { connect } from 'react-redux'
import logo from './logo.svg'
import './index.css'
import { getSettings } from './selectors/settings'
import { isMobileBrowser, getPageType } from './utility/utility'
import MobileSite from './components/MobileSite'
import { browserHistory } from 'react-router'
import { Icon, Menu, Modal, Popup } from 'semantic-ui-react'
import SettingsPopup from './components/SettingsPopup'
import { removeModal } from './actions/modal'
import { getModalType, getModalState } from './selectors/modal'
import { getAutomaton } from './selectors/automaton'
import * as pageTypes from './constants/pageTypes'
import generateModalContents from './components/generateModalContents'

export class App extends Component {
  render() {
    if(!isMobileBrowser()) {
      const modalContents = generateModalContents(
        this.props.automaton,
        this.props.modalState,
        this.props.modalType,
        this.props.automatonType,
        this.props.dispatch
      );
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
      modalState: getModalState(state),
      settings: getSettings(state)
    };
  }
)(App);