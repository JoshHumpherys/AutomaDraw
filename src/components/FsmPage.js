import React, { Component } from 'react'
import { connect } from 'react-redux'

export class FsmPage extends Component {
  render() {
    return (
      <div className="content-container">
        <div className="control-panel-left">
          left panel
        </div>
        <div className="center-container">
        </div>
        <div className="control-panel-right">
          right panel
        </div>
      </div>
    );
  }
}

export default connect(
  state => ({})
)(FsmPage);