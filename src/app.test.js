import React from 'react';
import { render } from 'react-dom';
import { unmountComponentAtNode } from 'react-dom';
import { createStore } from 'redux';
import { applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { Provider } from 'react-redux';

import { Reducer } from './reducers.js';
import { App } from './app.js';

it('renders without crashing', () => {
  const div = document.createElement('div');
  const store = createStore(Reducer, applyMiddleware(thunk));
  div.id = 'root';
  render(
    <Provider store={store}>
      <App />
    </Provider>,
    div
  );
  unmountComponentAtNode(div);
});
