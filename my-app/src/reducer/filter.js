const filterStateState = {
    "Open": true, 
    "Progressing": true,
    "Done": true,
};

export const filterStateReducer = (state = filterStateState, action) => {
    switch (action.type) {
        case 'CHANGE_STATE':
            let newState = {...state};
            if( action.payload.changeState !== null ){
                newState[action.payload.changeState] = !state[action.payload.changeState]
            }
            return newState
        default:
        return state;
    }
};

const filterOrderState = {
    order: "desc"
};

export const filterOrderReducer = (state = filterOrderState, action) => {
    switch (action.type) {
        case 'TOGGLE_ORDER':
            if(state.order === 'desc'){
                return {order: "asc"}
            }else if(state.order === 'asc'){
                return {order: "desc"}
            }
            return {order: "desc"}
            
        default:
        return state;
    }
};

const filterKeywordState = {
    keyword: ""
};

export const filterKeywordReducer = (state = filterKeywordState, action) => {
    switch (action.type) {
        case 'UPDATE_KEYWORD':
            return {keyword: action.payload.keyword}
        default:
        return state;
    }
};