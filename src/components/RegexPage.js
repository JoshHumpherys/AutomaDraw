import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Button, Input } from 'semantic-ui-react'
import { setRegex, clearRegex } from '../actions/regex'
import { getRegexString } from '../selectors/regex'
import { getSettings } from '../selectors/settings'
import { getEmptyStringSymbol, getAlternationSymbol } from '../utility/utility'
import $ from 'jquery'

export class RegexPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      selectionStart: 0,
      selectionEnd: 0
    };

    this.inputChanged = this.inputChanged.bind(this);
    this.addSymbol = this.addSymbol.bind(this);
    this.addEmptyStringSymbol = this.addEmptyStringSymbol.bind(this);
    this.addAlternationSymbol = this.addAlternationSymbol.bind(this);
    this.onInputBlur = this.onInputBlur.bind(this);
    this.clear = this.clear.bind(this);
  }

  inputChanged(e) {
    const input = e.target.value;
    this.props.dispatch(setRegex(input, this.props.emptyStringSymbol, this.props.alternationSymbol));
  }

  addSymbol(symbol) {
    const regexInput = $(this.inputRef);
    const { selectionStart, selectionEnd } = this.state;
    const currentVal = regexInput.val();
    const beginningString = currentVal.slice(0, selectionStart);
    const endString = currentVal.slice(selectionEnd);
    const newVal = beginningString + symbol + endString;
    regexInput.val(newVal); // TODO figure out why I need to do this
    regexInput.focus();
    this.props.dispatch(setRegex(newVal, this.props.emptyStringSymbol, this.props.alternationSymbol));
    regexInput[0].setSelectionRange(selectionStart + 1, selectionStart + 1);
  }

  addEmptyStringSymbol() {
    this.addSymbol(this.props.emptyStringSymbol);
  }

  addAlternationSymbol() {
    this.addSymbol(this.props.alternationSymbol);
  }

  onInputBlur() {
    const regexInput = this.inputRef;
    this.setState({
      selectionStart: regexInput.selectionStart,
      selectionEnd: regexInput.selectionEnd
    });
  }

  clear() {
    this.props.dispatch(clearRegex());
    $(this.inputRef).val(''); // TODO figure out why I need to do this
  }

  componentDidUpdate(prevProps) {
    const emptyStringSymbolChanged = prevProps.emptyStringSymbol !== this.props.emptyStringSymbol;
    const alternationSymbolChanged = prevProps.alternationSymbol !== this.props.alternationSymbol;
    if(emptyStringSymbolChanged || alternationSymbolChanged) {
      $(this.inputRef).val(this.props.regex) // TODO figure out why I need to do this
    }
  }

  render() {
    return (
      <div className="page-container" style={{ color: (this.props.darkTheme ? '#fff' : '#000') }}>
        <div className="regex-input-container">
          <div className="ui input regex-input">
            <input
              type="text"
              ref={input => this.inputRef = input}
              onChange={e => this.inputChanged(e)}
              defaultValue={this.props.regex}
              onBlur={this.onInputBlur}
              spellCheck="false" />
          </div>
        </div>
        <div className="centered-children">
          <Button content={this.props.emptyStringSymbol} onClick={this.addEmptyStringSymbol} />
          <Button content={this.props.alternationSymbol} onClick={this.addAlternationSymbol} />
          <Button content="(" onClick={() => this.addSymbol('(')} />
          <Button content=")" onClick={() => this.addSymbol(')')} />
          <Button content="*" onClick={() => this.addSymbol('*')} />
        </div>
        <div className="centered-children">
          <Button content="Clear" onClick={this.clear} />
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
      emptyStringSymbol: settings.emptyStringSymbol,
      alternationSymbol: settings.alternationSymbol
    };
  }
)(RegexPage);