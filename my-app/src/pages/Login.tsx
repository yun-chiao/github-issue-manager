import React from "react";
import useAuth from '../hook/useAuth';

function Login(): JSX.Element {
    const { login } = useAuth();

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
