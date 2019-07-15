import { getRandomNodePair } from '../backend-queries.js';
import { lookupNodeById } from '../backend-queries.js';

// set source and/or target node
export function setSourceTargetNode({ sourceNode, targetNode, updateUrl }) {
  return {
    type: 'set_source_target_node',
    payload: {
      sourceNode: sourceNode,
      targetNode: targetNode,
      updateUrl: updateUrl
    }
  };
}

// swap source/target node
export function swapSourceTargetNode() {
  return {
    type: 'swap_source_target_node',
    payload: { updateUrl: true }
  };
}

//
export function fetchRandomNodePair() {
  return async function(dispatch) {
    const pair = await getRandomNodePair();
    const source = await lookupNodeById(pair.source_id);
    const target = await lookupNodeById(pair.target_id);

    dispatch(
      setSourceTargetNode({
        sourceNode: source,
        targetNode: target,
        updateUrl: true
      })
    );
  };
}
