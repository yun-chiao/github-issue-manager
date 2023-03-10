import { createStore, combineReducers } from 'redux';
import { tokenReducer }from '../reducer/auth';
import { issuesReducer, hasMoreReducer } from '../reducer/issues';

const rootReducer = combineReducers({
    tokenReducer,
    issuesReducer,
    hasMoreReducer
  });

const store = createStore(rootReducer);

export default store;