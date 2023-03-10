import { BiEdit, BiTrashAlt } from "react-icons/bi";
import { useEffect } from 'react';

function IssueCard({ issue }) {  
    return (
        <div className="bg-white h-40 w-full my-4 rounded-xl shrink-0 pt-6">
            <div className="w-full h-1/4 flex items-center justify-between pl-7 pr-4">
                <button className="bg-slate-100 w-14 h-full rounded-md hover:bg-slate-400">{issue.state}</button>
                <div className="w-16 h-full flex items-center justify-between">
                    <button className="h-8 w-8 rounded-md hover:bg-slate-300 flex justify-center items-center"><BiEdit /></button>
                    <button className="h-8 w-8 rounded-md hover:bg-slate-300 flex justify-center items-center"><BiTrashAlt /></button>
                </div>
            </div>
            <div className="w-full h-3/4 pl-8 pr-6 py-2">
                <div className="text-2xl truncate">{issue.title}</div>
                <div className="pt-2 break-all h-full overflow-y-auto">{issue.body}</div>
            </div>
        </div>
            );
}

export default IssueCard;
