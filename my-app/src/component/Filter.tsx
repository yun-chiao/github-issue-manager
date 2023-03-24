import { BiSearch, BiPlus, BiCheck } from "react-icons/bi";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';
import { Menu, MenuItem } from '@szhsin/react-menu';
import { useState } from "react";
import { RootState } from "../store/type";
import React from 'react';

import '@szhsin/react-menu/dist/transitions/slide.css'


// Define text's color for different labels.
const itemTextColor: {[key: string]: string} = {
    "Open": "text-amber-500",
    "Progressing": "text-rose-500",
    "Done": "text-emerald-500"
}

// Define text's color for different labels.
const infoBgColor: {[key: string]: string} = {
    "Open": "bg-amber-500",
    "Progressing": "bg-rose-500",
    "Done": "bg-emerald-500"
}

const orderText: {[key: string]: string} = {
    'asc': "舊新",
    'desc': "新舊"
}

function Filter(): JSX.Element {
    const filterState = useSelector((state:RootState) => state.filterStateReducer);
    const filterOrder = useSelector((state:RootState) => state.filterOrderReducer);
    const preSearchKey = useSelector((state:RootState) => state.filterKeywordReducer.keyword);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const toCreateIssue = () => navigate(`/create`);
    const [searchKey, setSearchKey] = useState(preSearchKey);
      
    const ChangeState = (e: any) => dispatch({type: 'CHANGE_STATE', payload: { changeState: e.value } })

    const toggleOrder = () => dispatch({type: 'TOGGLE_ORDER'})

    const handleSearchKey = (e: React.ChangeEvent<HTMLInputElement>) => setSearchKey(e.target.value)

    const handleKeyDown = (e:  React.KeyboardEvent) => {if (e.key === 'Enter') searchIssue()}
        
    const searchIssue = async () => dispatch({type: 'UPDATE_KEYWORD', payload: { keyword: searchKey } })
      
    return (
        <div className="bg-sky-600 w-full h-full p-6 flex justify-between items-center">
            <span className="h-full w-2 flex flex-col justify-between">
                {Object.keys(filterState).map((key) => {
                    return (
                        <span key={`${key}-info`} className={`h-2 w-2 rounded-lg ${infoBgColor[key]} ${filterState[key]?"visible":"invisible"}`}></span>
                    )
                })}
            </span>
            <Menu menuClassName="bg-slate-100 w-36 h-28 p-2 rounded-md flex flex-col justify-evenly"
                  direction="left"
                  offsetX={12}
                  menuButton={<button className='bg-sky-700 hover:bg-sky-800 text-white w-12 h-8 rounded-md text-sm'>狀態</button>} 
                  transition
                  onItemClick={(e) => (e.keepOpen = true)}
            >
                {Object.keys(filterState).map((key) => {
                    return (
                        <MenuItem type="checkbox" key={key} checked={filterState[key]} value={key} onClick={ChangeState} className={`state-item ${itemTextColor[key]}`}>
                            <BiCheck className={`mx-2 ${filterState[key]?"visible":"invisible"}`}></BiCheck>
                             {key}
                        </MenuItem>
                    )
                })}
            </Menu>
            <button className='bg-sky-700 hover:bg-sky-800 text-white w-12 h-8 rounded-md text-sm' onClick={toggleOrder}>{orderText[filterOrder.order]}</button>
            <div className='bg-sky-700 w-64 h-8 rounded-md flex justify-between'>
                <input className='bg-transparent text-white w-64 h-8 truncate pl-3 focus:outline-none text-sm'
                       placeholder="這有搜尋可以用喔"
                       value={searchKey}
                       onChange={handleSearchKey}
                       onKeyDown={handleKeyDown}>
                </input>
                <button className='h-8 w-8 text-white hover:bg-sky-800 flex justify-center items-center rounded-md'
                        title="Search"
                        onClick={searchIssue}>
                    <BiSearch></BiSearch>
                </button>
            </div>         
            <button className='bg-sky-700 hover:bg-sky-800 text-white w-8 h-8 rounded-lg flex justify-center items-center'
                    title="Create issue"
                    onClick={toCreateIssue}>
                <BiPlus></BiPlus>
            </button>
        </div>
    );
}

export default Filter;

