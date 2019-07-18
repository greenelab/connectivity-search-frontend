
// set graph action
export function setGraph({ graph }) {
  return {
    type: 'set_graph',
    payload: {
      graph: graph
    }
  };
}