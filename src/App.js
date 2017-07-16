import React, { Component } from 'react'
import { connect } from 'react-redux'
import { getCount } from './selectors/count'
import logo from './logo.svg'
import './index.css'

export class App extends Component {
  render() {
    return (
      <div className="main-container">
        <div id="navbar" className="ui fixed inverted menu supercoolclass">
          <div className="ui container">
            <a href="#" className="header item">
              <img className="logo" src={logo} />
              AutomaDraw
            </a>
            <a href="#" className="item">FSM</a>
            <a href="#" className="item">PDA</a>
            <a href="#" className="item">TM</a>
            <a href="#" className="item">Regular Expression</a>
            <div className="ui simple dropdown item">
              Grammar <i className="dropdown icon" />
              <div className="menu">
                <a className="item" href="#">Recursively Enumerable</a>
                <a className="item" href="#">Context-Sensitive</a>
                <a className="item" href="#">Context-Free</a>
                <a className="item" href="#">Regular</a>
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
    count: getCount(state)
  })
)(App);