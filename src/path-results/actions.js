import { searchPaths } from '../backend-queries.js';

export function fetchPaths({ sourceId, targetId, metapaths }) {
  return async function(dispatch) {
    let paths = [];
    let nodes = {};
    let relationships = {};

    for (const metapath of metapaths) {
      if (metapath.checked) {
        const query = await searchPaths(
          sourceId,
          targetId,
          metapath.metapath_abbreviation
        );
        paths = [...paths, ...query.paths];
        nodes = { ...nodes, ...query.nodes };
        relationships = { ...relationships, ...query.relationships };
      }
    }

    dispatch(
      setPaths({
        paths: paths,
        nodes: nodes,
        relationships: relationships
      })
    );
  };
}

// set definitions
export function setPaths({ paths, nodes, relationships, updateUrl }) {
  return {
    type: 'set_paths',
    payload: {
      paths: paths,
      nodes: nodes,
      relationships: relationships,
      updateUrl: updateUrl
    }
  };
}
