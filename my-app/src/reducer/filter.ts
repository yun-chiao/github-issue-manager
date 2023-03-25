import { FilterKeyword, FilterOrder, FilterState } from "../type";

/// [filterStateState] represent whether the state be choosen by user or not.
/// It can be controll from StateMenu Component.
const filterStateState = {
    "Open": true,
    "Progressing": true,
    "Done": true,
};

/// The reducer for state filter.
export const filterStateReducer = (
    state: FilterState = filterStateState,
    action: {
        type: string;
        payload: { changeState: string; };
    }
): FilterState => {
    switch (action.type) {
        // When user change his condition for state filter.
        case "CHANGE_STATE":
            const newState = {
                ...state
            };

            if (action.payload.changeState !== null) {
                newState[action.payload.changeState] = !state[action.payload.changeState]
            }

            return newState
        default:
            return state;
    }
};

/// [filterOrderState] represent the order is old->new or new->old.
/// It can be controll from Filter Component.
const filterOrderState = {
    order: "desc"
};

export const filterOrderReducer = (state: FilterOrder = filterOrderState, action: { type: string; }): FilterOrder => {
    switch (action.type) {
        case "TOGGLE_ORDER":
            if (state.order === "desc") {
                return {
                    order: "asc"
                }
            } else if (state.order === "asc") {
                return {
                    order: "desc"
                }
            }

            return {
                order: "desc"
            }

        default:
            return state;
    }
};

/// [filterKeywordState] represent the filter keyword which user used for last searching.
/// It can be controll from Filter Component.
const filterKeywordState = {
    keyword: ""
};

export const filterKeywordReducer = (
    state: FilterKeyword = filterKeywordState,
    action: {
        type: string;
        payload: { keyword: string; };
    }
): FilterKeyword => {
    switch (action.type) {
        case "UPDATE_KEYWORD":
            return {
                keyword: action.payload.keyword
            }
        default:
            return state;
    }
};