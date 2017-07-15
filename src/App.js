import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

class App extends Component {
  render() {
    return (
      <div>
        <div className="ui fixed inverted menu">
          <div className="ui container">
            <a href="#" className="header item">
              <img className="logo" src={logo} />
              AutomaDraw
            </a>
            <a href="#" className="item">Home</a>
            <div className="ui simple dropdown item">
              Dropdown <i className="dropdown icon"></i>
              <div className="menu">
                <a className="item" href="#">Link Item</a>
                <a className="item" href="#">Link Item</a>
                <div className="divider"></div>
                <div className="header">Header Item</div>
                <div className="item">
                  <i className="dropdown icon"></i>
                    Sub Menu
                  <div className="menu">
                    <a className="item" href="#">Link Item</a>
                    <a className="item" href="#">Link Item</a>
                  </div>
                </div>
                <a className="item" href="#">Link Item</a>
              </div>
            </div>
          </div>
        </div>

        <div className="ui main text container">
          <h1 className="ui header">Semantic UI Fixed Template</h1>
          <p>This is a basic fixed menu template using fixed size containers.</p>
          <p>A text container is used for the main container, which is useful for single column layouts</p>
        </div>
      </div>
    );
  }
}

export default App;
