import React, { Component } from 'react'
import { connect } from 'react-redux'
import { increaseCount } from '../actions/count'
import { getCount } from '../selectors/count'
import { Button } from 'semantic-ui-react'

export class HomePage extends Component {
  constructor(props) {
    super(props);

    this.increaseCount = this.increaseCount.bind(this);
  }

  increaseCount() {
    this.props.dispatch(increaseCount());
  }

  render() {
    return (
      <div className="content-container">
        <div className="control-panel-left">
          <Button onClick={this.increaseCount}>Increase count: {this.props.count}</Button>
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
  state => ({
    count: getCount(state)
  })
)(HomePage);