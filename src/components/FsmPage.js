import React, { Component } from 'react'
import { connect } from 'react-redux'
import { changeFsmName } from '../actions/fsm'
import { getFsm } from '../selectors/fsm'
import { arrayToString, transitionFunctionsToTable } from '../utility/utility'
import { Table } from 'semantic-ui-react'

import EditableTextField from './EditableTextField'

export class FsmPage extends Component {
  render() {
    const createTransitionTable = () => {
      let transitionTable = transitionFunctionsToTable(
        this.props.fsm.states,
        this.props.fsm.alphabet,
        this.props.fsm.transitionFunctions
      );

      return (
        <table className="transition-table">
          <thead>
            <tr>
              <td>Q x &Sigma;</td>
              {this.props.fsm.alphabet.map(letter => <td>{letter}</td>)}
            </tr>
          </thead>
          <tbody>
            {
              this.props.fsm.states.map((state, i) => (
                <tr>
                  <td>{state}</td>
                  {transitionTable[i].map(s => <td>{s}</td>)}
                </tr>
              ))
            }
          </tbody>
        </table>
      );
    };

    return (
      <div className="content-container">
        <div className="control-panel-left">
          <h2 className="control-panel-text">
            <EditableTextField
              value={this.props.fsm.name}
              onChange={name => this.props.dispatch(changeFsmName(name))} />
          </h2>
          <div className="control-panel-text">
            <span>Q: {arrayToString(this.props.fsm.states)}</span>
          </div>
          <div className="control-panel-text">
            <span>&Sigma;: {arrayToString(this.props.fsm.alphabet)}</span>
          </div>
          <div className="control-panel-text">
            <span>&delta;: </span>
            {createTransitionTable()}
          </div>
          <div className="control-panel-text">
            <span>q&#8320;: {this.props.fsm.initialState}</span>
          </div>
          <div className="control-panel-text">
            <span>F: {arrayToString(this.props.fsm.acceptStates)}</span>
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