// actions to update global state variables

// set definitions
export function setDefinitions({
  metagraph,
  hetioDefinitions,
  hetioStyles,
  hetmechDefinitions
}) {
  return {
    type: 'set_definitions',
    payload: {
      metagraph: metagraph,
      hetioDefinitions: hetioDefinitions,
      hetioStyles: hetioStyles,
      hetmechDefinitions: hetmechDefinitions
    }
  };
}

// update source and/or target node
export function updateSourceTargetNodes({
  sourceNode,
  targetNode,
  dontUpdateUrl
}) {
  return {
    type: 'update_source_target_nodes',
    payload: { sourceNode: sourceNode, targetNode: targetNode },
    updateUrl: !dontUpdateUrl
  };
}

// swap source/target node
export function swapSourceTargetNodes() {
  return {
    type: 'swap_source_target_nodes',
    updateUrl: false
  };
}

// update metapaths
export function updateMetapaths({
  metapaths,
  dontUpdateUrl,
  dontTransferState
}) {
  return {
    type: 'update_metapaths',
    payload: { metapaths: metapaths },
    updateUrl: !dontUpdateUrl,
    transferState: !dontTransferState
  };
}

// update path queries
export function updatePathQueries({ pathQueries }) {
  return {
    type: 'update_path_queries',
    payload: { pathQueries: pathQueries },
    transferState: true
  };
}
