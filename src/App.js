import React, { Component } from 'react'
import { connect } from 'react-redux'
import logo from './logo.svg'
import './index.css'
import { getSettings } from './selectors/settings'
import { isMobileBrowser } from './utility/utility'
import MobileSite from './components/MobileSite'
import { browserHistory } from 'react-router'

export class App extends Component {
  render() {
    if(!isMobileBrowser()) {
      return (
        <div className={'main-container' + (this.props.settings.darkTheme ? ' main-container-dark-theme' : '')}>
          <div id="navbar" className="ui fixed inverted menu">
            <div className="ui container">
              <a onClick={() => browserHistory.push('/')} className="header item">
                <img className="logo" src={logo}/>
                AutomaDraw
              </a>
              <a onClick={() => browserHistory.push('/fsm')} className="item">FSM</a>
              <a onClick={() => browserHistory.push('/pda')} className="item">PDA</a>
              <a onClick={() => browserHistory.push('/tm')} className="item">TM</a>
              <a onClick={() => browserHistory.push('/regex')} className="item">Regular Expression</a>
              <div className="ui simple dropdown item">
                Grammar <i className="dropdown icon"/>
                <div className="menu">
                  <a onClick={() => browserHistory.push('/unrestricted')} className="item">
                    Recursively Enumerable
                  </a>
                  <a onClick={() => browserHistory.push('/contextsensitive')} className="item">
                    Context-Sensitive
                  </a>
                  <a onClick={() => browserHistory.push('/contextfree')} className="item">
                    Context-Free
                  </a>
                  <a onClick={() => browserHistory.push('/regular')} className="item">
                    Regular
                  </a>
                </div>
              </div>
            </div>
          </div>

          {this.props.children}

        </div>
      );
    } else {
      return <MobileSite />;
    }
  }
}

export default connect(
  state => ({
    settings: getSettings(state)
  })
)(App);