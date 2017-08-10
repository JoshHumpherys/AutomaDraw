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
  removeAcceptState,
  addTransition,
  addLetter
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
      transitionPopupToState: null,
      transitionPopupLetter: null,
      transitionPopupFromState: null,
      transitionPopup: false,
      creatingTransition: false,
      creatingTransitionFromState: null
    };

    this.creatingTransitionLineRef = 'creating_transition_line_ref';

    this.getStateRefName = this.getStateRefName.bind(this);
    this.getTransitionLineRefName = this.getTransitionLineRefName.bind(this);
    this.getTransitionLineStartCoords = this.getTransitionLineStartCoords.bind(this);
    this.getTransitionLineEndCoords = this.getTransitionLineEndCoords.bind(this);
    this.centerContainerMouseDown = this.centerContainerMouseDown.bind(this);
    this.centerContainerMouseUp = this.centerContainerMouseUp.bind(this);
    this.centerContainerMouseMove = this.centerContainerMouseMove.bind(this);
    this.centerContainerKeyDown = this.centerContainerKeyDown.bind(this);
    this.centerContainerKeyUp = this.centerContainerKeyUp.bind(this);
    this.stateMouseUp = this.stateMouseUp.bind(this);
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

  getTransitionLineStartCoords(coords) {
    return { x: coords.x + 20, y: coords.y + 20 };
  }

  getTransitionLineEndCoords(coords) {
    if(coords.x1 === coords.x2 && coords.y1 === coords.y2) {
      return { x: coords.x2 + 20, y: coords.y2 + 20 };
    }
    const r = Math.sqrt(Math.pow(coords.x2 - coords.x1, 2) + Math.pow(coords.y2 - coords.y1, 2));
    const offsetX = 23 * (coords.x2 - coords.x1) / r; // TODO why 23 instead of 22?
    const offsetY = 23 * (coords.y2 - coords.y1) / r;
    return { x: coords.x2 + 20 - offsetX, y: coords.y2 + 20 - offsetY };
  }

  startCreatingTransition(state) {
    this.setState({ creatingTransition: true, creatingTransitionFromState: state });
  }

  centerContainerMouseDown(e) {
    if(e.target === this.centerContainer && this.state.draggedElement === null && !this.state.creatingTransition) {
      // TODO evaluate if I need to store this in state because ctrl key is no longer required to drag state
      this.setState({ placingNewState: true });
    }
  }

  centerContainerMouseUp(e) {
    if(this.state.placingNewState && !this.state.creatingTransition) {
      const { x, y } = this.getMouseCoordsRelativeToContainer(e);

      const getNextStateName = states => {
        const statesArray = states.toArray();
        if(statesArray.length === 0) {
          return 'A';
        }
        const lastState = statesArray
          .map(state => state.toUpperCase())
          .reduce((max, value) => {
            if(value.length > max.length) {
              return value;
            } else if(max.length > value.length) {
              return max;
            }
            return value > max ? value : max;
          }, statesArray[0]);
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

    this.setState({ creatingTransition: false, creatingTransitionFromState: null });
  }

  centerContainerMouseMove(e) {
    e.target.focus();
    if(this.state.creatingTransition) {
      const line = this[this.creatingTransitionLineRef];
      const mouseCoords = this.getMouseCoordsRelativeToContainer(e);
      const endCoords = this.getTransitionLineStartCoords(mouseCoords); // TODO rename this function
      line.setAttribute('x2', endCoords.x);
      line.setAttribute('y2', endCoords.y);
    }
  }

  centerContainerKeyDown(e) {
    if(e.ctrlKey && !this.state.ctrlKey) {
      this.props.fsm.states.forEach(state => $(this[this.getStateRefName(state)]).addClass('draggable'));
      this.setState({ ctrlKey: e.ctrlKey });
      /*
      $('body').css('cursor', 'move');
      */
    }
  }

  centerContainerKeyUp(e) {
    if(!e.ctrlKey && this.state.ctrlKey) {
      this.props.fsm.states.forEach(state => $(this[this.getStateRefName(state)]).removeClass('draggable'));
      this.setState({ ctrlKey: e.ctrlKey });
      /*
      $('body').css('cursor', 'default');
      */
    }
  }

  stateMouseUp(e) {
    if(this.state.creatingTransition) {
      const getLetter = () => {
        // TODO make something better than a prompt
        const letter = prompt('What letter should be used for this transition?');
        if(letter !== null && letter.length !== 1) {
          return getLetter();
        }
        return letter;
      };
      const letter = getLetter();
      if(letter !== null) { // user clicked cancel
        if(!this.props.fsm.alphabet.contains(letter)) {
          this.props.dispatch(addLetter(letter));
        }
        this.props.dispatch(addTransition(this.state.creatingTransitionFromState, e.target.innerHTML, letter));
      }
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
    const transitions = this.props.fsm.transitionFunctions.get(element.innerHTML);
    if(transitions !== undefined) {
      for(const letter of transitions.keys()) {
        const line = this[this.getTransitionLineRefName(element.innerHTML, letter, transitions.get(letter))];
        const toStatePosition = this.props.fsm.statePositions.get(transitions.get(letter));
        const startCoords = this.getTransitionLineStartCoords({ x, y });
        const endCoords = this.getTransitionLineEndCoords({
          x1: x,
          y1: y,
          x2: toStatePosition.x,
          y2: toStatePosition.y
        });
        line.setAttribute('x1', startCoords.x);
        line.setAttribute('y1', startCoords.y);
        line.setAttribute('x2', endCoords.x);
        line.setAttribute('y2', endCoords.y);
      }
    }
    for(const [ state, transitions ] of this.props.fsm.transitionFunctions) {
      if(transitions) {
        for(const letter of transitions.keys()) {
          if(this.props.fsm.transitionFunctions.get(state).get(letter) === element.innerHTML) {
            const line = this[this.getTransitionLineRefName(state, letter, element.innerHTML)];
            const statePosition = this.props.fsm.statePositions.get(state);
            const coords = this.getTransitionLineEndCoords({
              x1: statePosition.x,
              y1: statePosition.y,
              x2: x,
              y2: y
            });
            line.setAttribute('x2', coords.x);
            line.setAttribute('y2', coords.y);
          }
        }
      }
    }
  }

  updateStatePositions() {
    if(this.state.draggedElement === null) {
      this.props.fsm.states.forEach(state => {
        const element = this[this.getStateRefName(state)];
        const position = this.props.fsm.statePositions.get(state);
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
          this.setState({ draggedElement: e.target });
          /*
          if(e.ctrlKey) {
            this.setState({ draggedElement: e.target });
          }
          */
        },
        onmove: e => {
          const target = this.state.draggedElement;
          if(target !== null) {
            const { x, y } = this.getMouseCoordsRelativeToContainer(e);
            const state = target.innerHTML;

            this.setElementPosition(target, x, y);
            /*
            if(this.state.ctrlReleasedDuringDrag === false) {
              if(e.ctrlKey) {
                this.setElementPosition(target, x, y);
              } else {
                this.setState({ ctrlReleasedDuringDrag: true });
                this.props.dispatch(moveStatePosition(state, x, y));
              }
            }
            */
          }
        },
        onend: e => {
          const target = this.state.draggedElement;
          if(target !== null) {
            const { x, y } = this.getMouseCoordsRelativeToContainer(e);
            this.props.dispatch(moveStatePosition(target.innerHTML, x, y));
            /*
            if(this.state.ctrlReleasedDuringDrag === false) {
              const { x, y } = this.getMouseCoordsRelativeToContainer(e);
              this.props.dispatch(moveStatePosition(target.innerHTML, x, y));
            }
            */
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
      const rows = [];
      for(const fromState of this.props.fsm.states.keys()) {
        const cols = [];
        cols.push(<td>{fromState}</td>);
        for(const letter of this.props.fsm.alphabet.keys()) {
          const toState = transitionTable[rows.length][cols.length - 1];
          cols.push(
            transitionTable[rows.length] ? (
              <td onClick={() => this.setState({
                transitionPopup: true,
                transitionPopupToState: toState,
                transitionPopupLetter: letter,
                transitionPopupFromState: fromState
              })}>{toState}</td>
            ) : (
              <td />
            )
          );
        }
        rows.push(
          <tr>
            {cols}
          </tr>
        );
      }

      return (
        <table className="transition-table">
          <thead>
            <tr>
              <td>Q x &Sigma;</td>
              {this.props.fsm.alphabet.map(letter => <td>{letter}</td>)}
            </tr>
          </thead>
          <tbody>
            {rows}
          </tbody>
        </table>
      );
    };

    const createSingleStateTransitionTable = () => {
      return (
        <table className="transition-table">
          <tbody>
          {
            this.props.fsm.alphabet.map(letter => {
              const transition = this.props.fsm.transitionFunctions.get(this.props.fsm.selected);
              const toState = transition ? transition.get(letter) : '';
              return (
                <tr>
                  <td>{letter}</td>
                  <td onClick={() => this.setState({
                    transitionPopup: true,
                    transitionPopupFromState: this.props.fsm.selected,
                    transitionPopupLetter: letter,
                    transitionPopupToState: toState || ''
                  })}>{toState}</td>
                </tr>
              );
            })
          }
          </tbody>
        </table>
      );
    };

    const createLine = (startCoords, endCoords, refString) => (
      <line
        x1={startCoords.x}
        y1={startCoords.y}
        x2={endCoords.x}
        y2={endCoords.y}
        stroke="#000" strokeWidth="2"
        markerEnd="url(#arrowhead)"
        ref={line =>
          this[refString] = line}
      />
    );

    const lines = [];
    for(const fromState of this.props.fsm.states) {
      const transitions = this.props.fsm.transitionFunctions.get(fromState);
      if(transitions) {
        for(const [ letter, toState ] of transitions.entries()) {
          const fromStatePosition = this.props.fsm.statePositions.get(fromState);
          const toStatePosition = this.props.fsm.statePositions.get(toState);
          const startCoords = this.getTransitionLineStartCoords({
            x: fromStatePosition.x,
            y: fromStatePosition.y
          });
          const endCoords = this.getTransitionLineEndCoords({
            x1: fromStatePosition.x,
            y1: fromStatePosition.y,
            x2: toStatePosition.x,
            y2: toStatePosition.y
          });
          lines.push(createLine(startCoords, endCoords, this.getTransitionLineRefName(fromState, letter, toState)));
        }
      }
    }
    if(this.state.creatingTransition) {
      const statePosition = this.props.fsm.statePositions.get(this.state.creatingTransitionFromState);
      const startCoords = this.getTransitionLineStartCoords(statePosition);
      lines.push(
        createLine(
          startCoords,
          startCoords,
          this.creatingTransitionLineRef
        )
      );
    }

    const popupContents = this.state.transitionPopup ? (
      <TransitionPopup
        fromState={this.state.transitionPopupFromState}
        letter={this.state.transitionPopupLetter}
        toState={this.state.transitionPopupToState}
        closePopup={() => this.setState({
          transitionPopup: false,
          transitionPopupFromState: null,
          transitionPopupLetter: null,
          transitionPopupToState: null
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
             onMouseMove={this.centerContainerMouseMove}
             tabIndex="0"> {/* TODO figure out why tabIndex attribute is required for onKeyDown to fire */}
           <div className={'popup' + (this.state.transitionPopup ? '' : ' popup-hidden')}>
             {popupContents}
           </div>
          {this.props.fsm.states.map(state => (
            <div
              className={'state' + (state === this.props.fsm.selected ? ' selected-state' : '')}
              ref={element => this[this.getStateRefName(state)] = element}
              onMouseDown={() => this.props.dispatch(selectState(state))}
              onMouseUp={this.stateMouseUp} // TODO create transition
              onDoubleClick={() => this.startCreatingTransition(state)}
            >{state}</div>
          ))}
          <svg xmlns="http://www.w3.org/2000/svg" id="arrows-svg">
            <defs>
              <marker id="arrowhead" markerWidth="10" markerHeight="7"
                      refX="8" refY="3.5" orient="auto">
                <polygon points="0 0, 10 3.5, 0 7" />
              </marker>
            </defs>
            {lines}
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
            <div className="control-panel-right">
              <h4 className="control-panel-text">Click on a state to make its properties appear here!</h4>
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