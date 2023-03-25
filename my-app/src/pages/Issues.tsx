import "./Issues.css"
import "./markdown.css"

import React from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { useSelector } from "react-redux";
import PacmanLoader from "react-spinners/PacmanLoader";

import Filter from "../component/Filter";
import IssueCard from "../component/IssueCard";
import useIssues from "../hook/useIssues";
import { RootState } from "../type";

function Issues(): JSX.Element {
    const issues = useSelector((state: RootState) => state.issuesReducer.issues);
    const hasMore = useSelector((state: RootState) => state.hasMoreReducer.hasMore);
    const { isLoading, fetchMoreIssues } = useIssues();

    return (
        <>
            <div className="flex h-full min-h-screen w-full justify-center bg-sky-900">
                <div className="flex h-full min-h-screen w-list flex-col items-center bg-white">
                    <div className='sticky top-0 h-20 w-full bg-sky-600'>
                        <Filter></Filter>
                    </div>
                    {isLoading ? (<div className='withoutHeader flex w-full flex-col items-center justify-center pr-12'><PacmanLoader color='#3785A8' speedMultiplier={2} size={30} /></div>) : (
                        <InfiniteScroll
                            style={{
                                "overflow": "hidden"
                            }}
                            className='divide-y'
                            dataLength={issues.length}
                            next={fetchMoreIssues}
                            hasMore={hasMore}
                            loader={<div className="flex h-20 items-center justify-center py-6 pr-12">
                                <PacmanLoader color='#3785A8' speedMultiplier={2} size={20} />
                            </div>}
                            endMessage={<div className="h-20 py-6 text-center text-2xl ">
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
