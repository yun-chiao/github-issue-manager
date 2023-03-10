import { createStore, combineReducers } from 'redux';
import { issuesReducer, hasMoreReducer } from '../reducer/issues';

const rootReducer = combineReducers({
    issuesReducer,
    hasMoreReducer
  });

const store = createStore(rootReducer);

export default store;