import { BiSearch, BiPlus, BiCheck } from "react-icons/bi";
import { useNavigate } from "react-router-dom";
import { useDispatch } from 'react-redux';
import { Menu, MenuItem } from '@szhsin/react-menu';
import { useState } from "react";
import { getFilterIssue } from "../service";
import '@szhsin/react-menu/dist/transitions/slide.css'

function Filter() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const toCreateIssue = () => navigate(`/create`);
    const [state, setState] = useState({"Open": true, "Progressing": true, "Done": true});
    const [queryLabels, setQueryLabels] = useState(["Open", "Progressing", "Done"]);
    const [order, setOrder] = useState('desc');
    const [orderText, setOrderText] = useState("新舊");
    const [searchKey, setSearchKey] = useState("");

    const ChangeState = (e) => {
        let newState = state;
        let newQueryLabels = [];
        if(state[e.value]){
            newQueryLabels = queryLabels.filter(item => item !== e.value)
        }else{
            newQueryLabels = [...queryLabels, e.value]
        }
        setQueryLabels(newQueryLabels)
        newState[e.value] = !newState[e.value];
        setState(newState);
        getFilterIssue(dispatch, newQueryLabels, order, searchKey)
    }

    const changeOrder = () => {
        let newOrder = order;
        if(order === 'asc'){
            newOrder = 'desc';
            setOrderText("新舊");
        }else if(order === 'desc'){
            newOrder = 'asc';
            setOrderText("舊新");
        }
        setOrder(newOrder);
        getFilterIssue(dispatch, queryLabels, newOrder, searchKey)
    }

    const handleSearchKey = (e) => {
        setSearchKey(e.target.value)
    }

    const searchIssue = (e) => {
        getFilterIssue(dispatch, queryLabels, order, searchKey);
    }

    return (
        <div className="bg-sky-600 w-full h-full p-6 flex justify-between items-center">
            <Menu menuClassName="bg-slate-100 w-36 h-28 p-2 rounded-md flex flex-col justify-evenly"
                  direction="left"
                  offsetX={12}
                  menuButton={<button className='bg-sky-700 hover:bg-sky-800 text-white w-12 h-8 rounded-md text-sm'>狀態</button>} 
                  transition
                  onItemClick={(e) => (e.keepOpen = true)}
            >
                <MenuItem type="checkbox" checked={state["Open"]} value={"Open"} onClick={ChangeState} className="text-gray-500 state-item">
                    <BiCheck className={`mx-2 ${state["Open"]?"visible":"invisible"}`}></BiCheck>
                    Open
                </MenuItem>
                <MenuItem type="checkbox" checked={state["Progressing"]} value={"Progressing"} onClick={ChangeState} className="text-red-500 state-item">
                    <BiCheck className={`mx-2 ${state["Progressing"]?"visible":"invisible"}`}></BiCheck>
                    Progressing
                </MenuItem>
                <MenuItem type="checkbox" checked={state["Done"]} value={"Done"} onClick={ChangeState} className="text-green-500 state-item">
                    <BiCheck className={`mx-2 ${state["Done"]?"visible":"invisible"}`}></BiCheck>
                    Done
                </MenuItem>
            </Menu>
            <button className='bg-sky-700 hover:bg-sky-800 text-white w-12 h-8 rounded-md text-sm' onClick={changeOrder}>{orderText}</button>
            <div className='bg-sky-700 w-64 h-8 rounded-md flex justify-between'>
                <input className='bg-transparent text-white w-64 h-8 truncate pl-3 focus:outline-none text-sm'
                       placeholder="這有搜尋可以用喔"
                       value={searchKey}
                       onChange={handleSearchKey}>
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
