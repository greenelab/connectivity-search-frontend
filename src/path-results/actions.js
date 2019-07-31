import { searchPaths } from '../backend-queries.js';

// fetch paths function
export async function fetchPaths({
  sourceNodeId,
  targetNodeId,
  metapaths,
  updateUrl,
  preserveChecks
}) {
  let paths = [];
  let nodes = {};
  let relationships = {};
  const pathCountInfo = {};

  const abbrevs = metapaths
    .filter((metapath) => metapath.checked)
    .map((metapath) => metapath.metapath_abbreviation);

  for (const abbrev of abbrevs) {
    const query = await searchPaths(sourceNodeId, targetNodeId, abbrev);
    paths = [...paths, ...query.paths];
    nodes = { ...nodes, ...query.nodes };
    relationships = { ...relationships, ...query.relationships };
    // include path_count_info returned from query to be used by metapaths
    // to fill in missing (not precomputed) data
    pathCountInfo[abbrev] = query.path_count_info;
  }

  return {
    paths: paths,
    nodes: nodes,
    relationships: relationships,
    pathCountInfo: pathCountInfo,
    updateUrl: updateUrl,
    preserveChecks: preserveChecks
  };
}

// set paths action
export function setPaths({
  paths,
  nodes,
  relationships,
  pathCountInfo,
  updateUrl,
  preserveChecks
}) {
  return {
    type: 'set_paths',
    payload: {
      paths: paths,
      nodes: nodes,
      relationships: relationships,
      pathCountInfo: pathCountInfo,
      updateUrl: updateUrl,
      preserveChecks: preserveChecks
    }
  };
}

// fetch and set paths action creator
export function fetchAndSetPaths({
  sourceNodeId,
  targetNodeId,
  metapaths,
  updateUrl,
  preserveChecks
}) {
  return async function(dispatch) {
    const paths = await fetchPaths({
      sourceNodeId: sourceNodeId,
      targetNodeId: targetNodeId,
      metapaths: metapaths,
      updateUrl: updateUrl,
      preserveChecks: preserveChecks
    });

    dispatch(setPaths(paths));
  };
}
