import React, { Component } from 'react'

export class HomeHelp extends Component {
  render() {
    return (
      <p>
        Click on a menu item to get started!
        <br />
        <br />
        This application contains tools for modeling and analyzing finite state machines, pushdown automata, Turing machines, regular expressions, and the four types of formal grammars in the Chomsky hierarchy.
      </p>
    );
  }
}

export class FsmHelp extends Component {
  render() {
    return (
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
    );
  }
}

export class PdaHelp extends Component {
  render() {
    return (
      <p>This page hasn't been created yet!</p>
    );
  }
}

export class TmHelp extends Component {
  render() {
    return (
      <p>This page hasn't been created yet!</p>
    );
  }
}

export class RegexHelp extends Component {
  render() {
    return (
      <p>This page hasn't been created yet!</p>
    );
  }
}

export class UnrestrictedHelp extends Component {
  render() {
    return (
      <p>This page hasn't been created yet!</p>
    );
  }
}

export class ContextSensitiveHelp extends Component {
  render() {
    return (
      <p>This page hasn't been created yet!</p>
    );
  }
}

export class ContextFreeHelp extends Component {
  render() {
    return (
      <p>This page hasn't been created yet!</p>
    );
  }
}

export class RegularHelp extends Component {
  render() {
    return (
      <p>This page hasn't been created yet!</p>
    );
  }
}