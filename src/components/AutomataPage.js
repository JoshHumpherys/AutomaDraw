import React, { Component } from 'react'
import { connect } from 'react-redux'
import { getFsm } from '../selectors/fsm'
import { getSettings } from '../selectors/settings'
import { arrayToString, transitionFunctionsToTable } from '../utility/utility'
import interact from 'interactjs'
import $ from 'jquery'
import { Button, Checkbox, Dropdown, Icon } from 'semantic-ui-react'
import { saveAs } from 'file-saver'
import { Map, Set } from 'immutable'

import EditableTextField from './EditableTextField'
import TransitionPopup from './TransitionPopup'

export class AutomataPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      draggedElement: null,
      mouseDownOnState: null,
      placingNewState: false,
      transitionPopupToState: null,
      transitionPopupLetter: null,
      transitionPopupFromState: null,
      transitionPopup: false,
      creatingTransitionFromState: null,
      contextMenuState: null
    };

    this.creatingTransitionLineRef = 'creating_transition_line_ref';
    this.initialTransitionLineRef = 'initial_transition_life_ref';
    this.contextMenuRef = 'context_menu_ref';

    this.getStateRefName = this.getStateRefName.bind(this);
    this.getTransitionLineRefName = this.getTransitionLineRefName.bind(this);
    this.getTransitionTextRefName = this.getTransitionTextRefName.bind(this);
    this.getStateCenterPosition = this.getStateCenterPosition.bind(this);
    this.getStatePositionFromCenterPosition = this.getStatePositionFromCenterPosition.bind(this);
    this.getTransitionLoopStartCoords = this.getTransitionLoopStartCoords.bind(this);
    this.getTransitionLineEndCoords = this.getTransitionLineEndCoords.bind(this);
    this.getTransitionLineTextPositionAndAngle = this.getTransitionLineTextPositionAndAngle.bind(this);
    this.getTransitionLoopTextPosition = this.getTransitionLoopTextPosition.bind(this);
    this.getInitialTransitionStartPosition = this.getInitialTransitionStartPosition.bind(this);
    this.centerContainerMouseDown = this.centerContainerMouseDown.bind(this);
    this.centerContainerMouseUp = this.centerContainerMouseUp.bind(this);
    this.centerContainerMouseMove = this.centerContainerMouseMove.bind(this);
    this.centerContainerKeyDown = this.centerContainerKeyDown.bind(this);
    this.centerContainerKeyUp = this.centerContainerKeyUp.bind(this);
    this.stateMouseDown = this.stateMouseDown.bind(this);
    this.stateMouseUp = this.stateMouseUp.bind(this);
    this.getMouseCoordsRelativeToContainer = this.getMouseCoordsRelativeToContainer.bind(this);
    this.setStatePosition = this.setStatePosition.bind(this);
    this.updateStatePositions = this.updateStatePositions.bind(this);
    this.stateRightClick = this.stateRightClick.bind(this);
    this.renameStateWithPopup = this.renameStateWithPopup.bind(this);
  }

  getStateRefName(state) {
    return 'state_' + state;
  }

  getTransitionLineRefName(state1, state2) {
    return 'transition_line_svg_' + state1 + '_' + state2;
  }

  getTransitionTextRefName(state1, state2) {
    return 'transition_text_svg_' + state1 + state2;
  }

  getStateCenterPosition(coords) {
    return { x: coords.x + 20, y: coords.y + 20 };
  }

  getStatePositionFromCenterPosition(coords) {
    return { x: coords.x - 20, y: coords.y - 20 };
  }

  getTransitionLoopStartCoords(coords) {
    return { x: coords.x + 20, y: coords.y };
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

  getTransitionLineTextPositionAndAngle(fromStatePosition, toStatePosition) {
    const fromStateCenterPosition = this.getStateCenterPosition(fromStatePosition);
    const toStateCenterPosition = this.getStateCenterPosition(toStatePosition);
    const dx = toStateCenterPosition.x - fromStateCenterPosition.x;
    const dy = toStateCenterPosition.y - fromStateCenterPosition.y;
    const r = Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2));
    const textX = (fromStateCenterPosition.x + toStateCenterPosition.x) / 2 + 8 * dy / r * (dx >= 0 ? 1 : -1);
    const textY = (fromStateCenterPosition.y + toStateCenterPosition.y) / 2 - 8 * Math.abs(dx) / r;
    return { x: textX, y: textY, angle: Math.atan(dy / dx) * 180 / Math.PI };
  }

  getTransitionLoopTextPosition(fromStatePosition) {
    // TODO don't hardcode radius values
    return { x: fromStatePosition.x + 20, y: fromStatePosition.y - 30 - 8 };
  }

  getInitialTransitionStartPosition(statePosition) {
    return { ...statePosition, x: statePosition.x - 100 };
  }

  startCreatingTransition(state) {
    this.setState({ creatingTransitionFromState: state });
  }

  centerContainerMouseDown(e) {
    if(
      e.target === this.centerContainer &&
      this.state.draggedElement === null &&
      this.state.creatingTransitionFromState === null &&
      this.state.contextMenuState === null
    ) {
      this.setState({ placingNewState: true });
    }
  }

  centerContainerMouseUp(e) {
    if(this.state.placingNewState && this.state.creatingTransitionFromState === null) {
      const mousePosition = this.getMouseCoordsRelativeToContainer(e);

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

      if(this.state.contextMenuState === null) {
        const name = getNextStateName(this.props.states);
        const statePosition = this.getStatePositionFromCenterPosition(mousePosition);
        this.props.addState(name, statePosition);
        this.props.selectState(name); // TODO remove this action if selected state is never used
      }
      this.setState({ placingNewState: false });
    }

    this.setState({ creatingTransitionFromState: null });
  }

  centerContainerMouseMove(e) {
    e.target.focus();
    if(this.state.creatingTransitionFromState !== null) {
      const line = this[this.creatingTransitionLineRef];
      const mouseCoords = this.getMouseCoordsRelativeToContainer(e);
      line.setAttribute('x2', mouseCoords.x);
      line.setAttribute('y2', mouseCoords.y);
    }
  }

  centerContainerKeyDown(e) {}

  centerContainerKeyUp(e) {}

  stateMouseDown(e, state) {
    this.props.selectState(state);
    this.setState({ mouseDownOnState: state });
  }

  // TODO make this work for PDA/TM
  stateMouseUp(e, state) {
    if(this.state.creatingTransitionFromState !== null) {
      this.props.addTransition(this.state.creatingTransitionFromState, state);
    }

    this.setState({ mouseDownOnState: null });
  }

  getMouseCoordsRelativeToContainer(event) {
    const x = event.pageX - $(this.centerContainer).offset().left;
    const y = event.pageY - $(this.centerContainer).offset().top;
    return { x, y };
  }

  // TODO make this work for PDA/TM
  setStatePosition(element, state, x, y) {
    element.style.webkitTransform = element.style.transform = `translate(${x}px, ${y}px)`;
    const statePosition = { x, y };
    const transitions = this.props.transitionFunctions.get(state);
    if(transitions !== undefined) {
      for(const letter of transitions.keys()) { // Update all transitions FROM the state being moved
        const toState = transitions.get(letter);
        const transitionSvg = this[this.getTransitionLineRefName(state, toState)];
        const text = this[this.getTransitionTextRefName(state, toState)];
        if(state === toState) {
          const startCoords = this.getTransitionLoopStartCoords(statePosition);
          const textPosition = this.getTransitionLoopTextPosition(statePosition);
          transitionSvg.setAttribute('cx', startCoords.x);
          transitionSvg.setAttribute('cy', startCoords.y);
          text.setAttribute('x', textPosition.x);
          text.setAttribute('y', textPosition.y);
        }
        else {
          const toStatePosition = this.props.statePositions.get(toState);
          const startCoords = this.getStateCenterPosition(statePosition);
          const endCoords = this.getTransitionLineEndCoords({
            x1: statePosition.x,
            y1: statePosition.y,
            x2: toStatePosition.x,
            y2: toStatePosition.y
          });
          const textPositionAndAngle = this.getTransitionLineTextPositionAndAngle(
            statePosition,
            toStatePosition
          );
          const { angle } = textPositionAndAngle;
          transitionSvg.setAttribute('x1', startCoords.x);
          transitionSvg.setAttribute('y1', startCoords.y);
          transitionSvg.setAttribute('x2', endCoords.x);
          transitionSvg.setAttribute('y2', endCoords.y);
          text.setAttribute('x', textPositionAndAngle.x);
          text.setAttribute('y', textPositionAndAngle.y);
          text.setAttribute('transform', `rotate(${angle} ${textPositionAndAngle.x}, ${textPositionAndAngle.y})`);
        }
      }
    }
    for(const [ fromState, transitions ] of this.props.transitionFunctions) { // Update all transitions TO the state being moved
      if(fromState !== state && transitions) {
        for(const letter of transitions.keys()) {
          if(this.props.transitionFunctions.get(fromState).get(letter) === state) {
            const transitionSvg = this[this.getTransitionLineRefName(fromState, state)];
            const text = this[this.getTransitionTextRefName(fromState, state)];
            const fromStatePosition = this.props.statePositions.get(fromState);
            const coords = this.getTransitionLineEndCoords({
              x1: fromStatePosition.x,
              y1: fromStatePosition.y,
              x2: x,
              y2: y
            });
            const textPositionAndAngle = this.getTransitionLineTextPositionAndAngle(
              fromStatePosition,
              statePosition
            );
            const { angle } = textPositionAndAngle;
            transitionSvg.setAttribute('x2', coords.x);
            transitionSvg.setAttribute('y2', coords.y);
            text.setAttribute('x', textPositionAndAngle.x);
            text.setAttribute('y', textPositionAndAngle.y);
            text.setAttribute('transform', `rotate(${angle} ${textPositionAndAngle.x}, ${textPositionAndAngle.y})`);
          }
        }
      }
    }
    if(this.props.initialState === state) {
      const initialTransitionSvg = this[this.initialTransitionLineRef];
      const stateCenterPosition = this.getStateCenterPosition(statePosition);
      const transitionStartPosition = this.getInitialTransitionStartPosition(stateCenterPosition);
      const transitionEndPosition = this.getTransitionLineEndCoords({
        x1: statePosition.x - 1,
        y1: statePosition.y,
        x2: statePosition.x,
        y2: statePosition.y
      });
      initialTransitionSvg.setAttribute('x1', transitionStartPosition.x);
      initialTransitionSvg.setAttribute('y1', transitionStartPosition.y);
      initialTransitionSvg.setAttribute('x2', transitionEndPosition.x);
      initialTransitionSvg.setAttribute('y2', transitionEndPosition.y);
    }
  }

  updateStatePositions() {
    if(this.state.draggedElement === null) {
      this.props.states.forEach(state => {
        const element = this[this.getStateRefName(state)];
        const position = this.props.statePositions.get(state);
        this.setStatePosition(element, state, position.x, position.y);
      });
    }
  }

  stateRightClick(e, state) {
    this.setState({ contextMenuState: state });

    const self = this;

    const removeContextMenu = () => {
      self.setState({ contextMenuState: null });
    };

    $(document).one('mousedown', e => {
      if(self.state.contextMenuState !== null) {
        if(!$.contains(this[this.contextMenuRef], e.target)) {
          removeContextMenu();
        }
      }
    });
  }

  renameStateWithPopup(state) {
    const getStateName = (nameAlreadyExists = false) => {
      // TODO make something better than a prompt
      const nameAlreadyExistsString = (nameAlreadyExists ? 'Name already exists.\n' : '');
      const promptString = nameAlreadyExistsString + `What should state "${state}" be renamed?`;
      const name = prompt(promptString);
      if(this.props.states.contains(name)) {
        return getStateName(true);
      }
      return name;
    };
    const name = getStateName();
    if(name !== null) { // user didn't click cancel
      this.props.changeStateName(state, name);
    }
  }

  uploadFile(file, callback) {
    const fileReader = new FileReader();

    fileReader.onload = e => {
      this.props.initializeFromJsonString(e.target.result);
      callback();
    };

    fileReader.readAsText(file, 'UTF-8');
  }

  componentDidUpdate() {
    // TODO share code with render and refactor so that we don't have to loop through every state
    // for every state to update transitions because all are getting updated
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
        },
        onmove: e => {
          const target = this.state.draggedElement;
          if(target !== null) {
            const { x, y } = this.getStatePositionFromCenterPosition(this.getMouseCoordsRelativeToContainer(e));
            const state = this.state.mouseDownOnState;

            this.setStatePosition(target, state, x, y);
          }
        },
        onend: e => {
          const target = this.state.draggedElement;
          const state = this.state.mouseDownOnState;
          if(target !== null) {
            const { x, y } = this.getStatePositionFromCenterPosition(this.getMouseCoordsRelativeToContainer(e));
            this.props.moveState(state, x, y);
            this.setState({ draggedElement: null });
          }
        }
      });

    this.updateStatePositions();
  }

  // TODO make this work for PDA/TM
  render() {
    const transitionTable = transitionFunctionsToTable(
      this.props.states,
      this.props.alphabet,
      this.props.transitionFunctions
    );

    const createTransitionTable = () => {
      if(transitionTable.length === 0) {
        return '\u2205';
      }

      const rows = [];
      for(const fromState of this.props.states.keys()) {
        const cols = [];
        cols.push(<td>{fromState}</td>);
        for(const letter of this.props.alphabet.keys()) {
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
              {this.props.alphabet.map(letter => <td>{letter}</td>)}
            </tr>
          </thead>
          <tbody>
            {rows}
          </tbody>
        </table>
      );
    };

    const createTransitionLine = (fromStatePosition, toStatePosition, letters, lineRefString, textRefString) => {
      const startCoords = this.getStateCenterPosition(fromStatePosition);
      const endCoords = this.getTransitionLineEndCoords({
        x1: fromStatePosition.x,
        y1: fromStatePosition.y,
        x2: toStatePosition.x,
        y2: toStatePosition.y
      });
      const textPositionAndAngle = this.getTransitionLineTextPositionAndAngle(fromStatePosition, toStatePosition);
      const { angle } = textPositionAndAngle;
      return {
        line: <line
          x1={startCoords.x}
          y1={startCoords.y}
          x2={endCoords.x}
          y2={endCoords.y}
          stroke={this.props.settings.darkTheme ? '#fff' : '#000'}
          strokeWidth="2"
          markerEnd="url(#arrowhead)"
          ref={line => this[lineRefString] = line}/>,
        text: <text
          x={textPositionAndAngle.x}
          y={textPositionAndAngle.y}
          transform={`rotate(${angle} ${textPositionAndAngle.x}, ${textPositionAndAngle.y})`}
          fontSize="20"
          textAnchor="middle"
          stroke={this.props.settings.darkTheme ? '#fff' : '#000'}
          fill={this.props.settings.darkTheme ? '#fff' : '#000'}
          ref={text => {
            this[textRefString] = text
          }}>{letters.join(', ')}</text>
      };
    };

    const createTransitionLoop = (fromStatePosition, letters, loopRefString, textRefString) => {
      const startCoords = this.getTransitionLoopStartCoords({
        x: fromStatePosition.x,
        y: fromStatePosition.y
      });
      const textCoords = this.getTransitionLoopTextPosition(fromStatePosition);
      return {
        loop: <ellipse
          cx={startCoords.x}
          cy={startCoords.y}
          rx="10"
          ry="30"
          fill="none"
          stroke={this.props.settings.darkTheme ? '#fff' : '#000'}
          strokeWidth="2"
          markerEnd="url(#arrowhead)"
          ref={loop => this[loopRefString] = loop} />,
        text: <text
          x={textCoords.x}
          y={textCoords.y}
          fontSize="20"
          textAnchor="middle"
          stroke={this.props.settings.darkTheme ? '#fff' : '#000'}
          fill={this.props.settings.darkTheme ? '#fff' : '#000'}
          ref={text => this[textRefString] = text}>{letters.join(', ')}</text>
      };
    };

    const lines = [];
    for(const fromState of this.props.states) {
      const transitions = this.props.transitionFunctions.get(fromState);
      if(transitions !== undefined) {
        const transitionsToStateMap = new Map({}).withMutations(transitionsToStateMap => {
          for(const [ letter, toState ] of transitions.entries()) {
            const transitionsToState = transitionsToStateMap.get(toState);
            if(transitionsToState !== undefined) {
              transitionsToStateMap.set(toState, transitionsToState.add(letter));
            } else {
              transitionsToStateMap.set(toState, new Set([letter]));
            }
          }
        });
        transitionsToStateMap.mapEntries(([ toState, letters ]) => {
          const fromStatePosition = this.props.statePositions.get(fromState);
          const loopRefString = this.getTransitionLineRefName(fromState, toState);
          const textRefString = this.getTransitionTextRefName(fromState, toState);
          if(fromState === toState) {
            const transitionLoop = createTransitionLoop(
              fromStatePosition,
              letters.sort(),
              loopRefString,
              textRefString
            );
            lines.push(transitionLoop.loop);
            lines.push(transitionLoop.text);
          }
          else {
            const toStatePosition = this.props.statePositions.get(toState);
            const transitionLine = createTransitionLine(
              fromStatePosition,
              toStatePosition,
              letters.sort(),
              loopRefString,
              textRefString
            );
            lines.push(transitionLine.line);
            lines.push(transitionLine.text);
          }
        });
      }
    }
    if(this.state.creatingTransitionFromState !== null) {
      const statePosition = this.props.statePositions.get(this.state.creatingTransitionFromState);
      lines.push(
        createTransitionLine(
          statePosition,
          statePosition,
          new Set(),
          this.creatingTransitionLineRef,
          null
        ).line
      );
    }
    if(this.props.initialState !== null) {
      const statePosition = this.props.statePositions.get(this.props.initialState);
      lines.push(
        createTransitionLine(
          this.getInitialTransitionStartPosition(statePosition),
          statePosition,
          new Set(),
          this.initialTransitionLineRef,
          null
        ).line
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
        })}
        className={this.state.transitionPopup ? '' : 'popup-hidden'} />
    ) : null;

    let dropdownX = 0;
    let dropdownY = 0;
    if(this.state.contextMenuState !== null) {
      const contextMenuStatePosition = this.props.statePositions.get(this.state.contextMenuState);
      if(contextMenuStatePosition !== undefined) {
        const contextMenuStateCenterPosition = this.getStateCenterPosition(contextMenuStatePosition);
        dropdownX = contextMenuStateCenterPosition.x;
        dropdownY = contextMenuStateCenterPosition.y;
      }
    }

    return (
      <div className="content-container">
        <div className="control-panel-left">
          <h2 className="control-panel-text">
            <EditableTextField
              value={this.props.name}
              onChange={name => this.props.changeName(name)} />
          </h2>
          <div className="control-panel-text">
            <span>Q: {arrayToString(this.props.states.toArray())}</span>
          </div>
          <div className="control-panel-text">
            <span>&Sigma;: {arrayToString(this.props.alphabet.toArray())}</span>
          </div>
          <div className="control-panel-text">
            <span>&delta;: </span>
            {createTransitionTable()}
          </div>
          <div className="control-panel-text">
            <span>q&#8320;: {this.props.initialState}</span>
          </div>
          <div className="control-panel-text">
            <span>F: {arrayToString(this.props.acceptStates.toArray())}</span>
          </div>
          <div className="control-panel-text">
            <Button onClick={() => $('#upload').click()}>
              <Icon name="upload" className="clickable-icon" /> Upload
            </Button>
            <input
              type="file"
              id="upload"
              style={{ display: 'none'}}
              onChange={() => {
                const upload = $('#upload');
                this.uploadFile(upload.get(0).files[0], () => upload.val(''));
              }}
            />
          </div>
          <div className="control-panel-text">
            <Button onClick={() => saveAs(
              new Blob([this.props.stringifyAutomaton()], { type: 'text/plain;charset=utf-8' }),
              `${this.props.name}.dat`
            )}>
              <Icon name="download" className="clickable-icon" /> Download
            </Button>
          </div>
          <div className="control-panel-text">
            <Button onClick={() => this.props.reset()}>
              <Icon name="refresh" className="clickable-icon" /> Reset
            </Button>
          </div>
        </div>
        <div className={'center-container' + (this.props.settings.darkTheme ? ' center-container-dark-theme' : '')}
          onMouseDown={this.centerContainerMouseDown}
          onMouseUp={this.centerContainerMouseUp}
          ref={element => this.centerContainer = element}
          onKeyDown={this.centerContainerKeyDown}
          onKeyUp={this.centerContainerKeyUp}
          onMouseMove={this.centerContainerMouseMove}
          onContextMenu={e => e.preventDefault()}
          tabIndex="0"> {/* TODO figure out why tabIndex attribute is required for onKeyDown to fire */}
          {popupContents}
          {this.props.states.map(state => (
            <div
              className={'state' + (state === this.props.selected ? ' selected-state' : '')}
              ref={element => this[this.getStateRefName(state)] = element}
              onMouseDown={e => this.stateMouseDown(e, state)}
              onMouseUp={e => this.stateMouseUp(e, state)}
              onDoubleClick={() => this.startCreatingTransition(state)}
              onContextMenu={e => this.stateRightClick(e, state)}
            >
              <div
                className={'state-child' + (this.props.acceptStates.contains(state) ? ' state-child-accept' : '')}>
                {state}
              </div>
            </div>
          ))}
          <svg xmlns="http://www.w3.org/2000/svg" id="arrows-svg">
            <defs>
              <marker id="arrowhead" markerWidth="10" markerHeight="7"
                  refX="8" refY="3.5" orient="auto"
                  stroke={this.props.settings.darkTheme ? '#fff' : '#000'}
                  fill={this.props.settings.darkTheme ? '#fff' : '#000'}>
                <polygon points="0 0, 10 3.5, 0 7" />
              </marker>
            </defs>
            {lines}
          </svg>
          {
            this.state.contextMenuState !== null ? (
              <div
                className="ui dropdown context-menu"
                style={{ top: dropdownY, left: dropdownX }}
                ref={dropdown => this[this.contextMenuRef] = dropdown}
                onClick={() => this.setState({ contextMenuState: null })}>
                <Dropdown.Menu className="visible">
                  <Dropdown.Item
                    text="Add transition"
                    icon="add"
                    onClick={() => this.startCreatingTransition(this.state.contextMenuState)} />
                  <Dropdown.Item
                    text="Rename"
                    icon="write"
                    onClick={() => this.renameStateWithPopup(this.state.contextMenuState)} />
                  <Dropdown.Item>
                    <Checkbox
                      id="initial-state-checkbox"
                      label="Initial state"
                      key={this.props.selected}
                      defaultChecked={this.props.initialState === this.props.selected}
                      onChange={(e, value) => {
                        value.checked ? this.props.changeInitialState(this.props.selected) : this.props.removeInitialState()
                      }} />
                  </Dropdown.Item>
                  <Dropdown.Item>
                    <Checkbox
                      id="accept-state-checkbox"
                      label="Accept state"
                      key={this.props.selected}
                      defaultChecked={this.props.acceptStates.includes(this.props.selected)}
                      onChange={(e, value) => {
                        const { selected } = this.props;
                        value.checked ? this.props.addAcceptState(selected) : this.props.removeAcceptState(selected)
                      }} />
                  </Dropdown.Item>
                  <Dropdown.Divider />
                  <Dropdown.Item
                    text="Delete"
                    icon="trash"
                    onClick={() => this.props.deleteState(this.state.contextMenuState)}
                  />
                </Dropdown.Menu>
              </div>
            ) : (
              null
            )
          }
        </div>
      </div>
    );
  }
}

export default connect(
  state => ({
    fsm: getFsm(state),
    settings: getSettings(state)
  })
)(AutomataPage);