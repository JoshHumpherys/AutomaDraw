import React, { Component } from 'react'
import { connect } from 'react-redux'
import {
  changeFsmName,
  moveStatePosition,
  addState,
  selectState,
  changeStateName,
  deleteState,
  changeInitialState,
  removeInitialState,
  addAcceptState,
  removeAcceptState
} from '../actions/fsm'
import { getFsm } from '../selectors/fsm'
import { arrayToString, transitionFunctionsToTable } from '../utility/utility'
import interact from 'interactjs'
import $ from 'jquery'
import { Button, Checkbox, Icon } from 'semantic-ui-react'

import EditableTextField from './EditableTextField'
import TransitionPopup from './TransitionPopup'

export class FsmPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      ctrlKey: false, // TODO this might not be true
      draggedElement: null,
      ctrlReleasedDuringDrag: false,
      placingNewState: false,
      transitionPopupState: null,
      transitionPopupLetter: null,
      transitionPopup: false
    };

    this.getStateRefName = this.getStateRefName.bind(this);
    this.getTransitionLineRefName = this.getTransitionLineRefName.bind(this);
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

  getTransitionLineRefName(state1, transition, state2) {
    return 'transition_' + state1 + '_' + transition + '_' + state2;
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

      const name = getNextStateName(this.props.fsm.states);
      this.props.dispatch(addState(name, x, y));
      this.props.dispatch(selectState(name));
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
    const transitions = this.props.fsm.transitionFunctions[element.innerHTML];
    if(transitions !== undefined) {
      Object.keys(transitions).forEach(transition => {
        const line = this[this.getTransitionLineRefName(element.innerHTML, transition, transitions[transition])];
        line.setAttribute('x1', x + 20);
        line.setAttribute('y1', y + 20);
      });
    }
    Object.keys(this.props.fsm.transitionFunctions).forEach(state =>
      Object.keys(this.props.fsm.transitionFunctions[state]).forEach(transition => {
        if(this.props.fsm.transitionFunctions[state][transition] === element.innerHTML) {
          const line = this[this.getTransitionLineRefName(state, transition, element.innerHTML)];
          line.setAttribute('x2', x + 20);
          line.setAttribute('y2', y + 20);
        }
      })
    );
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
    const transitionTable = transitionFunctionsToTable(
      this.props.fsm.states,
      this.props.fsm.alphabet,
      this.props.fsm.transitionFunctions
    );

    const createTransitionTable = () => {
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
                  {
                    transitionTable[i]
                      ? transitionTable[i].map((s, j) =>
                        <td onClick={() => this.setState({
                            transitionPopup: true,
                            transitionPopupState: state,
                            transitionPopupLetter: this.props.fsm.alphabet[j]
                        })}>{s}</td>)
                      : <td />
                  }
                </tr>
              ))
            }
          </tbody>
        </table>
      );
    };

    const createSingleStateTransitionTable = () => {
      return (
        <table className="transition-table">
          <tbody>
          {
            this.props.fsm.alphabet.map((letter, i) => (
              <tr>
                <td>{letter}</td>
                <td onClick={() => this.setState({
                  transitionPopup: true,
                  transitionPopupState: this.props.fsm.selected,
                  transitionPopupLetter: letter
                })}>{
                  transitionTable
                    [this.props.fsm.states.indexOf(this.props.fsm.selected)]
                    [this.props.fsm.alphabet.indexOf(letter)]
                }</td>
              </tr>
            ))
          }
          </tbody>
        </table>
      );
    };

    const popupContents = this.state.transitionPopup ? (
      <TransitionPopup
        state={this.state.transitionPopupState}
        letter={this.state.transitionPopupLetter}
        closePopup={() => this.setState({
          transitionPopup: false,
          transitionPopupState: null,
          transitionPopupLetter: null
        })}/>
    ) : null;

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
           <div className={'popup' + (this.state.transitionPopup ? '' : ' popup-hidden')}>
             {popupContents}
           </div>
          {this.props.fsm.states.map(state => (
            <div
              className={'state' + (state === this.props.fsm.selected ? ' selected-state' : '')}
              ref={element => this[this.getStateRefName(state)] = element}
              onMouseDown={() => this.props.dispatch(selectState(state))}
              onDoubleClick={() => alert(state)}
            >{state}</div>
          ))}
          <svg xmlns="http://www.w3.org/2000/svg" id="arrows-svg">
            <defs>
              <marker id="arrowhead" markerWidth="10" markerHeight="7"
                      refX="10" refY="3.5" orient="auto">
                <polygon points="0 0, 10 3.5, 0 7" />
              </marker>
            </defs>
            {
              this.props.fsm.states.map(state =>
                Object.keys(this.props.fsm.transitionFunctions[state] || {}).map(transition => {
                  const toState = this.props.fsm.transitionFunctions[state][transition];
                  return (
                    <line
                      x1={this.props.fsm.statePositions[state].x + 20}
                      y1={this.props.fsm.statePositions[state].y + 20}
                      x2={this.props.fsm.statePositions[toState].x + 20}
                      y2={this.props.fsm.statePositions[toState].y + 20}
                      stroke="#000" strokeWidth="2"
                      markerEnd="url(#arrowhead)"
                      ref={line =>
                        this[this.getTransitionLineRefName(state, transition, toState)] = line}
                    />
                  );
                }
                )
              )
            }
          </svg>
        </div>
        {
          this.props.fsm.selected ? (
            <div className="control-panel-right">
              <h2 className="control-panel-text">
                <EditableTextField
                  value={this.props.fsm.selected}
                  onChange={name => this.props.dispatch(changeStateName(this.props.fsm.selected, name))}/>
              </h2>
              <h4 className="control-panel-text">
                <Checkbox
                  id="initial-state-checkbox"
                  label="Initial State"
                  key={this.props.fsm.selected}
                  defaultChecked={this.props.fsm.initialState === this.props.fsm.selected}
                  onChange={(e, value) => {
                    this.props.dispatch(
                      value.checked ? changeInitialState(this.props.fsm.selected) : removeInitialState()
                    );
                  }} />
              </h4>
              <h4 className="control-panel-text">
                <Checkbox
                  id="accept-state-checkbox"
                  label="Accept State"
                  key={this.props.fsm.selected}
                  defaultChecked={this.props.fsm.acceptStates.includes(this.props.fsm.selected)}
                  onChange={(e, value) => {
                    const { selected } = this.props.fsm;
                    this.props.dispatch(
                      value.checked ? addAcceptState(selected) : removeAcceptState(selected)
                    );
                  }} />
              </h4>
              <h4 className="control-panel-text">
                {createSingleStateTransitionTable()}
              </h4>
              <h4 className="control-panel-text">
                <Button onClick={() => this.props.dispatch(deleteState(this.props.fsm.selected))}>
                  Delete <Icon name="trash" className="clickable-icon" />
                </Button>
              </h4>
            </div>
          ) : (
            <div className="control-panel-text">
              <h4>Click on a state to make its properties appear here!</h4>
            </div>
          )
        }
      </div>
    );
  }
}

export default connect(
  state => ({
    fsm: getFsm(state)
  })
)(FsmPage);