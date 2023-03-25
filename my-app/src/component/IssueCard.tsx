import MarkdownIt from "markdown-it";
import React from "react";
import { useCookies } from "react-cookie";
import { BiEdit, BiTrashAlt } from "react-icons/bi";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

import { closeIssue } from "../service";
import { Issue } from "../type";
import StateMenu from "./StateMenu";

/// The component to display each issue on Issues list in Issues page.
function IssueCard({ issue }: { issue: Issue }): JSX.Element {
    const [cookies] = useCookies(["token", "owner", "repo"]);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const mdParser = new MarkdownIt(/* Markdown-it options */);

    /// When users click the Card, navigating to the certain issue page.
    const toEditIssue = () => navigate(`/edit/${issue.number}`);

    /// When users click the trash icon, closing the issue.
    const deleteIssue = () => closeIssue(dispatch, issue.number, cookies["token"], cookies["owner"], cookies["repo"]);

    return (
        <div className="my-4 h-56 w-full shrink-0 bg-white pt-6">
            <div className="flex h-1/5 w-full items-center justify-between pl-7 pr-4">
                <StateMenu issue={issue}></StateMenu>
                <div className="flex h-full w-16 items-center justify-between">
                    <button className="flex h-8 w-8 items-center justify-center rounded-md hover:bg-slate-300"
                        onClick={toEditIssue}
                        title="Edit">
                        <BiEdit />
                    </button>
                    <button className="flex h-8 w-8 items-center justify-center rounded-md hover:bg-slate-300"
                        onClick={deleteIssue}
                        title="Close issue"
                    >
                        <BiTrashAlt />
                    </button>
                </div>
            </div>
            <div className="h-4/5 w-full py-2 pl-8 pr-6">
                <div className="h-1/4 truncate pt-1 text-2xl hover:cursor-pointer hover:underline" onClick={toEditIssue}>{issue.title} </div>
                <div className="card-scroll h-3/4 overflow-y-auto whitespace-pre-wrap break-all pt-2 hover:cursor-pointer hover:underline"
                    style={{
                        background: "transparent"
                    }}
                    onClick={toEditIssue}
                    dangerouslySetInnerHTML={{
                        __html: mdParser.render(issue.body)
                    }}
                />
            </div>
        </div>
    );
}

export default IssueCard;
