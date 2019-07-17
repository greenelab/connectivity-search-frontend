import { assembleGraph } from './assemble.js';

// reducer for state.graph
// takes whole state as input
export function graph(state = {}, action) {
  switch (action.type) {
    case 'set_paths':
      const paths = action.payload.paths;
      const nodes = { ...state.nodes, ...(action.payload.nodes || {}) };
      const relationships = {
        ...state.relationships,
        ...(action.payload.relationships || {})
      };

      const graph = assembleGraph(paths, nodes, relationships);

      return graph || [];
    default:
      return state.graph || [];
  }
}
