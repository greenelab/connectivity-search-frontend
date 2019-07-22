import { metagraph } from './app/reducers.js';
import { hetioStyles } from './app/reducers.js';
import { tooltipDefinitions } from './app/reducers.js';

import { sourceNode } from './node-search/reducers.js';
import { targetNode } from './node-search/reducers.js';

import { metapaths } from './metapath-results/reducers.js';

import { paths } from './path-results/reducers.js';
import { nodes } from './path-results/reducers.js';
import { relationships } from './path-results/reducers.js';

import { graph } from './path-graph/reducers.js';

import { copyObject } from './util/object.js';

// master combined reducer
export function Reducer(state = {}, action) {
  // make deep copy of old state into new state
  let newState = copyObject(state);

  // assemble new state from individual reducers
  newState = {
    metagraph: metagraph(newState.metagraph, action),
    hetioStyles: hetioStyles(newState.hetioStyles, action),
    tooltipDefinitions: tooltipDefinitions(newState.tooltipDefinitions, action),
    sourceNode: sourceNode(newState, action),
    targetNode: targetNode(newState, action),
    metapaths: metapaths(newState.metapaths, action),
    paths: paths(newState, action),
    nodes: nodes(newState.nodes, action),
    relationships: relationships(newState.relationships, action),
    graph: graph(newState, action)
  };

  // if explicitly specified, update url to match state
  if (action.payload && action.payload.updateUrl === true)
    updateUrl(newState);

  return newState;
}

// update url to reflect current state
function updateUrl(state) {
  // get checked metapaths
  const checkedMetapaths = [];
  for (const metapath of state.metapaths) {
    if (metapath.checked)
      checkedMetapaths.push(metapath.metapath_abbreviation);
  }

  // sort to keep order predictable
  checkedMetapaths.sort();

  // new url
  const newParams = new URLSearchParams();

  // set url parameters
  if (state.sourceNode.id !== undefined)
    newParams.set('source', state.sourceNode.id);
  if (state.targetNode.id !== undefined)
    newParams.set('target', state.targetNode.id);
  if (checkedMetapaths.length > 0)
    newParams.set('metapaths', checkedMetapaths.join(','));

  // make search string
  let search = newParams.toString();
  if (search.length > 0)
    search = '?' + search;

  // if url already matches state, dont push another history entry
  if (search === window.location.search)
    return;

  // navigate to new url
  const url = window.location.origin + window.location.pathname + search;
  window.history.pushState({}, '', url);
}
