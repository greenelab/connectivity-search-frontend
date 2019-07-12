import React from 'react';
import { render } from 'react-dom';
import { createStore } from 'redux';
import { combineReducers } from 'redux';
import { applyMiddleware } from 'redux';
import { compose } from 'redux';
import thunk from 'redux-thunk';
import logger from 'redux-logger';
import { Provider } from 'react-redux';

import { appReducer } from './app/reducer.js';
import { App } from './app';

// clear cache when app first starts (page refresh)
window.sessionStorage.clear();

// create global state store
const reducer = combineReducers({
  app: appReducer
});
const store = createStore(reducer, compose(applyMiddleware(thunk, logger)));

// render/run app
render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
);
