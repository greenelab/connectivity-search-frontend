import { metagraph } from './app/reducers.js';
import { hetioDefinitions } from './app/reducers.js';
import { hetioStyles } from './app/reducers.js';
import { hetmechDefinitions } from './app/reducers.js';

import { sourceNode } from './node-search/reducers.js';
import { targetNode } from './node-search/reducers.js';

import { copyObject } from './util/object.js';

export function Reducer(state = {}, action) {
  let newState = copyObject(state);

  newState = {
    metagraph: metagraph(newState.metagraph, action),
    hetioDefinitions: hetioDefinitions(newState.hetioDefinitions, action),
    hetioStyles: hetioStyles(newState.hetioStyles, action),
    hetmechDefinitions: hetmechDefinitions(newState.hetmechDefinitions, action),
    sourceNode: sourceNode(newState, action),
    targetNode: targetNode(newState, action)
  };

  return newState;
}
