import { createStore, combineReducers } from 'redux';
import { tokenReducer, codeReducer }from '../reducer/auth';

const rootReducer = combineReducers({
    tokenReducer,
  });

const store = createStore(rootReducer);

export default store;