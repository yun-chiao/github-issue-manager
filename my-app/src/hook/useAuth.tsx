import { useEffect } from 'react';
import { getToken, getUser } from '../service';
import { useNavigate } from "react-router-dom";
import { useCookies } from 'react-cookie';

function useAuth(): { login: () => void } {
    const client_id = process.env.REACT_APP_CLIENT_ID;
    const navigate = useNavigate();
    const [cookies, setCookie] = useCookies(['token', 'username']);

    useEffect(() => {
        const queryString = window.location.search;
        const urlParams = new URLSearchParams(queryString);
        const code = urlParams.get("code");
        const getAuth = async () => {
            const token = await getToken(code)
            setCookie('token', token, { path: '/' })
            const username = await getUser(token);
            setCookie('username', username, { path: '/' })
            navigate("/select");
        }
        if (code !== null) {
            getAuth()
        }
    }, [navigate, setCookie])

    const login = () => {
        window.location.href = `https://github.com/login/oauth/authorize?client_id=${client_id}&amp;scope=repo`;
    };

    return { login };
}

export default useAuth;
