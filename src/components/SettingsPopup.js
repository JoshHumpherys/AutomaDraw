import React, { Component } from 'react'
import { connect } from 'react-redux'
import { getSettings } from '../selectors/settings'
import { Checkbox, Dropdown } from 'semantic-ui-react'
import { setDarkTheme, setEmptyStringSymbol, setAlternationSymbol } from '../actions/settings'

import * as emptyStringSymbols from '../constants/emptyStringSymbols'
import * as alternationSymbols from '../constants/alternationSymbols'

export class SettingsPopup extends Component {
  render() {
    return (
      <div>
        <div>
          <h4>Dark Theme</h4>
          <Checkbox
            toggle
            defaultChecked={this.props.settings.darkTheme}
            onChange={(e, data) => this.props.dispatch(setDarkTheme(data.checked))}
          />
        </div>
        <br />
        <div>
          <h4>Empty String Symbol</h4>
          <Dropdown
            defaultValue={this.props.settings.emptyStringSymbol}
            fluid
            selection
            options={
              [
                { text: 'Lambda', value: emptyStringSymbols.LAMBDA },
                { text: 'Epsilon', value: emptyStringSymbols.EPSILON }
              ]
            }
            onChange={(e, data) => {
              this.props.dispatch(setEmptyStringSymbol(this.props.settings.emptyStringSymbol, data.value));
            }}
          />
        </div>
        <br />
        <div>
          <h4>Alternation Symbol</h4>
          <Dropdown
            defaultValue={this.props.settings.alternationSymbol}
            fluid
            selection
            options={
              [
                { text: 'Pipe', value: alternationSymbols.PIPE },
                { text: 'Union', value: alternationSymbols.UNION },
                { text: 'Plus', value: alternationSymbols.PLUS },
                { text: 'Logical Or', value: alternationSymbols.LOGICAL_OR }
              ]
            }
            onChange={(e, data) => {
              this.props.dispatch(setAlternationSymbol(this.props.settings.alternationSymbol, data.value));
            }}
          />
        </div>
      </div>
    );
  }
}

export default connect(
  state => ({
    settings: getSettings(state)
  })
)(SettingsPopup);