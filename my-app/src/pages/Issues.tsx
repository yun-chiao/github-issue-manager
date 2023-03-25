import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import IssueCard from '../component/IssueCard';
import InfiniteScroll from "react-infinite-scroll-component";
import Filter from '../component/Filter';
import { RootState } from '../type';
import "./Issues.css"
import './markdown.css'
import React from "react";
import useIssues from '../hook/useIssues';

function Issues(): JSX.Element {
    const issues = useSelector((state: RootState) => state.issuesReducer.issues);
    const hasMore = useSelector((state: RootState) => state.hasMoreReducer.hasMore);
    const filterState = useSelector((state: RootState) => state.filterStateReducer);
    const filterOrder = useSelector((state: RootState) => state.filterOrderReducer);
    const preSearchKey = useSelector((state: RootState) => state.filterKeywordReducer.keyword);
    const [page, setPage] = useState<number>(1);
    const { isLoading } = useIssues(page);

    useEffect(() => setPage(1), [filterState, filterOrder, preSearchKey])

    const fetchMoreIssues = () => setPage(page + 1);

    return (
        <>
            {isLoading ? (<div>Loading...</div>) : (
                <div className="bg-sky-900 w-full h-full flex justify-center min-h-screen">
                    <div className="bg-white w-list h-full flex flex-col items-center min-h-screen">
                        <div className='bg-sky-600 w-full h-20 sticky top-0'>
                            <Filter></Filter>
                        </div>
                        <InfiniteScroll
                            style={{ "overflow": "hidden" }}
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
                            {issues.map((issue) => (
                                <IssueCard key={issue.number} issue={issue} />
                            ))}
                        </InfiniteScroll>
                    </div>
                </div>
            )}
        </>
    );
}

export default Issues;
