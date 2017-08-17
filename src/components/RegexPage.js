import React, { Component } from 'react'
import { connect } from 'react-redux'
import { getSettings } from '../selectors/settings'
import { Button, Input } from 'semantic-ui-react'
import $ from 'jquery'

import { getEmptyStringSymbol, getAlternationSymbol } from '../utility/utility'

export class RegexPage extends Component {
  constructor(props) {
    super(props);

    this.regexInputRef = 'regex_input_ref';

    this.addSymbol = this.addSymbol.bind(this);
  }

  addSymbol(symbol) {
    const regexInputRef = $(this[this.regexInputRef].inputRef);
    regexInputRef.val(regexInputRef.val() + symbol);
    regexInputRef.focus();
  }

  render() {
    const emptyStringSymbol = getEmptyStringSymbol(this.props.settings.emptyStringSymbol);
    const alternationSymbol = getAlternationSymbol(this.props.settings.alternationSymbol);
    return (
      <div className="page-container" style={{ color: (this.props.settings.darkTheme ? '#fff' : '#000') }}>
        <div className="regex-input-container">
          <Input ref={input => this[this.regexInputRef] = input} className='regex-input' />
          <Button onClick={() => this.addSymbol(emptyStringSymbol)} content={emptyStringSymbol} />
          <Button onClick={() => this.addSymbol(alternationSymbol)} content={alternationSymbol} />
        </div>
      </div>
    );
  }
}

export default connect(
  state => ({
    settings: getSettings(state)
  })
)(RegexPage);