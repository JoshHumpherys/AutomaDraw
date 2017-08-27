import React, { Component } from 'react'
import { connect } from 'react-redux'
import { getPda } from '../selectors/pda'
import AutomataPage from './AutomataPage'

export class PdaPage extends Component {
  render() {
    return <AutomataPage />;
  }
}

export default connect(
  state => ({
    pda: getPda(state)
  })
)(PdaPage);