import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Button, Input } from 'semantic-ui-react'
import { setRegex } from '../actions/regex'
import { getRegexString } from '../selectors/regex'
import { getSettings } from '../selectors/settings'
import { getEmptyStringSymbol, getAlternationSymbol } from '../utility/utility'
import $ from 'jquery'

export class RegexPage extends Component {
  constructor(props) {
    super(props);

    this.regexInputRef = 'regex_input_ref';

    this.inputChanged = this.inputChanged.bind(this);
    this.addSymbol = this.addSymbol.bind(this);
    this.addEmptyStringSymbol = this.addEmptyStringSymbol.bind(this);
    this.addAlternationSymbol = this.addAlternationSymbol.bind(this);
    this.onInputBlur = this.onInputBlur.bind(this);
  }

  inputChanged(input) {
    this.props.dispatch(setRegex(input, this.props.emptyStringSymbol, this.props.alternationSymbol));
  }

  addSymbol(symbol) {
    const regexInput = $(this[this.regexInputRef].inputRef);
    const { cursorPosition } = this.state;
    const currentVal = regexInput.val();
    const newVal = currentVal.substring(0, cursorPosition) + symbol + currentVal.substring(cursorPosition);
    regexInput.val(newVal);
    regexInput.focus();
    this.props.dispatch(setRegex(newVal, this.props.emptyStringSymbol, this.props.alternationSymbol));
    regexInput[0].setSelectionRange(cursorPosition + 1, cursorPosition + 1);
  }

  addEmptyStringSymbol() {
    this.addSymbol(this.props.emptyStringSymbol);
  }

  addAlternationSymbol() {
    this.addSymbol(this.props.alternationSymbol);
  }

  onInputBlur() {
    this.setState({ cursorPosition: this[this.regexInputRef].inputRef.selectionStart });
  }

  componentDidUpdate(prevProps) {
    const emptyStringSymbolChanged = prevProps.emptyStringSymbol !== this.props.emptyStringSymbol;
    const alternationSymbolChanged = prevProps.alternationSymbol !== this.props.alternationSymbol;
    if(emptyStringSymbolChanged || alternationSymbolChanged) {
      $(this[this.regexInputRef].inputRef).val(this.props.regex)
    }
  }

  render() {
    return (
      <div className="page-container" style={{ color: (this.props.darkTheme ? '#fff' : '#000') }}>
        <div className="regex-input-container">
          <Input
            ref={input => this[this.regexInputRef] = input}
            className='regex-input'
            onChange={(e, data) => this.inputChanged(data.value)}
            defaultValue={this.props.regex}
            onBlur={this.onInputBlur}
          />
          <Button content={this.props.emptyStringSymbol} onClick={this.addEmptyStringSymbol} />
          <Button content={this.props.alternationSymbol} onClick={this.addAlternationSymbol} />
        </div>
      </div>
    );
  }
}

export default connect(
  state => {
    const settings = getSettings(state);
    return {
      regex: getRegexString(state),
      darkTheme: settings.darkTheme,
      emptyStringSymbol: getEmptyStringSymbol(settings.emptyStringSymbol),
      alternationSymbol: getAlternationSymbol(settings.alternationSymbol)
    };
  }
)(RegexPage);