import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Button, Icon, Message } from 'semantic-ui-react'

export class HomePage extends Component {
  render() {
    return (
      <div className="page-container">
        <Message>
          <Message.Header>
            Welcome to AutomaDraw!
          </Message.Header>
          <p>
            This is an application used to model and analyze finite automata and formal grammars. It was initially
            developed in 2017 by Josh Humpherys as part of his Senior Integration Project for Covenant College, but it
            is still undergoing development.
          </p>
          <p>
            The application currently supports modeling and running finite state machines, pushdown automata, and Turing
            machines. Automata can be downloaded into special files so that they can be shared with others or uploaded
            later. Similarly, test cases can be created and downloaded so they can be shared or resused across sessions.
            There exists a simple regular expressions page that has buttons for special symbols such as the empty
            symbol, alternation symbol, and Kleene star, and there are settings to change these symbols,
            as well as to switch between a light theme and a dark theme.
          </p>
          <p>
            Despite a substantial feature set, there is always more that can be added. Regular expressions can be
            entered but not tested. There only exist stub pages for modeling grammars, and in the future it would be
            nice to be able to convert back and forth between grammars and automata. Also, the site performs poorly on
            mobile devices and is not compatible with touch screens. Nonetheless, the program is a great tool to model
            and test various types of automata!
          </p>
          <p>
            The project is open source, so feel free to contribute!
          </p>
        </Message>
        <Button onClick={() => window.open('https://github.com/JoshHumpherys/AutomaDraw')}>
          <Icon name="github" size="big" className="clickable-icon" />GitHub!
        </Button>
      </div>
    );
  }
}

export default connect(
  state => ({})
)(HomePage);