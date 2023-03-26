import { HasMore, Issue, Issues, Label } from "../type";

/// [issuesState] represent the stored issues.
const issuesState = {
    issues: [],
};

export const issuesReducer = (
    state: Issues = issuesState,
    action: {
        type: string;
        payload: { issues: Issue[]; closed_number: number; issue_number: number; labels: Label[]; };
    }
): Issues => {
    switch (action.type) {
        case "INIT_ISSUES":
            return {
                issues: [...action.payload.issues],
            }
        case "UPDATE_ISSUES":
            return {
                issues: [
                    ...state.issues,
                    ...action.payload.issues
                ],
            }
        // Modify the issues content directly rather than recall API. Both the close and update state may be act frequently, 
        // so it should not recall API. Moreover, many refresh for view will decrease experience.
        case "REMOVE_ISSUE":
            return {
                issues: state.issues.filter(item => item.number !== action.payload.closed_number)
            }
        // Modify the issues content directly rather than recall API. Both the close and update state may be act frequently, 
        // so it should not recall API. Moreover, many refresh for view will decrease experience.        
        case "UPDATE_STATE":
            return {
                issues: state.issues.map(item => {
                    if (item.number === action.payload.issue_number) {
                        // 在需要更新的元素上應用所需的更改
                        return {
                            ...item, labels: action.payload.labels
                        };
                    }

                    return item;
                })
            }
        default:
            return state;
    }
};

/// [hasMoreState] represent whether there are more issues not be fetched or not.
const hasMoreState = {
    hasMore: true,
};

export const hasMoreReducer = (state: HasMore = hasMoreState, action: { type: string; }): HasMore => {
    switch (action.type) {
        case "HAS_MORE":
            return {
                hasMore: true,
            }
        case "NON_HAS_MORE":
            return {
                hasMore: false,
            }
        default:
            return state;
    }
};
