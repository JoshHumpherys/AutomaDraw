import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Button, Icon, Message } from 'semantic-ui-react'
import { getSettings } from '../selectors/settings'

export class MobileSite extends Component {
  render() {
    return (
      <div className={'main-container' + (this.props.settings.darkTheme ? ' main-container-dark-theme' : '')}>
        <div className="page-container">
          <Message>
            <Message.Header>
              Mobile sites are unsupported
            </Message.Header>
            <p>
              We apologize for the inconvenience, but mobile sites are not currently supported.
              We hope to add limited mobile functionality in the future!
            </p>
            <p>
              The project is open source, so feel free to contribute!
            </p>
          </Message>
          <Button onClick={() => window.open('https://github.com/JoshHumpherys/AutomaDraw')} style={{ width: '100%' }}>
            <Icon name="github" size="big" className="clickable-icon" />GitHub!
          </Button>
        </div>
      </div>
    );
  }
}

export default connect(
  state => ({
    settings: getSettings(state)
  })
)(MobileSite);