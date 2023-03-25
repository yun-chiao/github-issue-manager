import { useState } from "react";
import React from "react";
import PacmanLoader from "react-spinners/PacmanLoader";

import useRepos from "../hook/useRepo";

function SelectRepo(): JSX.Element {
    const [isSelect, setIsSelect] = useState(false);
    const [repoKey, setRepoKey] = useState("");
    const { repos, isLoading, selectRepo } = useRepos();

    const handleRepoKey = (e) => {
        setRepoKey(e.target.value)
    }

    return (
        <div className="flex h-screen w-full flex-col items-center justify-center bg-sky-900">
            {isLoading ? <PacmanLoader color='#ffffff' speedMultiplier={2} size={30} /> : (
                <>
                    <div onClick={() => setIsSelect(true)} className={isSelect ? "h-10 w-64 rounded-md border-2 text-white" : "h-20 w-20 border-2 text-white transition-all hover:h-10 hover:w-52"}>
                        <button className={`h-full w-full text-white ${isSelect ? "hidden" : ""}`}>Click!</button>
                        <div className='flex h-full w-full justify-between'>
                            <input className={`h-full w-11/12 text-white ${!isSelect ? "hidden" : ""} bg-transparent px-2 focus:outline-none`}
                                value={repoKey}
                                onChange={handleRepoKey}
                                placeholder="Select repo..."
                            >
                            </input>
                        </div>
                    </div>
                    <div className={`h-24 w-64 overflow-y-auto rounded-b-md border-2 border-t-0 border-white bg-transparent ${!isSelect ? "hidden" : ""}`}>
                        {repos.filter((item) =>
                            item.name.toUpperCase().includes(repoKey.trim().toUpperCase())
                        ).map((repo) => {
                            return <button key={repo.name}
                                className='flex h-1/3 w-full items-center truncate px-2 text-sm text-white hover:bg-slate-900'
                                onClick={() => selectRepo(repo)}>{repo.name}</button>
                        })}
                    </div>
                </>)
            }
        </div>
    );
}

export default SelectRepo;
