import { assembleGraph } from './assemble.js';
import { transferObjectProps } from '../util/object.js';

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

      transferObjectProps(
        state.graph.nodes,
        graph.nodes,
        ['neo4j_id'],
        ['x', 'y', 'fx', 'fy', 'vx', 'vy']
      );

      return graph || { nodes: [], edges: [] };

    case 'set_graph':
      const g = action.payload.graph;
      return g || { nodes: [], edges: [] };

    default:
      return state.graph || { nodes: [], edges: [] };
  }
}
