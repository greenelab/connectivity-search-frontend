export function paths(state = [], action) {
  switch (action.type) {
    case 'set_paths':
      return action.payload.paths || [];
    default:
      return state;
  }
}

export function nodes(state = {}, action) {
  switch (action.type) {
    case 'set_paths':
      return { ...state, ...(action.payload.nodes || {}) };
    default:
      return state;
  }
}
export function relationships(state = {}, action) {
  switch (action.type) {
    case 'set_paths':
      return { ...state, ...(action.payload.relationships || {}) };
    default:
      return state;
  }
}
