import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Button, Input } from 'semantic-ui-react'
import { setRegex } from '../actions/regex'
import { getRegex } from '../selectors/regex'
import { getSettings } from '../selectors/settings'
import { getEmptyStringSymbol, getAlternationSymbol } from '../utility/utility'
import $ from 'jquery'

export class RegexPage extends Component {
  constructor(props) {
    super(props);

    this.regexInputRef = 'regex_input_ref';

    this.addSymbol = this.addSymbol.bind(this);
    this.setRegex = this.setRegex.bind(this);
  }

  addSymbol(symbol) {
    const regexInputRef = $(this[this.regexInputRef].inputRef);
    const newRegex = regexInputRef.val() + symbol;
    regexInputRef.val(newRegex);
    regexInputRef.focus();
  }

  setRegex() {
    const newRegex = $(this[this.regexInputRef].inputRef).val();
    this.props.dispatch(setRegex(newRegex));
  }

  render() {
    const emptyStringSymbol = getEmptyStringSymbol(this.props.settings.emptyStringSymbol);
    const alternationSymbol = getAlternationSymbol(this.props.settings.alternationSymbol);
    return (
      <div className="page-container" style={{ color: (this.props.settings.darkTheme ? '#fff' : '#000') }}>
        <div className="regex-input-container">
          <Input
            ref={input => this[this.regexInputRef] = input}
            className='regex-input'
            onBlur={this.setRegex}
            defaultValue={this.props.regex.regex}
          />
          <Button onClick={() => this.addSymbol(emptyStringSymbol)} content={emptyStringSymbol} />
          <Button onClick={() => this.addSymbol(alternationSymbol)} content={alternationSymbol} />
        </div>
      </div>
    );
  }
}

export default connect(
  state => ({
    regex: getRegex(state),
    settings: getSettings(state)
  })
)(RegexPage);