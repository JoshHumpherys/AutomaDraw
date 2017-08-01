import React, { Component } from 'react'
import { connect } from 'react-redux'
import { changeFsmName, moveStatePosition, addState, selectState, changeStateName, deleteState } from '../actions/fsm'
import { getFsm } from '../selectors/fsm'
import { arrayToString, transitionFunctionsToTable } from '../utility/utility'
import interact from 'interactjs'
import $ from 'jquery'
import { Button, Icon } from 'semantic-ui-react'

import EditableTextField from './EditableTextField'

export class FsmPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      ctrlKey: false, // TODO this might not be true
      draggedElement: null,
      ctrlReleasedDuringDrag: false,
      placingNewState: false
    };

    this.getStateRefName = this.getStateRefName.bind(this);
    this.centerContainerMouseDown = this.centerContainerMouseDown.bind(this);
    this.centerContainerMouseUp = this.centerContainerMouseUp.bind(this);
    this.centerContainerKeyDown = this.centerContainerKeyDown.bind(this);
    this.centerContainerKeyUp = this.centerContainerKeyUp.bind(this);
    this.getMouseCoordsRelativeToContainer = this.getMouseCoordsRelativeToContainer.bind(this);
    this.setElementPosition = this.setElementPosition.bind(this);
    this.updateStatePositions = this.updateStatePositions.bind(this);
  }

  getStateRefName(state) {
    return 'state_' + state;
  }

  centerContainerMouseDown(e) {
    if(e.target === this.centerContainer && this.state.draggedElement === null) {
      this.setState({ placingNewState: true });
    }
  }

  centerContainerMouseUp(e) {
    if(this.state.placingNewState) {
      const { x, y } = this.getMouseCoordsRelativeToContainer(e);

      const getNextStateName = states => {
        if(states.length === 0) {
          return 'A';
        }
        const lastState = states
          .map(state => state.toUpperCase())
          .reduce((max, value) => {
            if(value.length > max.length) {
              return value;
            } else if(max.length > value.length) {
              return max;
            }
            return value > max ? value : max;
          }, states[0]);
        const getNextChar = char => String.fromCharCode(((char.charCodeAt() - 65 + 1) % 26 + 26) % 26 + 65);
        const setChar = (string, char, i) => string.substring(0, i) + char + string.slice(i + 1);
        let nextState = lastState;
        for(let i = nextState.length - 1; i >= 0; i--) {
          if(nextState.charAt(i) !== 'Z') {
            nextState = setChar(nextState, getNextChar(nextState.charAt(i)), i);
            break;
          }
          nextState = setChar(nextState, 'A', i);
          if(i === 0) {
            nextState = 'A' + nextState;
          }
        }
        return nextState;
      };

      this.props.dispatch(addState(getNextStateName(this.props.fsm.states), x, y));
      this.setState({ placingNewState: false });
    }
  }

  centerContainerKeyDown(e) {
    if(e.ctrlKey && !this.state.ctrlKey) {
      this.props.fsm.states.forEach(state => $(this[this.getStateRefName(state)]).addClass('draggable'));
      this.setState({ ctrlKey: e.ctrlKey });
      $('body').css('cursor', 'move');
    }
  }

  centerContainerKeyUp(e) {
    if(!e.ctrlKey && this.state.ctrlKey) {
      this.props.fsm.states.forEach(state => $(this[this.getStateRefName(state)]).removeClass('draggable'));
      this.setState({ ctrlKey: e.ctrlKey });
      $('body').css('cursor', 'default');
    }
  }

  getMouseCoordsRelativeToContainer(event) {
    // TODO remove fudge factor for centering state on mouse position
    const x = event.pageX - $(this.centerContainer).offset().left - 20;
    const y = event.pageY - $(this.centerContainer).offset().top - 20;
    return { x, y };
  }

  setElementPosition(element, x, y) {
    element.style.webkitTransform = element.style.transform = `translate(${x}px, ${y}px)`;
    element.setAttribute('data-x', x);
    element.setAttribute('data-y', y);
  }

  updateStatePositions() {
    if(this.state.draggedElement === null) {
      this.props.fsm.states.forEach(state => {
        const element = this[this.getStateRefName(state)];
        const position = this.props.fsm.statePositions[state];
        this.setElementPosition(element, position.x, position.y);
      });
    }
  }

  componentDidUpdate() {
    this.updateStatePositions();
  }

  componentDidMount() {
    interact('.state')
      .draggable({
        // TODO enable this and fix associated bugs
        // (i.e., picking up a state while another is still moving)
        // inertia: true,
        restrict: {
          restriction: "parent",
          endOnly: true,
          elementRect: { top: 0, left: 0, bottom: 1, right: 1 }
        },
        onstart: e => {
          if(e.ctrlKey) {
            this.setState({ draggedElement: e.target });
          }
        },
        onmove: e => {
          const target = this.state.draggedElement;
          if(target !== null) {
            const { x, y } = this.getMouseCoordsRelativeToContainer(e);
            const state = target.innerHTML;

            if(this.state.ctrlReleasedDuringDrag === false) {
              if(e.ctrlKey) {
                this.setElementPosition(target, x, y);
              } else {
                this.setState({ ctrlReleasedDuringDrag: true });
                this.props.dispatch(moveStatePosition(state, x, y));
              }
            }
          }
        },
        onend: e => {
          const target = this.state.draggedElement;
          if(target !== null) {
            if(this.state.ctrlReleasedDuringDrag === false) {
              const {x, y} = this.getMouseCoordsRelativeToContainer(e);
              this.props.dispatch(moveStatePosition(target.innerHTML, x, y));
            }
            this.setState({ draggedElement: null, ctrlReleasedDuringDrag: false });
          }
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
             onMouseDown={this.centerContainerMouseDown}
             onMouseUp={this.centerContainerMouseUp}
             ref={element => this.centerContainer = element}
             onKeyDown={this.centerContainerKeyDown}
             onKeyUp={this.centerContainerKeyUp}
             onMouseMove={e => e.target.focus()}
             tabIndex="0"> {/* TODO figure out why tabIndex attribute is required for onKeyDown to fire */}
          {this.props.fsm.states.map(state => (
            <div
              className="state"
              ref={element => this[this.getStateRefName(state)] = element}
              onMouseDown={() => this.props.dispatch(selectState(state))}
            >{state}</div>
          ))}
        </div>
        <div className="control-panel-right">
          <div className="control-panel-text">
            {
              this.props.fsm.selected ? (
                <div>
                  <h2 className="control-panel-text">
                    <EditableTextField
                      value={this.props.fsm.selected}
                      onChange={name => this.props.dispatch(changeStateName(this.props.fsm.selected, name))}/>
                  </h2>
                  <Button onClick={() => this.props.dispatch(deleteState(this.props.fsm.selected))}>
                    Delete <Icon name="trash" className="clickable-icon" />
                  </Button>
                </div>
              ) : (
                <h4>Click on a state to make its properties appear here!</h4>
              )
            }
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