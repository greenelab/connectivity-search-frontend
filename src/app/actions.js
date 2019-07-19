import { getMetagraph } from '../backend-queries.js';
import { getHetioStyles } from '../backend-queries.js';
import { getHetioDefinitions } from '../backend-queries.js';
import { getHetmechDefinitions } from '../backend-queries.js';
import { lookupNodeById } from '../backend-queries.js';
import { searchMetapaths } from '../backend-queries.js';

import { setSourceTargetNode } from '../node-search/actions.js';
import { setMetapaths } from '../metapath-results/actions.js';

// get metagraph, hetio definitions, hetio styles, and hetmech definitions
export async function fetchDefinitions() {
  const metagraph = (await getMetagraph()) || {};
  const hetioStyles = (await getHetioStyles()) || {};
  const hetioDefinitions = (await getHetioDefinitions()) || {};
  const hetmechDefinitions = (await getHetmechDefinitions()) || {};

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
  tooltipDefinitions['neo4j_id'] = tooltipDefinitions['id'];

  return {
    metagraph: metagraph,
    hetioStyles: hetioStyles,
    tooltipDefinitions: tooltipDefinitions
  };
}

// set definitions
export function setDefinitions({ metagraph, hetioStyles, tooltipDefinitions }) {
  return {
    type: 'set_definitions',
    payload: {
      metagraph: metagraph,
      hetioStyles: hetioStyles,
      tooltipDefinitions: tooltipDefinitions
    }
  };
}

// fetch and set definitions
export function fetchAndSetDefinitions() {
  return async function(dispatch) {
    const definitions = await fetchDefinitions();
    dispatch(setDefinitions(definitions));
  };
}

// load source/target nodes and checked metapaths from url
export function loadStateFromUrl() {
  return async function(dispatch) {
    let params = new URLSearchParams(window.location.search);
    const sourceNodeId = params.get('source') || null;
    const targetNodeId = params.get('target') || null;
    const metapathAbbrevs = params.get('metapaths') || '';

    const sourceNode = await lookupNodeById(sourceNodeId);
    const targetNode = await lookupNodeById(targetNodeId);
    const metapaths = (await searchMetapaths(sourceNodeId, targetNodeId)) || [];

    // by the time awaits return, url may be different (eg if user
    // clicks back/forward quickly). if different, exit and allow more
    // recent call to change state
    params = new URLSearchParams(window.location.search);
    if (
      params.get('source') !== sourceNodeId ||
      params.get('target') !== targetNodeId ||
      params.get('metapaths') !== metapathAbbrevs
    )
      return;

    // check metapaths based on url
    for (const metapath of metapaths) {
      if (
        metapathAbbrevs.includes(metapath.metapath_abbreviation) ||
        metapathAbbrevs.includes(metapath.metapath_id)
      )
        metapath.checked = true;
    }

    // set global state
    dispatch(
      setSourceTargetNode({
        sourceNode: sourceNode,
        targetNode: targetNode,
        updateUrl: false
      })
    );
    dispatch(
      setMetapaths({
        metapaths: metapaths,
        updateUrl: false
      })
    );
  };
}
