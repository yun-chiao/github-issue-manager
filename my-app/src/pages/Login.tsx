import { useEffect } from 'react';
import { getToken, getUser } from '../service';
import { useNavigate } from "react-router-dom";
import { useCookies } from 'react-cookie';
import React from "react";

function Login(): JSX.Element {
    const client_id = process.env.REACT_APP_CLIENT_ID
    const navigate = useNavigate();
    const [cookies, setCookie] = useCookies(['token', 'username']);

    useEffect(() => {
        const queryString = window.location.search;
        const urlParams = new URLSearchParams(queryString);
        let code = urlParams.get("code");
        const toGetToken = async () => {
            let token = await getToken(code)
            setCookie('token', token, { path: '/' })
            let username = await getUser(token);
            setCookie('username', username, { path: '/' })
            navigate("/select");
        }
        if (code !== null){
            toGetToken()
        }
    }, [navigate])
    const login = async() => window.location.href = `https://github.com/login/oauth/authorize?client_id=${client_id}&amp;scope=repo`;
    

    return (
        <div className="bg-sky-900 w-full h-screen flex justify-center items-center">
            <button className="h-20 w-20 border-2 text-white hover:animate-bounce"
                    onClick={() => login()}        
            >
                Login
            </button>
        </div>
    );
}

export default Login;
