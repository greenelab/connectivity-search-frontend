import { transferObjectProps } from '../util/object.js';

// reducer for state.metapaths
export function metapaths(state = [], action) {
  switch (action.type) {
    case 'set_metapaths':
      let metapaths = action.payload.metapaths;

      // transfer checkbox states from previous to next
      if (action.payload.preserveChecks) {
        metapaths = transferObjectProps(
          state,
          action.payload.metapaths,
          ['metapath_id'],
          ['checked']
        );
      }
      return metapaths || [];
    default:
      return state;
  }
}

// reducer for state.precomputedMetapathsOnly
export function precomputedMetapathsOnly(state = true, action) {
  switch (action.type) {
    case 'toggle_precomputed_metapaths_only':
      return !state;
    default:
      return state;
  }
}