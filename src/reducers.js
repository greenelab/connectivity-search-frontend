// map previous global state to new global state based on action
export function Reducer(previousState = {}, action) {
  // start with previous state
  const newState = { ...previousState };

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
      if (previousState.sourceNode && previousState.targetNode) {
        newState.sourceNode = previousState.targetNode;
        newState.targetNode = previousState.sourceNode;
      }
      break;

    // update metapaths
    case 'update_metapaths':
      if (action.payload.metapaths !== undefined)
        newState.metapaths = action.payload.metapaths;
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

  // set new state
  return newState;
}
