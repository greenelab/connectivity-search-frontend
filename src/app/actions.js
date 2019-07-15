import { getMetagraph } from '../backend-queries.js';
import { getHetioStyles } from '../backend-queries.js';
import { getHetioDefinitions } from '../backend-queries.js';
import { getHetmechDefinitions } from '../backend-queries.js';

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
