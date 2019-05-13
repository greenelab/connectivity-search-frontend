import { transferObjectProps } from './util';
import { transferQueryProps } from './util';

// map previous global state to new global state based on action
export function Reducer(prevState = {}, action) {
  // start with previous state
  const newState = { ...prevState };

  // detect action type and set new state accordingly
  switch (action.type) {
    // set definitions
    case 'set_definitions':
      if (action.payload.metagraph !== undefined)
        newState.metagraph = action.payload.metagraph;
      if (action.payload.hetioDefinitions !== undefined)
        newState.hetioDefinitions = action.payload.hetioDefinitions;
      if (action.payload.hetioStyles !== undefined)
        newState.hetioStyles = action.payload.hetioStyles;
      if (action.payload.hetmechDefinitions !== undefined)
        newState.hetmechDefinitions = action.payload.hetmechDefinitions;
      break;

    // update source and/or target node
    case 'update_source_target_nodes':
      if (action.payload.sourceNode !== undefined)
        newState.sourceNode = action.payload.sourceNode;
      if (action.payload.targetNode !== undefined)
        newState.targetNode = action.payload.targetNode;
      break;

    // swap source/target nodes
    case 'swap_source_target_nodes':
      if (prevState.sourceNode && prevState.targetNode) {
        newState.sourceNode = prevState.targetNode;
        newState.targetNode = prevState.sourceNode;
      }
      break;

    // update metapaths
    case 'update_metapaths':
      if (action.payload.metapaths !== undefined) {
        newState.metapaths = action.payload.metapaths;
        transferObjectProps(
          prevState.metapaths,
          newState.metapaths,
          ['id'],
          ['checked', 'highlighted']
        );
      }
      break;

    // update path queries
    case 'update_path_queries':
      if (action.payload.pathQueries !== undefined) {
        newState.pathQueries = action.payload.pathQueries;
        // console.log(newState.pathQueries);
        transferQueryProps(
          prevState.pathQueries,
          newState.pathQueries,
          'paths',
          ['node_ids', 'rel_ids'],
          ['checked', 'highlighted']
        );
        // console.log(newState.pathQueries);
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

  // set new state
  return newState;
}
