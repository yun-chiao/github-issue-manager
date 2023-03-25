import React from "react";
import PacmanLoader from "react-spinners/PacmanLoader";

import useAuth from "../hook/useAuth";

/// The page to let users login.
function Login(): JSX.Element {
    const { login, isLoading } = useAuth();

    return (
        <div className="flex h-screen w-full items-center justify-center bg-sky-900">
            {isLoading ? <PacmanLoader color='#ffffff' speedMultiplier={2} size={30} /> :
                <button className="h-20 w-20 border-2 text-white hover:animate-bounce"
                    onClick={() => login()}
                >
                    Login
                </button>}

        </div>
    );
}

export default Login;
