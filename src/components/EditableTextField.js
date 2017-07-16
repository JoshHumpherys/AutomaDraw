import React, { Component } from 'react'
import { Icon } from 'semantic-ui-react'

export default class EditableTextField extends Component {
  constructor(props) {
    super(props);

    this.state = {
      editing: false,
      value: this.props.value
    };

    this.onSubmit = this.onSubmit.bind(this);
    this.handleKeyDown = this.handleKeyDown.bind(this);
  }

  onSubmit(value) {
    this.props.onChange(value);
    this.setState({ editing: false });
  }

  handleKeyDown(e) {
    this.setState({ value: e.target.value });
    if(e.keyCode === 13) {
      this.onSubmit(e.target.value);
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if(this.state.editing) {
      this.inputField.focus();
      if(!prevState.editing) {
        this.inputField.select();
      }
    }
  }

  render() {
    return (
      <div className="editable-main-container">
        <Icon />
        <div className="editable-container">
          {
            this.state.editing ? (
              <input
                className="editable"
                type="text"
                onKeyDown={this.handleKeyDown}
                defaultValue={this.state.value}
                ref={input => this.inputField = input} />
            ) : (
              <span className="editable">{this.props.value}</span>
            )
          }
        </div>
        {
          this.state.editing ? (
            <Icon className="editable-icon" name="checkmark box" onClick={() => this.onSubmit(this.inputField.value)} />
          ) : (
            <Icon className="editable-icon" name="edit" onClick={() => this.setState({ editing: true })} />
          )
        }
      </div>
    );
  }
}