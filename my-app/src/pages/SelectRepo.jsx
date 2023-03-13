import { useEffect, useState } from 'react';
import { getRepos } from '../service';
import { useNavigate } from "react-router-dom"
import { useCookies } from 'react-cookie';

function SelectRepo() {
    const [isSelect, setIsSelect] = useState(false);
    const [repos, setRepos] = useState([]);
    const [repoKey, setRepoKey] = useState("");
    const [cookies, setCookie] = useCookies(['token', 'owner', 'repo']);

    const navigate = useNavigate();

    useEffect(() => {
        const getData = async () => {
            setRepos(await getRepos(cookies['token'], cookies['owner']));
        }
        getData()
    }, [])

    const handleRepoKey = (e) => {
        setRepoKey(e.target.value)
    }

    const selectRepo = (e) => {
        setCookie('repo', e.target.innerText, { path: '/' })
        navigate("/issues")
    }

    return (
        <div className="bg-sky-900 w-full h-screen flex justify-center items-center flex-col">
            <div  onClick={() => setIsSelect(true)} className={isSelect?`h-10 w-64 border-2 text-white rounded-md`:`h-20 w-20 border-2 text-white transition-all hover:h-10 hover:w-52`}>
                <button className={`h-full w-full text-white ${isSelect?"hidden":""}`}>Select repo</button>
                <div className='w-full h-full flex justify-between'>
                    <input className={`h-full w-11/12 text-white ${!isSelect?"hidden":""} bg-transparent focus:outline-none px-2`}
                        value={repoKey}
                        onChange={handleRepoKey}
                        placeholder="Select repo..."
                    >
                    </input>
                </div>
            </div>
            <div className={`bg-transparent border-white border-2 border-t-0 w-64 h-24 rounded-b-md overflow-y-auto ${!isSelect?"hidden":""}`}>
                {repos.filter((item) =>
                    item.name.toUpperCase().includes(repoKey.trim().toUpperCase())
                    ).map((repo)=>{
                   return <button key={repo.name}
                                  className='h-1/3 w-full truncate px-2 flex items-center hover:bg-slate-900 text-white text-sm'
                                  onClick={selectRepo}>{repo.name}</button>
                })}
            </div>
        </div>
    );
}

export default SelectRepo;
