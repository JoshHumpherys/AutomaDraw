import { combineReducers } from 'redux'
import fsm from './fsm'
import { routerReducer } from 'react-router-redux'

const rootReducer = combineReducers({
  routing: routerReducer,
  fsm
});

export default rootReducer;