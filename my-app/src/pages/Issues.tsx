import { useSelector } from 'react-redux';
import IssueCard from '../component/IssueCard';
import InfiniteScroll from "react-infinite-scroll-component";
import Filter from '../component/Filter';
import { RootState } from '../type';
import "./Issues.css"
import './markdown.css'
import React from "react";
import useIssues from '../hook/useIssues';
import PacmanLoader from "react-spinners/PacmanLoader";

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
                    {isLoading ? (<div className='flex flex-col items-center justify-center withoutHeader w-full pr-12'><PacmanLoader color='#3785A8' speedMultiplier={2} size={30} /></div>) : (
                        <InfiniteScroll
                            style={{ "overflow": "hidden" }}
                            className='divide-y'
                            dataLength={issues.length}
                            next={fetchMoreIssues}
                            hasMore={hasMore}
                            loader={<div className="flex justify-center items-center py-6 h-20 pr-12">
                                <PacmanLoader color='#3785A8' speedMultiplier={2} size={20} />
                            </div>}
                            endMessage={<div className="text-center text-2xl py-6 h-20 ">
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
