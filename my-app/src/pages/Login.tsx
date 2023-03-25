import React from "react";
import useAuth from '../hook/useAuth';
import PacmanLoader from "react-spinners/PacmanLoader";

function Login(): JSX.Element {
    const { login, isLoading } = useAuth();

    return (
        <div className="bg-sky-900 w-full h-screen flex justify-center items-center">
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
