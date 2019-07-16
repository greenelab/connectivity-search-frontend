import { searchMetapaths } from '../backend-queries.js';

// fetch metapaths function
export async function fetchMetapaths({
  sourceNodeId,
  targetNodeId,
  updateUrl,
  preserveChecks
}) {
  const metapaths = await searchMetapaths(sourceNodeId, targetNodeId) || [];
  return {
    metapaths: metapaths,
    updateUrl: updateUrl,
    preserveChecks: preserveChecks
  };
}

// set metapaths action
export function setMetapaths({ metapaths, updateUrl, preserveChecks }) {
  return {
    type: 'set_metapaths',
    payload: {
      metapaths: metapaths,
      updateUrl: updateUrl,
      preserveChecks: preserveChecks
    }
  };
}

// fetch and set metapaths action creator
export function fetchAndSetMetapaths({
  sourceNodeId,
  targetNodeId,
  updateUrl,
  preserveChecks
}) {
  return async function(dispatch) {
    const metapaths = await fetchMetapaths({
      sourceNodeId: sourceNodeId,
      targetNodeId: targetNodeId,
      updateUrl: updateUrl,
      preserveChecks: preserveChecks
    });
    dispatch(setMetapaths(metapaths));
  };
}
