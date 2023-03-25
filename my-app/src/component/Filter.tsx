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

// Define text's color for different labels.
const infoBgColor: { [key: string]: string } = {
    "Open": "bg-amber-500",
    "Progressing": "bg-rose-500",
    "Done": "bg-emerald-500"
}

const orderText: { [key: string]: string } = {
    "asc": "舊新",
    "desc": "新舊"
}

function Filter(): JSX.Element {
    const filterState = useSelector((state: RootState) => state.filterStateReducer);
    const filterOrder = useSelector((state: RootState) => state.filterOrderReducer);
    const preSearchKey = useSelector((state: RootState) => state.filterKeywordReducer.keyword);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const toCreateIssue = () => navigate("/create");
    const [searchKey, setSearchKey] = useState(preSearchKey);

    const ChangeState = (e: any) => dispatch({
        type: "CHANGE_STATE", payload: {
            changeState: e.value
        }
    })

    const toggleOrder = () => dispatch({
        type: "TOGGLE_ORDER"
    })

    const handleSearchKey = (e: React.ChangeEvent<HTMLInputElement>) => setSearchKey(e.target.value)

    const handleKeyDown = (e: React.KeyboardEvent) => { if (e.key === "Enter") searchIssue() }

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

