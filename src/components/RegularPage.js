import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Button, Icon, Message } from 'semantic-ui-react'

export class RegularPage extends Component {
  render() {
    return (
      <div className="page-container">
        <Message>
          <Message.Header>
            Regular grammars are under construction!
          </Message.Header>
          <p>
            We're actively working to implement all of the intended features.
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
)(RegularPage);