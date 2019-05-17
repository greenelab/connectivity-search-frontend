import { transferObjectProps } from './util';
import { transferQueryProps } from './util';
import { copyObject } from './util';

// map previous global state to new global state based on action
export function Reducer(prevState, action) {
  // start with previous state
  let newState;
  if (prevState === undefined)
    newState = {};
  else
    newState = { ...prevState };

  // detect action type and set new state accordingly
  switch (action.type) {
    // set definitions
    case 'set_definitions':
      if (action.payload.metagraph !== undefined)
        newState.metagraph = copyObject(action.payload.metagraph);
      if (action.payload.hetioDefinitions !== undefined)
        newState.hetioDefinitions = copyObject(action.payload.hetioDefinitions);
      if (action.payload.hetioStyles !== undefined)
        newState.hetioStyles = copyObject(action.payload.hetioStyles);
      if (action.payload.hetmechDefinitions !== undefined) {
        newState.hetmechDefinitions = copyObject(
          action.payload.hetmechDefinitions
        );
      }
      break;

    // update source and/or target node
    case 'update_source_target_nodes':
      if (action.payload.sourceNode !== undefined)
        newState.sourceNode = copyObject(action.payload.sourceNode);
      if (action.payload.targetNode !== undefined)
        newState.targetNode = copyObject(action.payload.targetNode);
      break;

    // swap source/target nodes
    case 'swap_source_target_nodes':
      if (prevState.sourceNode && prevState.targetNode) {
        newState.sourceNode = copyObject(prevState.targetNode);
        newState.targetNode = copyObject(prevState.sourceNode);
      }
      break;

    // update metapaths
    case 'update_metapaths':
      if (action.payload.metapaths !== undefined) {
        newState.metapaths = copyObject(action.payload.metapaths);
        if (action.preserveChecks === true) {
          transferObjectProps(
            prevState.metapaths,
            newState.metapaths,
            ['id'],
            ['checked']
          );
        }
      }
      break;

    // update path queries
    case 'update_path_queries':
      if (action.payload.pathQueries !== undefined) {
        newState.pathQueries = copyObject(action.payload.pathQueries);
        if (action.preserveChecks === true) {
          transferQueryProps(
            prevState.pathQueries,
            newState.pathQueries,
            'paths',
            ['node_ids', 'rel_ids'],
            ['checked', 'highlighted']
          );
        }
      }
      break;

    default:
      break;
  }

  // make sure critical variables defined
  if (!newState.metagraph)
    newState.metagraph = {};
  if (!newState.hetioDefinitions)
    newState.hetioDefinitions = {};
  if (!newState.hetioStyles)
    newState.hetioStyles = {};
  if (!newState.hetmechDefinitions)
    newState.hetmechDefinitions = {};
  if (!newState.sourceNode)
    newState.sourceNode = {};
  if (!newState.targetNode)
    newState.targetNode = {};
  if (!newState.metapaths)
    newState.metapaths = [];
  if (!newState.pathQueries)
    newState.pathQueries = [];

  // update url after state change unless on redux initialization or
  // explicitly bypassed
  if (action.updateUrl === true && prevState !== undefined)
    updateUrl(newState);

  // set new state
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
