import { Menu, MenuItem } from '@szhsin/react-menu';
import { updateState } from '../service';
import { useCookies } from 'react-cookie';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from "react";

// Define kinds of displaying label.
const states = ["Open", "Progressing", "Done"];

// Define text's color for different labels.
const itemTextColor = {
    "Open": "text-amber-500",
    "Progressing": "text-rose-500",
    "Done": "text-emerald-500"
}

function StateMenu({issue}) {
    const [cookies] = useCookies(['token', 'owner', 'repo']);
    const dispatch = useDispatch();
    const filterState = useSelector(state => state.filterStateReducer);
    const [labelText, setLabelText] = useState('')

    /// To initial state view.
    useEffect(() => {
        let label = issue.labels.filter( label => states.includes(label.name));
        // If the issue has no state label, give it temp label 'Open'.
        label.length === 0 ? setLabelText('Open') : setLabelText(label[0].name);
    }, [issue])

    /// To change the text for displaying state.
    const ChangeState = (e) => {
        let label = e.syntheticEvent.target.innerText;
        updateState(dispatch, issue.number, label, issue.labels, cookies['token'], cookies['owner'], cookies['repo'], filterState)
    }

    return (
        <Menu menuClassName="bg-slate-100 w-28 h-28 p-2 rounded-md flex flex-col justify-evenly"
                      direction="right"
                      offsetX={12}
                      menuButton={<button className={`bg-slate-100 w-24 h-10 rounded-md hover:bg-slate-400 ${itemTextColor[labelText]}`}>{labelText}</button>} 
                      transition
                >
                    {Object.keys(filterState).map((key) => {
                    return (
                        <MenuItem key={`${issue.number}-${key}`}  onClick={(e) => ChangeState(e)} className={`state-item ${itemTextColor[key]}`}>
                             {key}
                        </MenuItem>
                    )
                })}
        </Menu>
    );
}

export default StateMenu;
