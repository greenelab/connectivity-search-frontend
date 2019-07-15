import React from 'react';
import { Component } from 'react';
import { connect } from 'react-redux';

import { NodeSearch } from '../node-search';
import { NodeResults } from '../node-results';
import { MetapathResults } from '../metapath-results';
import { cutString } from '../util/string.js';

import { fetchDefinitions } from './actions.js';
import { updateStateFromUrl } from './actions.js';
import { fetchMetapaths } from '../metapath-results/actions.js';
import './index.css';

import '../global.css';

// main app component
class App extends Component {
  // initialize component
  constructor(props) {
    super(props);

    // fetch definitions when page first loads
    this.props.dispatch(fetchDefinitions());
    // get parameters from url when page first loads
    this.updateStateFromUrl();
    // listen for back/forward navigation (history)
    window.addEventListener('popstate', this.updateStateFromUrl);
  }

  // when component updates
  componentDidUpdate(prevProps) {
    // when source/target node change
    if (
      prevProps.sourceNode.id !== this.props.sourceNode.id ||
      prevProps.targetNode.id !== this.props.targetNode.id
    ) {
      this.props.dispatch(
        fetchMetapaths(this.props.sourceNode.id, this.props.targetNode.id)
      );
    }

    this.updateTitle();
  }

  // update document title to reflect current state
  updateTitle = () => {
    const metapaths = this.props.metapaths.filter(
      (metapath) => metapath.checked
    ).length;

    const title =
      cutString(this.props.sourceNode.name || '___', 20) +
      ' ↔ ' +
      cutString(this.props.targetNode.name || '___', 20) +
      ' – ' +
      metapaths +
      ' metapaths';
    document.title = title;
  };

  // update source/target nodes, checked metapaths, etc from url
  updateStateFromUrl = () => {
    this.props.dispatch(updateStateFromUrl());
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
        <MetapathResults />
      </>
    );
  }
}
// connect component to global state
App = connect((state) => ({
  sourceNode: state.sourceNode,
  targetNode: state.targetNode,
  metapaths: state.metapaths
}))(App);
export { App };
