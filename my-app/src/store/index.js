import { createStore, combineReducers } from 'redux';
import { issuesReducer, hasMoreReducer } from '../reducer/issues';
import { filterStateReducer, filterOrderReducer } from '../reducer/filter';

const rootReducer = combineReducers({
    issuesReducer,
    hasMoreReducer,
    filterStateReducer,
    filterOrderReducer
  });

const store = createStore(rootReducer);

export default store;