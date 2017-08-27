import React, { Component } from 'react'
import { connect } from 'react-redux'
import { getTm } from '../selectors/tm'
import AutomataPage from './AutomataPage'

export class TmPage extends Component {
  render() {
    return <AutomataPage />;
  }
}

export default connect(
  state => ({
    tm: getTm(state)
  })
)(TmPage);