import { assemblePath } from './assemble.js';
import { textDescription } from './assemble.js';
import { transferObjectProps } from '../util/object.js';

export function paths(state = {}, action) {
  switch (action.type) {
    case 'set_paths':
      let newPaths = action.payload.paths;

      if (action.payload.preserveChecks) {
        newPaths = transferObjectProps(
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

      for (const path of newPaths) {
        path.assembled = assemblePath(path, nodes, relationships);
        path.text_description = textDescription(path.assembled);
      }

      return newPaths || [];
    default:
      return state.paths || [];
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
