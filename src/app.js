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
import { setState } from './actions.js';
import { compareArrays, transferObjectProps } from './util.js';
import './styles.css';

// main app component
class App extends Component {
  // initialize component
  constructor(props) {
    super(props);

    this.fetchDefinitions = this.fetchDefinitions.bind(this);
    this.updateStateFromUrl = this.updateStateFromUrl.bind(this);
    this.updateUrlFromState = this.updateUrlFromState.bind(this);

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
    else if (prevProps.metapaths !== this.props.metapaths) {
      this.onMetapathChange();
      this.updateUrlFromState();
    }
  }

  // when source and/or target node changes
  onNodeChange() {
    this.props.dispatch((dispatch) => {
      // accumulate results
      const results = {};

      // query metapaths
      searchMetapaths(this.props.sourceNode.id, this.props.targetNode.id)
        .then((metapathResults) => (results.metapaths = metapathResults))
        // query paths
        .then(() => {
          // persist metapath checks
          transferObjectProps(
            this.props.metapaths,
            results.metapaths,
            ['id'],
            ['checked']
          );
          // fetch paths for checked metapaths
          const promises = [];
          for (const metapath of results.metapaths) {
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
          return Promise.all(promises);
        })
        .then((pathQueryResults) => (results.pathQueries = pathQueryResults))
        // set global state
        .then(() => {
          dispatch(setState(results, true));
        });
    });
  }

  // when available or checked metapaths change
  onMetapathChange() {
    this.props.dispatch((dispatch) => {
      // fetch paths for checked metapaths
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
      Promise.all(promises).then((pathQueryResults) => {
        dispatch(
          setState(
            {
              pathQueries: pathQueryResults
            },
            true
          )
        );
      });
    });
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
          setState({
            metagraph: results[0],
            hetioDefinitions: results[1],
            hetioStyles: results[2],
            hetmechDefinitions: results[3]
          })
        );
      });
    });
  }

  // get source node id according to url
  getUrlSourceNodeId() {
    return new URLSearchParams(window.location.search).get('source');
  }

  // get target node id according to url
  getUrlTargetNodeId() {
    return new URLSearchParams(window.location.search).get('target');
  }

  // get checked metapaths according to url
  getUrlCheckedMetapaths() {
    const checkedMetapaths = new URLSearchParams(window.location.search).get(
      'metapaths'
    );
    if (checkedMetapaths)
      return checkedMetapaths.split(',').sort();
    else
      return [];
  }

  // get source node id according to global state
  getStateSourceNodeId() {
    return String(this.props.sourceNode.id);
  }

  // get target node id according to global state
  getStateTargetNodeId() {
    return String(this.props.targetNode.id);
  }

  // get checked metapaths according to global state
  getStateCheckedMetapaths() {
    const checkedMetapaths = [];
    for (const metapath of this.props.metapaths) {
      if (metapath.checked)
        checkedMetapaths.push(metapath.metapath_abbreviation);
    }
    return checkedMetapaths.sort();
  }

  // check if url parameters are same as global state
  compareUrlToState() {
    return (
      this.getUrlSourceNodeId() === this.getStateSourceNodeId() &&
      this.getUrlTargetNodeId() === this.getStateTargetNodeId() &&
      compareArrays(
        this.getUrlCheckedMetapaths(),
        this.getStateCheckedMetapaths()
      )
    );
  }

  // update source/target nodes, metapaths, etc from url
  updateStateFromUrl() {
    console.log('updateStateFromUrl');
    this.props.dispatch((dispatch) => {
      // query new nodes and metapaths
      const promises = [
        lookupNodeById(this.getUrlSourceNodeId()),
        lookupNodeById(this.getUrlTargetNodeId()),
        searchMetapaths(this.getUrlSourceNodeId(), this.getUrlTargetNodeId())
      ];

      // once all queries have returned
      Promise.all(promises).then((results) => {
        const newSourceNode = results[0];
        const newTargetNode = results[1];
        const newMetapaths = results[2];
        console.log(newSourceNode.id, newTargetNode.id);

        // check metapaths based on url
        for (const newMetapath of newMetapaths) {
          if (
            this.getUrlCheckedMetapaths().indexOf(
              newMetapath.metapath_abbreviation
            ) !== -1
          )
            newMetapath.checked = true;
        }

        // update global state
        dispatch(
          setState({
            sourceNode: newSourceNode,
            targetNode: newTargetNode,
            metapaths: newMetapaths
          })
        );
      });
    });
  }

  // update url from source/target nodes, metapaths, etc
  updateUrlFromState() {
    // if url matches global state, then this function being called after
    // user navigation, and no reason to update url again, so exit
    if (this.compareUrlToState())
      return;

    console.log('updateUrlFromState');

    const stateSourceNodeId = this.getStateSourceNodeId();
    const stateTargetNodeId = this.getStateTargetNodeId();
    const stateCheckedMetapaths = this.getStateCheckedMetapaths();

    // new url
    const newParams = new URLSearchParams();

    // set url parameters
    if (stateSourceNodeId !== undefined)
      newParams.set('source', stateSourceNodeId);
    if (stateTargetNodeId !== undefined)
      newParams.set('target', stateTargetNodeId);
    if (stateCheckedMetapaths.length > 0)
      newParams.set('metapaths', stateCheckedMetapaths.join(','));

    // make search string
    let search = newParams.toString();
    if (search.length > 0)
      search = '?' + search;

    // navigate to new url
    const url = window.location.origin + window.location.pathname + search;
    window.history.pushState({}, '', url);

    // update document/tab title
    const title =
      (this.props.sourceNode.name || '___') +
      ' → ' +
      (this.props.targetNode.name || '___') +
      ' — ' +
      stateCheckedMetapaths.length +
      ' metapaths';
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
