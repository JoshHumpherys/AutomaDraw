import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import { Provider } from 'react-redux'
import { createStore, compose } from 'redux'
import registerServiceWorker from './registerServiceWorker'
import rootReducer from './reducers/rootReducer'
import { Router, Route, browserHistory } from 'react-router'
import { syncHistoryWithStore } from 'react-router-redux'

import App from './App'
import HomePage from './components/HomePage'
import FsmPage from './components/FsmPage'
import PdaPage from './components/PdaPage'
import TmPage from './components/TmPage'
import RegexPage from './components/RegexPage'
import UnrestrictedPage from './components/UnrestrictedPage'
import ContextSensitivePage from './components/ContextSensitivePage'
import ContextFreePage from './components/ContextFreePage'
import RegularPage from './components/RegularPage'

const middleware = compose(
  window.devToolsExtension ? window.devToolsExtension() : f => f
);

const store = createStore(
  rootReducer,
  middleware
);

const history = syncHistoryWithStore(browserHistory, store);

ReactDOM.render(
  <Provider store={store}>
    <App>
      <Router history={browserHistory}>
        <Route path="/" component={HomePage} />
        <Route path="/fsm" component={FsmPage} />
        <Route path="/pda" component={PdaPage} />
        <Route path="/tm" component={TmPage} />
        <Route path="/regex" component={RegexPage} />
        <Route path="/unrestricted" component={UnrestrictedPage} />
        <Route path="/contextsensitive" component={ContextSensitivePage} />
        <Route path="/contextfree" component={ContextFreePage} />
        <Route path="/regular" component={RegularPage} />
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