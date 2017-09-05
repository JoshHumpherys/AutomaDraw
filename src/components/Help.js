import React, { Component } from 'react'

export class HomeHelp extends Component {
  render() {
    return (
      <p>
        This website contains tools for modeling and analyzing finite state machines, pushdown automata, Turing machines, regular expressions, and the four types of formal grammars in the Chomsky hierarchy.
        <br />
        <br />
        Click on a menu item to get started!
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
      <p>
        A pushdown automaton (PDA) is a type of automaton that employs a stack. Given an input symbol, current state, and stack symbol, a pushdown automaton can follow a transition to another state, and optionally manipulate (push or pop) the stack. Pushdown automata are more capable than finite-state machines but less capable than Turing machines.
        <br />
        <br />
        Click on the background to add a state, drag a state to move it, or right click on a state for more options.
        <br />
        <br />
        <a href="https://en.wikipedia.org/wiki/Pushdown_automaton" target="blank">
          Click here for more information on pushdown automata!
        </a>
      </p>

    );
  }
}

export class TmHelp extends Component {
  render() {
    return (
      <p>
        A Turing machine (TM) is a mathematical model of computation that defines an abstract machine which manipulates symbols on an infinite strip of tape divided into discrete cells according to a table of rules. For each transition, it positions its head over a cell to obtain an input symbol. Given an input symbol and the current state, a Turing machine follows a transition to a state, writes a symbol in the current cell, moves its head either right or left, and optionally halts the computation.
        <br />
        <br />
        Click on the background to add a state, drag a state to move it, or right click on a state for more options.
        <br />
        <br />
        <a href="https://en.wikipedia.org/wiki/Turing_machine" target="blank">
          Click here for more information on Turing machines!
        </a>
      </p>
    );
  }
}

export class RegexHelp extends Component {
  render() {
    return (
      <p>
        A regular expression (abbr. regex or regexp) is a sequence of characters that defines a search pattern or describes a regular language. Regular expressions consist of constants, which denote sets of strings, and operator symbols, which denote operations over these sets. The three basic operations are concatenation, alternation, and the Kleene star.
        <br />
        <br />
        Type in the textbox or click on the buttons to create a regular expression.
        <br />
        <br />
        <a href="https://en.wikipedia.org/wiki/Regular_expression" target="blank">
          Click here for more information on regular expressions!
        </a>
      </p>
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