const tokenState = {
    token: null,
};

export const tokenReducer = (state = tokenState, action) => {
    switch (action.type) {
      case 'GET_TOKEN':
        return {
          token: action.payload.token,
        }
      default:
        return state;
    }
  };
