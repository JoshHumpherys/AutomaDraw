import { combineReducers } from 'redux'
import fsm from './fsm'
import pda from './pda'
import tm from './tm'
import regex from './regex'
import modal from './modal'
import settings from './settings'
import { routerReducer } from 'react-router-redux'

const rootReducer = combineReducers({
  routing: routerReducer,
  fsm,
  pda,
  tm,
  regex,
  modal,
  settings
});

export default rootReducer;