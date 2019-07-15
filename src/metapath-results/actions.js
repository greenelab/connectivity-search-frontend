import { searchMetapaths } from '../backend-queries.js';

export function fetchMetapaths(sourceId, targetId) {
  return async function(dispatch) {
    const metapaths = await searchMetapaths(sourceId, targetId);

    dispatch(
      setMetapaths({
        metapaths: metapaths,
        preserveChecks: true
      })
    );
  };
}

// set definitions
export function setMetapaths({ metapaths, preserveChecks }) {
  return {
    type: 'set_metapaths',
    payload: {
      metapaths: metapaths,
      preserveChecks: preserveChecks
    }
  };
}
