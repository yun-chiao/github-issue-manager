import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getIssues } from '../service';
import IssueCard from '../component/IssueCard';
import InfiniteScroll from "react-infinite-scroll-component";
import "./Issues.css"

function Issues() {
    const token = useSelector(state => state.tokenReducer.token);
    const issues = useSelector(state => state.issuesReducer.issues);
    const hasMore = useSelector(state => state.hasMoreReducer.hasMore);
    const [page, setPage] = useState(1);
    const dispatch = useDispatch();

    useEffect(() => {
        getIssues(dispatch, token, page);
        setPage(page+1);
    }, [dispatch, token])

    const fetchMoreIssues = () => {
        getIssues(dispatch, token, page);
        setPage(page+1);
    }

    return (
        <div className="bg-sky-900 w-full h-full flex justify-center min-h-screen">
            <div className="bg-white w-1/4 h-full flex flex-col items-center min-h-screen">
                <InfiniteScroll  
                    style={{"overflow": "hidden"}}
                    className='divide-y'
                    dataLength={issues.length}
                    next={fetchMoreIssues}
                    hasMore={hasMore}
                    loader={
                        <div className="text-center text-2xl my-4 h-10">
                            <h2>Loading</h2>
                        </div>
                    }
                    endMessage={
                        <div className="text-center text-2xl my-4 h-10">
                            <h2>No more issues!</h2>
                        </div>
                    }
                    >
                    {issues.map( (issue) => (
                    <IssueCard key={issue.node_id} issue={issue}/>
                ) )}
                </InfiniteScroll>
            </div>
        </div>
    );
}

export default Issues;
