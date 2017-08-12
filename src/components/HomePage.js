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
            This is an application used to model and analyze finite automata and formal grammars.
            It is currently under development, and as such is highly under-featured and may not work properly at times.
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