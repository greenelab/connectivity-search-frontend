import React from 'react';
import { Component } from 'react';
import { connect } from 'react-redux';

import { NodeSearch } from '../node-search';
import { NodeResults } from '../node-results';
import { MetapathResults } from '../metapath-results';
import { PathResults } from '../path-results';
import { cutString } from '../util/string.js';
import { loadStateFromUrl } from './actions.js';
import { compareObjects } from '../util/object';
import { fetchAndSetDefinitions } from './actions.js';
import { fetchAndSetMetapaths } from '../metapath-results/actions.js';
import { fetchAndSetPaths } from '../path-results/actions';

import './index.css';

import '../global.css';

// main app component
class App extends Component {
  // initialize component
  constructor(props) {
    super(props);

    // fetch definitions when page first loads
    this.props.dispatch(fetchAndSetDefinitions());
    // get parameters from url when page first loads
    this.loadStateFromUrl();
    // listen for back/forward navigation (history)
    window.addEventListener('popstate', this.loadStateFromUrl);
  }

  // when component updates
  componentDidUpdate(prevProps) {
    // if target and source were swapped
    const swapped =
      compareObjects(prevProps.targetNode, this.props.sourceNode) &&
      compareObjects(prevProps.sourceNode, this.props.targetNode);

    // normally the updateUrl flag is set to true by the action that sets
    // the new source/target state. the swap action does not set the flag,
    // so it can be set here instead, so that url can also be updated with
    // the new metapath abbreviations resulting from the swap

    // when source/target node change, update metapaths
    if (
      prevProps.sourceNode.id !== this.props.sourceNode.id ||
      prevProps.targetNode.id !== this.props.targetNode.id
    ) {
      this.props.dispatch(
        fetchAndSetMetapaths({
          sourceNodeId: this.props.sourceNode.id,
          targetNodeId: this.props.targetNode.id,
          updateUrl: swapped,
          preserveChecks: true
        })
      );
    }

    // when metapaths change, update paths
    if (!compareObjects(prevProps.metapaths, this.props.metapaths)) {
      this.props.dispatch(
        fetchAndSetPaths({
          sourceNodeId: this.props.sourceNode.id,
          targetNodeId: this.props.targetNode.id,
          metapaths: this.props.metapaths,
          preserveChecks: true
        })
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

  // load source/target nodes, checked metapaths, etc from url
  loadStateFromUrl = () => {
    this.props.dispatch(loadStateFromUrl());
  };

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
        <PathResults />
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
