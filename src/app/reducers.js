export function metagraph(state = {}, action) {
  switch (action.type) {
    case 'set_definitions':
      return action.payload.metagraph || {};
    default:
      return state;
  }
}

export function hetioDefinitions(state = {}, action) {
  switch (action.type) {
    case 'set_definitions':
      return action.payload.hetioDefinitions || {};
    default:
      return state;
  }
}

export function hetioStyles(state = {}, action) {
  switch (action.type) {
    case 'set_definitions':
      return action.payload.hetioStyles || {};
    default:
      return state;
  }
}

export function hetmechDefinitions(state = {}, action) {
  switch (action.type) {
    case 'set_definitions':
      return action.payload.hetmechDefinitions || {};
    default:
      return state;
  }
}
