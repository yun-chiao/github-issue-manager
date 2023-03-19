import { BiEdit, BiTrashAlt } from "react-icons/bi";
import { useDispatch } from 'react-redux';
import { closeIssue } from '../service';
import { useNavigate } from "react-router-dom";
import MarkdownIt from 'markdown-it';
import { useCookies } from 'react-cookie';
import StateMenu from "./StateMenu";

function IssueCard({ issue }) {
    const [cookies] = useCookies(['token', 'owner', 'repo']);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const mdParser = new MarkdownIt(/* Markdown-it options */);

    const toEditIssue = () => {
        navigate(`/edit/${issue.number}`);
    }

    /// To close the issue when users click the trash icon.
    const deleteIssue = () => {
        closeIssue(dispatch, issue.number, cookies['token'], cookies['owner'], cookies['repo']);
    }

    return (
        <div className="bg-white h-56 w-full my-4 shrink-0 pt-6">
            <div className="w-full h-1/5 flex items-center justify-between pl-7 pr-4">
                <StateMenu issue={issue}></StateMenu>
                <div className="w-16 h-full flex items-center justify-between">
                    <button className="h-8 w-8 rounded-md hover:bg-slate-300 flex justify-center items-center"
                            onClick={toEditIssue}
                            title="Edit">
                        <BiEdit />
                    </button>
                    <button className="h-8 w-8 rounded-md hover:bg-slate-300 flex justify-center items-center"
                            onClick={deleteIssue}
                            title="Close issue"
                    >
                        <BiTrashAlt />
                    </button>
                </div>
            </div>
            <div className="w-full h-4/5 pl-8 pr-6 py-2">
                <div className="h-1/4 text-2xl truncate pt-1 hover:cursor-pointer hover:underline" onClick={toEditIssue}>{issue.title} </div>
                <div  className="pt-2 h-3/4 break-all overflow-y-auto whitespace-pre-wrap hover:cursor-pointer hover:underline" 
                      style={{background: "transparent"}} 
                      onClick={toEditIssue}
                      dangerouslySetInnerHTML={{ __html:  mdParser.render(issue.body) }} />
            </div>
        </div>
            );
}

export default IssueCard;
