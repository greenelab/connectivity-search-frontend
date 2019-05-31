import React from 'react';
import { render } from 'react-dom';
import { createStore } from 'redux';
import { applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { Provider } from 'react-redux';

import { Reducer } from './reducers.js';
import { App } from './app.js';

// clear cache when app first starts (page refresh)
window.sessionStorage.clear();

// create global state store
const store = createStore(Reducer, applyMiddleware(thunk));

// render/run app
render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
);
