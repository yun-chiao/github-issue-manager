import React from "react";
import { useNavigate } from "react-router-dom";

function NotFound(): JSX.Element {
    const navigate = useNavigate();

    const toLogin = () => navigate("/");
    return (
        <div className="flex h-screen w-full flex-col items-center justify-center bg-sky-900">
            <button className="mb-4 h-12 w-32 border-2 text-white"
                onClick={toLogin}>
                To login page
            </button>
            <h1 className="text-white">404 Error</h1>
        </div>
    );
}

export default NotFound;
