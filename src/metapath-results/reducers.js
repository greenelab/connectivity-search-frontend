import { transferObjectProps } from '../util/object.js';

// reducer for state.metapaths
export function metapaths(state = [], action) {
  switch (action.type) {
    case 'set_metapaths':
      let metapaths = action.payload.metapaths;

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
