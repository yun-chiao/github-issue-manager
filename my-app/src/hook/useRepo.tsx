import { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import { getRepos } from "../service";

interface Repo {
    name: string;
}

/// Fetch all the repos of the user, and provide some logical functions for SelectRepo page.
const useRepos = (): { isLoading: boolean; selectRepo: (repo: Repo) => void; repos: Repo[] } => {
    const [isLoading, setIsLoading] = useState(false);
    const [repos, setRepos] = useState([]);
    const [cookies, setCookie] = useCookies(["token", "owner", "repo"]);
    const navigate = useNavigate();

    /// Fetch all the repos of the user.
    useEffect(() => {
        const getData = async () => {
            setIsLoading(true)
            setRepos(await getRepos(cookies["token"]));
            setIsLoading(false)
        }

        getData()
    }, [cookies["token"]])

    /// Store the chosen repo and its' owner into cookie.
    const selectRepo = (repo) => {
        setCookie("owner", repo.owner.login, {
            path: "/"
        })
        setCookie("repo", repo.name, {
            path: "/"
        })
        toast.success(`進入${repo.owner.login}的${repo.name}！`);
        navigate("/issues")
    }

    return {
        isLoading, selectRepo, repos
    };
};

export default useRepos;
