import "@szhsin/react-menu/dist/transitions/slide.css"

import { Menu, MenuItem } from "@szhsin/react-menu";
import { useState } from "react";
import React from "react";
import { BiCheck, BiPlus, BiSearch } from "react-icons/bi";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import { RootState } from "../type";


// Define text's color for different labels.
const itemTextColor: { [key: string]: string } = {
    "Open": "text-amber-500",
    "Progressing": "text-rose-500",
    "Done": "text-emerald-500"
}

// Define bg-color for different labels displaying on the IssueCard.
const infoBgColor: { [key: string]: string } = {
    "Open": "bg-amber-500",
    "Progressing": "bg-rose-500",
    "Done": "bg-emerald-500"
}

// Define the Text on the Filter to displaying the order.
const orderText: { [key: string]: string } = {
    "asc": "舊新",
    "desc": "新舊"
}

/// The component to display Filter which can controll filter condition for fetching issues.
function Filter(): JSX.Element {
    const filterState = useSelector((state: RootState) => state.filterStateReducer);
    const filterOrder = useSelector((state: RootState) => state.filterOrderReducer);
    const preSearchKey = useSelector((state: RootState) => state.filterKeywordReducer.keyword);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [searchKey, setSearchKey] = useState(preSearchKey);

    /// When users click the button '+', navigating to ./create page.
    const toCreateIssue = () => navigate("/create");

    /// When users click the item in state menu on filter, it would info Reducer to update newest state data.
    const ChangeState = (e: any) => dispatch({
        type: "CHANGE_STATE", payload: {
            changeState: e.value
        }
    })

    /// When users click the order button, it would info Reducer to update newest order.
    const toggleOrder = () => dispatch({
        type: "TOGGLE_ORDER"
    })

    /// To store the newest keyword in input element when users typing.    
    const handleSearchKey = (e: React.ChangeEvent<HTMLInputElement>) => setSearchKey(e.target.value)

    /// When users keydown enter on focusing input element, it would behave like clicking search button.
    const handleKeyDown = (e: React.KeyboardEvent) => { if (e.key === "Enter") searchIssue() }

    /// When users click the search button or keydown enter, it would info Reducer to store the search keyword.
    const searchIssue = async () => dispatch({
        type: "UPDATE_KEYWORD", payload: {
            keyword: searchKey
        }
    })

    return (
        <div className="flex h-full w-full items-center justify-between bg-sky-600 p-6">
            <span className="flex h-full w-2 flex-col justify-between">
                {Object.keys(filterState).map((key) => {
                    return (
                        <span key={`${key}-info`} className={`h-2 w-2 rounded-lg ${infoBgColor[key]} ${filterState[key] ? "visible" : "invisible"}`}></span>
                    )
                })}
            </span>
            <Menu menuClassName="bg-slate-100 w-36 h-28 p-2 rounded-md flex flex-col justify-evenly"
                direction="left"
                offsetX={12}
                menuButton={<button className='h-8 w-12 rounded-md bg-sky-700 text-sm text-white hover:bg-sky-800'>狀態</button>}
                transition
                onItemClick={(e) => (e.keepOpen = true)}
            >
                {Object.keys(filterState).map((key) => {
                    return (
                        <MenuItem type="checkbox" key={key} checked={filterState[key]} value={key} onClick={ChangeState} className={`state-item ${itemTextColor[key]}`}>
                            <BiCheck className={`mx-2 ${filterState[key] ? "visible" : "invisible"}`}></BiCheck>
                            {key}
                        </MenuItem>
                    )
                })}
            </Menu>
            <button className='h-8 w-12 rounded-md bg-sky-700 text-sm text-white hover:bg-sky-800' onClick={toggleOrder}>{orderText[filterOrder.order]}</button>
            <div className='flex h-8 w-64 justify-between rounded-md bg-sky-700'>
                <input className='h-8 w-64 truncate bg-transparent pl-3 text-sm text-white focus:outline-none'
                    placeholder="這有搜尋可以用喔"
                    value={searchKey}
                    onChange={handleSearchKey}
                    onKeyDown={handleKeyDown}>
                </input>
                <button className='flex h-8 w-8 items-center justify-center rounded-md text-white hover:bg-sky-800'
                    title="Search"
                    onClick={searchIssue}>
                    <BiSearch></BiSearch>
                </button>
            </div>
            <button className='flex h-8 w-8 items-center justify-center rounded-lg bg-sky-700 text-white hover:bg-sky-800'
                title="Create issue"
                onClick={toCreateIssue}>
                <BiPlus></BiPlus>
            </button>
        </div>
    );
}

export default Filter;

