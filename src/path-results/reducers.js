import { assemblePath } from './assemble.js';
import { textDescription } from './assemble.js';
import { transferObjectProps } from '../util/object.js';

// reducer for state.paths
// takes whole state as input
export function paths(state = {}, action) {
  switch (action.type) {
    case 'set_paths':
      let paths = action.payload.paths;

      if (action.payload.preserveChecks) {
        paths = transferObjectProps(
          state.paths,
          action.payload.paths,
          ['node_ids', 'rel_ids'],
          ['checked', 'highlighted']
        );
      }

      const nodes = { ...state.nodes, ...(action.payload.nodes || {}) };
      const relationships = {
        ...state.relationships,
        ...(action.payload.relationships || {})
      };

      for (const path of paths) {
        path.assembled = assemblePath(path, nodes, relationships);
        path.text_description = textDescription(path.assembled);
      }

      return paths || [];
    default:
      return state.paths || [];
  }
}

// reducer for state.nodes
export function nodes(state = {}, action) {
  switch (action.type) {
    case 'set_paths':
      return { ...state, ...(action.payload.nodes || {}) };
    default:
      return state;
  }
}

// reducer for state.relationships
export function relationships(state = {}, action) {
  switch (action.type) {
    case 'set_paths':
      return { ...state, ...(action.payload.relationships || {}) };
    default:
      return state;
  }
}
