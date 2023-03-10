const issuesState = {
    issues: [],
};

export const issuesReducer = (state = issuesState, action) => {
    switch (action.type) {
        case 'INIT_ISSUES':
            return {
                issues: [...action.payload.issues],
            }
        case 'UPDATE_ISSUES':
            return {
                issues: [
                    ...state.issues,
                    ...action.payload.issues
                ],
            }
        case 'CLOSE_ISSUE':
            return{
                issues: state.issues.filter( item => item.number !== action.payload.closed_number)
            }
      default:
        return state;
    }
  };

const hasMoreState = {
    hasMore: true,
};

export const hasMoreReducer = (state = hasMoreState, action) => {
    switch (action.type) {
        case 'HAS_MORE':
            return {
                hasMore: true,
            }
        case 'NON_HAS_MORE':
            return {
                hasMore: false,
            }
        default:
        return state;
    }
};
