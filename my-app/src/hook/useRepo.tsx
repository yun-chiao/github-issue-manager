import { useEffect, useState } from 'react';
import { getRepos } from '../service';
import { useCookies } from 'react-cookie';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

interface Repo {
    name: string;
}

const useRepos = (): { isLoading: boolean; selectRepo: (repo: Repo) => void; repos: Repo[] } => {
    const [isLoading, setIsLoading] = useState(false);
    const [repos, setRepos] = useState([]);
    const [cookies, setCookie] = useCookies(['token', 'owner', 'repo']);
    const navigate = useNavigate();

    useEffect(() => {
        const getData = async () => {
            setIsLoading(true)
            setRepos(await getRepos(cookies['token']));
            setIsLoading(false)
        }
        getData()
    }, [cookies['token']])

    const selectRepo = (repo) => {
        setCookie('owner', repo.owner.login, { path: '/' })
        setCookie('repo', repo.name, { path: '/' })
        toast.success(`進入${repo.owner.login}的${repo.name}！`);
        navigate("/issues")
    }
    return { isLoading, selectRepo, repos };
};

export default useRepos;
