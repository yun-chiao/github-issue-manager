import { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";

import { getToken, getUser } from "../service";

/// To complete the progress of GitHub authorizing, and get user's data.
function useAuth(): { login: () => void; isLoading: boolean } {
    const [isLoading, setIsLoading] = useState(false);
    const client_id = process.env.REACT_APP_CLIENT_ID;
    const navigate = useNavigate();
    const [cookies, setCookie] = useCookies(["token", "username"]);

    /// Fetch the code to get token and get user's data.
    useEffect(() => {
        const queryString = window.location.search;
        const urlParams = new URLSearchParams(queryString);
        const code = urlParams.get("code");

        const getAuth = async () => {
            setIsLoading(true);
            const token = await getToken(code)
            setCookie("token", token, {
                path: "/"
            })
            const username = await getUser(token);
            setCookie("username", username, {
                path: "/"
            })
            navigate("/select");
            setIsLoading(false);
        }

        if (code !== null) {
            getAuth()
        }
    }, [navigate, setCookie])

    /// Navigate to GitHub authorizing page to confirm.
    const login = () => {
        window.location.href = `https://github.com/login/oauth/authorize?client_id=${client_id}&amp;scope=repo`;
    };

    return {
        login, isLoading
    };
}

export default useAuth;
