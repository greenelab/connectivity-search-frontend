import React from 'react';
import { Component } from 'react';
import { connect } from 'react-redux';

import { Header } from './header.js';
import { NodeSearch } from './node-search.js';
import { NodeResults } from './node-results.js';
import { MetapathResults } from './metapath-results.js';
import { PathResults } from './path-results.js';
import { PathGraph } from './path-graph.js';
import { getMetagraph } from './backend-query.js';
import { getHetioDefinitions } from './backend-query.js';
import { getHetioStyles } from './backend-query.js';
import { getHetmechDefinitions } from './backend-query.js';
import { lookupNodeById } from './backend-query.js';
import { searchMetapaths } from './backend-query.js';
import { searchPaths } from './backend-query.js';
import { setDefinitions } from './actions.js';
import { updateSourceTargetNodes } from './actions.js';
import { updateMetapaths } from './actions.js';
import { updatePathQueries } from './actions.js';
import { cutString } from './util.js';
import './styles.css';

// main app component
class App extends Component {
  // initialize component
  constructor(props) {
    super(props);

    this.fetchDefinitions = this.fetchDefinitions.bind(this);
    this.updateStateFromUrl = this.updateStateFromUrl.bind(this);
    this.updateMetapaths = this.updateMetapaths.bind(this);
    this.updatePaths = this.updatePaths.bind(this);

    // fetch definitions when page first loads
    this.fetchDefinitions();
    // get parameters from url when page first loads
    this.updateStateFromUrl();
    // listen for back/forward navigation (history)
    window.addEventListener('popstate', this.updateStateFromUrl);
  }

  // when component changes
  componentDidUpdate(prevProps) {
    if (
      prevProps.sourceNode.id !== this.props.sourceNode.id ||
      prevProps.targetNode.id !== this.props.targetNode.id
    )
      this.onNodeChange();
    else if (prevProps.metapaths !== this.props.metapaths)
      this.onMetapathChange();

    // update document title after state change
    this.updateTitle();
  }

  // get metagraph, hetio definitions, and hetmech definitions
  fetchDefinitions() {
    this.props.dispatch((dispatch) => {
      // wait until all fetches return to update state
      const promises = [
        getMetagraph(),
        getHetioDefinitions(),
        getHetioStyles(),
        getHetmechDefinitions()
      ];
      Promise.all(promises).then((results) => {
        dispatch(
          setDefinitions({
            metagraph: results[0],
            hetioDefinitions: results[1],
            hetioStyles: results[2],
            hetmechDefinitions: results[3]
          })
        );
      });
    });
  }

  // update source/target nodes, checked metapaths, etc from url
  updateStateFromUrl(event) {
    this.props.dispatch((dispatch) => {
      const params = new URLSearchParams(window.location.search);
      const source = params.get('source');
      const target = params.get('target');
      const metapaths = params.get('metapaths');
      let checkedMetapaths;
      if (metapaths)
        checkedMetapaths = metapaths.split(',');
      else
        checkedMetapaths = [];

      const promises = [
        lookupNodeById(source),
        lookupNodeById(target),
        searchMetapaths(source, target)
      ];

      // once all queries have returned
      Promise.all(promises).then(
        ([newSourceNode, newTargetNode, newMetapaths]) => {
          // by the time promises return, url may be different (eg if user
          // clicks back/forward quickly). if different, exit and allow more
          // recent call to change state
          const params = new URLSearchParams(window.location.search);
          if (
            params.get('source') !== source ||
            params.get('target') !== target ||
            params.get('metapaths') !== metapaths
          )
            return;

          if (!newMetapaths)
            newMetapaths = [];

          // check metapaths based on url
          for (const newMetapath of newMetapaths) {
            if (checkedMetapaths.includes(newMetapath.metapath_abbreviation))
              newMetapath.checked = true;
          }

          // update global state
          dispatch(
            updateSourceTargetNodes({
              sourceNode: newSourceNode,
              targetNode: newTargetNode,
              dontUpdateUrl: true
            })
          );
          dispatch(
            updateMetapaths({
              metapaths: newMetapaths,
              dontUpdateUrl: true,
              dontTransferState: true
            })
          );
        }
      );
    });
  }

  // update document title to reflect current state
  updateTitle() {
    const checkedMetapaths = [];
    for (const metapath of this.props.metapaths) {
      if (metapath.checked)
        checkedMetapaths.push(metapath.metapath_abbreviation);
    }

    // update document/tab title
    const title =
      cutString(this.props.sourceNode.name || '___', 20) +
      ' ↔ ' +
      cutString(this.props.targetNode.name || '___', 20) +
      ' – ' +
      checkedMetapaths.length +
      ' metapaths';
    document.title = title;
  }

  // when source/target node change
  onNodeChange() {
    this.updateMetapaths();
  }

  // update metapaths (node pair query results) when source/target node change
  updateMetapaths() {
    this.props.dispatch((dispatch) =>
      searchMetapaths(this.props.sourceNode.id, this.props.targetNode.id).then(
        (results) =>
          dispatch(
            updateMetapaths({
              metapaths: results
            })
          )
      )
    );
  }

  // when checked metapaths change
  onMetapathChange() {
    this.updatePaths();
  }

  // update paths when checked metapaths change
  updatePaths() {
    this.props.dispatch((dispatch) => {
      // fetch paths for all checked metapaths
      const promises = [];
      for (const metapath of this.props.metapaths) {
        if (metapath.checked) {
          promises.push(
            searchPaths(
              this.props.sourceNode.id,
              this.props.targetNode.id,
              metapath.metapath_abbreviation
            )
          );
        }
      }

      // update path queries when all queries have returned
      Promise.all(promises).then((results) => {
        dispatch(
          updatePathQueries({
            pathQueries: results
          })
        );
      });
    });
  }

  // display component
  render() {
    return (
      <>
        <Header />
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
  metapaths: state.metapaths
}))(App);

export { App };
