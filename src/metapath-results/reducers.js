export function metapaths(state = [], action) {
  switch (action.type) {
    case 'set_metapaths':
      return action.payload.metapaths || [];
    default:
      return state;
  }
}