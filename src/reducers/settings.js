import * as actionTypes from '../constants/actionTypes'
import { stringToArray } from '../utility/utility'
import { OrderedSet, OrderedMap } from 'immutable';

export default function fsm(
  state = {
    darkTheme: true
  },
  action) {
  switch (action.type) {
    case actionTypes.SETTINGS_DARK_THEME_SET: {
      return { ...state, darkTheme: action.payload.darkTheme };
    }
    default: {
      return state;
    }
  }
}