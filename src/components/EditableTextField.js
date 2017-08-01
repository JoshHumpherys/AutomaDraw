import React, { Component } from 'react'
import { Icon } from 'semantic-ui-react'
import $ from 'jquery';

export default class EditableTextField extends Component {
  constructor(props) {
    super(props);

    this.state = {
      editing: false,
      value: this.props.value
    };

    this.startEditing = this.startEditing.bind(this);
    this.registerCloseHandler = this.registerCloseHandler.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.handleKeyDown = this.handleKeyDown.bind(this);
  }

  startEditing() {
    this.setState({ editing: true });
    this.registerCloseHandler();
  }

  registerCloseHandler() {
    $(document).one('click', e => {
      if(this.inputField) {
        if(e.target !== this.inputField) {
          this.onSubmit(this.inputField.value);
        } else {
          this.registerCloseHandler();
        }
      }
    });
  }

  onSubmit(value) {
    this.props.onChange(value);
    this.setState({ editing: false, value });
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
        this.inputField.value = this.props.value;
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
            <Icon className="clickable-icon" name="checkmark box" onClick={() => this.onSubmit(this.inputField.value)} />
          ) : (
            <Icon className="clickable-icon" name="edit" onClick={this.startEditing} />
          )
        }
      </div>
    );
  }
}