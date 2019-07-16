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

// load source/target nodes, checked metapaths, etc from url
export function loadStateFromUrl() {
  return async function(dispatch) {
    console.log('hi');
    let params = new URLSearchParams(window.location.search);
    const sourceId = params.get('source');
    const targetId = params.get('target');
    const metapathAbbrevs = params.get('metapaths');

    const sourceNode = await lookupNodeById(sourceId);
    const targetNode = await lookupNodeById(targetId);
    const metapaths = (await searchMetapaths(sourceId, targetId)) || [];

    // by the time awaits return, url may be different (eg if user
    // clicks back/forward quickly). if different, exit and allow more
    // recent call to change state
    params = new URLSearchParams(window.location.search);
    if (
      params.get('source') !== sourceId ||
      params.get('target') !== targetId ||
      params.get('metapaths') !== metapathAbbrevs
    )
      return;

    // check metapaths based on url
    if (metapathAbbrevs) {
      for (const metapath of metapaths) {
        if (metapathAbbrevs.includes(metapath.metapath_abbreviation))
          metapath.checked = true;
      }
    }

    // set global state
    dispatch(
      setSourceTargetNode({
        sourceNode: sourceNode,
        targetNode: targetNode,
        dontUpdateUrl: true
      })
    );
    dispatch(
      setMetapaths({
        metapaths: metapaths,
        dontUpdateUrl: true
      })
    );
  };
}
