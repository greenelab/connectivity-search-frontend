import { searchMetapaths } from '../backend-queries.js';
import { searchPaths } from '../backend-queries.js';
import { copyObject } from '../util/object.js';

// fetch metapaths function
export async function fetchMetapaths({
  sourceNodeId,
  targetNodeId,
  precomputedOnly,
  updateUrl,
  preserveChecks
}) {
  const metapaths =
    (await searchMetapaths(sourceNodeId, targetNodeId, !precomputedOnly)) || [];
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
  precomputedOnly,
  updateUrl,
  preserveChecks
}) {
  return async function(dispatch) {
    const metapaths = await fetchMetapaths({
      sourceNodeId: sourceNodeId,
      targetNodeId: targetNodeId,
      precomputedOnly: precomputedOnly,
      updateUrl: updateUrl,
      preserveChecks: preserveChecks
    });
    dispatch(setMetapaths(metapaths));
  };
}

// fetch metapath data for metapath that hasn't been precomputed
export async function fetchMetapathMissingData({
  sourceNodeId,
  targetNodeId,
  metapathId,
  metapaths,
  updateUrl,
  preserveChecks
}) {
  const query =
    (await searchPaths(sourceNodeId, targetNodeId, metapathId)) || {};

  const newMetapaths = copyObject(metapaths);

  const index = newMetapaths.findIndex(
    (metapath) => metapath.metapath_id === metapathId
  );
  newMetapaths[index] = {
    ...newMetapaths[index],
    ...query.path_count_info
  };

  return {
    metapaths: newMetapaths,
    updateUrl: updateUrl,
    preserveChecks: preserveChecks
  };
}

// fetch and set metapath missing data
export function fetchAndSetMetapathMissingData({
  sourceNodeId,
  targetNodeId,
  metapathId,
  metapaths,
  updateUrl,
  preserveChecks
}) {
  return async function(dispatch) {
    const newMetapaths = await fetchMetapathMissingData({
      sourceNodeId: sourceNodeId,
      targetNodeId: targetNodeId,
      metapathId: metapathId,
      metapaths: metapaths,
      updateUrl: updateUrl,
      preserveChecks: preserveChecks
    });
    dispatch(setMetapaths(newMetapaths));
  };
}

// toggle precomputedMetapathsOnly action
export function togglePrecomputedMetapathsOnly() {
  return {
    type: 'toggle_precomputed_metapaths_only',
    payload: {
      updateUrl: true
    }
  };
}

// set precomputedMetapathsOnly action
export function setPrecomputedMetapathsOnly({
  precomputedMetapathsOnly,
  updateUrl
}) {
  return {
    type: 'set_precomputed_metapaths_only',
    payload: {
      precomputedMetapathsOnly: precomputedMetapathsOnly,
      updateUrl: updateUrl
    }
  };
}
