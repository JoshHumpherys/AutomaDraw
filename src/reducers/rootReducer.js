import { combineReducers } from 'redux'
import fsm from './fsm'
import regex from './regex'
import settings from './settings'
import { routerReducer } from 'react-router-redux'

const rootReducer = combineReducers({
  routing: routerReducer,
  fsm,
  regex,
  settings
});

export default rootReducer;