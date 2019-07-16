import { transferObjectProps } from '../util/object.js';

export function metapaths(state = [], action) {
  switch (action.type) {
    case 'set_metapaths':
      let newMetapaths = action.payload.metapaths;

      if (action.payload.preserveChecks) {
        newMetapaths = transferObjectProps(
          state,
          action.payload.metapaths,
          ['id'],
          ['checked']
        );
      }
      return newMetapaths || [];
    default:
      return state;
  }
}
