import { BiEdit, BiTrashAlt } from "react-icons/bi";
import { Menu, MenuItem } from '@szhsin/react-menu';
import { useEffect, useState } from "react";
import { useDispatch } from 'react-redux';
import { closeIssue, updateState } from '../service';

// Define kinds of displaying label.
const states = ["Open", "Progressing", "Done"];

// Define text's color for different labels.
const LABEL_COLOR = {
    "Open": "text-gray-500",
    "Progressing": "text-red-500",
    "Done": "text-green-500",
}

function IssueCard({ issue }) {

    const [textColor, setTextColor] = useState('');
    const [labelText, setLabelText] = useState('')
    const dispatch = useDispatch();

    /// To initial state view.
    useEffect(() => {
        let label = issue.labels.filter( label => states.includes(label.name));
        label = label.length === 0? "Open" : label[0];
        if(label.name === "Progressing"){
            setLabelText("Progressing");
            setTextColor(LABEL_COLOR.Progressing);      
        }else if(label.name === "Done"){
            setLabelText("Done");
            setTextColor(LABEL_COLOR.Done);   
        }else{
            setLabelText("Open");
            setTextColor(LABEL_COLOR.Open);             
        }   
    }, [issue])

    /// To change the text for displaying state.
    const ChangeState = (e) => {
        let label = e.syntheticEvent.target.innerText;
        updateState(dispatch, issue.number, label, issue.labels)
    }

    /// To close the issue when users click the trash icon.
    const deleteIssue = () => {
        closeIssue(dispatch, issue.number);
    }

    return (
        <div className="bg-white h-40 w-full my-4 rounded-xl shrink-0 pt-6">
            <div className="w-full h-1/4 flex items-center justify-between pl-7 pr-4">
                <Menu menuClassName="bg-slate-100 w-28 h-28 p-2 rounded-md flex flex-col justify-evenly"
                      direction="right"
                      offsetX={12}
                      menuButton={<button className={`bg-slate-100 w-24 h-full rounded-md hover:bg-slate-400 ${textColor}`}>{labelText}</button>} 
                      transition
                >
                    <MenuItem className="text-gray-500 state-item" onClick={(e) => ChangeState(e)}>Open</MenuItem>
                    <MenuItem className="text-red-500 state-item" onClick={(e) => ChangeState(e)}>Progressing</MenuItem>
                    <MenuItem className="text-green-500 state-item" onClick={(e) => ChangeState(e)}>Done</MenuItem>
                </Menu>
                
                <div className="w-16 h-full flex items-center justify-between">
                    <button className="h-8 w-8 rounded-md hover:bg-slate-300 flex justify-center items-center"><BiEdit /></button>
                    <button className="h-8 w-8 rounded-md hover:bg-slate-300 flex justify-center items-center"
                            onClick={deleteIssue}
                    >
                        <BiTrashAlt />
                    </button>
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
