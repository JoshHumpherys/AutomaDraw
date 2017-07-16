import { combineReducers } from 'redux'
import count from './count'
import { routerReducer } from 'react-router-redux'

const rootReducer = combineReducers({
  routing: routerReducer,
  count
});

export default rootReducer;