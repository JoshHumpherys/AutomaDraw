import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Message } from 'semantic-ui-react'

export class HomePage extends Component {render() {
    return (
      <div className="page-container">
        <Message>
          <Message.Header>
            Welcome to AutomaDraw!
          </Message.Header>
          <p>
            Here is some placeholder text that will eventually be a description of the application.
          </p>
        </Message>
      </div>
    );
  }
}

export default connect(
  state => ({})
)(HomePage);