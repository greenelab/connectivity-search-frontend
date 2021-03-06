import React from 'react';
import { Component } from 'react';
import { connect } from 'react-redux';

import { NodeSearch } from '../node-search';
import { NodeResults } from '../node-results';
import { MetapathResults } from '../metapath-results';
import { PathResults } from '../path-results';
import { PathGraph } from '../path-graph';
import { loadStateFromUrl } from './actions.js';
import { compareObjects } from 'hetio-frontend-components';
import { fetchAndSetDefinitions } from './actions.js';
import { fetchAndSetMetapaths } from '../metapath-results/actions.js';
import { fetchAndSetPaths } from '../path-results/actions';

import './index.css';

// Note about class arrow functions vs normal functions:
//
// Arrow functions automatically bind "this", but do not get added to the class
// prototype, and thus get duplicated for every instance of the class. For
// convenience, syntax aesthetics, and mitigation of human errors (forgetting
// to bind "this"), arrow functions are used in classes, with two exceptions:
// 1) react life-cycle methods (componentDidUpdate, render, etc) and 2) in
// cases where there will be many instances of the class (say, > 10), like the
// reusable "widgets" in /components.

// main app component
class App extends Component {
  // initialize component
  constructor(props) {
    super(props);

    // fetch definitions when page first loads
    this.props.dispatch(fetchAndSetDefinitions());
  }

  // when component mounds
  componentDidMount() {
    // get parameters from url when page first loads
    this.loadStateFromUrl();
    // listen for back/forward navigation (history)
    window.addEventListener('popstate', this.loadStateFromUrl);
  }

  // when component updates
  componentDidUpdate(prevProps) {
    // when source/target node change, update metapaths
    if (
      (prevProps.sourceNode.id !== this.props.sourceNode.id ||
        prevProps.targetNode.id !== this.props.targetNode.id) &&
      (this.props.sourceNode.id || this.props.targetNode.id)
    ) {
      this.props.dispatch(
        fetchAndSetMetapaths({
          sourceNodeId: this.props.sourceNode.id,
          targetNodeId: this.props.targetNode.id,
          precomputedOnly: this.props.precomputedMetapathsOnly,
          updateUrl: true,
          preserveChecks: true
        })
      );
    }

    // when precomputedMetapathsOnly changes, update metapaths
    if (
      prevProps.precomputedMetapathsOnly !==
        this.props.precomputedMetapathsOnly &&
      this.props.sourceNode.id &&
      this.props.targetNode.id
    ) {
      this.props.dispatch(
        fetchAndSetMetapaths({
          sourceNodeId: this.props.sourceNode.id,
          targetNodeId: this.props.targetNode.id,
          precomputedOnly: this.props.precomputedMetapathsOnly,
          updateUrl: true,
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
  }

  // when component unmounts
  componentWillUnmount() {
    window.removeEventListener('popstate', this.loadStateFromUrl);
  }

  // load source/target nodes, checked metapaths, etc from url
  loadStateFromUrl = () => {
    this.props.dispatch(loadStateFromUrl());
  };

  // display component
  render() {
    return (
      <>
        <NodeSearch />
        <NodeResults />
        <MetapathResults />
        <PathResults />
        <PathGraph />
      </>
    );
  }
}
// connect component to global state
App = connect((state) => ({
  sourceNode: state.sourceNode,
  targetNode: state.targetNode,
  metapaths: state.metapaths,
  precomputedMetapathsOnly: state.precomputedMetapathsOnly
}))(App);
export { App };
