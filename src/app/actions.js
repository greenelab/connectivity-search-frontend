import { getMetagraph } from '../backend-queries.js';
import { getHetioStyles } from '../backend-queries.js';
import { getHetioDefinitions } from '../backend-queries.js';
import { getHetmechDefinitions } from '../backend-queries.js';
import { lookupNodeById } from '../backend-queries.js';
import { searchMetapaths } from '../backend-queries.js';

import { setSourceTargetNode } from '../node-search/actions.js';
import { setMetapaths } from '../metapath-results/actions.js';

// get metagraph, hetio definitions, hetio styles, and hetmech definitions
export function fetchDefinitions() {
  return async function(dispatch) {
    const metagraph = await getMetagraph();
    const hetioStyles = await getHetioStyles();
    const hetioDefinitions = await getHetioDefinitions();
    const hetmechDefinitions = await getHetmechDefinitions();

    // combine definitions into single convenient tooltipText lookup
    let tooltipDefinitions = {};
    if (hetioDefinitions.properties) {
      tooltipDefinitions = {
        ...tooltipDefinitions,
        ...hetioDefinitions.properties.common,
        ...hetioDefinitions.properties.nodes
      };
    }
    if (hetioDefinitions.metanodes) {
      tooltipDefinitions = {
        ...tooltipDefinitions,
        ...hetioDefinitions.metanodes
      };
    }
    tooltipDefinitions = { ...tooltipDefinitions, ...hetmechDefinitions };

    dispatch(
      setDefinitions({
        metagraph: metagraph,
        hetioStyles: hetioStyles,
        tooltipDefinitions: tooltipDefinitions
      })
    );
  };
}

// set definitions
function setDefinitions({ metagraph, hetioStyles, tooltipDefinitions }) {
  return {
    type: 'set_definitions',
    payload: {
      metagraph: metagraph,
      hetioStyles: hetioStyles,
      tooltipDefinitions: tooltipDefinitions
    }
  };
}

// update source/target nodes, checked metapaths, etc from url
export function updateStateFromUrl() {
  return async function(dispatch) {
    let params = new URLSearchParams(window.location.search);
    const source = params.get('source');
    const target = params.get('target');
    const metapaths = params.get('metapaths');
    let checkedMetapaths;
    if (metapaths)
      checkedMetapaths = metapaths.split(',');
    else
      checkedMetapaths = [];

    const newSourceNode = await lookupNodeById(source);
    const newTargetNode = await lookupNodeById(target);
    let newMetapaths = await searchMetapaths(source, target);

    // by the time awaits return, url may be different (eg if user
    // clicks back/forward quickly). if different, exit and allow more
    // recent call to change state
    params = new URLSearchParams(window.location.search);
    if (
      params.get('source') !== source ||
      params.get('target') !== target ||
      params.get('metapaths') !== metapaths
    )
      return;

    if (!newMetapaths)
      newMetapaths = [];

    // check metapaths based on url
    for (const newMetapath of newMetapaths) {
      if (checkedMetapaths.includes(newMetapath.metapath_abbreviation))
        newMetapath.checked = true;
    }

    // update global state
    dispatch(
      setSourceTargetNode({
        sourceNode: newSourceNode,
        targetNode: newTargetNode
      })
    );
    dispatch(
      setMetapaths({
        metapaths: newMetapaths
      })
    );
  };
}
