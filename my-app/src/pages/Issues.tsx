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
    const { isLoading, fetchMoreIssues } = useIssues();

    return (
        <>
            <div className="bg-sky-900 w-full h-full flex justify-center min-h-screen">
                <div className="bg-white w-list h-full flex flex-col items-center min-h-screen">
                    <div className='bg-sky-600 w-full h-20 sticky top-0'>
                        <Filter></Filter>
                    </div>
                    {isLoading ? (<div>Loading...</div>) : (
                        <InfiniteScroll
                            style={{ "overflow": "hidden" }}
                            className='divide-y'
                            dataLength={issues.length}
                            next={fetchMoreIssues}
                            hasMore={hasMore}
                            loader={<div className="text-center text-2xl my-4 h-10">
                                <h2>Loading</h2>
                            </div>}
                            endMessage={<div className="text-center text-2xl my-4 h-10">
                                <h2>No more issues!</h2>
                            </div>}
                        >
                            {issues.map((issue) => (
                                <IssueCard key={issue.number} issue={issue} />
                            ))}
                        </InfiniteScroll>
                    )}
                </div>
            </div>
        </>
    );
}

export default Issues;
