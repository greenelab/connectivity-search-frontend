import React from 'react';
import { Component } from 'react';
import { connect } from 'react-redux';

import { Header } from './header.js';
import { NodeSearch } from './node-search.js';
import { NodeResults } from './node-results.js';
import { MetapathResults } from './metapath-results.js';
import { lookupNodeById } from './backend-query.js';
import { searchMetapaths } from './backend-query.js';
import { updateSourceTargetNodes } from './actions.js';
import { updateMetapaths } from './actions.js';
import './styles.css';

// main app component
class App extends Component {
  // initialize component
  constructor(props) {
    super(props);

    this.updateNodesFromUrl = this.updateNodesFromUrl.bind(this);
    this.updateMetapaths = this.updateMetapaths.bind(this);
    this.updateHistory = this.updateHistory.bind(this);
    this.updateTitle = this.updateTitle.bind(this);

    // get parameters from url when page first loads
    this.updateNodesFromUrl();
    // listen for back/forward navigation (history)
    window.addEventListener('popstate', this.updateNodesFromUrl);
  }

  // when component changes
  componentDidUpdate(prevProps) {
    if (
      prevProps.sourceNode !== this.props.sourceNode ||
      prevProps.targetNode !== this.props.targetNode
    )
      this.onNodeChange();
  }

  // update source/target nodes from url
  updateNodesFromUrl() {
    this.props.dispatch((dispatch) => {
      const params = new URLSearchParams(window.location.search);
      const sourceNodeId = params.get('source');
      const targetNodeId = params.get('target');

      // wait until both node searches return to update state
      const promises = [
        lookupNodeById(sourceNodeId),
        lookupNodeById(targetNodeId)
      ];
      Promise.all(promises).then((results) => {
        dispatch(
          updateSourceTargetNodes({
            sourceNode: results[0],
            targetNode: results[1]
          })
        );
      });
    });
  }

  // when source/target node change
  onNodeChange() {
    // update history url before title to make sure title gets changed for
    // correct page
    this.updateMetapaths();
    this.updateHistory();
    this.updateTitle();
  }

  // update metapaths (node pair query results) when source/target node change
  updateMetapaths() {
    this.props.dispatch((dispatch) => {
      if (this.props.sourceNode.id && this.props.targetNode.id) {
        searchMetapaths(
          this.props.sourceNode.id,
          this.props.targetNode.id
        ).then((results) =>
          dispatch(
            updateMetapaths({
              metapaths: results
            })
          )
        );
      } else {
        dispatch(
          updateMetapaths({
            metapaths: []
          })
        );
      }
    });
  }

  // add history entry for source/target node without navigating page
  updateHistory() {
    const oldParams = new URLSearchParams(window.location.search);
    const newParams = new URLSearchParams();

    if (this.props.sourceNode.id)
      newParams.set('source', this.props.sourceNode.id);
    if (this.props.targetNode.id)
      newParams.set('target', this.props.targetNode.id);

    // if url already matches source/target nodes, don't update.
    // will prevent extra history entry from getting source/target from url on
    // page load
    if (
      (oldParams.get('source') === newParams.get('source')) &
      (oldParams.get('target') === newParams.get('target'))
    )
      return;

    let search = newParams.toString();
    if (search.length > 0)
      search = '?' + search;

    const url = window.location.origin + window.location.pathname + search;
    window.history.pushState({}, '', url);
  }

  // update page title based on source/target node
  updateTitle() {
    if (!this.props.sourceNode.id && !this.props.targetNode.id)
      return;
    const title =
      'hetmech · ' +
      (this.props.sourceNode.name || '___') +
      ' → ' +
      (this.props.targetNode.name || '___');
    document.title = title;
  }

  // display component
  render() {
    return (
      <>
        <Header />
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
  targetNode: state.targetNode
}))(App);

export { App };