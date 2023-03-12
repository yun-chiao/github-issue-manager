import { BiSearch } from "react-icons/bi";

function Fliter() {
    return (
        <div className="bg-sky-600 w-full h-full p-6 flex justify-begin items-center gap-4">
            <button className='bg-sky-700 hover:bg-sky-800 text-white w-12 h-8 rounded-md text-sm'>狀態</button>
            <button className='bg-sky-700 hover:bg-sky-800 text-white w-12 h-8 rounded-md text-sm'>新舊</button>
            <div className='bg-sky-700 w-80 h-8 rounded-md flex justify-between'>
                <input className='bg-transparent text-white w-64 h-8 truncate pl-3 focus:outline-none text-sm'
                       placeholder="這有搜尋可以用喔">
                </input>
                <button className='h-8 w-8 text-white hover:bg-sky-800 flex justify-center items-center rounded-md' title="搜尋"><BiSearch></BiSearch></button>
            </div>          
        </div>
    );
}

export default Fliter;
