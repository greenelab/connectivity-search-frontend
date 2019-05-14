// actions to update global state variables

// set global state
export function setState(newState, transferState) {
  return {
    type: 'set_state',
    payload: newState,
    transferState: transferState
  };
}
