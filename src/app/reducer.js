const initialState = {
  metagraph: {},
  hetioDefinitions: {},
  hetioStyles: {},
  hetmechDefinitions: {}
};

export function appReducer(state = initialState, action) {
  switch (action.type) {
    case 'set_definitions': {
      const {
        metagraph,
        hetioDefinitions,
        hetioStyles,
        hetmechDefinitions
      } = action.payload;

      return {
        ...state,
        metagraph,
        hetioDefinitions,
        hetioStyles,
        hetmechDefinitions
      };
    }

    default:
      return state;
  }
}
