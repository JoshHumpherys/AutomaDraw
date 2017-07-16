import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import { Provider } from 'react-redux'
import { createStore, compose } from 'redux'
import App from './App'
import registerServiceWorker from './registerServiceWorker'
import HomePage from './components/HomePage'
import rootReducer from './reducers/rootReducer'
import { Router, Route, hashHistory } from 'react-router'
import { syncHistoryWithStore } from 'react-router-redux'

const middleware = compose(
  window.devToolsExtension ? window.devToolsExtension() : f => f
);

const store = createStore(
  rootReducer,
  middleware
);

const history = syncHistoryWithStore(hashHistory, store);

ReactDOM.render(
  <Provider store={store}>
    <App>
      <Router history={history}>
        <Route path="/" component={HomePage} />
      </Router>
    </App>
  </Provider>,
  document.getElementById('root')
);

registerServiceWorker(); // TODO learn how to use this

/*
<Router history={history}>
    <Route path="/" component={HomePage} />
    <Route path="/login" component={LoginPage} />
</Router>
*/