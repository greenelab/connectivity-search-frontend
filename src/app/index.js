import React from 'react';
import { Component } from 'react';
import { connect } from 'react-redux';

import { NodeSearch } from '../node-search';
import { NodeResults } from '../node-results';

import { fetchDefinitions } from './actions.js';
import './index.css';

import '../global.css';

// main app component
class App extends Component {
  // initialize component
  constructor(props) {
    super(props);

    // fetch definitions when page first loads
    this.props.dispatch(fetchDefinitions());
  }

  // display component
  render() {
    return (
      <>
        {/* <link
          rel='stylesheet'
          type='text/css'
          href='https://het.io/global.css'
        /> */}
        <NodeSearch />
        <NodeResults />
      </>
    );
  }
}
// connect component to global state
App = connect()(App);

export { App };
