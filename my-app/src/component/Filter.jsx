import { BiSearch, BiPlus, BiCheck } from "react-icons/bi";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';
import { Menu, MenuItem } from '@szhsin/react-menu';
import { useState, useEffect } from "react";
import { getFilterIssue } from "../service";
import { useCookies } from 'react-cookie';
import '@szhsin/react-menu/dist/transitions/slide.css'

const textColor = {
    "Open": "text-gray-500",
    "Progressing": "text-red-500",
    "Done": "text-green-500"
}

const orderText = {
    'asc': "舊新",
    'desc': "新舊"
}

function Filter() {
    const [cookies] = useCookies(['owner', 'repo']);
    const filterState = useSelector(state => state.filterStateReducer);
    const filterOrder = useSelector(state => state.filterOrderReducer);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const toCreateIssue = () => navigate(`/create`);
    const [searchKey, setSearchKey] = useState("");

    useEffect(() => {
        console.log('filterState', filterState)
        const getIssue = async () => await getFilterIssue(dispatch, filterState, filterOrder, searchKey, cookies['owner'], cookies['repo'])
        getIssue();
      }, [filterState, filterOrder]);

    const ChangeState = (e) => dispatch({type: 'CHANGE_STATE', payload: { changeState: e.value } })

    const toggleOrder = () => dispatch({type: 'TOGGLE_ORDER'})

    const handleSearchKey = (e) => {
        setSearchKey(e.target.value)
    }

    const handleKeyDown = (event) => {if (event.key === 'Enter') searchIssue()}
        
    const searchIssue = async () => await getFilterIssue(dispatch, filterState, filterOrder, searchKey, cookies['owner'], cookies['repo']);

    return (
        <div className="bg-sky-600 w-full h-full p-6 flex justify-between items-center">
            <Menu menuClassName="bg-slate-100 w-36 h-28 p-2 rounded-md flex flex-col justify-evenly"
                  direction="left"
                  offsetX={12}
                  menuButton={<button className='bg-sky-700 hover:bg-sky-800 text-white w-12 h-8 rounded-md text-sm'>狀態</button>} 
                  transition
                  onItemClick={(e) => (e.keepOpen = true)}
            >
                {Object.keys(filterState).map((key) => {
                    return (
                        <MenuItem type="checkbox" key={key} checked={filterState[key]} value={key} onClick={ChangeState} className={`state-item ${textColor[key]}`}>
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
