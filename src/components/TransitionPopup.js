import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Button, Dropdown } from 'semantic-ui-react'
import { addTransition } from '../actions/fsm';
import { getFsm } from '../selectors/fsm'

export class TransitionPopup extends Component {
  constructor(props) {
    super(props);

    this.state = {
      selected: props.states[0]
    };

    this.onSubmit = this.onSubmit.bind(this);
  }

  onSubmit() {
    this.props.dispatch(addTransition(this.props.state, this.state.selected, this.props.letter));
    this.props.closePopup();
  }

  render() {
    //onClick={() => this.setState({ selected: state })}
    return (
      <div>
        <Dropdown
          placeholder={this.state.selected}
          fluid
          selection
          options={this.props.states.map(state => ({ text: state, value: state }))}
          onChange={(e, data) => this.setState({ selected: data.value })} />
        <Button onClick={() => this.onSubmit()}>Submit</Button>
      </div>
    );
  }
}

export default connect(
  state => ({
    states: getFsm(state).states
  })
)(TransitionPopup);