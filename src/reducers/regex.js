import * as actionTypes from '../constants/actionTypes'

export default function regex(
  state = {
    regex: ''
  },
  action) {
  switch (action.type) {
    case actionTypes.REGEX_SET: {
      return { ...state, regex: action.payload.regex };
    }
    default: {
      return state;
    }
  }
}