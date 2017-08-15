import React, { Component } from 'react'
import { connect } from 'react-redux'
import logo from './logo.svg'
import './index.css'
import { getSettings } from './selectors/settings'
import { isMobileBrowser } from './utility/utility'
import MobileSite from './components/MobileSite'
import { browserHistory } from 'react-router'
import { Icon, Menu, Popup } from 'semantic-ui-react'

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
              <Menu.Item name="FSM" onClick={() => browserHistory.push('/fsm')} />
              <Menu.Item name="PDA" onClick={() => browserHistory.push('/pda')} />
              <Menu.Item name="TM" onClick={() => browserHistory.push('/tm')} />
              <Menu.Item name="Regular Expression" onClick={() => browserHistory.push('/regex')} />
              <Menu.Item className="ui simple dropdown item">
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
              </Menu.Item>
              <Menu.Menu position='right'>
                <Popup hoverable trigger={
                  <Menu.Item>
                    <Icon name="help circle"/> Help
                  </Menu.Item>
                }>
                  <p>
                    A finite-state machine (FSM) is a mathematical model of computation. It is an abstract machine that can be in exactly one of a finite number of states at any given time. The FSM can change from one state to another in response to some external inputs. An FSM is defined by a list of its states, its initial state, and the conditions for each transition.
                    <br />
                    <br />
                    Click on the background to add a state, drag a state to move it, or right click on a state for more options.
                    <br />
                    <br />
                    <a href="https://en.wikipedia.org/wiki/Finite-state_machine" target="blank">
                      Click here for more information on finite state machines!
                    </a>
                  </p>
                </Popup>
              </Menu.Menu>
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