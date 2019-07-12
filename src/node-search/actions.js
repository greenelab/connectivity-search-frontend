// set source and/or target node
export function setSourceTargetNode({
  sourceNode,
  targetNode,
  dontUpdateUrl
}) {
  return {
    type: 'set_source_target_node',
    payload: { sourceNode: sourceNode, targetNode: targetNode },
    updateUrl: !dontUpdateUrl
  };
}

// swap source/target node
export function swapSourceTargetNode() {
  return {
    type: 'swap_source_target_node',
    updateUrl: false
  };
}
