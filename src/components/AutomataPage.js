import React, { Component } from 'react'
import { connect } from 'react-redux'
import { getSettings } from '../selectors/settings'
import interact from 'interactjs'
import $ from 'jquery'
import { Button, Checkbox, Dropdown, Icon } from 'semantic-ui-react'
import { saveAs } from 'file-saver'
import { Map, Set } from 'immutable'
import { createModal } from '../actions/modal'

import EditableTextField from './EditableTextField'

export class AutomataPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      draggedElement: null,
      mouseDownOnState: null,
      placingNewState: false,
      creatingTransitionFromState: null,
      contextMenuState: null
    };

    this.creatingTransitionLineRef = 'creating_transition_line_ref';
    this.initialTransitionLineRef = 'initial_transition_life_ref';

    this.getStateRefName = this.getStateRefName.bind(this);
    this.getTransitionLineRefName = this.getTransitionLineRefName.bind(this);
    this.getTransitionTextRefName = this.getTransitionTextRefName.bind(this);
    this.getStateCenterPosition = this.getStateCenterPosition.bind(this);
    this.getStatePositionFromCenterPosition = this.getStatePositionFromCenterPosition.bind(this);
    this.getTransitionLoopStartCoords = this.getTransitionLoopStartCoords.bind(this);
    this.getTransitionLineEndPosition = this.getTransitionLineEndPosition.bind(this);
    this.getTransitionLineTextPositionAndAngle = this.getTransitionLineTextPositionAndAngle.bind(this);
    this.getTransitionLoopTextPosition = this.getTransitionLoopTextPosition.bind(this);
    this.getInitialTransitionStartPosition = this.getInitialTransitionStartPosition.bind(this);
    this.setSvgTransitionLinePosition = this.setSvgTransitionLinePosition.bind(this);
    this.setSvgTransitionLineStartCoords = this.setSvgTransitionLineStartCoords.bind(this);
    this.setSvgTransitionLineEndCoords = this.setSvgTransitionLineEndCoords.bind(this);
    this.setSvgTransitionLoopPosition = this.setSvgTransitionLoopPosition.bind(this);
    this.setSvgTextPosition = this.setSvgTextPosition.bind(this);
    this.setSvgTextPositionAndAngle = this.setSvgTextPositionAndAngle.bind(this);
    this.centerContainerMouseDown = this.centerContainerMouseDown.bind(this);
    this.centerContainerMouseUp = this.centerContainerMouseUp.bind(this);
    this.centerContainerMouseMove = this.centerContainerMouseMove.bind(this);
    this.centerContainerKeyDown = this.centerContainerKeyDown.bind(this);
    this.centerContainerKeyUp = this.centerContainerKeyUp.bind(this);
    this.stateMouseDown = this.stateMouseDown.bind(this);
    this.stateMouseUp = this.stateMouseUp.bind(this);
    this.getMousePositionRelativeToContainer = this.getMousePositionRelativeToContainer.bind(this);
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

  getTransitionLineEndPosition(coords) {
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

  setSvgTransitionLinePosition(transitionRef, startCoords, endCoords) {
    this.setSvgTransitionLineStartCoords(transitionRef, startCoords);
    this.setSvgTransitionLineEndCoords(transitionRef, endCoords);
  }

  setSvgTransitionLineStartCoords(transitionRef, startCoords) {
    transitionRef.setAttribute('x1', startCoords.x);
    transitionRef.setAttribute('y1', startCoords.y);
  }

  setSvgTransitionLineEndCoords(transitionRef, endCoords) {
    transitionRef.setAttribute('x2', endCoords.x);
    transitionRef.setAttribute('y2', endCoords.y);
  }

  setSvgTransitionLoopPosition(transitionRef, coords) {
    transitionRef.setAttribute('cx', coords.x);
    transitionRef.setAttribute('cy', coords.y);
  }

  setSvgTextPosition(textRef, position) {
    textRef.setAttribute('x', position.x);
    textRef.setAttribute('y', position.y);
  }

  setSvgTextPositionAndAngle(textRef, positionAndAngle) {
    this.setSvgTextPosition(textRef, positionAndAngle);
    textRef.setAttribute('transform', `rotate(${positionAndAngle.angle} ${positionAndAngle.x}, ${positionAndAngle.y})`);
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
      const mousePosition = this.getMousePositionRelativeToContainer(e);

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
      const mouseCoords = this.getMousePositionRelativeToContainer(e);
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

  stateMouseUp(e, state) {
    if(this.state.creatingTransitionFromState !== null) {
      this.props.addTransition(this.state.creatingTransitionFromState, state);
    }

    this.setState({ mouseDownOnState: null });
  }

  getMousePositionRelativeToContainer(event) {
    const x = event.pageX - $(this.centerContainer).offset().left;
    const y = event.pageY - $(this.centerContainer).offset().top;
    return { x, y };
  }

  // TODO make this work for PDA/TM
  setStatePosition(element, state, x, y) {
    element.style.webkitTransform = element.style.transform = `translate(${x}px, ${y}px)`;
    const statePosition = { x, y };
    const transitionsFromState = this.props.simpleNestedTransitionFunction.get(state);
    if(transitionsFromState !== undefined) {
      for(const transitionText of transitionsFromState.keys()) { // Update all transitions FROM the state being moved
        const toState = transitionsFromState.get(transitionText);
        const transitionRef = this[this.getTransitionLineRefName(state, toState)];
        const textRef = this[this.getTransitionTextRefName(state, toState)];
        if(state === toState) { // Transition to self
          const transitionStartPosition = this.getTransitionLoopStartCoords(statePosition);
          const textPosition = this.getTransitionLoopTextPosition(statePosition);
          this.setSvgTransitionLoopPosition(transitionRef, transitionStartPosition);
          this.setSvgTextPosition(textRef, textPosition);
        }
        else { // Transition to another state
          const toStatePosition = this.props.statePositions.get(toState);
          const transitionStartPosition = this.getStateCenterPosition(statePosition);
          const transitionEndPosition = this.getTransitionLineEndPosition({
            x1: statePosition.x,
            y1: statePosition.y,
            x2: toStatePosition.x,
            y2: toStatePosition.y
          });
          const textPositionAndAngle = this.getTransitionLineTextPositionAndAngle(
            statePosition,
            toStatePosition
          );
          this.setSvgTransitionLinePosition(transitionRef, transitionStartPosition, transitionEndPosition);
          this.setSvgTextPositionAndAngle(textRef, textPositionAndAngle);
        }
      }
    }
    for(const [ fromState, transitionsFromState ] of this.props.simpleNestedTransitionFunction) { // Update all transitions TO the state being moved
      if(fromState !== state && transitionsFromState) {
        for(const transitionText of transitionsFromState.keys()) {
          if(this.props.simpleNestedTransitionFunction.get(fromState).get(transitionText) === state) {
            const transitionRef = this[this.getTransitionLineRefName(fromState, state)];
            const textRef = this[this.getTransitionTextRefName(fromState, state)];
            const fromStatePosition = this.props.statePositions.get(fromState);
            const transitionEndPosition = this.getTransitionLineEndPosition({
              x1: fromStatePosition.x,
              y1: fromStatePosition.y,
              x2: x,
              y2: y
            });
            const textPositionAndAngle = this.getTransitionLineTextPositionAndAngle(
              fromStatePosition,
              statePosition
            );
            this.setSvgTransitionLineEndCoords(transitionRef, transitionEndPosition);
            this.setSvgTextPositionAndAngle(textRef, textPositionAndAngle);
          }
        }
      }
    }
    if(this.props.initialState === state) { // The state being moved is the initial state
      const initialTransitionRef = this[this.initialTransitionLineRef];
      const stateCenterPosition = this.getStateCenterPosition(statePosition);
      const transitionStartPosition = this.getInitialTransitionStartPosition(stateCenterPosition);
      const transitionEndPosition = this.getTransitionLineEndPosition({
        x1: statePosition.x - 1,
        y1: statePosition.y,
        x2: statePosition.x,
        y2: statePosition.y
      });
      this.setSvgTransitionLinePosition(initialTransitionRef, transitionStartPosition, transitionEndPosition);
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
        if(!$.contains(this.contextMenuRef, e.target)) {
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
            const { x, y } = this.getStatePositionFromCenterPosition(this.getMousePositionRelativeToContainer(e));
            const state = this.state.mouseDownOnState;

            this.setStatePosition(target, state, x, y);
          }
        },
        onend: e => {
          const target = this.state.draggedElement;
          const state = this.state.mouseDownOnState;
          if(target !== null) {
            const { x, y } = this.getStatePositionFromCenterPosition(this.getMousePositionRelativeToContainer(e));
            this.props.moveState(state, x, y);
            this.setState({ draggedElement: null });
          }
        }
      });

    this.updateStatePositions();
  }

  // TODO make this work for PDA/TM
  render() {
    const defaultPosition = { x1: 0, y1: 0, x2: 0, y2: 0 };
    const createTransitionLine = (transitionTexts, lineRefString, textRefString, linePosition = defaultPosition) => {
      return {
        line: <line
          x1={linePosition.x1}
          y1={linePosition.y1}
          x2={linePosition.x2}
          y2={linePosition.y2}
          key={lineRefString}
          stroke={this.props.settings.darkTheme ? '#fff' : '#000'}
          strokeWidth="2"
          markerEnd="url(#arrowhead)"
          ref={line => this[lineRefString] = line}/>,
        text: <text
          key={textRefString}
          fontSize="20"
          textAnchor="middle"
          stroke={this.props.settings.darkTheme ? '#fff' : '#000'}
          fill={this.props.settings.darkTheme ? '#fff' : '#000'}
          ref={text => {
            this[textRefString] = text
          }}>{transitionTexts.join(', ')}</text>
      };
    };

    const createTransitionLoop = (transitionTexts, loopRefString, textRefString) => {
      return {
        loop: <ellipse
          key={loopRefString}
          rx="10"
          ry="30"
          fill="none"
          stroke={this.props.settings.darkTheme ? '#fff' : '#000'}
          strokeWidth="2"
          markerEnd="url(#arrowhead)"
          ref={loop => this[loopRefString] = loop} />,
        text: <text
          key={textRefString}
          fontSize="20"
          textAnchor="middle"
          stroke={this.props.settings.darkTheme ? '#fff' : '#000'}
          fill={this.props.settings.darkTheme ? '#fff' : '#000'}
          ref={text => this[textRefString] = text}>{transitionTexts.join(', ')}</text>
      };
    };

    const svgChildren = [];
    for(const fromState of this.props.states) {
      const transitions = this.props.simpleNestedTransitionFunction.get(fromState);
      if(transitions !== undefined) {
        const transitionsToStateMap = new Map({}).withMutations(transitionsToStateMap => {
          for(const [ transitionText, toState ] of transitions.entries()) {
            const transitionsToState = transitionsToStateMap.get(toState);
            if(transitionsToState !== undefined) {
              transitionsToStateMap.set(toState, transitionsToState.add(transitionText));
            } else {
              transitionsToStateMap.set(toState, new Set([transitionText]));
            }
          }
        });
        transitionsToStateMap.mapEntries(([ toState, transitionTexts ]) => {
          const loopRefString = this.getTransitionLineRefName(fromState, toState);
          const textRefString = this.getTransitionTextRefName(fromState, toState);
          if(fromState === toState) {
            const transitionLoop = createTransitionLoop(
              transitionTexts.sort(),
              loopRefString,
              textRefString
            );
            svgChildren.push(transitionLoop.loop);
            svgChildren.push(transitionLoop.text);
          }
          else {
            const transitionLine = createTransitionLine(
              transitionTexts.sort(),
              loopRefString,
              textRefString
            );
            svgChildren.push(transitionLine.line);
            svgChildren.push(transitionLine.text);
          }
        });
      }
    }
    if(this.state.creatingTransitionFromState !== null) {
      const fromStatePosition = this.props.statePositions.get(this.state.creatingTransitionFromState);
      const transitionStartPosition = this.getStateCenterPosition(fromStatePosition);
      const creatingTransitionLine = createTransitionLine(
        new Set(),
        this.creatingTransitionLineRef,
        null,
        {
          x1: transitionStartPosition.x,
          y1: transitionStartPosition.y,
          x2: transitionStartPosition.x,
          y2: transitionStartPosition.y
        }
      ).line;
      svgChildren.push(creatingTransitionLine);
    }
    if(this.props.initialState !== null) {
      svgChildren.push(
        createTransitionLine(
          new Set(),
          this.initialTransitionLineRef,
          null
        ).line
      );
    }

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
          {
            this.props.formalProperties.map(formalProperty =>
              <div className="control-panel-text" key={formalProperty.name}>
                <span className={formalProperty.modalType ? 'clickable' : ''} onClick={() => {
                  if(formalProperty.modalType) {
                    this.props.dispatch(createModal(formalProperty.modalType));
                  }
                }}>{formalProperty.name}: {formalProperty.value}</span>
              </div>
            )
          }
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
          {this.props.states.map(state => (
            <div
              key={state}
              className={'state' + (state === this.props.selected ? ' selected-state' : '')}
              ref={element => this[this.getStateRefName(state)] = element}
              onMouseDown={e => this.stateMouseDown(e, state)}
              onMouseUp={e => this.stateMouseUp(e, state)}
              onDoubleClick={() => this.startCreatingTransition(state)}
              onContextMenu={e => this.stateRightClick(e, state)}>
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
            {svgChildren}
          </svg>
          {
            this.state.contextMenuState !== null ? (
              <div
                className="ui dropdown context-menu"
                style={{ top: dropdownY, left: dropdownX }}
                ref={dropdown => this.contextMenuRef = dropdown}
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
    settings: getSettings(state)
  })
)(AutomataPage);