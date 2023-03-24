export interface FilterState {
    Open: boolean;
    Progressing: boolean;
    Done: boolean;
  }
  
  export interface FilterOrder {
    order: string;
  }
  
  export interface FilterKeyword {
    keyword: string;
  }
  
  export interface Issues {
    issues: object[];
  }
  
  export interface HasMore {
    hasMore: boolean;
  }
  
  export interface RootState {
    filterStateReducer: FilterState;
    filterOrderReducer: FilterOrder;
    filterKeywordReducer: FilterKeyword;
    issuesReducer: Issues;
    hasMoreReducer: HasMore;
  }