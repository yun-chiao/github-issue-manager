import { Menu, MenuItem } from "@szhsin/react-menu";
import { useEffect, useState } from "react";
import React from "react";
import { useCookies } from "react-cookie";
import { useDispatch, useSelector } from "react-redux";

import { updateState } from "../service";
import { Issue, RootState } from "../type";

// Define kinds of displaying label.
const states: string[] = ["Open", "Progressing", "Done"];

// Define text's color for different labels.
const itemTextColor: { [key: string]: string } = {
    "Open": "text-amber-500",
    "Progressing": "text-rose-500",
    "Done": "text-emerald-500"
}

/// The component to display the menu that let users can choose and view the current state.
function StateMenu({ issue }: { issue: Issue }): JSX.Element {
    const [cookies] = useCookies(["token", "owner", "repo"]);
    const dispatch = useDispatch();
    const filterState = useSelector((state: RootState) => state.filterStateReducer);
    const [labelText, setLabelText] = useState("")

    /// To initial state view.
    useEffect(() => {
        const label = issue.labels.filter(label => states.includes(label.name));
        // If the issue has no state label, give it temp label 'Open'.
        label.length === 0 ? setLabelText("Open") : setLabelText(label[0].name);
    }, [issue])

    /// To change the text for displaying state.
    const ChangeState = (e) => {
        const label = e.syntheticEvent.target.innerText;
        updateState(dispatch, issue.number, label, issue.labels, cookies["token"], cookies["owner"], cookies["repo"], filterState)
    }

    return (
        <Menu menuClassName="bg-slate-100 w-28 h-28 p-2 rounded-md flex flex-col justify-evenly"
            direction="right"
            offsetX={12}
            menuButton={<button className={`h-10 w-24 rounded-md bg-slate-100 hover:bg-slate-400 ${itemTextColor[labelText]}`}>{labelText}</button>}
            transition
        >
            {Object.keys(filterState).map((key) => {
                return (
                    <MenuItem key={`${issue.number}-${key}`} onClick={(e) => ChangeState(e)} className={`state-item ${itemTextColor[key]}`}>
                        {key}
                    </MenuItem>
                )
            })}
        </Menu>
    );
}

export default StateMenu;
