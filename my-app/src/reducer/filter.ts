import { FilterState, FilterKeyword, FilterOrder } from "../type";

const filterStateState = {
    "Open": true,
    "Progressing": true,
    "Done": true,
};

export const filterStateReducer = (state: FilterState = filterStateState, action: { type: string; payload: { changeState: string; }; }): FilterState => {
    switch (action.type) {
        case 'CHANGE_STATE':
            const newState = { ...state };
            if (action.payload.changeState !== null) {
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

export const filterOrderReducer = (state: FilterOrder = filterOrderState, action: { type: string; }): FilterOrder => {
    switch (action.type) {
        case 'TOGGLE_ORDER':
            if (state.order === 'desc') {
                return { order: "asc" }
            } else if (state.order === 'asc') {
                return { order: "desc" }
            }
            return { order: "desc" }

        default:
            return state;
    }
};

const filterKeywordState = {
    keyword: ""
};

export const filterKeywordReducer = (state: FilterKeyword = filterKeywordState, action: { type: string; payload: { keyword: string; }; }): FilterKeyword => {
    switch (action.type) {
        case 'UPDATE_KEYWORD':
            console.log('UPDATE_KEYWORD', action.payload.keyword)
            return { keyword: action.payload.keyword }
        default:
            return state;
    }
};