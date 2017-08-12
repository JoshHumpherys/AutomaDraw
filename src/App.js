import React, { Component } from 'react'
import { connect } from 'react-redux'
import logo from './logo.svg'
import './index.css'
import { getSettings } from './selectors/settings'

export class App extends Component {
  render() {
    return (
      <div className={'main-container' + (this.props.settings.darkTheme ? ' main-container-dark-theme' : '')}>
        <div id="navbar" className="ui fixed inverted menu">
          <div className="ui container">
            <a href="/" className="header item">
              <img className="logo" src={logo} />
              AutomaDraw
            </a>
            <a href="fsm" className="item">FSM</a>
            <a href="pda" className="item">PDA</a>
            <a href="tm" className="item">TM</a>
            <a href="regex" className="item">Regular Expression</a>
            <div className="ui simple dropdown item">
              Grammar <i className="dropdown icon" />
              <div className="menu">
                <a href="unrestricted" className="item">Recursively Enumerable</a>
                <a href="contextsensitive" className="item">Context-Sensitive</a>
                <a href="contextfree" className="item">Context-Free</a>
                <a href="regular" className="item">Regular</a>
              </div>
            </div>
          </div>
        </div>

        {this.props.children}

      </div>
    );
  }
}

export default connect(
  state => ({
    settings: getSettings(state)
  })
)(App);