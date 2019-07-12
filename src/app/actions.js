import { getMetagraph } from '../backend-queries.js';
import { getHetioDefinitions } from '../backend-queries.js';
import { getHetioStyles } from '../backend-queries.js';
import { getHetmechDefinitions } from '../backend-queries.js';

// get metagraph, hetio definitions, hetio styles, and hetmech definitions
export function fetchDefinitions() {
  return async function(dispatch) {
    const metagraph = await getMetagraph();
    const hetioDefinitions = await getHetioDefinitions();
    const hetioStyles = await getHetioStyles();
    const hetmechDefinitions = await getHetmechDefinitions();

    dispatch(
      setDefinitions({
        metagraph: metagraph,
        hetioDefinitions: hetioDefinitions,
        hetioStyles: hetioStyles,
        hetmechDefinitions: hetmechDefinitions
      })
    );
  };
}

// set definitions
function setDefinitions({
  metagraph,
  hetioDefinitions,
  hetioStyles,
  hetmechDefinitions
}) {
  return {
    type: 'set_definitions',
    payload: {
      metagraph: metagraph,
      hetioDefinitions: hetioDefinitions,
      hetioStyles: hetioStyles,
      hetmechDefinitions: hetmechDefinitions
    }
  };
}
