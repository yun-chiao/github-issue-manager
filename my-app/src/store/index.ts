import { combineReducers,createStore } from "redux";

import { filterKeywordReducer,filterOrderReducer, filterStateReducer } from "../reducer/filter";
import { hasMoreReducer,issuesReducer } from "../reducer/issues";

const rootReducer = combineReducers({
    issuesReducer,
    hasMoreReducer,
    filterStateReducer,
    filterOrderReducer,
    filterKeywordReducer
  });

const store = createStore(rootReducer);

export default store;