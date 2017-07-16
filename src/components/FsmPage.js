import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Icon } from 'semantic-ui-react'
import { changeFsmName, changeFsmStates, changeFsmAlphabet } from '../actions/fsm'
import { getFsm } from '../selectors/fsm'

import EditableTextField from './EditableTextField'

export class FsmPage extends Component {
  render() {
    return (
      <div className="content-container">
        <div className="control-panel-left">
          <h2 className="control-panel-text">
            <EditableTextField
              value={this.props.fsm.name}
              onChange={name => this.props.dispatch(changeFsmName(name))} />
          </h2>
          <div className="control-panel-text">
            <span>Q: {this.props.fsm.states}</span>
            {/*<EditableTextField
              value={this.props.fsm.states}
              onChange={states => this.props.dispatch(changeFsmStates(states))} />*/}
          </div>
          <div className="control-panel-text">
            <span>&Sigma;: {this.props.fsm.alphabet}</span>
            {/*<EditableTextField
              value={this.props.fsm.alphabet}
              onChange={alphabet => this.props.dispatch(changeFsmAlphabet(alphabet))} />*/}
          </div>
        </div>
        <div className="center-container">
        </div>
        <div className="control-panel-right">
          <div className="control-panel-text">
            <h4>Click on a state to make it's properties appear here!</h4>
          </div>
        </div>
      </div>
    );
  }
}

export default connect(
  state => ({
    fsm: getFsm(state)
  })
)(FsmPage);