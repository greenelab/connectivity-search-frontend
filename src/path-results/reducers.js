import { assemblePath } from './assemble.js';
import { textDescription } from './assemble.js';

export function paths(state = {}, action) {
  switch (action.type) {
    case 'set_paths':
      const newPaths = action.payload.paths;
      const nodes = { ...state, ...(action.payload.nodes || {}) };
      const relationships = {
        ...state,
        ...(action.payload.relationships || {})
      };

      for (const path of newPaths) {
        path.assembled = assemblePath(path, nodes, relationships);
        path.text_description = textDescription(path.assembled);
      }

      return newPaths || [];
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
