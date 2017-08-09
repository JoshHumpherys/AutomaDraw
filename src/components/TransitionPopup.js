import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Button, Dropdown } from 'semantic-ui-react'
import { addTransition, removeTransition } from '../actions/fsm';
import { getFsm } from '../selectors/fsm'

export class TransitionPopup extends Component {
  constructor(props) {
    super(props);

    this.state = {
      selected: props.toState !== "" ? props.toState : props.states.toArray()[0]
    };

    this.onSubmit = this.onSubmit.bind(this);
  }

  onSubmit() {
    this.props.dispatch(addTransition(this.props.fromState, this.state.selected, this.props.letter));
    this.props.closePopup();
  }

  onDelete() {
    this.props.dispatch(removeTransition(this.props.fromState, this.props.letter));
    this.props.closePopup();
  }

  render() {
    return (
      <div>
        <Dropdown
          placeholder={this.state.selected}
          fluid
          selection
          options={this.props.states.toArray().map(state => ({ text: state, value: state }))}/* TODO don't call toArray */
          onChange={(e, data) => this.setState({ selected: data.value })} />
        <Button onClick={() => this.onSubmit()}>Submit</Button>
        <Button onClick={() => this.onDelete()}>Delete</Button>
      </div>
    );
  }
}

export default connect(
  state => ({
    states: getFsm(state).states
  })
)(TransitionPopup);