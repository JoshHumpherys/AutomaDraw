import { combineReducers } from 'redux'
import fsm from './fsm'
import settings from './settings'
import { routerReducer } from 'react-router-redux'

const rootReducer = combineReducers({
  routing: routerReducer,
  fsm,
  settings
});

export default rootReducer;