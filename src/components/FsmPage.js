import React, { Component } from 'react'
import { connect } from 'react-redux'
import { changeFsmName, moveStatePosition, addState } from '../actions/fsm'
import { getFsm } from '../selectors/fsm'
import { arrayToString, transitionFunctionsToTable } from '../utility/utility'
import interact from 'interactjs'
import $ from 'jquery'

import EditableTextField from './EditableTextField'

export class FsmPage extends Component {
  constructor(props) {
    super(props);

    this.getStateRefName = this.getStateRefName.bind(this);
    this.centerContainerClicked = this.centerContainerClicked.bind(this);
    this.setElementPosition = this.setElementPosition.bind(this);
    this.updateStatePositions = this.updateStatePositions.bind(this);
  }

  getStateRefName(state) {
    return 'state_' + state;
  }

  centerContainerClicked(e) {
    if(e.target === this.centerContainer) {
      const x = e.pageX - $(this.centerContainer).offset().left;
      const y = e.pageY - $(this.centerContainer).offset().top;

      // TODO remove fudge factor for centering state on mouse position
      // TODO name state something reasonable (this is done temporarily to avoid naming conflicts but no guarantees)
      let state = "";
      const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
      for(let i = 0; i < 3; i++) {
        state += chars.charAt(Math.floor(Math.random() * chars.length));
      }
      this.props.dispatch(addState(state, x - 20, y - 20));
    }
  }

  setElementPosition (element, x, y) {
    element.style.webkitTransform = element.style.transform = `translate(${x}px, ${y}px)`;
    element.setAttribute('data-x', x);
    element.setAttribute('data-y', y);
  };

  updateStatePositions() {
    this.props.fsm.states.forEach(state => {
      const element = this[this.getStateRefName(state)];
      const position = this.props.fsm.statePositions[state];
      this.setElementPosition(element, position.x, position.y);
    });
  }

  componentDidUpdate() {
    this.updateStatePositions();
  }

  componentDidMount() {
    interact('.state')
      .draggable({
        inertia: true,
        restrict: {
          restriction: "parent",
          endOnly: true,
          elementRect: { top: 0, left: 0, bottom: 1, right: 1 }
        },
        onmove: event => {
          const x = (parseFloat(event.target.getAttribute('data-x')) || 0) + event.dx;
          const y = (parseFloat(event.target.getAttribute('data-y')) || 0) + event.dy;

          this.setElementPosition(event.target, x, y);
        },
        onend: event => {
          const x = (parseFloat(event.target.getAttribute('data-x')) || 0);
          const y = (parseFloat(event.target.getAttribute('data-y')) || 0);
          this.props.dispatch(moveStatePosition(event.target.innerHTML, x, y));
        }
      });

    this.updateStatePositions();
  }

  render() {
    const createTransitionTable = () => {
      const transitionTable = transitionFunctionsToTable(
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
                  {transitionTable[i] ? transitionTable[i].map(s => <td>{s}</td>) : <td />}
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
        <div className="center-container"
             onClick={this.centerContainerClicked}
             ref={element => this.centerContainer = element}>
          {this.props.fsm.states.map(state => (
            <div className="state" ref={element => this[this.getStateRefName(state)] = element}>{state}</div>
          ))}
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