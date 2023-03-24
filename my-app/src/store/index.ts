import { createStore, combineReducers } from 'redux';
import { issuesReducer, hasMoreReducer } from '../reducer/issues';
import { filterStateReducer, filterOrderReducer, filterKeywordReducer } from '../reducer/filter';

const rootReducer = combineReducers({
    issuesReducer,
    hasMoreReducer,
    filterStateReducer,
    filterOrderReducer,
    filterKeywordReducer
  });

const store = createStore(rootReducer);

export default store;